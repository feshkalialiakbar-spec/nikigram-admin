'use client';

import React from 'react';
import { TaskDashboard } from '@/components/tasks';
import styles from './index.module.scss';

interface TasksInProgressProps {
  className?: string;
}

const TasksInProgress: React.FC<TasksInProgressProps> = ({ className }) => {
  return (
    <div className={`${styles.tasksInProgress} ${className || ''}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>در حال انجام</h1>
      </div>
      <div className={styles.content}>
        <TaskDashboard />
      </div>
    </div>
  );
};

export default TasksInProgress;
