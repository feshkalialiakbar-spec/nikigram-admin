'use client';

import React from 'react';
import { TaskDashboard } from '@/components/tasks';
import styles from './index.module.scss';

interface TasksCompletedProps {
  className?: string;
}

const TasksCompleted: React.FC<TasksCompletedProps> = ({ className }) => {
  return (
    <div className={`${styles.tasksCompleted} ${className || ''}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>تکمیل شده</h1>
      </div>
      <div className={styles.content}>
        <TaskDashboard />
      </div>
    </div>
  );
};

export default TasksCompleted;
