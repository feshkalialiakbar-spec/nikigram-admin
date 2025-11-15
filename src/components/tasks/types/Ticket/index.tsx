'use client'
import { useState, useEffect } from 'react';
import svgPaths from "./imports/svg-8p7neied56";
import './styles/app.css';
import { getoken } from '@/actions/cookieToken';

interface Ticket {
  subject: string;
  category_id: number;
  priority_id: number;
  status_id: number;
  ticket_id: number;
  ticket_number: string;
  conversation_id: number;
  user_id: number;
  cust_id: number;
  assigned_agent_id: number;
  required_expertise: string;
  sla_deadline: string;
  first_response_time: string;
  resolution_time: string;
  satisfaction_rating: number;
  satisfaction_comment: string;
  created_at: string;
  updated_at: string;
  closed_at: string;
  category_name: string;
  status_value: string;
  priority_value: string;
}

interface TicketResponse {
  total_count: number;
  items: Ticket[];
}

export default function App() {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTickets() {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/ticket/chat/page/8?limit=50&offset=0`,
          {
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${await getoken('TICKETS')}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch tickets');
        }

        const data: TicketResponse = await response.json();

        if (data.items && data.items.length > 0) {
          setTicket(data.items[0]);
        } else {
          setTicket({
            subject: 'تیکت به پشتیبانی',
            category_name: 'اصلاحیه وجه',
            status_value: 'پاسخ داده شده',
            ticket_number: '#12345',
            created_at: '2024-04-13T10:00:00Z',
            updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            category_id: 1,
            priority_id: 1,
            status_id: 1,
            ticket_id: 1,
            conversation_id: 1,
            user_id: 1,
            cust_id: 1,
            assigned_agent_id: 1,
            required_expertise: '',
            sla_deadline: '',
            first_response_time: '',
            resolution_time: '',
            satisfaction_rating: 0,
            satisfaction_comment: '',
            closed_at: '',
            priority_value: 'متوسط'
          });
        }
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setTicket({
          subject: 'تیکت به پشتیبانی',
          category_name: 'اصلاحیه وجه',
          status_value: 'پاسخ داده شده',
          ticket_number: '#12345',
          created_at: '2024-04-13T10:00:00Z',
          updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          category_id: 1,
          priority_id: 1,
          status_id: 1,
          ticket_id: 1,
          conversation_id: 1,
          user_id: 1,
          cust_id: 1,
          assigned_agent_id: 1,
          required_expertise: '',
          sla_deadline: '',
          first_response_time: '',
          resolution_time: '',
          satisfaction_rating: 0,
          satisfaction_comment: '',
          closed_at: '',
          priority_value: 'متوسط'
        });
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, []);

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
      return formatDate(dateString);
    }
  };

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
              <p className="profile-name" dir="auto">نیکی میزانی</p>
              <p className="profile-role" dir="auto">پشتیبانی</p>
            </div>
          </div>

          <div className="ticket-details-section">
            <p className="ticket-details-title" dir="auto">اطلاعات تیکت</p>

            {loading ? (
              <div className="loading-text">در حال بارگذاری...</div>
            ) : ticket ? (
              <div className="ticket-info-container">
                <div className="ticket-info-row">
                  <p className="value" dir="auto">{ticket.subject}</p>
                  <p className="label" dir="auto">عنوان تیکت</p>
                </div>
                <div className="ticket-info-row">
                  <p className="value" dir="auto">{formatDate(ticket.created_at)}</p>
                  <p className="label" dir="auto">زمان ایجاد تیکت</p>
                </div>
                <div className="ticket-info-row">
                  <p className="value" dir="auto">{formatDateTime(ticket.updated_at)}</p>
                  <p className="label" dir="auto">آخرین به‌روزرسانی</p>
                </div>
                <div className="ticket-info-row">
                  <p className="value" dir="auto">نیکی میزانی</p>
                  <p className="label" dir="auto">آخرین پاسخ توسط</p>
                </div>
                <div className="ticket-info-row">
                  <p className="value" dir="auto">۲</p>
                  <p className="label" dir="auto">تعداد کل پاسخ‌ها</p>
                </div>
                <div className="ticket-info-row">
                  <p className="value" dir="auto">{ticket.category_name}</p>
                  <p className="label" dir="auto">دپارتمان تیکت</p>
                </div>
                <div className="ticket-info-row">
                  <p className="value-success" dir="auto">{ticket.status_value}</p>
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
                <p dir="auto">{ticket?.subject || 'موضوع تیکت به پشتیبانی'}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="messages-area">
              <div className="messages-wrapper">
                {/* User Message */}
                <div className="user-message">
                  <div className="message-header">
                    <p className="user-name" dir="auto">شما</p>
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
                        <p className="message-text" dir="auto">این متن شامل پیام توضیحات می باشد.</p>
                        <div className="message-footer">
                          <div className="edit-icon">
                            <svg fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                              <g id="edit">
                                <path d={svgPaths.p3a6dbc80} fill="#0E315D" opacity="0.4" />
                                <path d={svgPaths.p2ef1a800} fill="#0E315D" />
                                <path d={svgPaths.p2dc85900} fill="#0E315D" />
                              </g>
                            </svg>
                          </div>
                          <div className="message-time">
                            <p className="time-text">امروز، ۱۳:۳۰</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Agent Message */}
                <div className="agent-message">
                  <div className="message-header">
                    <div className="agent-icon">
                      <svg fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <g id="profile">
                          <path d={svgPaths.p13d05a80} fill="#0E315D" opacity="0.4" />
                          <path d={svgPaths.pbb46500} fill="#0E315D" />
                        </g>
                      </svg>
                    </div>
                    <p className="agent-name" dir="auto">نیکی میزانی</p>
                  </div>
                  <div className="message-bubble">
                    <div className="bubble-inner">
                      <div className="bubble-content">
                        <p className="message-text" dir="auto">این متن شامل پیام توضیحات می باشد.</p>
                        <div className="message-footer">
                          <div className="message-time">
                            <p className="time-text">۲۴ تیر ۱۴۰۳، ۱۳:۴۵</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
}
