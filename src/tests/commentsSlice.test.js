import { configureStore } from '@reduxjs/toolkit';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import commentsReducer, {
  fetchCommentsForPost,
  toggleCommentsForPost,
} from '../features/comments/commentsSlice';

const createMockCommentsResponse = () => [
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
        {
          kind: 't1',
          data: {
            id: 'comment456',
            author: 'second_user',
            body: 'This is another test comment.',
            ups: 18,
          },
        },
        {
          kind: 'more',
          data: {
            id: 'morecomments',
          },
        },
      ],
    },
  },
];

const createStore = () =>
  configureStore({
    reducer: {
      comments: commentsReducer,
    },
  });

describe('commentsSlice', () => {
  let fetchMock;

  beforeEach(() => {
    fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(createMockCommentsResponse()),
      })
    );

    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('returns the initial state', () => {
    const state = commentsReducer(undefined, { type: 'unknown' });

    expect(state).toEqual({
      activePostId: null,
      commentsByPostId: {},
      loadingByPostId: {},
      errorByPostId: {},
    });
  });

  it('sets the active post when comments are toggled open', () => {
    const state = commentsReducer(undefined, toggleCommentsForPost('post123'));

    expect(state.activePostId).toBe('post123');
  });

  it('clears the active post when the same comments are toggled closed', () => {
    const startingState = {
      activePostId: 'post123',
      commentsByPostId: {},
      loadingByPostId: {},
      errorByPostId: {},
    };

    const state = commentsReducer(
      startingState,
      toggleCommentsForPost('post123')
    );

    expect(state.activePostId).toBe(null);
  });

  it('switches the active post when a different post is toggled', () => {
    const startingState = {
      activePostId: 'post123',
      commentsByPostId: {},
      loadingByPostId: {},
      errorByPostId: {},
    };

    const state = commentsReducer(
      startingState,
      toggleCommentsForPost('post456')
    );

    expect(state.activePostId).toBe('post456');
  });

  it('fetches comments for a post', async () => {
    const store = createStore();

    await store.dispatch(
      fetchCommentsForPost({
        postId: 'post123',
        permalink: '/r/reactjs/comments/post123/test_post/',
      })
    );

    expect(fetchMock).toHaveBeenCalledWith(
      'https://www.reddit.com/r/reactjs/comments/post123/test_post/.json?limit=10'
    );

    const state = store.getState().comments;

    expect(state.loadingByPostId.post123).toBe(false);
    expect(state.errorByPostId.post123).toBe('');
    expect(state.commentsByPostId.post123).toEqual([
      {
        id: 'comment123',
        author: 'comment_user',
        body: 'This is a test comment.',
        ups: 42,
      },
      {
        id: 'comment456',
        author: 'second_user',
        body: 'This is another test comment.',
        ups: 18,
      },
    ]);
  });

  it('sets loading state while comments are being fetched', () => {
    const action = fetchCommentsForPost.pending('', {
      postId: 'post123',
      permalink: '/r/reactjs/comments/post123/test_post/',
    });

    const state = commentsReducer(undefined, action);

    expect(state.loadingByPostId.post123).toBe(true);
    expect(state.errorByPostId.post123).toBe('');
  });

  it('sets error state when fetching comments fails', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
    });

    const store = createStore();

    await store.dispatch(
      fetchCommentsForPost({
        postId: 'post123',
        permalink: '/r/reactjs/comments/post123/test_post/',
      })
    );

    const state = store.getState().comments;

    expect(state.loadingByPostId.post123).toBe(false);
    expect(state.errorByPostId.post123).toBe('Failed to fetch comments.');
  });
});