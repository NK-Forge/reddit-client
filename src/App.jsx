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
  const { selectedSubreddit, searchTerm, posts } = useSelector(
    (state) => state.posts
  );

  useEffect(() => {
    dispatch(fetchPostsBySubreddit(selectedSubreddit));
  }, [dispatch, selectedSubreddit]);

  const handleSubredditClick = (subreddit) => {
    dispatch(setSelectedSubreddit(subreddit));
  };

  return (
    <main className="app">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Threadline</p>
          <h1>Explore Reddit without the noise.</h1>
          <p className="intro">
            Search posts, browse focused communities, and open discussions from
            a clean reader built for fast scanning.
          </p>

          <div className="hero-actions">
            <SearchBar />
          </div>
        </div>

        <aside className="app-card" aria-label="Threadline app highlights">
          <p className="card-label">Now viewing</p>
          <h2>r/{selectedSubreddit}</h2>
          <p>
            {searchTerm
              ? `Filtering the feed for "${searchTerm}".`
              : 'Browse the latest posts from the selected community.'}
          </p>

          <div className="app-stats" aria-label="Feed stats">
            <div>
              <strong>{posts.length}</strong>
              <span>Posts loaded</span>
            </div>
            <div>
              <strong>{subreddits.length}</strong>
              <span>Communities</span>
            </div>
          </div>
        </aside>
      </section>

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
        <p className="section-label">Live feed</p>
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