import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const normalizeComment = (comment) => ({
  id: comment.id,
  author: comment.author,
  body: comment.body,
  ups: comment.ups,
});

export const fetchCommentsForPost = createAsyncThunk(
  'comments/fetchCommentsForPost',
  async ({ postId, permalink }) => {
    const response = await fetch(
      `https://www.reddit.com${permalink}.json?limit=10`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch comments.');
    }

    const data = await response.json();
    const commentsListing = data[1]?.data?.children || [];

    const comments = commentsListing
      .filter((child) => child.kind === 't1')
      .map((child) => normalizeComment(child.data));

    return {
      postId,
      comments,
    };
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    activePostId: null,
    commentsByPostId: {},
    loadingByPostId: {},
    errorByPostId: {},
  },
  reducers: {
    toggleCommentsForPost: (state, action) => {
      state.activePostId =
        state.activePostId === action.payload ? null : action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsForPost.pending, (state, action) => {
        const { postId } = action.meta.arg;

        state.loadingByPostId[postId] = true;
        state.errorByPostId[postId] = '';
      })
      .addCase(fetchCommentsForPost.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;

        state.loadingByPostId[postId] = false;
        state.commentsByPostId[postId] = comments;
      })
      .addCase(fetchCommentsForPost.rejected, (state, action) => {
        const { postId } = action.meta.arg;

        state.loadingByPostId[postId] = false;
        state.errorByPostId[postId] =
          action.error.message || 'Something went wrong while loading comments.';
      });
  },
});

export const { toggleCommentsForPost } = commentsSlice.actions;

export default commentsSlice.reducer;