import { TaskInterface } from "@/interface";
import { buildDocDownloadUrl } from "@/utils/docUrl";

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
  allowAssignment?: boolean;
}

export interface TaskTableProps {
  tasks: TaskInterface[];
  onOperationClick?: (taskId: number, operation: string) => Promise<void> | void;
  className?: string;
  isAssignable?: boolean;
}

export interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  className?: string;
  dateOptions?: { label: string; value: string }[];
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
  REF_TYPE_COOPERATION_REQUEST: 5, // تسک درخواست همکاری
  REF_TYPE_TICKET: 6,
  REF_TYPE_BUSINESS_CHANGE_REQUEST: 7
} as const;

export type TaskType = typeof TASK_TYPES[keyof typeof TASK_TYPES];

// Profile Change Request Types
export interface ProfileDocument {
  document_id?: number;
  document_type?: number;
  file_uid?: string;
  upload_date?: string;
  is_verified?: number;
  status_id?: number;
  version?: number;
  url?: string;
  filename?: string;
  file_extension: string;
  file_size: number;

  id?: string;
  fileType?: 'jpg' | 'pdf' | 'png';
  uploadDate?: string;
  fileSize?: string;
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
  rawApiData?: ApiProfileChangeRequestResponse;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  onSelectPrimary: (individualId: string) => void;
  className?: string;
}

export interface BusinessDocument {
  id: string;
  name: string;
  fileType?: string;
  fileSize?: string;
  uploadDate?: string;
  url?: string;
  statusId?: number;
  isVerified?: number;
}

export interface BusinessPlatform {
  id: string;
  accountName: string;
  identifier: string;
  platformName: string;
  isDefault: boolean;
  isActive: boolean;
  isVerified: boolean;
  link?: string;
}

export interface BusinessContactPerson {
  fullName: string;
  firstName?: string;
  lastName?: string;
  nationalId?: string;
  mobile?: string;
  avatar?: string;
}

export interface BusinessInfo {
  title: string;
  legalTitle?: string | null;
  registrationCode?: string | null;
  idNumber?: string | null;
  description?: string | null;
  address?: string | null;
  cityId?: number | null;
  logoUrl?: string;
}

export interface BusinessProfileRequest {
  id: string;
  requestDate: string;
  taskTitle: string;
  statusName: string;
  businessInfo: BusinessInfo;
  contactPerson: BusinessContactPerson;
  documents: BusinessDocument[];
  platforms: BusinessPlatform[];
  notes?: string | null;
}

