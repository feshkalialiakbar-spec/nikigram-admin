export interface TaskInterface {
  task_id: number
  task_title: string
  task_description: string
  status_id: number
  status_name: string
  created_at: string
  ref_type: number
  ref_uid: number
  ref_id: number
  staff_position_info: {
    staff_id: number
    position_id: number
    position_title: string
  }
  assignment_info: {
    assignment_id: number
    assignment_date: string
    assignment_notes: string
  }
}
export interface TaskDetail {
  task_id: number;
  task_title: string;
  task_description: string;
  ref_type: number;
  ref_id: number;
  status_id: number;
  status_name: string;
  created_at: string;
  source_template_id: string;
  parent_task_id: string;
}

export interface PartyRequestDetails {
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
  birth_date: string; // ISO date string (e.g. "1375-06-09T00:00:00")
  education_degree: string | null;
  biography: string;
  profile_image: string;
  mobile: string;
  is_verified: number;
  is_canceled: number;
}

export interface PartyDocData {
  document_id: number;
  document_type: number;
  file_uid: string;
  upload_date: string; // ISO date string
  is_verified: number;
  status_id: number;
  version: number;
}

export interface PartyPlatformData {
  account_id: number;
  account_name: string;
  account_identifier: string;
  is_default: number;
  is_active: number;
  is_workplatform: number;
  is_verified: number;
  platform_name: string;
  platform_icon: string;
  base_url: string | null;
  platform_active: number;
  status_id: number;
}

export interface RedirectData {
  redirect_url: string;
  ref_type: number;
  task_id: number;
}

export interface TaskData {
  task_details: TaskDetail;
  staff_id: number;
  changed_fields: string[];
  party_request_details: PartyRequestDetails;
  party_docs_data: PartyDocData[];
  party_platforms_data: PartyPlatformData[];
}

export interface ProfileChangeTaskInterface {
  taskData: TaskData;
  redirectData: RedirectData;
}
