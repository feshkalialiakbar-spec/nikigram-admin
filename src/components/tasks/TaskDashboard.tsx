'use client';

import React from 'react';
import { TaskDashboardProps } from './types';
import { useTasks, useTaskFilters, useTaskPagination } from './hooks';
import { DEFAULT_FILTERS } from './utils';
import { TaskTableSkeleton } from '@/components/ui';
import FilterBar from './FilterBar';
import TaskTable from './TaskTable';
import Pagination from './Pagination';
import styles from './TaskDashboard.module.scss';

const TaskDashboard: React.FC<TaskDashboardProps> = ({ className }) => {
  const { tasks, loading, error, refetch } = useTasks();
  const { filters, filteredTasks, updateFilters } = useTaskFilters(tasks, DEFAULT_FILTERS);
  const { currentPage, totalPages, paginatedTasks, goToPage } = useTaskPagination(filteredTasks);

  const handleFilterChange = React.useCallback((newFilters: typeof filters) => {
    updateFilters(newFilters);
    goToPage(1); // Reset to first page when filters change
  }, [updateFilters, goToPage]);

  const handlePageChange = React.useCallback((page: number) => {
    goToPage(page);
  }, [goToPage]);

  const handleOperationClick = React.useCallback((taskId: string, operation: string) => {
    console.log(`Operation ${operation} clicked for task ${taskId}`);
    // Here you would typically navigate to a detail page or open a modal
  }, []);

  const paginationInfo = React.useMemo(() => ({
    currentPage,
    totalPages,
    totalItems: filteredTasks.length,
    itemsPerPage: 15,
  }), [currentPage, totalPages, filteredTasks.length]);

  if (loading) {
    return (
      <div className={`${styles.dashboard} ${className || ''}`}>
        <TaskTableSkeleton rows={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.dashboard} ${className || ''}`}>
        <div className={styles.error}>
          خطا در بارگذاری داده‌ها: {error}
          <button onClick={refetch} className={styles.retryButton}>
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.dashboard} ${className || ''}`}>
      <div className={styles.mainContent}>
        <FilterBar 
          filters={filters} 
          onFilterChange={handleFilterChange} 
        />

        <TaskTable
          tasks={paginatedTasks}
          onOperationClick={handleOperationClick}
        />

        <Pagination 
          pagination={paginationInfo} 
          onPageChange={handlePageChange} 
        />
      </div>
    </div>
  );
};

export default TaskDashboard;