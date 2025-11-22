'use client'
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  TaskInterface,
  FilterOptions,
  UseTaskFiltersReturn,
  UseTaskPaginationReturn,
} from '../types';
import { useSkeletonLoading } from './useSkeletonLoading';
import {
  fetchMyTasks,
  PaginationParams,
  PaginatedResponse,
  TaskServiceResult,
  TASK_DEFAULT_LIMIT,
} from '@/services/task/taskServices';
import { convertToPersianDate } from '@/utils/dateUtils';

interface UseTasksQueryOptions {
  enabled?: boolean;
}

type TaskListFetcher = (
  params?: PaginationParams
) => Promise<TaskServiceResult<PaginatedResponse<TaskInterface>>>;

interface UsePaginatedTaskServiceOptions {
  enabled?: boolean;
}

interface UsePaginatedTaskServiceReturn {
  tasks: TaskInterface[];
  total: number;
  limit: number;
  offset: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<TaskServiceResult<PaginatedResponse<TaskInterface>> | void>;
}

const createPaginationFallback = (params?: PaginationParams) => ({
  limit: params?.limit ?? TASK_DEFAULT_LIMIT,
  offset: params?.offset ?? 0,
});

export const usePaginatedTaskService = (
  fetcher: TaskListFetcher,
  paginationParams?: PaginationParams,
  options?: UsePaginatedTaskServiceOptions
): UsePaginatedTaskServiceReturn => {
  const { limit, offset } = createPaginationFallback(paginationParams);
  const enabled = options?.enabled ?? true;

  const [tasks, setTasks] = useState<TaskInterface[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchedKeyRef = useRef<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetcher({ limit, offset });

      if (response.success && response.data) {
        setTasks(response.data.tasks);
        setTotal(response.data.total);
      } else {
        setTasks([]);
        setTotal(0);
        setError(response.message ?? 'خطا در بارگذاری داده‌ها');
      }

      return response;
    } catch (err) {
      setTasks([]);
      setTotal(0);
      setError(err instanceof Error ? err.message : 'خطای ناشناخته رخ داده است');
    } finally {
      setLoading(false);
    }
  }, [enabled, fetcher, limit, offset]);

  useEffect(() => {
    if (!enabled) {
      lastFetchedKeyRef.current = null;
      return;
    }

    const fetchKey = `${limit}-${offset}`;

    if (lastFetchedKeyRef.current === fetchKey) {
      return;
    }

    lastFetchedKeyRef.current = fetchKey;
    void fetchData();
  }, [enabled, fetchData, limit, offset]);

  return {
    tasks,
    total,
    limit,
    offset,
    loading,
    error,
    refetch: fetchData,
  };
};

export const useTasksQuery = (
  _filters?: FilterOptions,
  paginationParams?: PaginationParams,
  options?: UseTasksQueryOptions,
) => {
  const {
    tasks,
    total,
    loading,
    error,
    refetch: refetchTasks,
  } = usePaginatedTaskService(
    fetchMyTasks,
    paginationParams,
    options
  );
  const showSkeleton = useSkeletonLoading({ isLoading: loading });

  return {
    tasks,
    total,
    loading: showSkeleton,
    error,
    refetch: async () => {
      await refetchTasks();
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
      // Search filter: matches task title or description
      const matchesSearch =
        !filters.search ||
        task.task_title.toLowerCase().includes(filters.search.toLowerCase()) ||
        (task.task_description && task.task_description.toLowerCase().includes(filters.search.toLowerCase()));

      // Process filter: matches ref_type
      const matchesProcess =
        !filters.process || String(task.ref_type) === filters.process;

      // Date filter: matches Persian date format (YYYY/MM/DD)
      const matchesDate = !filters.date || (() => {
        const taskPersianDate = convertToPersianDate(task.created_at);
        return taskPersianDate === filters.date || taskPersianDate.includes(filters.date);
      })();

      // Skip performer personnel filter for now as it's not in TaskInterface
      const matchesPerformerPersonnel = !filters.performerPersonnel;

      // Status filter: matches status_id
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
