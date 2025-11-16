// src/components/tasks/types/TicketRequestApproval/Ticket/lib/types.ts

export interface TicketParticipantDto {
  user_id: number;
  cust_id: number;
  FirstName: string;
  LastName: string;
  FullName: string | null;
  ProfileImage: string | null;
  joined_at: string;
  is_support_agent: boolean;
  agent_id: number | null;
}

export interface MessageAttachmentDto {
  file_uid: string;
  file_name: string;
  file_extension: string;
  file_size: number;
}

export interface TicketMessageDto {
  message_id: number;
  user_id: number;
  cust_id: number;
  content: string | null;
  message_type: 'text' | 'file';
  attachment_url: string | null;
  file_extension: string | null;
  file_size: number | null;
  sent_at: string;
   is_mine: boolean;
  is_read: boolean | null;
  attachments: MessageAttachmentDto[] | null;
}

export type ChatAttachment = {
  file_uid: string;
  file_name?: string;
  file_extension?: string | null;
  file_size?: number | null;
};

export type ChatMessage = {
  id: string | number;
  text: string;
  created_at: string;
  sender: 'user' | 'agent';
  sender_name?: string;
  attachments?: ChatAttachment[] | null;
};

export type TicketLite = {
  subject: string;
  created_at: string;
  updated_at: string;
  category_name: string;
  status_value: string;
  ticket_id: number;
};


