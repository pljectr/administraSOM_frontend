import React from 'react';
import styles from './KanbanCard.module.css';

const ActivitySection = () => {
  const activities = [
    {
      id: 1,
      user: 'Matheus Garcia',
      date: 'mar 20 às 16:03',
      action: 'created this task'
    },
    {
      id: 2,
      user: 'System',
      date: 'abr 7 às 14:00',
      action: 'Diciso - 20mar2025 encaminhado para chefia sedec para mudar o expediente dos PCTD para banco de horas'
    },
    {
      id: 3,
      user: 'Matheus Garcia',
      date: 'abr 8',
      action: 'changed status to Complete'
    }
  ];

  return (
    <div className={styles.activitySection}>
      <h3>Activity</h3>
      
      <ul className={styles.activityList}>
        {activities.map(activity => (
          <li key={activity.id} className={styles.activityItem}>
            <div className={styles.activityHeader}>
              <strong>{activity.user}</strong>
              <span>{activity.date}</span>
            </div>
            <p>{activity.action}</p>
          </li>
        ))}
      </ul>
      
      <button className={styles.showMoreButton}>Show More</button>
    </div>
  );
};

export default ActivitySection;