import React from 'react';
import styles from './KanbanCard.module.css';

const StatusSection = () => {
  return (
    <div className={styles.statusSection}>
      <h3>Status</h3>
      
      <div className={styles.statusItem}>
        <label>Status</label>
        <select className={styles.statusSelect}>
          <option value="complete">COMPLETE</option>
          <option value="in_progress">In Progress</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      
      <div className={styles.statusItem}>
        <label>Due Date</label>
        <input type="date" className={styles.statusInput} />
      </div>
      
      <div className={styles.statusItem}>
        <label>Estimated Time</label>
        <input type="text" placeholder="e.g. 2h" className={styles.statusInput} />
      </div>
      
      <div className={styles.statusItem}>
        <label>Tags</label>
        <div className={styles.tagsContainer}>
          <span className={styles.tag}>Urgent</span>
          <span className={styles.tag}>Admin</span>
          <button className={styles.addTagButton}>+</button>
        </div>
      </div>
      
      <div className={styles.divider}></div>
      
      <div className={styles.statusItem}>
        <label>Priority</label>
        <select className={styles.statusSelect}>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      
      <div className={styles.statusItem}>
        <label>Tracked Time</label>
        <div className={styles.timeTracked}>0h 0m</div>
      </div>
    </div>
  );
};

export default StatusSection;