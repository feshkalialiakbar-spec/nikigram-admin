 
import { useState, useMemo, useCallback } from 'react';
import { Task, FilterOptions, UseTaskFiltersReturn, UseTaskPaginationReturn } from '../types';
import { useMyTasks } from '@/hooks/useTaskServices';
import { useSkeletonLoading } from './useSkeletonLoading';
 
export const useTasksQuery = (_filters?: FilterOptions) => {
  const { data: tasks = [], isLoading, error, refetch } = useMyTasks();
  const showSkeleton = useSkeletonLoading({ isLoading });

  return {
    tasks,
    loading: showSkeleton,
    error: error?.message || null,
    refetch: async () => {
      await refetch();
    },
  };
};

// Hook for task filtering
export const useTaskFilters = (
  tasks: Task[],
  initialFilters: FilterOptions
): UseTaskFiltersReturn => {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        !filters.search ||
        task.taskName.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.process.toLowerCase().includes(filters.search.toLowerCase());

      const matchesProcess =
        !filters.process || task.process === filters.process;
      
      const matchesDate = !filters.date || task.date === filters.date;
      
      const matchesPerformerPersonnel = 
        !filters.performerPersonnel || 
        task.performerPersonnel.some(person => person.id === filters.performerPersonnel);
      
      const matchesStatus = !filters.status || task.status === filters.status;
      
      const matchesOperations = !filters.operations || task.operation.type === filters.operations;

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

// Hook for pagination
export const useTaskPagination = (
  tasks: Task[],
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

// Export the skeleton loading hook
export { useSkeletonLoading };
