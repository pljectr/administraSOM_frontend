//KanBanCard.jsx

import React, { useState } from 'react';
import styles from './KanbanCard.module.css';
import StatusSection from './StatusSection';
import CommentSection from './CommentSection';
import DetailsSection from './DetailsSection';
import ActivitySection from './ActivitySection';

const KanbanCard = () => {
  const [description, setDescription] = useState(
    '# Trâmites pessoais e administrativos\n\n- Peça ao Brian para criar um resumo - gerar substancias - encontrar tarefas semelhantes - ou faça uma pergunta sobre esta tarefa'
  );
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, {
        id: Date.now(),
        author: 'Matheus Garcia',
        date: new Date().toLocaleString(),
        text: newComment
      }]);
      setNewComment('');
    }
  };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.mainContent}>
        <h1 className={styles.cardTitle}>Trâmites pessoais e administrativos</h1>
        
        <div className={styles.descriptionSection}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.descriptionTextarea}
          />
        </div>
        
        <div className={styles.uploadsSection}>
          <h3>Uploads</h3>
          <div className={styles.uploadArea}>
            <p>Arraste arquivos aqui ou clique para fazer upload</p>
          </div>
        </div>
        
        <div className={styles.detailsActivityContainer}>
          <DetailsSection />
          <ActivitySection />
        </div>
      </div>
      
      <div className={styles.sidebar}>
        <StatusSection />
        <CommentSection 
          comments={comments}
          newComment={newComment}
          setNewComment={setNewComment}
          onAddComment={handleAddComment}
        />
      </div>
    </div>
  );
};

export default KanbanCard;