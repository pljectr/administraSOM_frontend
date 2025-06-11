import React from 'react';
import styles from './KanbanCard.module.css';

const DetailsSection = () => {
  return (
    <div className={styles.detailsSection}>
      <h3>Details</h3>
      
      <div className={styles.detailItem}>
        <label>Subtasks</label>
        <ul className={styles.subtaskList}>
          <li>
            <input type="checkbox" id="subtask1" />
            <label htmlFor="subtask1">Terapeuta - Cidadã</label>
          </li>
          <li>
            <input type="checkbox" id="subtask2" />
            <label htmlFor="subtask2">Matheus Garcia</label>
          </li>
        </ul>
        <button className={styles.addButton}>+ Add Subtask</button>
      </div>
      
      <div className={styles.detailItem}>
        <label>Action Items</label>
        <ul className={styles.actionList}>
          <li>Diciso - 20mar2025 encaminhado para chefia</li>
          <li>Diciso - 40abr2025 - Anixo prévio PCTD Marmitt - TCLM</li>
        </ul>
      </div>
    </div>
  );
};

export default DetailsSection;