import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import commentsReducer from '../features/comments/commentsSlice';
import postsReducer from '../features/posts/postsSlice';
import PostsList from '../features/posts/PostsList';

const basePost = {
  id: 'abc123',
  title: 'Test post title',
  author: 'test_user',
  subreddit: 'reactjs',
  ups: 125,
  comments: 14,
  permalink: '/r/reactjs/comments/abc123/test_post_title/',
  redditUrl: 'https://www.reddit.com/r/reactjs/comments/abc123/test_post_title/',
  url: 'https://example.com',
  image: 'https://example.com/image.jpg',
};

const renderWithStore = (preloadedState) => {
  const store = configureStore({
    reducer: {
      posts: postsReducer,
      comments: commentsReducer,
    },
    preloadedState,
  });

  render(
    <Provider store={store}>
      <PostsList />
    </Provider>
  );

  return store;
};

const createStateWithPosts = (posts = [basePost]) => ({
  posts: {
    posts,
    selectedSubreddit: 'popular',
    searchTerm: '',
    isLoading: false,
    hasError: false,
    errorMessage: '',
    noticeMessage: '',
    dataSource: 'live',
  },
  comments: {
    activePostId: null,
    commentsByPostId: {},
    loadingByPostId: {},
    errorByPostId: {},
    noticeByPostId: {},
  },
});

describe('PostsList', () => {
  let fetchMock;

  beforeEach(() => {
    fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {},
            {
              data: {
                children: [
                  {
                    kind: 't1',
                    data: {
                      id: 'comment123',
                      author: 'comment_user',
                      body: 'This is a test comment.',
                      ups: 42,
                    },
                  },
                ],
              },
            },
          ]),
      })
    );

    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('renders the loading state', () => {
    renderWithStore({
      posts: {
        posts: [],
        selectedSubreddit: 'popular',
        searchTerm: '',
        isLoading: true,
        hasError: false,
        errorMessage: '',
        noticeMessage: '',
        dataSource: 'live',
      },
      comments: {
        activePostId: null,
        commentsByPostId: {},
        loadingByPostId: {},
        errorByPostId: {},
        noticeByPostId: {},
      },
    });

    expect(screen.getByText(/loading posts/i)).toBeInTheDocument();
  });

  it('renders the error state', () => {
    renderWithStore({
      posts: {
        posts: [],
        selectedSubreddit: 'popular',
        searchTerm: '',
        isLoading: false,
        hasError: true,
        errorMessage: 'Failed to fetch posts.',
        noticeMessage: '',
        dataSource: 'live',
      },
      comments: {
        activePostId: null,
        commentsByPostId: {},
        loadingByPostId: {},
        errorByPostId: {},
        noticeByPostId: {},
      },
    });

    expect(screen.getByText(/failed to fetch posts/i)).toBeInTheDocument();
  });

  it('renders the empty state', () => {
    renderWithStore(createStateWithPosts([]));

    expect(screen.getByText(/no posts found/i)).toBeInTheDocument();
  });

  it('renders post cards with post details', () => {
    renderWithStore(createStateWithPosts());

    expect(screen.getByText('Test post title')).toBeInTheDocument();
    expect(screen.getByText(/r\/reactjs/i)).toBeInTheDocument();
    expect(screen.getByText(/u\/test_user/i)).toBeInTheDocument();
    expect(screen.getByText(/125 upvotes/i)).toBeInTheDocument();
    expect(screen.getByText(/14 comments/i)).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /view discussion/i })
    ).toHaveAttribute('href', basePost.redditUrl);
  });

  it('fetches and displays comments when Show comments is clicked', async () => {
    const user = userEvent.setup();

    renderWithStore(createStateWithPosts());

    await user.click(screen.getByRole('button', { name: /show comments/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        'https://www.reddit.com/r/reactjs/comments/abc123/test_post_title/.json?limit=10'
      );
    });

    expect(
      await screen.findByText(/this is a test comment/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/u\/comment_user/i)).toBeInTheDocument();
    expect(screen.getByText(/42 upvotes/i)).toBeInTheDocument();
  });

  it('hides comments when Hide comments is clicked', async () => {
    const user = userEvent.setup();

    renderWithStore({
      ...createStateWithPosts(),
      comments: {
        activePostId: basePost.id,
        commentsByPostId: {
          [basePost.id]: [
            {
              id: 'comment123',
              author: 'comment_user',
              body: 'This is a cached comment.',
              ups: 42,
            },
          ],
        },
        loadingByPostId: {},
        errorByPostId: {},
        noticeByPostId: {},
      },
    });

    expect(screen.getByText(/this is a cached comment/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /hide comments/i }));

    expect(
      screen.queryByText(/this is a cached comment/i)
    ).not.toBeInTheDocument();
  });
});