'use client';

import React, { useState } from 'react';
import { useApiList } from '@/hooks/useTaskServices';
import { fetchStoppedTasks } from '@/services/taskServices';
import { Task, TaskDashboard } from '@/components/tasks';
import styles from './index.module.scss';

interface TasksStoppedProps {
  className?: string;
}

const TasksStopped: React.FC<TasksStoppedProps> = ({ className }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const paginationParams = {
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
  };

  const { data: tasks, total, isLoading, error, refetch } = useApiList({
    fetcher: fetchStoppedTasks,
    queryKey: ['tasks', 'stopped', paginationParams],
    enabled: true,
    retry: 3,
    paginationParams,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
      <div className={styles.content}>
        <TaskDashboard
          tasks={tasks as Task[]}
          loading={isLoading}
          error={error ? (error as unknown as Error)?.message || null : null}
          onRefetch={refetch}
          currentPage={currentPage}
          totalItems={total}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default TasksStopped;
