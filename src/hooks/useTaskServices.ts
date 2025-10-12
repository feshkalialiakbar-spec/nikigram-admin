import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { Task } from '@/components/tasks/types';
import {
  fetchMyTasks,
  fetchUnassignedTasks,
  fetchStoppedTasks,
  fetchInProgressTasks,
  fetchCompletedTasks,
  fetchApprovedTasks,
  fetchNeedsCorrectionTasks,
  fetchRejectedTasks,
  fetchCancelledTasks,
  fetchTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '@/services/taskServices';

/**
 * Generic hook for fetching data with React Query
 */
interface UseApiListOptions<T> {
  fetcher: () => Promise<T>;
  queryKey: string[];
  enabled?: boolean;
  retry?: number;
  staleTime?: number;
  gcTime?: number;
}

export const useApiList = <T = any>({
  fetcher,
  queryKey,
  enabled = true,
  retry = 3,
  staleTime,
  gcTime,
}: UseApiListOptions<T>) => {
  const query = useQuery({
    queryKey,
    queryFn: fetcher,
    enabled,
    retry,
    staleTime,
    gcTime,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
    isError: query.isError,
    isFetching: query.isFetching,
  };
};

/**
 * Hook to fetch my tasks
 */
export const useMyTasks = (options?: Partial<UseQueryOptions<Task[], Error>>) => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks', 'my-tasks'],
    queryFn: fetchMyTasks,
    ...options,
  });
};

/**
 * Hook to fetch unassigned tasks
 */
export const useUnassignedTasks = (options?: Partial<UseQueryOptions<Task[], Error>>) => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks', 'unassigned'],
    queryFn: fetchUnassignedTasks,
    ...options,
  });
};

/**
 * Hook to fetch stopped tasks
 */
export const useStoppedTasks = (options?: Partial<UseQueryOptions<Task[], Error>>) => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks', 'stopped'],
    queryFn: fetchStoppedTasks,
    ...options,
  });
};

/**
 * Hook to fetch in-progress tasks (status 38)
 */
export const useInProgressTasks = (options?: Partial<UseQueryOptions<Task[], Error>>) => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks', 'in-progress'],
    queryFn: fetchInProgressTasks,
    ...options,
  });
};

/**
 * Hook to fetch completed tasks (status 39)
 */
export const useCompletedTasks = (options?: Partial<UseQueryOptions<Task[], Error>>) => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks', 'completed'],
    queryFn: fetchCompletedTasks,
    ...options,
  });
};

/**
 * Hook to fetch approved tasks (status 40)
 */
export const useApprovedTasks = (options?: Partial<UseQueryOptions<Task[], Error>>) => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks', 'approved'],
    queryFn: fetchApprovedTasks,
    ...options,
  });
};

/**
 * Hook to fetch needs correction tasks (status 41)
 */
export const useNeedsCorrectionTasks = (options?: Partial<UseQueryOptions<Task[], Error>>) => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks', 'needs-correction'],
    queryFn: fetchNeedsCorrectionTasks,
    ...options,
  });
};

/**
 * Hook to fetch rejected tasks (status 42)
 */
export const useRejectedTasks = (options?: Partial<UseQueryOptions<Task[], Error>>) => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks', 'rejected'],
    queryFn: fetchRejectedTasks,
    ...options,
  });
};

/**
 * Hook to fetch cancelled tasks (status 43)
 */
export const useCancelledTasks = (options?: Partial<UseQueryOptions<Task[], Error>>) => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks', 'cancelled'],
    queryFn: fetchCancelledTasks,
    ...options,
  });
};

/**
 * Hook to fetch a single task by ID
 */
export const useTask = (id: string | number, options?: Partial<UseQueryOptions<Task, Error>>) => {
  return useQuery<Task, Error>({
    queryKey: ['tasks', id],
    queryFn: () => fetchTaskById(id),
    enabled: !!id,
    ...options,
  });
};

/**
 * Hook to create a new task
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskData: Partial<Task>) => createTask(taskData),
    onSuccess: () => {
      // Invalidate and refetch task queries
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

/**
 * Hook to update a task
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<Task> }) =>
      updateTask(id, data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch task queries
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.id] });
    },
  });
};

/**
 * Hook to delete a task
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => deleteTask(id),
    onSuccess: () => {
      // Invalidate and refetch task queries
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

