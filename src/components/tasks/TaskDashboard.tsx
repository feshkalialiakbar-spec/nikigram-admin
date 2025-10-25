'use client';

import React from 'react';
import { TaskDashboardProps } from './types';
import { useTasksQuery, useTaskFilters, useTaskPagination } from './hooks';
import { DEFAULT_FILTERS } from './utils';
import FilterBar from './FilterBar';
import TaskTable from './TaskTable';
import Pagination from './Pagination';
import styles from './TaskDashboard.module.scss';
import { TaskTableSkeleton } from '../ui/TaskTableSkeleton';

const TaskDashboard: React.FC<TaskDashboardProps> = ({
  className,
  tasks: externalTasks,
  loading: externalLoading,
  error: externalError,
  onRefetch,
  currentPage: externalCurrentPage,
  totalItems: externalTotalItems,
  itemsPerPage: externalItemsPerPage = 15,
  onPageChange: externalOnPageChange,
}) => {
  // Determine if we're using server-side or client-side pagination
  const isServerSidePagination = externalCurrentPage !== undefined && externalTotalItems !== undefined && externalOnPageChange !== undefined;

  // Only use internal query if no external data is provided
  const shouldUseInternalQuery = externalTasks === undefined;
  const { tasks: internalTasks, loading: internalLoading, error: internalError, refetch: internalRefetch } = useTasksQuery();

  // Use external data if provided, otherwise use internal data
  const tasks = shouldUseInternalQuery ? internalTasks : (externalTasks || []);
  const loading = externalLoading !== undefined ? externalLoading : (shouldUseInternalQuery ? internalLoading : false);
  const error = externalError !== undefined ? externalError : (shouldUseInternalQuery ? internalError : null);
  const refetch = onRefetch || internalRefetch;

  const { filters, filteredTasks, updateFilters } = useTaskFilters(tasks, DEFAULT_FILTERS);

  // Client-side pagination for filtered results
  const { currentPage: clientCurrentPage, totalPages: clientTotalPages, paginatedTasks: clientPaginatedTasks, goToPage: clientGoToPage } = useTaskPagination(filteredTasks, externalItemsPerPage);

  const handleFilterChange = React.useCallback((newFilters: typeof filters) => {
    updateFilters(newFilters);
    if (isServerSidePagination) {
      externalOnPageChange(1); // Reset to first page when filters change
    } else {
      clientGoToPage(1);
    }
  }, [updateFilters, isServerSidePagination, externalOnPageChange, clientGoToPage]);

  const handlePageChange = React.useCallback((page: number) => {
    if (isServerSidePagination) {
      externalOnPageChange(page);
    } else {
      clientGoToPage(page);
    }
  }, [isServerSidePagination, externalOnPageChange, clientGoToPage]);

  const handleOperationClick = React.useCallback((taskId: string, operation: string) => {
    console.log(`Operation ${operation} clicked for task ${taskId}`);
    // Here you would typically navigate to a detail page or open a modal
  }, []);

  // Determine which pagination data to use
  const currentPage = isServerSidePagination ? externalCurrentPage : clientCurrentPage;
  const totalPages = isServerSidePagination
    ? Math.ceil((externalTotalItems || 0) / externalItemsPerPage)
    : clientTotalPages;
  const totalItems = isServerSidePagination ? externalTotalItems : filteredTasks.length;
  const displayTasks = isServerSidePagination ? filteredTasks : clientPaginatedTasks;

  const paginationInfo = React.useMemo(() => ({
    currentPage,
    totalPages,
    totalItems: totalItems || 0,
    itemsPerPage: externalItemsPerPage,
  }), [currentPage, totalPages, totalItems, externalItemsPerPage]);

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
          tasks={displayTasks}
          onOperationClick={handleOperationClick}
        />

        <div className={styles.paginationContainer}>
          <Pagination
            pagination={paginationInfo}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskDashboard;