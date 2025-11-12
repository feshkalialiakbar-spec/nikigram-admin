'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import svgPaths from "./imports/svg-8p7neied56";
import ChatArea from "./components/ChatArea";
import ticketStyles from './styles/Ticket.module.css';

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

function VuesaxBulkProfileCircle() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bulk/profile-circle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="profile-circle">
          <path d={svgPaths.p1275af00} fill="var(--fill-0, #435A73)" id="Vector" opacity="0.4" />
          <path d={svgPaths.p2b892180} fill="var(--fill-0, #435A73)" id="Vector_2" />
          <path d={svgPaths.p1033ad00} fill="var(--fill-0, #435A73)" id="Vector_3" />
          <g id="Vector_4" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const persianDate = new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
  return persianDate;
}

function formatDateTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 24) {
    return `${diffInHours} ساعت پیش`;
  } else {
    return formatDate(dateString);
  }
}

export default function App() {
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTickets() {
      try {
        setLoading(true);
        
        // Get token from cookie
        const getCookie = (name: string): string | null => {
          if (typeof document === 'undefined') return null;
          const match = document.cookie.match(
            new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
          );
          return match ? decodeURIComponent(match[1]) : null;
        };
        
        const accessToken = getCookie('34a435y6546pr656rj67gm789peua677689awe890rguy987e89r69gr890rtk6mg5ps447e');
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const response = await fetch(
          `${apiUrl}/api/ticket/my-tickets?LAN_ID=fa&limit=10&offset=0`,
          {
            headers: {
              'accept': 'application/json',
              'Authorization': accessToken ? `Bearer ${accessToken}` : ''
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
          // Use mock data if no tickets available
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
        // Use mock data on error
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

  return (
    <div className={ticketStyles.container}>
      {/* Main Chat Area */}
      <div className={ticketStyles.chatWrapper}>
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className={ticketStyles.backButton}
        >
          <svg className={ticketStyles.backIcon} fill="none" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>بازگشت</span>
        </button>
        
        {/* Chat Area */}
        <ChatArea 
          subject={ticket?.subject || "موضوع تیکت به پشتیبانی"}
          userMessage={{ 
            text: "این متن شامل پیام توضیحات می باشد.", 
            time: "امروز، ۱۳:۳۰" 
          }}
          agentMessage={{ 
            text: "این متن شامل پیام توضیحات می باشد.", 
            time: "۲۴ تیر ۱۴۰۳، ۱۳:۴۵" 
          }}
        />
      </div>
      
      {/* Profile Sidebar */}
      <div className={ticketStyles.profileContainer}>
        <div className={ticketStyles.ticketInfo}>
          <div className={ticketStyles.profileDetails}>
            <div className={ticketStyles.profileIcon}>
              <VuesaxBulkProfileCircle />
            </div>
            <div className={ticketStyles.profileTextContainer}>
              <p className={ticketStyles.profileName} dir="auto">نیکی میزانی</p>
              <p className={ticketStyles.profileRole} dir="auto">پشتیبانی</p>
            </div>
          </div>
          
          <div className={ticketStyles.ticketDetails}>
            <p className={ticketStyles.ticketDetailsTitle} dir="auto">اطلاعات تیکت</p>
            
            {loading ? (
              <div className={ticketStyles.loading}>در حال بارگذاری...</div>
            ) : ticket ? (
              <div className={ticketStyles.ticketInfoContainer}>
                <div className={ticketStyles.ticketInfoRow}>
                  <p className={ticketStyles.value} dir="auto">{ticket.subject}</p>
                  <p className={ticketStyles.label} dir="auto">عنوان تیکت</p>
                </div>
                <div className={ticketStyles.ticketInfoRow}>
                  <p className={ticketStyles.value} dir="auto">{formatDate(ticket.created_at)}</p>
                  <p className={ticketStyles.label} dir="auto">زمان ایجاد تیکت</p>
                </div>
                <div className={ticketStyles.ticketInfoRow}>
                  <p className={ticketStyles.value} dir="auto">{formatDateTime(ticket.updated_at)}</p>
                  <p className={ticketStyles.label} dir="auto">آخرین به‌روزرسانی</p>
                </div>
                <div className={ticketStyles.ticketInfoRow}>
                  <p className={ticketStyles.value} dir="auto">نیکی میزانی</p>
                  <p className={ticketStyles.label} dir="auto">آخرین پاسخ توسط</p>
                </div>
                <div className={ticketStyles.ticketInfoRow}>
                  <p className={ticketStyles.value} dir="auto">۲</p>
                  <p className={ticketStyles.label} dir="auto">تعداد کل پاسخ‌ها</p>
                </div>
                <div className={ticketStyles.ticketInfoRow}>
                  <p className={ticketStyles.value} dir="auto">{ticket.category_name}</p>
                  <p className={ticketStyles.label} dir="auto">دپارتمان تیکت</p>
                </div>
                <div className={ticketStyles.ticketInfoRow}>
                  <p className={ticketStyles.valueSuccess} dir="auto">{ticket.status_value}</p>
                  <p className={ticketStyles.label} dir="auto">وضعیت</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        
        <div className={ticketStyles.closeTicketContainer}>
          <div className={ticketStyles.closeTicketInfo}>
            <p className={ticketStyles.title} dir="auto">بستن تیکت</p>
            <p className={ticketStyles.description} dir="auto">
              بسته شدن تیکت به منزله‌ی پایان گفتگو و پیگیری از سوی کارشناسان لینگومسترز می‌باشد، لطفا در نظر داشته باشید اگر سفارش یا درخواست شما انجام نگرفته است، تیکت را نبندید.
            </p>
          </div>
          <div className={ticketStyles.closeButton}>
            <div className={ticketStyles.inner}>
              <div className={ticketStyles.content}>
                <div className={ticketStyles.textWrapper}>
                  <div className={ticketStyles.text}>
                    <p dir="auto">بستن تیکت</p>
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
