'use client';

import React, { useState, useEffect } from 'react';
import { TicketRequestApprovalProps } from '@/components/tasks/types';
import { getUserChatHistory } from '@/services/taskDetailServices';
import svgPaths from '../Ticket/imports/svg-8p7neied56';
import '../Ticket/styles/app.css';

interface ChatHistoryMessage {
  message_id: number;
  user_id: number;
  cust_id: number;
  content: string | null;
  message_type: string;
  attachment_url: string | null;
  file_extension: string | null;
  file_size: number | null;
  sent_at: string;
  reply_to_message_id: number | null;
  is_mine: boolean;
  is_read: boolean;
  attachments: Array<{
    file_uid: string;
    file_name: string;
    file_extension: string;
    file_size: number;
  }> | null;
}

interface ChatHistoryParticipant {
  user_id: number;
  cust_id: number;
  FirstName: string | null;
  LastName: string | null;
  FullName: string | null;
  ProfileImage: string | null;
  joined_at: string;
  is_support_agent: boolean;
  agent_id: number | null;
}

interface ChatHistoryResponse {
  header: {
    ticket_id: number;
    ticket_number: string;
    subject: string;
    status_id: number;
    status_value: string;
    conversation_id: number;
  };
  participants: ChatHistoryParticipant[];
  total_count: number;
  messages: ChatHistoryMessage[];
  limit: number;
  offset: number;
}

