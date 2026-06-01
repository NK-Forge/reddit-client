import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  DEMO_NOTICE,
  getDemoPostsBySubreddit,
  searchDemoPosts,
} from '../../data/demoRedditData';

const getPostImage = (post) => {
  const previewImage = post.preview?.images?.[0]?.source?.url;

  if (previewImage) {
    return previewImage.replaceAll('&amp;', '&');
  }

  if (post.thumbnail && post.thumbnail.startsWith('http')) {
    return post.thumbnail.replaceAll('&amp;', '&');
  }

  return null;
};

const normalizePost = (post) => ({
  id: post.id,
  title: post.title,
  author: post.author,
  subreddit: post.subreddit,
  ups: post.ups,
  comments: post.num_comments,
  permalink: post.permalink,
  redditUrl: `https://www.reddit.com${post.permalink}`,
  url: post.url,
  image: getPostImage(post),
});

export const fetchPostsBySubreddit = createAsyncThunk(
  'posts/fetchPostsBySubreddit',
  async (subreddit) => {
    let response;

    try {
      response = await fetch(
        `https://www.reddit.com/r/${subreddit}.json?limit=25`
      );
    } catch {
      return {
        posts: getDemoPostsBySubreddit(subreddit),
        noticeMessage: DEMO_NOTICE,
        dataSource: 'demo',
      };
    }

    if (!response.ok) {
      return {
        posts: getDemoPostsBySubreddit(subreddit),
        noticeMessage: DEMO_NOTICE,
        dataSource: 'demo',
      };
    }

    try {
      const data = await response.json();

      return {
        posts: data.data.children.map((child) => normalizePost(child.data)),
        noticeMessage: '',
        dataSource: 'live',
      };
    } catch {
      return {
        posts: getDemoPostsBySubreddit(subreddit),
        noticeMessage: DEMO_NOTICE,
        dataSource: 'demo',
      };
    }
  }
);

export const searchPosts = createAsyncThunk(
  'posts/searchPosts',
  async (searchTerm) => {
    let response;

    try {
      response = await fetch(
        `https://www.reddit.com/search.json?q=${encodeURIComponent(
          searchTerm
        )}&limit=25`
      );
    } catch {
      return {
        posts: searchDemoPosts(searchTerm),
        noticeMessage: DEMO_NOTICE,
        dataSource: 'demo',
      };
    }

    if (!response.ok) {
      return {
        posts: searchDemoPosts(searchTerm),
        noticeMessage: DEMO_NOTICE,
        dataSource: 'demo',
      };
    }

    try {
      const data = await response.json();

      return {
        posts: data.data.children.map((child) => normalizePost(child.data)),
        noticeMessage: '',
        dataSource: 'live',
      };
    } catch {
      return {
        posts: searchDemoPosts(searchTerm),
        noticeMessage: DEMO_NOTICE,
        dataSource: 'demo',
      };
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    selectedSubreddit: 'popular',
    searchTerm: '',
    isLoading: false,
    hasError: false,
    errorMessage: '',
    noticeMessage: '',
    dataSource: 'live',
  },
  reducers: {
    setSelectedSubreddit: (state, action) => {
      state.selectedSubreddit = action.payload;
      state.searchTerm = '';
      state.noticeMessage = '';
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostsBySubreddit.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = '';
      })
      .addCase(fetchPostsBySubreddit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.posts;
        state.noticeMessage = action.payload.noticeMessage;
        state.dataSource = action.payload.dataSource;
      })
      .addCase(fetchPostsBySubreddit.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
        state.errorMessage = action.error.message;
      })
      .addCase(searchPosts.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = '';
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.posts;
        state.noticeMessage = action.payload.noticeMessage;
        state.dataSource = action.payload.dataSource;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
        state.errorMessage = action.error.message;
      });
  },
});

export const { setSelectedSubreddit, setSearchTerm } = postsSlice.actions;

export default postsSlice.reducer;