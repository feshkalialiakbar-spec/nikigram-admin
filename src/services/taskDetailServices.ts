import { getoken } from '@/actions/cookieToken';
import {
  ApiProfileChangeRequestResponse,
  ApiHelpRequestResponse,
  ApiCooperationRequestResponse,
  ApiTemplateRequestResponse,
  ApiTicketRequestResponse,
} from '@/components/tasks/types';

export interface TaskDetailApiResponse {
  taskData:
  | ApiProfileChangeRequestResponse
  | ApiHelpRequestResponse
  | ApiCooperationRequestResponse
  | ApiTemplateRequestResponse
  | ApiTicketRequestResponse;
  redirectData: {
    ref_type: number;
  };
}

const getApiBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error('API base URL is not configured.');
  }
  return baseUrl;
};


const fetchJson = async <T>(input: RequestInfo, init?: RequestInit): Promise<T> => {
  const response = await fetch(input, init);
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const detail =
      (errorBody && (errorBody.detail as string | undefined)) ||
      response.statusText ||
      'Request failed';
    throw new Error(detail);
  }
  return response.json() as Promise<T>;
};

export const fetchTaskDetail = async (taskId: string): Promise<TaskDetailApiResponse> => {
  return fetchJson<TaskDetailApiResponse>(`/api/task/detail/${taskId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
};

export const verifyProfileChangeRequest = async (
  requestId: string,
  isVerified: boolean
): Promise<Record<string, unknown>> => {
  const token = await getoken(`verify profile change request ${requestId}`);
  return fetchJson<Record<string, unknown>>(
    `${getApiBaseUrl()}/api/admin/task/profile/change_request/${requestId}/verify`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        is_verified: isVerified,
        description: '',
      }),
    }
  );
};

interface HelpRequestVerificationPayload {
  template_id: number;
  title: string;
  description: string;
  task_assignments: Array<{
    temp_task_id: number;
    staff_id: number;
    deadline: number;
    assignment_notes: string;
  }>;
}

export const verifyHelpRequest = async (
  requestId: string,
  payload: HelpRequestVerificationPayload
): Promise<Record<string, unknown>> => {
  const token = await getoken(`verify help request ${requestId}`);
  return fetchJson<Record<string, unknown>>(
    `${getApiBaseUrl()}/api/admin/task/project/request/${requestId}/verify`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );
};

export const approveTemplateRequest = async (
  requestId: string
): Promise<Record<string, unknown>> => {
  const token = await getoken(`verify template request ${requestId}`);
  return fetchJson<Record<string, unknown>>(
    `${getApiBaseUrl()}/api/admin/task/project/template/${requestId}/approve/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const approveCooperationRequest = async (
  requestId: string
): Promise<Record<string, unknown>> => {
  const token = await getoken(`approve cooperation request ${requestId}`);
  return fetchJson<Record<string, unknown>>(
    `${getApiBaseUrl()}/api/admin/task/profile/cooperation_request/${requestId}/approve/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const approveTicketRequest = async (
  requestId: string
): Promise<Record<string, unknown>> => {
  const token = await getoken(`approve ticket request ${requestId}`);
  return fetchJson<Record<string, unknown>>(
    `${getApiBaseUrl()}/api/admin/task/profile/ticket/${requestId}/approve/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getUserChatHistory = async ({ ticket_id, page, limit }: { ticket_id: number, page: number, limit: number }): Promise<Record<string, unknown>> => {
  const token = await getoken(`get chat history for ticket ${ticket_id}`);
  return fetchJson<Record<string, unknown>>(
    `${getApiBaseUrl()}/api/ticket/chat/page/${ticket_id}?limit=${limit}&offset=${page}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
};