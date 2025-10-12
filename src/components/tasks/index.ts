// Main exports for tasks components
export { default as TaskDashboard } from './TaskDashboard';
export { default as TaskTable } from './TaskTable';
export { default as FilterBar } from './FilterBar';
export { default as Pagination } from './Pagination';

// Export types
export type {
  Task,
  PerformerPerson,
  TaskStatus,
  TaskOperation,
  FilterOptions,
  PaginationInfo,
  TaskDashboardProps,
  TaskTableProps,
  FilterBarProps,
  PaginationProps,
  ApiTaskResponse,
  ApiTasksResponse,
  UseTasksReturn,
  UseTaskFiltersReturn,
  UseTaskPaginationReturn,
} from './types';

// Export hooks
export {
  useTasksQuery,
  useTaskFilters,
  useTaskPagination,
  useSkeletonLoading,
} from './hooks';

// Export utilities
export {
  getStatusClass,
  getStatusText,
  PROCESS_OPTIONS,
  PERSONNEL_OPTIONS,
  STATUS_OPTIONS,
  OPERATION_OPTIONS,
  DEFAULT_FILTERS,
} from './utils';
