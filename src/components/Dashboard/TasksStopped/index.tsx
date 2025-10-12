'use client';

import React from 'react';
import { useApiList } from '@/hooks/useTaskServices';
import { fetchStoppedTasks } from '@/services/taskServices';
import { TaskDashboard } from '@/components/tasks';
import styles from './index.module.scss';

interface TasksStoppedProps {
  className?: string;
}

const TasksStopped: React.FC<TasksStoppedProps> = ({ className }) => {
  const { data: tasks, isLoading, error, refetch } = useApiList({
    fetcher: fetchStoppedTasks,
    queryKey: ['tasks', 'stopped'],
    enabled: true,
    retry: 3,
  });

  if (isLoading) {
    return (
      <div className={`${styles.tasksStopped} ${className || ''}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>متوقف شده</h1>
        </div>
        <div className={styles.content}>
          <TaskDashboard />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.tasksStopped} ${className || ''}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>متوقف شده</h1>
        </div>
        <div className={styles.error}>
          <p>خطا در بارگذاری داده‌ها: {error.message}</p>
          <button onClick={() => refetch()} className={styles.retryButton}>
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.tasksStopped} ${className || ''}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>متوقف شده</h1>
      </div>
      <div className={styles.content}>
        <TaskDashboard />
      </div>
    </div>
  );
};

export default TasksStopped;