const TicketRequestApproval: React.FC<TicketRequestApprovalProps> = ({
  request,
  rawApiData,
}) => {
  const [chatHistory, setChatHistory] = useState<ChatHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // If chat history is already in rawApiData (from API route), use it directly
        if (rawApiData?.chat_history) {
          console.log('Using chat history from rawApiData');
          setChatHistory(rawApiData.chat_history as ChatHistoryResponse);
          setLoading(false);
          return;
        }
        
        // Otherwise, fetch it using getUserChatHistory
        // Use ticket_id from ticket_details, or ref_id from task_details, or fallback to request.ticket_id
        const ticketId = rawApiData?.ticket_details?.ticket_id 
          || rawApiData?.task_details?.ref_id 
          || request.ticket_id;
        
        if (!ticketId || ticketId === 0) {
          throw new Error('Ticket ID not found');
        }

        console.log('Loading chat history for ticket_id:', ticketId);

        const response = await getUserChatHistory({
          ticket_id: ticketId,
          page: 0,
          limit: 50,
        });

        console.log('Chat history response:', response);
        setChatHistory(response as unknown as ChatHistoryResponse);
      } catch (err) {
        console.error('Error loading chat history:', err);
        setError(err instanceof Error ? err.message : 'Failed to load chat history');
      } finally {
        setLoading(false);
      }
    };

    loadChatHistory();
  }, [request, rawApiData]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const persianDate = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
    return persianDate;
  };

  const formatDateTime = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours} ساعت پیش`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 0) {
        return 'امروز';
      } else if (diffInDays === 1) {
        return 'دیروز';
      } else {
        return formatDate(dateString);
      }
    }
  };

  const formatMessageTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInHours < 24) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `امروز، ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } else {
      const persianDate = new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
      return persianDate;
    }
  };

  const getParticipantName = (message: ChatHistoryMessage, participants: ChatHistoryParticipant[]): string => {
    const participant = participants.find(p => p.user_id === message.user_id);
    if (participant?.is_support_agent) {
      return participant.FullName || 'پشتیبانی';
    }
    return 'شما';
  };

  const getParticipantInfo = (message: ChatHistoryMessage, participants: ChatHistoryParticipant[]) => {
    return participants.find(p => p.user_id === message.user_id);
  };

  const header = chatHistory?.header;
  const participants = chatHistory?.participants || [];
  const messages = chatHistory?.messages || [];
  const lastReplyParticipant = participants.find(p => p.is_support_agent);

  return (
    <div className="ticket-system-container">
      {/* Profile Sidebar */}
      <div className="profile-sidebar">
        <div className="ticket-info-section">
          <div className="profile-header">
            <div className="profile-icon">
              <svg fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
                <g id="profile-circle">
                  <path d={svgPaths.p1275af00} fill="#435A73" opacity="0.4" />
                  <path d={svgPaths.p2b892180} fill="#435A73" />
                  <path d={svgPaths.p1033ad00} fill="#435A73" />
                </g>
              </svg>
            </div>
            <div className="profile-text-wrapper">
              <p className="profile-name" dir="auto">
                {lastReplyParticipant?.FullName || 'پشتیبانی نیکی میزانی'}
              </p>
              <p className="profile-role" dir="auto">پشتیبانی</p>
            </div>
          </div>

          <div className="ticket-details-section">
            <p className="ticket-details-title" dir="auto">اطلاعات تیکت</p>

            {loading ? (
              <div className="loading-text">در حال بارگذاری...</div>
            ) : error ? (
              <div className="error-text">{error}</div>
            ) : rawApiData?.ticket_details ? (
              <div className="ticket-info-container">
                <div className="ticket-info-row">
                  <p className="value" dir="auto">{rawApiData.ticket_details.subject || request.subject || '-'}</p>
                  <p className="label" dir="auto">عنوان تیکت</p>
                </div>
                <div className="ticket-info-row">
                  <p className="value" dir="auto">
                    {rawApiData.ticket_details.created_at 
                      ? formatDate(rawApiData.ticket_details.created_at)
                      : formatDate(request.requestDate)}
                  </p>
                  <p className="label" dir="auto">زمان ایجاد تیکت</p>
                </div>
                <div className="ticket-info-row">
                  <p className="value" dir="auto">
                    {rawApiData.ticket_details.updated_at 
                      ? formatDateTime(rawApiData.ticket_details.updated_at)
                      : chatHistory?.messages && chatHistory.messages.length > 0 
                        ? formatDateTime(chatHistory.messages[0].sent_at)
                        : formatDateTime(new Date().toISOString())}
                  </p>
                  <p className="label" dir="auto">آخرین به‌روزرسانی</p>
                </div>
                <div className="ticket-info-row">
                  <p className="value" dir="auto">
                    {lastReplyParticipant?.FullName || 'نیکی میزانی'}
                  </p>
                  <p className="label" dir="auto">آخرین پاسخ توسط</p>
                </div>
                <div className="ticket-info-row">
                  <p className="value" dir="auto">{chatHistory?.total_count || 0}</p>
                  <p className="label" dir="auto">تعداد کل پاسخ‌ها</p>
                </div>
                <div className="ticket-info-row">
                  <p className="value" dir="auto">{rawApiData.ticket_details.category_name || request.category_name || '-'}</p>
                  <p className="label" dir="auto">دپارتمان تیکت</p>
                </div>
                <div className="ticket-info-row">
                  <p className="value-success" dir="auto">
                    {rawApiData.ticket_details.status_value === 'in_progress' 
                      ? 'در حال انجام' 
                      : rawApiData.ticket_details.status_value || request.status_value || '-'}
                  </p>
                  <p className="label" dir="auto">وضعیت</p>
                </div>
              </div>
            ) : header ? (
              <div className="ticket-info-container">
                <div className="ticket-info-row">
                  <p className="value" dir="auto">{header.subject}</p>
                  <p className="label" dir="auto">عنوان تیکت</p>
                </div>
                <div className="ticket-info-row">
                  <p className="value" dir="auto">
                    {header ? formatDate(new Date(participants[0]?.joined_at || header.conversation_id.toString()).toISOString()) : formatDate(request.requestDate)}
                  </p>
                  <p className="label" dir="auto">زمان ایجاد تیکت</p>
                </div>
                <div className="ticket-info-row">
                  <p className="value" dir="auto">
                    {header && chatHistory?.messages && chatHistory.messages.length > 0 
                      ? formatDateTime(chatHistory.messages[0].sent_at)
                      : formatDateTime(new Date().toISOString())}
                  </p>
                  <p className="label" dir="auto">آخرین به‌روزرسانی</p>
                </div>
                <div className="ticket-info-row">
                  <p className="value" dir="auto">
                    {lastReplyParticipant?.FullName || 'نیکی میزانی'}
                  </p>
                  <p className="label" dir="auto">آخرین پاسخ توسط</p>
                </div>
                <div className="ticket-info-row">
                  <p className="value" dir="auto">{chatHistory?.total_count || 0}</p>
                  <p className="label" dir="auto">تعداد کل پاسخ‌ها</p>
                </div>
                <div className="ticket-info-row">
                  <p className="value" dir="auto">{request.category_name || '-'}</p>
                  <p className="label" dir="auto">دپارتمان تیکت</p>
                </div>
                <div className="ticket-info-row">
                  <p className="value-success" dir="auto">
                    {header.status_value === 'in_progress' ? 'پاسخ داده شده' : header.status_value}
                  </p>
                  <p className="label" dir="auto">وضعیت</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="close-ticket-section">
          <div className="close-ticket-info">
            <p className="title" dir="auto">بستن تیکت</p>
            <p className="description" dir="auto">
              بسته شدن تیکت به منزله‌ی پایان گفتگو و پیگیری از سوی کارشناسان لینگومسترز می‌باشد، لطفا در نظر داشته باشید اگر سفارش یا درخواست شما انجام نگرفته است، تیکت را نبندید.
            </p>
          </div>
          <div className="close-button">
            <div className="button-inner">
              <div className="button-content">
                <div className="button-text-wrapper">
                  <div className="button-text">
                    <p dir="auto">بستن تیکت</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-container">
        <div className="chat-inner">
          <div className="chat-content">
            {/* Chat Title */}
            <div className="chat-title">
              <div className="chat-subject">
                <p dir="auto">{rawApiData?.ticket_details?.subject || header?.subject || request.subject || 'موضوع تیکت به پشتیبانی'}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="messages-area">
              <div className="messages-wrapper">
                {loading ? (
                  <div className="loading-text">در حال بارگذاری پیام‌ها...</div>
                ) : error ? (
                  <div className="error-text">{error}</div>
                ) : messages.length === 0 ? (
                  <div className="error-text">پیامی یافت نشد</div>
                ) : (
                  messages.map((message) => {
                    const participant = getParticipantInfo(message, participants);
                    const isAdmin = participant?.is_support_agent || false;
                    const senderName = getParticipantName(message, participants);
                    
                    if (isAdmin) {
                      // Admin message - purple on right
                      return (
                        <div key={message.message_id} className="agent-message admin-message">
                          <div className="message-header">
                            <p className="agent-name" dir="auto">{senderName}</p>
                            <div className="agent-icon">
                              <svg fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                                <g id="profile">
                                  <path d={svgPaths.p13d05a80} fill="#0E315D" opacity="0.4" />
                                  <path d={svgPaths.pbb46500} fill="#0E315D" />
                                </g>
                              </svg>
                            </div>
                          </div>
                          <div className="message-bubble">
                            <div className="bubble-inner">
                              <div className="bubble-content">
                                {message.content && (
                                  <p className="message-text" dir="auto">{message.content}</p>
                                )}
                                {message.attachments && message.attachments.length > 0 && (
                                  <div className="message-attachments">
                                    {message.attachments.map((attachment, idx) => (
                                      <div key={idx} className="attachment-item">
                                        <span>{attachment.file_name}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <div className="message-footer">
                                  <div className="message-time">
                                    <p className="time-text">{formatMessageTime(message.sent_at)}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      // User message
                      return (
                        <div key={message.message_id} className="user-message">
                          <div className="message-header">
                            <p className="user-name" dir="auto">{senderName}</p>
                            <div className="user-icon">
                              <svg fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                                <g id="profile">
                                  <path d={svgPaths.p13d05a80} fill="#0E315D" opacity="0.4" />
                                  <path d={svgPaths.pbb46500} fill="#0E315D" />
                                </g>
                              </svg>
                            </div>
                          </div>
                          <div className="message-bubble">
                            <div className="bubble-inner">
                              <div className="bubble-content">
                                {message.content && (
                                  <p className="message-text" dir="auto">{message.content}</p>
                                )}
                                {message.attachments && message.attachments.length > 0 && (
                                  <div className="message-attachments">
                                    {message.attachments.map((attachment, idx) => (
                                      <div key={idx} className="attachment-item">
                                        <span>{attachment.file_name}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <div className="message-footer">
                                  <div className="message-time">
                                    <p className="time-text">{formatMessageTime(message.sent_at)}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })
                )}
              </div>
            </div>

            {/* Input Area */}
            <div className="input-area">
              <div className="input-wrapper">
                <div className="input-frame">
                  <div className="frame-inner">
                    <div className="frame-content">
                      <div className="action-icon">
                        <svg fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                          <g id="camera">
                            <path d={svgPaths.p3cb5f780} fill="#0E315D" opacity="0.4" />
                            <path d={svgPaths.p31e9bc80} fill="#0E315D" />
                            <path d={svgPaths.p39bc3300} fill="#131D28" />
                          </g>
                        </svg>
                      </div>
                      <div className="action-icon">
                        <svg fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                          <path d={svgPaths.p10627200} fill="#0E315D" opacity="0.4" />
                          <path d={svgPaths.p332e9600} fill="#131D28" />
                        </svg>
                      </div>
                      <div className="input-content">
                        <div className="placeholder-wrapper">
                          <div className="placeholder-text">
                            <p dir="auto">پیام</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mic-button-wrapper">
                <div className="mic-shadow" />
                <div className="mic-button">
                  <div className="mic-inner">
                    <div className="mic-content">
                      <div className="mic-icon">
                        <svg fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                          <g id="microphone-2">
                            <path d={svgPaths.p1899c780} fill="white" opacity="0.4" />
                            <path d={svgPaths.p7f348f0} fill="white" />
                          </g>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketRequestApproval;
