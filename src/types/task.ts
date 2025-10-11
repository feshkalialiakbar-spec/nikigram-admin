export interface Task {
  id: string;
  taskName: string;
  process: string;
  date: string;
  status: TaskStatus;
  operation: TaskOperation;
}

export type TaskStatus = 'pending' | 'stopped' | 'rejected' | 'completed';

export interface TaskOperation {
  type: 'perform' | 'restart' | 'view';
  label: string;
}

export interface FilterOptions {
  search: string;
  process: string;
  date: string;
  status: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