export interface BusinessProfileApprovalProps {
  request: BusinessProfileRequest;
  rawApiData?: ApiBusinessProfileChangeRequestResponse;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
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
    file_extension: string;
    file_size: number;
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

export interface ApiBusinessProfileChangeRequestResponse {
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
  business_request_details: {
    request_id: number;
    customer_id: number;
    customer_uid: string;
    user_id: number;
    legal_relation_id: number;
    legal_entity_id: number;
    status: number;
    is_canceled: number;
    is_verified: number;
    verified_by: number | null;
    verified_at: string | null;
    notes: string | null;
    changed_fields: string[] | null;
    created_at: string;
    updated_at: string;
    title: string;
    legal_title: string | null;
    reg_code: string | null;
    id_number: string | null;
    logo_uid: string | null;
    role_id: number;
    description: string | null;
    city_id: number | null;
    address_description: string | null;
    party_id: number | null;
    party_first_name: string | null;
    party_last_name: string | null;
    party_full_name: string | null;
    party_national_id: string | null;
    party_profile_image: string | null;
    party_mobile: string | null;
  };
  business_docs_data: Array<{
    document_id: number;
    document_type?: number | null;
    document_name?: string | null;
    file_uid: string;
    upload_date?: string | null;
    is_verified?: number | null;
    status_id?: number | null;
    version?: number | null;
    file_extension?: string | null;
    file_size?: number | null;
  }>;
  business_platforms_data: Array<{
    account_id: number;
    account_name: string;
    account_identifier: string;
    is_default: number;
    is_active: number;
    is_workplatform: number;
    is_verified: number;
    platform_name: string;
    platform_icon: string | null;
    base_url: string | null;
    platform_active: number;
    status_id: number;
  }>;
}

// Mapper: API -> internal ProfileChangeRequest
export function mapApiProfileChangeToProps(api: ApiProfileChangeRequestResponse): ProfileChangeRequest {
  const realProfile: RealProfile = {
    profileType: 'حقیقی',
    gender: api.party_request_details.gender === 1 ? 'مرد' : 'زن',
    contactNumber: api.party_request_details.mobile,
    nationalId: api.party_request_details.national_id,
    lastName: api.party_request_details.last_name,
    firstName: api.party_request_details.first_name,
    documents: api.party_docs_data
  };

  const legalProfile: LegalProfile = {
    profileType: 'حقوقی',
    contactNumber: api.party_request_details.mobile,
    roleInCompany: 'مدیرعامل',
    nationalId: '—',
    companyName: '—',
    documents: [],
  };

  const request: ProfileChangeRequest = {
    id: String(api.task_details.task_id),
    requestDate: api.task_details.created_at,
    userName: `${api.party_request_details.first_name} ${api.party_request_details.last_name}`,
    userAvatar: buildDocDownloadUrl(api.party_request_details.profile_image),
    realProfile,
    legalProfile,
    primaryIndividuals: [],
    aiComment: undefined,
  };

  return request;
}

// Help Request Types
export interface HelpRequestDocument {
  id: string;
  filename: string;
  fileType: string;
  uploadDate: string;
  fileSize: string;
  url?: string;
}

export interface HelpRequestUser {
  id: string;
  name: string;
  level: string;
  avatar?: string;
}

export interface HelpRequestDetails {
  id: string;
  requestDate: string;
  requestType: string;
  requestTitle: string;
  category: string;
  subcategory: string;
  timeframe: string;
  requiredAmount: string;
  contactInfo: string;
  shebaNumber: string;
  isShebaVerified: boolean;
  description: string;
  attachedDocuments: HelpRequestDocument[];
  user: HelpRequestUser;
  aiComment?: string;
}

export interface HelpRequestApprovalProps {
  request: HelpRequestDetails;
  rawApiData?: ApiHelpRequestResponse;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  className?: string;
}

// API Response Types for Help Request
export interface ApiHelpRequestResponse {
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
  staff_id?: number;
  project_request_details: {
    request_id: number;
    request_type: number;
    category_id: number;
    title: string;
    description: string;
    max_amount_monthly: number;
    ibn: string;
    time_period: number;
    amount_in_period: number;
    mobile: string;
    status: number;
    created_at: string;
    updated_at: string | null;
    category_name: string;
    parent_category_name: string;
    user_id: number;
    cust_id: number;
    first_name: string;
    last_name: string;
    profile_image: string | null;
    party_mobile: string;
    is_verified: number;
    verified_by: number | null;
    verified_at: string | null;
    // Optional fields for backward compatibility
    user_level?: number;
    request_title?: string;
    subcategory_id?: number;
    subcategory_name?: string;
    timeframe?: string;
    required_amount?: number;
    contact_info?: string;
    sheba_number?: string;
    is_sheba_verified?: boolean;
    project_request_id?: number;
    customer_id?: number;
    customer_uid?: string;
  };
  project_request_documents?: {
    document_id: number;
    document_name: string;
    document_type: string;
    file_uid: string;
    upload_date: string;
    version: number | null;
    status_id: number;
  }[];
  // Keep old name for backward compatibility
  project_docs_data?: {
    document_id: number;
    file_uid: string;
    filename: string;
    file_size: number;
    upload_date: string;
    is_verified: number;
  }[];
}

// Cooperation Request Types
export interface CooperationSpecialization {
  party_specialization_id: number;
  specialization_id: number;
  specialization_name: string;
  skill_category_id: number;
  category_name: string;
}

export interface CooperationRequestDetails {
  id: string;
  requestDate: string;
  notes: string;
  status: string;
  userName: string;
  userAvatar?: string;
  specializations: CooperationSpecialization[];
}

export interface CooperationRequestApprovalProps {
  request: CooperationRequestDetails;
  rawApiData?: ApiCooperationRequestResponse;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  className?: string;
}

// API Response Types for Cooperation Request
export interface ApiCooperationRequestResponse {
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
  assignment_id: number;
  cooperation_request_details: {
    request_id: number;
    party_id: number;
    notes: string;
    request_date: string;
    status: number;
    first_name: string;
    last_name: string;
    full_name: string;
    profile_image: string;
  };
  specialization_details: CooperationSpecialization[];
}

// Template Request Types
export interface TemplateRequestDetails {
  id: string;
  requestDate: string;
  requestType: string;
  title: string;
  description: string;
  category: string;
  parentCategory: string;
  maxAmountMonthly: string;
  timePeriod: string;
  amountInPeriod: string;
  status: string;
  userName: string;
  userAvatar?: string;
  isVerified: boolean;
}

export interface TemplateRequestApprovalProps {
  request: TemplateRequestDetails;
  rawApiData?: ApiTemplateRequestResponse;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  className?: string;
}

// API Response Types for Template Request
export interface ApiTemplateRequestResponse {
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
  request_id: number;
  request_type: number;
  category_id: number;
  title: string;
  description: string;
  max_amount_monthly: number;
  time_period: number;
  amount_in_period: number;
  status: number;
  created_at: string;
  updated_at: string;
  category_name: string;
  parent_category_name: string;
  user_id: number;
  cust_id: number;
  is_verified: number;
  verified_by: number;
  verified_at: string | null;
}

// Ticket Request Types
export interface TicketRequestDetails {
  id: string;
  requestDate: string;
  ticket_id: number;
  ticket_number: string;
  subject: string;
  category_name: string;
  status_value: string;
  conversation_id: number;
}

export interface TicketRequestApprovalProps {
  request: TicketRequestDetails;
  rawApiData?: ApiTicketRequestResponse;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  className?: string;
}

// API Response Types for Ticket Request
export interface ApiTicketRequestResponse {
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
  ticket_details: {
    ticket_id: number;
    ticket_number: string;
    subject: string;
    category_id: number;
    category_name: string;
    status_id: number;
    status_value: string;
    conversation_id: number;
    created_at: string;
    updated_at: string;
  };
  // Optional chat history data (included when fetched from API route)
  chat_history?: {
    header: {
      ticket_id: number;
      ticket_number: string;
      subject: string;
      status_id: number;
      status_value: string;
      conversation_id: number;
    };
    participants: Array<{
      user_id: number;
      cust_id: number;
      FirstName: string | null;
      LastName: string | null;
      FullName: string | null;
      ProfileImage: string | null;
      joined_at: string;
      is_support_agent: boolean;
      agent_id: number | null;
    }>;
    total_count: number;
    messages: Array<{
      message_id: number;
      user_id: number;
      cust_id: number;
      content: string | null;
      message_type: string;
      attachment_url: string | null;
      file_extension: string | null;
      file_size: number | null;
      sent_at: string;
       is_mine: boolean;
      is_read: boolean;
      attachments: Array<{
        file_uid: string;
        file_name: string;
        file_extension: string;
        file_size: number;
      }> | null;
    }>;
    limit: number;
    offset: number;
  };
}