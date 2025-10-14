import { TaskInterface } from "@/interface";

// Re-export TaskInterface for convenience
export type { TaskInterface };

export interface PerformerPerson {
  id: string;
  name: string;
  avatar?: string;
}

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
  tasks?: TaskInterface[];
  loading?: boolean;
  error?: string | null;
  onRefetch?: () => void;
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

export interface TaskTableProps {
  tasks: TaskInterface[];
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
  tasks: TaskInterface[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseTaskFiltersReturn {
  filters: FilterOptions;
  filteredTasks: TaskInterface[];
  updateFilters: (newFilters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
}

export interface UseTaskPaginationReturn {
  currentPage: number;
  totalPages: number;
  paginatedTasks: TaskInterface[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
}

// Task Type Constants
export const TASK_TYPES = {
  REF_TYPE_PARTY_CHANGE_REQUEST: 1, // تسک درخواست تغییر پروفایل
  REF_TYPE_PROJECT_REQUEST: 2, // تسک درخواست کمک
  REF_TYPE_PROJECT_TASKS: 3, // تسک های مربوط به انجام پروژه
  REF_TYPE_REQUEST_PROJECT_TEMPLATE: 4, // تسک درخواست ایجاد تمپلیت
} as const;

export type TaskType = typeof TASK_TYPES[keyof typeof TASK_TYPES];

// Profile Change Request Types
export interface ProfileDocument {
  id: string;
  filename: string;
  fileType: 'jpg' | 'pdf';
  uploadDate: string;
  fileSize: string;
  url?: string;
}

export interface RealProfile {
  profileType: 'حقیقی';
  gender: string;
  contactNumber: string;
  nationalId: string;
  lastName: string;
  firstName: string;
  documents: ProfileDocument[];
}

export interface LegalProfile {
  profileType: 'حقوقی';
  contactNumber: string;
  roleInCompany: string;
  nationalId: string;
  companyName: string;
  documents: ProfileDocument[];
}

export interface PrimaryIndividual {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  document: ProfileDocument;
}

export interface ProfileChangeRequest {
  id: string;
  requestDate: string;
  userName: string;
  userAvatar?: string;
  realProfile: RealProfile;
  legalProfile: LegalProfile;
  primaryIndividuals: PrimaryIndividual[];
  aiComment?: string;
}

export interface ProfileChangeApprovalProps {
  request: ProfileChangeRequest;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  onSelectPrimary: (individualId: string) => void;
  className?: string;
}

