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

// API Response Types for Profile Change Request
export interface ApiProfileChangeRequestResponse {
  task_details: {
    task_id: number;
    task_title: string;
    task_description: string;
    ref_type: number;
    ref_id: number;
    status_id: number;
    status_name: string;
    created_at: string;
    source_template_id: number | null;
    parent_task_id: number | null;
  };
  staff_id: number;
  changed_fields: string[];
  party_request_details: {
    party_request_id: number;
    party_id: number;
    party_uid: string;
    user_id: number;
    customer_id: number;
    customer_uid: string;
    first_name: string;
    last_name: string;
    alias: string;
    national_id: string;
    gender: number;
    birth_date: string;
    education_degree: number;
    biography: string;
    profile_image: string;
    mobile: string;
    is_verified: number;
    is_canceled: number;
  };
  party_docs_data: {
    document_id: number;
    document_type: number;
    file_uid: string;
    upload_date: string;
    is_verified: number;
    status_id: number;
    version: number;
  }[];
  party_platforms_data: {
    account_id: number;
    account_name: string;
    account_identifier: string;
    is_default: number;
    is_active: number;
    is_workplatform: number;
    is_verified: number;
    platform_name: string;
    platform_icon: string;
    base_url: string;
    platform_active: number;
    status_id: number;
  }[];
}

