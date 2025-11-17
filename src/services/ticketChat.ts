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

export async function closeTicket(params: {
  ticketId: number | string;
  token: string;
}): Promise<void> {
  const base = getApiBaseUrl();
  const url = `${base}/api/ticket/chat/close-ticket/${params.ticketId}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${params.token}`,
    },
  });
  if (!res.ok) {
    const message = await res.text().catch(() => '');
    throw new Error(message || `Failed to close ticket: ${res.status}`);
  }
}


