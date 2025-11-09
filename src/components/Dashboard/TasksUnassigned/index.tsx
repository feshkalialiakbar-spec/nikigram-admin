'use client';

import React, { useState } from 'react';
import { useApiList } from '@/hooks/useTaskServices';
import { fetchUnassignedTasks } from '@/services/task/taskServices';
import { TaskDashboard } from '@/components/tasks';
import styles from './index.module.scss';
import WithNavbarLayout from '@/components/layouts/withNavbarLayout/WithNavbarLayout';
import Button from '@/components/ui/actions/button/Button';

interface TasksUnassignedProps {
  className?: string;
}

const TasksUnassigned: React.FC<TasksUnassignedProps> = ({ className }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const paginationParams = {
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
  };

  const { data: tasks, total, isLoading, error, refetch } = useApiList({
    fetcher: fetchUnassignedTasks,
    queryKey: ['tasks', 'unassigned', paginationParams],
    enabled: true,
    retry: 3,
    paginationParams,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className={`${styles.tasksUnassigned} ${className || ''}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>اختصاص نیافته</h1>
        </div>
        <div className={styles.content}>
          <TaskDashboard />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.tasksUnassigned} ${className || ''}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>اختصاص نیافته</h1>
        </div>
        <div className={styles.error}>
          <p>خطا در بارگذاری داده‌ها: {error.message}</p>
          <Button onClick={() => refetch()} buttonClassName={styles.retryButton}>
            تلاش مجدد
          </Button>
        </div>
      </div>
    );
  }

  return (
    <WithNavbarLayout>
      <div className={`${styles.tasksUnassigned} ${className || ''}`}>
        <div className={styles.content}>
          <TaskDashboard
            tasks={tasks}
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
    </WithNavbarLayout>

  );
};

export default TasksUnassigned;
