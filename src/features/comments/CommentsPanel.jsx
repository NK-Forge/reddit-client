import { useSelector } from 'react-redux';

export default function CommentsPanel({ postId }) {
  const {
    commentsByPostId,
    loadingByPostId,
    errorByPostId,
    noticeByPostId,
  } = useSelector((state) => state.comments);

  const comments = commentsByPostId[postId] || [];
  const isLoading = loadingByPostId[postId];
  const errorMessage = errorByPostId[postId];
  const noticeMessage = noticeByPostId[postId];

  if (isLoading) {
    return <p className="comments-status">Loading comments...</p>;
  }

  if (errorMessage) {
    return <p className="comments-status error">{errorMessage}</p>;
  }

  if (noticeMessage) {
    return <p className="comments-status notice">{noticeMessage}</p>;
  }

  if (!comments.length) {
    return <p className="comments-status">No comments found.</p>;
  }

  return (
    <section className="comments-panel" aria-label="Post comments">
      <h3>Top Comments</h3>

      <div className="comments-list">
        {comments.map((comment) => (
          <article className="comment-card" key={comment.id}>
            <p className="comment-meta">
              u/{comment.author} • {comment.ups.toLocaleString()} upvotes
            </p>
            <p>{comment.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}