// src/services/ticketChat.ts

type TicketChatPageItem = {
  id?: number;
  subject?: string;
  created_at?: string;
  updated_at?: string;
  category_name?: string;
  status_value?: string;
  ticket_id?: number;
  description?: string;
  text?: string;
  is_owner?: boolean;
  sender_name?: string;
};

type TicketChatPageResponse = {
  total_count?: number;
  items?: TicketChatPageItem[];
};

const getApiBaseUrl = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error('API base URL is not configured.');
  }
  return baseUrl.replace(/\/+$/, '');
};

export async function fetchChatPage(params: {
  ticketId: number | string;
  limit: number;
  offset: number;
  token: string;
}): Promise<TicketChatPageResponse> {
  const base = getApiBaseUrl();
  const url = `${base}/api/ticket/chat/page/${params.ticketId}?limit=${encodeURIComponent(
    String(params.limit)
  )}&offset=${encodeURIComponent(String(params.offset))}`;
  const res = await fetch(url, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${params.token}`,
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Failed to load chat page: ${res.status}`);
  }
  return res.json();
}

export async function sendTextMessage(params: {
  ticketId: number | string;
  content: string;
  token: string;
}): Promise<void> {
  const base = getApiBaseUrl();
  const url = `${base}/api/ticket/chat/send-message/${params.ticketId}`;
  const body = {
    content: params.content ?? '',
    message_type: 'text',
    attachment_url: '',
   };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${params.token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Failed to send message: ${res.status}`);
  }
}

export async function sendFileMessage(params: {
  ticketId: number | string;
  fileUid: string;
  token: string;
}): Promise<void> {
  const base = getApiBaseUrl();
  const url = `${base}/api/ticket/chat/send-message/${params.ticketId}`;
  const body = {
    content: '',
    message_type: 'file',
    attachment_url: params.fileUid || '',
   };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${params.token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Failed to send file message: ${res.status}`);
  }
}

const extractApiMessage = (rawPayload: string | null): string => {
  if (!rawPayload) return '';
  const trimmed = rawPayload.trim();
  if (!trimmed) return '';
  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed === 'string') return parsed;
    if (parsed && typeof parsed === 'object') {
      return (
        (typeof parsed.message === 'string' && parsed.message) ||
        (typeof parsed.detail === 'string' && parsed.detail) ||
        ''
      );
    }
  } catch {
    // fall through to return the raw string
  }
  return trimmed;
};

export async function closeTicket(params: {
  ticketId: number | string;
  token: string;
}): Promise<string> {
  const base = getApiBaseUrl();
  const url = `${base}/api/ticket/chat/close-ticket/${params.ticketId}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${params.token}`,
    },
  });
  const payload = await res.text().catch(() => '');
  const message = extractApiMessage(payload);
  if (!res.ok) {
    throw new Error(message || `Failed to close ticket: ${res.status}`);
  }
  return message || 'تیکت با موفقیت بسته شد.';
}


