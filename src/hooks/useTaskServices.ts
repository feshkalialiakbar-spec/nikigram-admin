import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { Task } from '@/components/tasks/types';
import {
  fetchMyTasks,
  fetchUnassignedTasks,
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

export const useApiList = <T = unknown>({
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

