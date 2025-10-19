// API Response Types

export interface ProfileChangeRequest {
  id: number;
  requestDate: string;
  userName: string;
  userAvatar?: string;
  realProfile: {
    firstName: string;
    lastName: string;
    nationalId: string;
    birthDate: string;
    phoneNumber: string;
    email: string;
    address: string;
  };
  legalProfile: {
    companyName: string;
    registrationNumber: string;
    economicCode: string;
    nationalId: string;
    address: string;
  };
  primaryIndividuals: Array<{
    id: number;
    name: string;
    role: string;
    avatar: string;
    isSelected: boolean;
  }>;
  aiComment?: string;

  
}

export interface ProjectTemplate {
  id: number;
  requestDate: string;
  userName: string;
  userAvatar?: string;
  templateName: string;
  templateDescription: string;
  projectType: string;
  estimatedDuration: string;
  budget: string;
  priority: string;
  status: string;
  attachments: Array<{
    id: number;
    name: string;
    url: string;
    size: string;
    uploadDate: string;
  }>;
  stakeholders: Array<{
    id: number;
    name: string;
    role: string;
    email: string;
    phone: string;
  }>;
  requirements: string[];
  aiComment?: string;
  language?: string;
}

export interface ApiError {
  error: string;
  details?: any;
}

export interface ApiSuccess {
  message: string;
  task_id: string;
}

// Task Detail Response (from external API)
export interface TaskDetailResponse {
  redirect_url: string;
  ref_type: number;
  task_id: number;
}

// Ref Types
export enum RefType {
  PARTY_CHANGE_REQUEST = 1,
  PROJECT_REQUEST = 2,
  PROJECT_TASKS = 3,
  REQUEST_PROJECT_TEMPLATE = 4,
}

