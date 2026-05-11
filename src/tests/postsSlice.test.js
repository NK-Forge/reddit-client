import { configureStore } from '@reduxjs/toolkit';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import postsReducer, {
  fetchPostsBySubreddit,
  searchPosts,
  setSearchTerm,
  setSelectedSubreddit,
} from '../features/posts/postsSlice';

const createMockRedditResponse = () => ({
  data: {
    children: [
      {
        data: {
          id: 'abc123',
          title: 'Test Reddit Post',
          author: 'test_user',
          subreddit: 'reactjs',
          ups: 150,
          num_comments: 25,
          permalink: '/r/reactjs/comments/abc123/test_reddit_post/',
          url: 'https://example.com/post',
          thumbnail: 'self',
          preview: {
            images: [
              {
                source: {
                  url: 'https://example.com/image.jpg?width=640&amp;height=480',
                },
              },
            ],
          },
        },
      },
    ],
  },
});

const createStore = () =>
  configureStore({
    reducer: {
      posts: postsReducer,
    },
  });

describe('postsSlice', () => {
  let fetchMock;

  beforeEach(() => {
    fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(createMockRedditResponse()),
      })
    );

    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('returns the initial state', () => {
    const state = postsReducer(undefined, { type: 'unknown' });

    expect(state).toEqual({
      posts: [],
      selectedSubreddit: 'popular',
      searchTerm: '',
      isLoading: false,
      hasError: false,
      errorMessage: '',
    });
  });

  it('sets the selected subreddit and clears the search term', () => {
    const startingState = {
      posts: [],
      selectedSubreddit: 'popular',
      searchTerm: 'react',
      isLoading: false,
      hasError: false,
      errorMessage: '',
    };

    const state = postsReducer(startingState, setSelectedSubreddit('webdev'));

    expect(state.selectedSubreddit).toBe('webdev');
    expect(state.searchTerm).toBe('');
  });

  it('sets the search term', () => {
    const state = postsReducer(undefined, setSearchTerm('redux'));

    expect(state.searchTerm).toBe('redux');
  });

  it('fetches posts by subreddit', async () => {
    const store = createStore();

    await store.dispatch(fetchPostsBySubreddit('reactjs'));

    expect(fetchMock).toHaveBeenCalledWith(
      'https://www.reddit.com/r/reactjs.json?limit=25'
    );

    const state = store.getState().posts;

    expect(state.isLoading).toBe(false);
    expect(state.hasError).toBe(false);
    expect(state.posts).toHaveLength(1);
    expect(state.posts[0]).toEqual({
      id: 'abc123',
      title: 'Test Reddit Post',
      author: 'test_user',
      subreddit: 'reactjs',
      ups: 150,
      comments: 25,
      permalink: '/r/reactjs/comments/abc123/test_reddit_post/',
      redditUrl: 'https://www.reddit.com/r/reactjs/comments/abc123/test_reddit_post/',
      url: 'https://example.com/post',
      image: 'https://example.com/image.jpg?width=640&height=480',
    });
  });

  it('searches posts by search term', async () => {
    const store = createStore();

    await store.dispatch(searchPosts('react testing'));

    expect(fetchMock).toHaveBeenCalledWith(
      'https://www.reddit.com/search.json?q=react%20testing&limit=25'
    );

    const state = store.getState().posts;

    expect(state.isLoading).toBe(false);
    expect(state.hasError).toBe(false);
    expect(state.posts).toHaveLength(1);
  });

  it('sets error state when fetching posts fails', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
    });

    const store = createStore();

    await store.dispatch(fetchPostsBySubreddit('reactjs'));

    const state = store.getState().posts;

    expect(state.isLoading).toBe(false);
    expect(state.hasError).toBe(true);
    expect(state.errorMessage).toBe('Failed to fetch posts.');
  });

  it('sets error state when searching posts fails', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
    });

    const store = createStore();

    await store.dispatch(searchPosts('react'));

    const state = store.getState().posts;

    expect(state.isLoading).toBe(false);
    expect(state.hasError).toBe(true);
    expect(state.errorMessage).toBe('Failed to search posts.');
  });
});