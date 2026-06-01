import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  DEMO_NOTICE,
  getDemoCommentsForPost,
} from '../../data/demoRedditData';

const normalizeComment = (comment) => ({
  id: comment.id,
  author: comment.author,
  body: comment.body,
  ups: comment.ups,
});

export const fetchCommentsForPost = createAsyncThunk(
  'comments/fetchCommentsForPost',
  async ({ postId, permalink }) => {
    let response;

    try {
      response = await fetch(
        `https://www.reddit.com${permalink}.json?limit=10`
      );
    } catch {
      return {
        postId,
        comments: getDemoCommentsForPost(postId),
        noticeMessage: DEMO_NOTICE,
      };
    }

    if (!response.ok) {
      return {
        postId,
        comments: getDemoCommentsForPost(postId),
        noticeMessage: DEMO_NOTICE,
      };
    }

    try {
      const data = await response.json();
      const commentsListing = data[1]?.data?.children || [];

      const comments = commentsListing
        .filter((child) => child.kind === 't1')
        .map((child) => normalizeComment(child.data));

      return {
        postId,
        comments,
        noticeMessage: '',
      };
    } catch {
      return {
        postId,
        comments: getDemoCommentsForPost(postId),
        noticeMessage: DEMO_NOTICE,
      };
    }
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    activePostId: null,
    commentsByPostId: {},
    loadingByPostId: {},
    errorByPostId: {},
    noticeByPostId: {},
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
        const { postId, comments, noticeMessage } = action.payload;

        state.loadingByPostId[postId] = false;
        state.commentsByPostId[postId] = comments;
        state.noticeByPostId[postId] = noticeMessage;
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