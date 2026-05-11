import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

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
  permalink: `https://www.reddit.com${post.permalink}`,
  url: post.url,
  image: getPostImage(post),
});

export const fetchPostsBySubreddit = createAsyncThunk(
  'posts/fetchPostsBySubreddit',
  async (subreddit) => {
    const response = await fetch(
      `https://www.reddit.com/r/${subreddit}.json?limit=25`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch posts.');
    }

    const data = await response.json();

    return data.data.children.map((child) => normalizePost(child.data));
  }
);

export const searchPosts = createAsyncThunk(
  'posts/searchPosts',
  async (searchTerm) => {
    const response = await fetch(
      `https://www.reddit.com/search.json?q=${encodeURIComponent(
        searchTerm
      )}&limit=25`
    );

    if (!response.ok) {
      throw new Error('Failed to search posts.');
    }

    const data = await response.json();

    return data.data.children.map((child) => normalizePost(child.data));
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
  },
  reducers: {
    setSelectedSubreddit: (state, action) => {
      state.selectedSubreddit = action.payload;
      state.searchTerm = '';
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
        state.posts = action.payload;
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
        state.posts = action.payload;
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