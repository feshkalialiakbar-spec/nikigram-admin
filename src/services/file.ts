const getApiBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error('API base URL is not configured.');
  }
  return baseUrl;
};

export const downloadFileBlob = async (url: string): Promise<Blob> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to download file.');
  }
  return response.blob();
};

interface ProxyDownloadParams {
  url: string;
  filename: string;
}

export const proxyDownloadFile = async ({
  url,
  filename,
}: ProxyDownloadParams): Promise<Blob> => {
  const response = await fetch('/api/proxy-download', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, filename }),
  });

  if (!response.ok) {
    throw new Error(`Proxy error: ${response.status}`);
  }

  return response.blob();
};

export interface UploadFileParams {
  file: File;
  entityType?: string;
  accessToken?: string | null;
}

export interface UploadedFileMeta {
  file_uid: string;
  name: string;
  size: number;
  type: string;
}

export const uploadFile = async ({
  file,
  entityType = 'project-request',
  accessToken,
}: UploadFileParams): Promise<UploadedFileMeta> => {
  const formData = new FormData();
  formData.append('is_featured', 'false');
  formData.append('is_private', 'false');
  formData.append('attachment_type', '');
  formData.append('entity_type', entityType);
  formData.append('title', '');
  formData.append('description', '');
  formData.append('file', file, file.name);

  const response = await fetch(`${getApiBaseUrl()}/api/sys/files/upload`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const detail =
      (errorBody && (errorBody.detail as string | undefined)) ||
      response.statusText ||
      'Upload failed.';
    throw new Error(detail);
  }

  const result = await response.json();

  if (!result?.file_uid) {
    throw new Error('Invalid upload response.');
  }

  return {
    file_uid: result.file_uid as string,
    name: file.name,
    size: file.size,
    type: file.type,
  };
};


