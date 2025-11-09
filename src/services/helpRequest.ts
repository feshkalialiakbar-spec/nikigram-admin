import { getoken } from '@/actions/cookieToken';

interface HelpRequestDocumentPayload {
  document_name: string;
  document_type: string;
  file_uid: string;
  version: string;
  status_id: number;
}

interface SubmitHelpRequestDocumentsParams {
  requestId: number | string;
  isApproved: boolean;
  documents: HelpRequestDocumentPayload[];
}

export interface SubmitHelpRequestDocumentsResponse {
  detail?: string;
  message?: string;
  [key: string]: unknown;
}

const getApiBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error('API base URL is not configured.');
  }
  return baseUrl;
};

export const submitHelpRequestDocuments = async ({
  requestId,
  isApproved,
  documents,
}: SubmitHelpRequestDocumentsParams): Promise<SubmitHelpRequestDocumentsResponse> => {
  const token = (await getoken('HELP_REQUEST_SERVICE_SUBMIT')) as string | undefined;
  if (!token) {
    throw new Error('ACCESS_TOKEN_MISSING');
  }

  const endpoint = `${getApiBaseUrl()}/api/admin/task/project/request/${requestId}/documents?is_verified=${isApproved}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(documents),
  });

  const data = (await response.json().catch(() => ({}))) as SubmitHelpRequestDocumentsResponse;

  if (!response.ok) {
    const detail = data?.detail ?? response.statusText ?? 'Failed to submit documents';
    throw new Error(detail);
  }

  return data;
};


