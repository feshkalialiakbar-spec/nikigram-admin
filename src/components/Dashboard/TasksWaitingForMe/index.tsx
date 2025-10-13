'use client';

import React from 'react';
import { useApiList } from '@/hooks/useTaskServices';
import { fetchWaitingForMeTasks } from '@/services/taskServices';
import { TaskDashboard } from '@/components/tasks';
import styles from './index.module.scss';

interface TasksWaitingForMeProps {
  className?: string;
}

const TasksWaitingForMe: React.FC<TasksWaitingForMeProps> = ({ className }) => {
  const { data: tasks, isLoading, error, refetch } = useApiList({
    fetcher: fetchWaitingForMeTasks,
    queryKey: ['tasks', 'waiting-for-me'],
    enabled: true,
    retry: 3,
  });

  if (isLoading) {
    return (
      <div className={`${styles.tasksWaitingForMe} ${className || ''}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>در انتظار انجام من</h1>
        </div>
        <div className={styles.content}>
          <TaskDashboard />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.tasksWaitingForMe} ${className || ''}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>در انتظار انجام من</h1>
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
    <div className={`${styles.tasksWaitingForMe} ${className || ''}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>در انتظار انجام من</h1>
      </div>
      <div className={styles.content}>
        <TaskDashboard 
          tasks={tasks}
          loading={isLoading}
          error={error ? (error as unknown as Error)?.message || null : null}
          onRefetch={refetch}
        />
      </div>
    </div>
  );
};

export default TasksWaitingForMe;


