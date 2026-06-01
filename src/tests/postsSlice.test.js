import { configureStore } from '@reduxjs/toolkit';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { DEMO_NOTICE } from '../data/demoRedditData';
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
      noticeMessage: '',
      dataSource: 'live',
    });
  });

  it('sets the selected subreddit and clears the search term and notice message', () => {
    const startingState = {
      posts: [],
      selectedSubreddit: 'popular',
      searchTerm: 'react',
      isLoading: false,
      hasError: false,
      errorMessage: '',
      noticeMessage: DEMO_NOTICE,
      dataSource: 'demo',
    };

    const state = postsReducer(startingState, setSelectedSubreddit('webdev'));

    expect(state.selectedSubreddit).toBe('webdev');
    expect(state.searchTerm).toBe('');
    expect(state.noticeMessage).toBe('');
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
    expect(state.errorMessage).toBe('');
    expect(state.noticeMessage).toBe('');
    expect(state.dataSource).toBe('live');
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
    expect(state.errorMessage).toBe('');
    expect(state.noticeMessage).toBe('');
    expect(state.dataSource).toBe('live');
    expect(state.posts).toHaveLength(1);
  });

  it('falls back to demo posts when fetching posts fails', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
    });

    const store = createStore();

    await store.dispatch(fetchPostsBySubreddit('reactjs'));

    const state = store.getState().posts;

    expect(state.isLoading).toBe(false);
    expect(state.hasError).toBe(false);
    expect(state.errorMessage).toBe('');
    expect(state.noticeMessage).toBe(DEMO_NOTICE);
    expect(state.dataSource).toBe('demo');
    expect(state.posts.length).toBeGreaterThan(0);
    expect(state.posts[0].id).toBe('demo-reactjs-1');
  });

  it('falls back to demo posts when searching posts fails', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
    });

    const store = createStore();

    await store.dispatch(searchPosts('react'));

    const state = store.getState().posts;

    expect(state.isLoading).toBe(false);
    expect(state.hasError).toBe(false);
    expect(state.errorMessage).toBe('');
    expect(state.noticeMessage).toBe(DEMO_NOTICE);
    expect(state.dataSource).toBe('demo');
    expect(state.posts.length).toBeGreaterThan(0);
  });

  it('falls back to demo posts when the network request throws', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network blocked'));

    const store = createStore();

    await store.dispatch(fetchPostsBySubreddit('webdev'));

    const state = store.getState().posts;

    expect(state.isLoading).toBe(false);
    expect(state.hasError).toBe(false);
    expect(state.errorMessage).toBe('');
    expect(state.noticeMessage).toBe(DEMO_NOTICE);
    expect(state.dataSource).toBe('demo');
    expect(state.posts.length).toBeGreaterThan(0);
    expect(state.posts[0].subreddit).toBe('webdev');
  });
});