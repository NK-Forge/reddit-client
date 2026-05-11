import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import PostsList from './features/posts/PostsList';
import {
  fetchPostsBySubreddit,
  setSelectedSubreddit,
} from './features/posts/postsSlice';
import SearchBar from './features/search/SearchBar';

const subreddits = ['popular', 'webdev', 'reactjs', 'gaming'];

function App() {
  const dispatch = useDispatch();
  const { selectedSubreddit, searchTerm } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPostsBySubreddit(selectedSubreddit));
  }, [dispatch, selectedSubreddit]);

  const handleSubredditClick = (subreddit) => {
    dispatch(setSelectedSubreddit(subreddit));
  };

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">NK Forge Coursework</p>
          <h1>Post Reader</h1>
          <p className="intro">
            Browse popular posts, filter by category, and search public post
            data.
          </p>
        </div>

        <SearchBar />
      </header>

      <nav className="subreddit-nav" aria-label="Post categories">
        {subreddits.map((subreddit) => (
          <button
            key={subreddit}
            type="button"
            className={selectedSubreddit === subreddit ? 'active' : ''}
            onClick={() => handleSubredditClick(subreddit)}
          >
            r/{subreddit}
          </button>
        ))}
      </nav>

      <section className="results-heading">
        <h2>
          {searchTerm
            ? `Search results for "${searchTerm}"`
            : `Showing r/${selectedSubreddit}`}
        </h2>
      </section>

      <PostsList />
    </main>
  );
}

export default App;