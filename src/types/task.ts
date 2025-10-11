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

export type TaskStatus = 'pending' | 'stopped' | 'rejected' | 'completed';

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
