import React from 'react';
import styles from './KanbanCard.module.css';

const CommentSection = ({ comments, newComment, setNewComment, onAddComment }) => {
  return (
    <div className={styles.commentSection}>
      <h3>Comments</h3>
      
      <div className={styles.commentList}>
        {comments.length === 0 ? (
          <p>No comments yet</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className={styles.comment}>
              <div className={styles.commentHeader}>
                <strong>{comment.author}</strong>
                <span>{comment.date}</span>
              </div>
              <p>{comment.text}</p>
            </div>
          ))
        )}
      </div>
      
      <div className={styles.commentForm}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className={styles.commentTextarea}
        />
        <button 
          onClick={onAddComment}
          className={styles.commentButton}
        >
          Add Comment
        </button>
      </div>
    </div>
  );
};

export default CommentSection;