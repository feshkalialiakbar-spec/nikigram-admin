import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { TaskInterface } from '@/components/tasks/types';
import {
  fetchMyTasks,
  fetchUnassignedTasks,
  createTask,
  updateTask,
  deleteTask,
  PaginatedResponse,
  PaginationParams,
} from '@/services/taskServices';

/**
 * Generic hook for fetching data with React Query
 */
interface UseApiListOptions<T> {
  fetcher: (params?: PaginationParams) => Promise<PaginatedResponse<T>>;
  queryKey: (string | number | PaginationParams | undefined)[];
  enabled?: boolean;
  retry?: number;
  staleTime?: number;
  gcTime?: number;
  paginationParams?: PaginationParams;
}

export const useApiList = <T = unknown>({
  fetcher,
  queryKey,
  enabled = true,
  retry = 3,
  staleTime,
  gcTime,
  paginationParams,
}: UseApiListOptions<T>) => {
  const query = useQuery({
    queryKey,
    queryFn: () => fetcher(paginationParams),
    enabled,
    retry,
    staleTime,
    gcTime,
  });

  return {
    data: query.data?.tasks,
    total: query.data?.total ?? 0,
    limit: query.data?.limit ?? 15,
    offset: query.data?.offset ?? 0,
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
export const useMyTasks = (
  paginationParams?: PaginationParams,
  options?: Partial<UseQueryOptions<PaginatedResponse<TaskInterface>, Error>>
) => {
  return useQuery<PaginatedResponse<TaskInterface>, Error>({
    queryKey: ['tasks', 'my-profile', paginationParams],
    queryFn: () => fetchMyTasks(paginationParams),
    ...options,
  });
};

/**
 * Hook to fetch unassigned tasks
 */
export const useUnassignedTasks = (
  paginationParams?: PaginationParams,
  options?: Partial<UseQueryOptions<PaginatedResponse<TaskInterface>, Error>>
) => {
  return useQuery<PaginatedResponse<TaskInterface>, Error>({
    queryKey: ['tasks', 'unassigned', paginationParams],
    queryFn: () => fetchUnassignedTasks(paginationParams),
    ...options,
  });
};
/**
 * Hook to create a new task
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskData: Partial<TaskInterface>) => createTask(taskData),
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
    mutationFn: ({ id, data }: { id: string | number; data: Partial<TaskInterface> }) =>
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

