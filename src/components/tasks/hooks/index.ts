import { useState, useMemo, useCallback } from 'react';
import { TaskInterface, FilterOptions, UseTaskFiltersReturn, UseTaskPaginationReturn } from '../types';
import { useMyTasks } from '@/hooks/useTaskServices';
import { useSkeletonLoading } from './useSkeletonLoading';
import { PaginationParams } from '@/services/task/taskServices';

interface UseTasksQueryOptions {
  enabled?: boolean;
}

export const useTasksQuery = (
  _filters?: FilterOptions,
  paginationParams?: PaginationParams,
  options?: UseTasksQueryOptions,
) => {
  const { data, isLoading, error, refetch } = useMyTasks(paginationParams, {
    enabled: options?.enabled,
  });
  const showSkeleton = useSkeletonLoading({ isLoading });

  return {
    tasks: data?.tasks || [],
    total: data?.total || 0,
    loading: showSkeleton,
    error: error?.message || null,
    refetch: async () => {
      await refetch();
    },
  };
};

// Hook for task filtering
export const useTaskFilters = (
  tasks: TaskInterface[],
  initialFilters: FilterOptions
): UseTaskFiltersReturn => {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        !filters.search ||
        task.task_title.toLowerCase().includes(filters.search.toLowerCase()) ||
        String(task.ref_type).toLowerCase().includes(filters.search.toLowerCase());

      const matchesProcess =
        !filters.process || String(task.ref_type) === filters.process;
      
      const matchesDate = !filters.date || task.created_at.includes(filters.date);
      
      // Skip performer personnel filter for now as it's not in TaskInterface
      const matchesPerformerPersonnel = !filters.performerPersonnel;
      
      const matchesStatus = !filters.status || String(task.status_id) === filters.status;
      
      // Skip operations filter as it's not in TaskInterface
      const matchesOperations = !filters.operations;

      return matchesSearch && matchesProcess && matchesDate && 
             matchesPerformerPersonnel && matchesStatus && matchesOperations;
    });
  }, [tasks, filters]);

  const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  return {
    filters,
    filteredTasks,
    updateFilters,
    resetFilters,
  };
};

// Hook for pagination - client-side only (filters results from a page)
export const useTaskPagination = (
  tasks: TaskInterface[],
  itemsPerPage: number = 15
): UseTaskPaginationReturn => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.ceil(tasks.length / itemsPerPage);

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return tasks.slice(startIndex, endIndex);
  }, [tasks, currentPage, itemsPerPage]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const previousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  return {
    currentPage,
    totalPages,
    paginatedTasks,
    goToPage,
    nextPage,
    previousPage,
  };
};

// Hook for server-side pagination
export const useServerPagination = (itemsPerPage: number = 15) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const paginationParams: PaginationParams = useMemo(() => ({
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
  }), [currentPage, itemsPerPage]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const nextPage = useCallback(() => {
    setCurrentPage(prev => prev + 1);
  }, []);

  const previousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  }, []);

  return {
    currentPage,
    paginationParams,
    goToPage,
    nextPage,
    previousPage,
  };
};

// Export the skeleton loading hook
export { useSkeletonLoading };
