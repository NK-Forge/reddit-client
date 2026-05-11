import { useSelector } from 'react-redux';

export default function PostsList() {
  const { posts, isLoading, hasError, errorMessage } = useSelector(
    (state) => state.posts
  );

  if (isLoading) {
    return <p className="status-message">Loading posts...</p>;
  }

  if (hasError) {
    return (
      <p className="status-message error">
        {errorMessage || 'Something went wrong while loading posts.'}
      </p>
    );
  }

  if (!posts.length) {
    return <p className="status-message">No posts found.</p>;
  }

  return (
    <section className="posts-list" aria-label="Reddit posts">
      {posts.map((post) => (
        <article className="post-card" key={post.id}>
          {post.image && (
            <img
              className="post-thumbnail"
              src={post.image}
              alt=""
              aria-hidden="true"
            />
          )}

          <div className="post-content">
            <p className="post-meta">
              r/{post.subreddit} • Posted by u/{post.author}
            </p>

            <h2>{post.title}</h2>

            <div className="post-stats">
              <span>{post.ups.toLocaleString()} upvotes</span>
              <span>{post.comments.toLocaleString()} comments</span>
            </div>

            <a href={post.permalink} target="_blank" rel="noreferrer">
              View discussion
            </a>
          </div>
        </article>
      ))}
    </section>
  );
}