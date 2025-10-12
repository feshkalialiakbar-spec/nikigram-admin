// Task-related types and interfaces
export interface Task {
  id: string;
  taskName: string;
  process: string;
  date: string;
  status: TaskStatus;
  operation: TaskOperation;
  performerPersonnel: PerformerPerson[];
}

export interface PerformerPerson {
  id: string;
  name: string;
  avatar?: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'approved' | 'needs_correction' | 'rejected' | 'cancelled';

export interface TaskOperation {
  type: 'perform' | 'restart' | 'view';
  label: string;
}

export interface FilterOptions {
  search: string;
  process: string;
  date: string;
  performerPersonnel: string;
  status: string;
  operations: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// Component Props Types
export interface TaskDashboardProps {
  className?: string;
  tasks?: Task[];
  loading?: boolean;
  error?: string | null;
  onRefetch?: () => void;
}

export interface TaskTableProps {
  tasks: Task[];
  onOperationClick: (taskId: string, operation: string) => void;
  className?: string;
}

export interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  className?: string;
}

export interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  className?: string;
}

// API Response Types
export interface ApiTaskResponse {
  task_id: number;
  task_title: string;
  status_name: string;
  status_id: number;
  ref_type: number;
  created_at: string;
}

export interface ApiTasksResponse {
  tasks: ApiTaskResponse[];
  total: number;
  limit: number;
  offset: number;
}

// Hook Types
export interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseTaskFiltersReturn {
  filters: FilterOptions;
  filteredTasks: Task[];
  updateFilters: (newFilters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
}

export interface UseTaskPaginationReturn {
  currentPage: number;
  totalPages: number;
  paginatedTasks: Task[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
}

