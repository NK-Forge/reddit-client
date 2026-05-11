import { useDispatch, useSelector } from 'react-redux';
import CommentsPanel from '../comments/CommentsPanel';
import {
  fetchCommentsForPost,
  toggleCommentsForPost,
} from '../comments/commentsSlice';

export default function PostsList() {
  const dispatch = useDispatch();

  const { posts, isLoading, hasError, errorMessage } = useSelector(
    (state) => state.posts
  );

  const { activePostId, commentsByPostId } = useSelector(
    (state) => state.comments
  );

  const handleCommentsClick = (post) => {
    dispatch(toggleCommentsForPost(post.id));

    if (!commentsByPostId[post.id]) {
      dispatch(
        fetchCommentsForPost({
          postId: post.id,
          permalink: post.permalink,
        })
      );
    }
  };

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

            <div className="post-actions">
              <a
                className="post-action-link"
                href={post.redditUrl}
                target="_blank"
                rel="noreferrer"
              >
                View discussion
              </a>

              <button
                className="comments-toggle"
                type="button"
                onClick={() => handleCommentsClick(post)}
              >
                {activePostId === post.id ? 'Hide comments' : 'Show comments'}
              </button>
            </div>

            {activePostId === post.id && <CommentsPanel postId={post.id} />}
          </div>
        </article>
      ))}
    </section>
  );
}