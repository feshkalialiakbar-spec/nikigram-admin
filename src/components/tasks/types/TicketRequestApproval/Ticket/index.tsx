'use client'
import { useCallback, useEffect, useRef, useState } from 'react';
import { getoken } from '@/actions/cookieToken';
import { TicketRequestApprovalProps } from '@/components/tasks/types';
import styles from './TicketDetail.module.scss';
import TicketMessageCard from '../ticketMessageCard/TicketMessageCard';
import TicketMessageInput from '../ticketMessageInput/TicketMessageInput';
import { uploadFile, UploadedFileMeta } from '@/services/file';
import { fetchChatPage, sendFileMessage, sendTextMessage } from '@/services/ticketChat';
import {
  TicketLite,
  TicketMessageDto,
  TicketParticipantDto,
  ChatMessage,
} from './lib/types';

type RawTicketData = {
  ticket_details?: {
    subject: string;
    created_at: string;
    updated_at: string;
    category_name?: string;
    status_value: string;
    ticket_id: number;
  };
  chat_history?: {
    participants?: TicketParticipantDto[];
    messages?: TicketMessageDto[];
    total_count?: number;
  };
};



export default function App(props: Partial<TicketRequestApprovalProps>) {
  const [ticket, setTicket] = useState<TicketLite | null>(null);
  const [loadingTicket, setLoadingTicket] = useState(true);
  const [simpleMessages, setSimpleMessages] = useState<ChatMessage[]>([]);
  const [ticketMessages, setTicketMessages] = useState<TicketMessageDto[]>([]);
  const [participants, setParticipants] = useState<TicketParticipantDto[]>([]);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [booting, setBooting] = useState(true);
  const topSentinelRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const ticketId = props.rawApiData?.ticket_details?.ticket_id ?? props.request?.ticket_id ?? 8;
  const pageSize = 30;

  useEffect(() => {
    const loadTicket = async () => {
      try {
        setLoadingTicket(true);
        // Bootstrap from provided API data if available
        const existing = props.rawApiData as Partial<RawTicketData> | null | undefined;
        if (existing?.ticket_details) {
          setTicket({
            subject: existing.ticket_details.subject,
            created_at: existing.ticket_details.created_at,
            updated_at: existing.ticket_details.updated_at,
            category_name: existing.ticket_details.category_name || '',
            status_value: existing.ticket_details.status_value,
            ticket_id: existing.ticket_details.ticket_id,
          });
        }
        if (existing?.chat_history) {
          const chat = existing.chat_history;
          setParticipants(chat?.participants ?? []);
          const msgs = (chat?.messages ?? []);
          // Ensure chronological order (oldest -> newest) for UI
          setTicketMessages([...(msgs || [])].sort((a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime()));
          setHasMore(((chat?.total_count) || 0) > (msgs?.length || 0));
          return;
        }

        // Otherwise, do a lightweight initial ticket info fetch
        const initToken = await getoken('TICKETS') || '';
        const data = await fetchChatPage({
          ticketId,
          limit: 1,
          offset: 0,
          token: initToken,
        });
        const first = data.items?.[0];
        setTicket({
          subject: first?.subject || 'تیکت به پشتیبانی',
          created_at: first?.created_at || new Date().toISOString(),
          updated_at: first?.updated_at || new Date().toISOString(),
          category_name: first?.category_name || 'اصلاحیه وجه',
          status_value: first?.status_value || 'پاسخ داده شده',
          ticket_id: first?.ticket_id ?? ticketId,
        });
      } catch (e) {
        setTicket({
          subject: 'تیکت به پشتیبانی',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          category_name: 'اصلاحیه وجه',
          status_value: 'پاسخ داده شده',
          ticket_id: ticketId,
        });
      } finally {
        setLoadingTicket(false);
      }
    };
    loadTicket();
  }, []);

  // no date utilities needed here (cards format their own time)

  const mapApiMessages = (apiItems: any[]): ChatMessage[] =>
    (apiItems || []).map((m) => ({
      id: m.id ?? `${m.created_at}-${Math.random()}`,
      text: m.description || m.text || '',
      created_at: m.created_at || new Date().toISOString(),
      sender: m.is_owner ? 'user' : 'agent',
      sender_name: m.sender_name,
      attachments: null,
    }));

  const fetchOlder = useCallback(async () => {
    if (isLoadingOlder || !hasMore) return;
    setIsLoadingOlder(true);
    try {
      const pageToken = await getoken('TICKETS') || '';
      const data = await fetchChatPage({
        ticketId,
        limit: pageSize,
        offset: page,
        token: pageToken,
      });
      const newMsgs = mapApiMessages(data.items || []);
      setSimpleMessages((prev) => [...newMsgs.reverse(), ...prev]); // prepend older (keep chronological)
      setPage((p) => p + pageSize);
      if (!newMsgs.length) setHasMore(false);
      // keep scroll roughly at same message after prepend
      if (listRef.current) {
        listRef.current.scrollTop = 10;
      }
    } catch {
      setHasMore(false);
    } finally {
      setIsLoadingOlder(false);
    }
  }, [hasMore, isLoadingOlder, page, ticketId]);

  useEffect(() => {
    (async () => {
      if (simpleMessages.length === 0 && ticketMessages.length === 0) {
        await fetchOlder();
      }
      requestAnimationFrame(() => {
        if (listRef.current) {
          listRef.current.scrollTop = listRef.current.scrollHeight;
        }
        setBooting(false);
      });
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!topSentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fetchOlder();
          }
        });
      },
      { root: listRef.current, threshold: 1.0 }
    );
    observer.observe(topSentinelRef.current);
    return () => observer.disconnect();
  }, [fetchOlder]);

  const handleSend = useCallback(async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    // If we have rich chat, append to TicketMessageDto list optimistically, else to simple list
    if (ticketMessages.length > 0) {
      const optimisticRich: TicketMessageDto = {
        message_id: Date.now(),
        user_id: 0,
        cust_id: 0,
        content: trimmed,
        message_type: "text",
        attachment_url: "",
        file_extension: null,
        file_size: null,
        sent_at: new Date().toISOString(),
        is_mine: true,
        is_read: null,
        attachments: [],
      };
      setTicketMessages((prev) => [...prev, optimisticRich]);
    } else {
      const optimistic: ChatMessage = {
        id: `tmp-${Date.now()}`,
        text: trimmed,
        created_at: new Date().toISOString(),
        sender: 'user',
      };
      setSimpleMessages((prev) => [...prev, optimistic]);
    }
    setInputValue('');
    requestAnimationFrame(() => {
      if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    });
    try {
      const sendToken = await getoken('TICKETS') || '';

      await sendTextMessage({
        ticketId: ticket?.ticket_id ?? ticketId,
        content: trimmed,
        token: sendToken,
      });

    } catch {
      // revert optimistic on failure
      if (ticketMessages.length > 0) {
        setTicketMessages((prev) => prev.filter((m) => String(m.message_id).startsWith('tmp-') === false));
      } else {
        setSimpleMessages((prev) => prev.filter((m) => !String(m.id).startsWith('tmp-')));
      }
      setInputValue(trimmed);
    }
  }, [inputValue, ticket, ticketId, ticketMessages.length]);

  const handleFileSelected = useCallback(
    async (file: File) => {
      try {
        const token = (await getoken('TICKETS')) || '';
        const meta: UploadedFileMeta = await uploadFile({
          file,
          entityType: 'ticket',
          accessToken: token,
        });
        if (ticketMessages.length > 0) {
          const optimisticFileMsg: TicketMessageDto = {
            message_id: Date.now(),
            user_id: 0,
            cust_id: 0,
            content: '',
            message_type: 'file',
            attachment_url: meta.file_uid,
            file_extension: (meta.name.split('.').pop() || '').toLowerCase(),
            file_size: meta.size,
            sent_at: new Date().toISOString(),
            is_mine: true,
            is_read: null,
            attachments: [
              {
                file_uid: meta.file_uid,
                file_name: meta.name,
                file_extension: `.${(meta.name.split('.').pop() || '').toLowerCase()}`,
                file_size: meta.size,
              },
            ],
          };
          setTicketMessages((prev) => [...prev, optimisticFileMsg]);
        } else {
          const optimisticSimple: ChatMessage = {
            id: `tmp-file-${Date.now()}`,
            text: '',
            created_at: new Date().toISOString(),
            sender: 'user',
            attachments: [
              {
                file_uid: meta.file_uid,
                file_name: meta.name,
                file_extension: `.${(meta.name.split('.').pop() || '').toLowerCase()}`,
                file_size: meta.size,
              },
            ],
          };
          setSimpleMessages((prev) => [...prev, optimisticSimple]);
        }
        requestAnimationFrame(() => {
          if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
        });
        await sendFileMessage({
          ticketId: ticket?.ticket_id ?? ticketId,
          fileUid: meta.file_uid,
          token,
        });
      } catch {
        if (ticketMessages.length > 0) {
          setTicketMessages((prev) => prev.filter((m) => !Number(m.message_id)));
        } else {
          setSimpleMessages((prev) => prev.filter((m) => !String(m.id).toString().startsWith('tmp-file-')));
        }
      }
    },
    [ticketMessages.length, ticket, ticketId]
  );



  const getParticipantInfo = useCallback(
    (userId: number, custId: number): TicketParticipantDto | null => {
      const found = participants.find((p) => p.user_id === userId && p.cust_id === custId);
      return found || null;
    },
    [participants]
  );

  return (
    <div className={styles["ticket-detail"]}>
      <div className={styles["ticket-detail__header"]}>
        <p dir="auto" style={{ margin: 0 }}>{ticket?.subject || 'تیکت به پشتیبانی'}</p>
      </div>

      <div ref={listRef} className={styles["ticket-detail__messages"]} style={{ position: 'relative' }}>
        {booting && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.8))',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              padding: 16,
              zIndex: 1,
            }}
          >
            <div style={{ width: '60%', height: 16, borderRadius: 8, background: 'var(--gray-100)' }} />
            <div style={{ width: '75%', height: 48, borderRadius: 12, background: 'var(--gray-100)' }} />
            <div style={{ alignSelf: 'flex-end', width: '55%', height: 16, borderRadius: 8, background: 'var(--gray-100)' }} />
            <div style={{ alignSelf: 'flex-end', width: '70%', height: 40, borderRadius: 12, background: 'var(--gray-100)' }} />
            <div style={{ width: '65%', height: 16, borderRadius: 8, background: 'var(--gray-100)' }} />
          </div>
        )}
        <div ref={topSentinelRef} />
        {ticketMessages.length > 0
          ? ticketMessages.map((msg) => {
            const participant = getParticipantInfo(msg.user_id, msg.cust_id);
            return (
              <TicketMessageCard
                key={String(msg.message_id)}
                message={msg}
                participant={participant}
              />
            );
          })
          : simpleMessages.map((m) => {
            const numericId = typeof m.id === 'number' ? m.id : Number.parseInt(String(m.id).replace(/\D/g, '')) || Date.now();
            const fake: TicketMessageDto = {
              message_id: numericId,
              user_id: m.sender === 'user' ? 0 : 1,
              cust_id: 0,
              content: m.text,
              message_type: "text",
              attachment_url: "",
              file_extension: null,
              file_size: null,
              sent_at: m.created_at,
              is_mine: m.sender === 'user',
              is_read: null,
              attachments: (m.attachments || []).map(a => ({
                file_uid: a.file_uid,
                file_name: a.file_name || '',
                file_extension: (a.file_extension || '').toString(),
                file_size: typeof a.file_size === 'number' ? a.file_size : 0,
              })),
            };
            return (
              <TicketMessageCard
                key={String(m.id)}
                message={fake}
                participant={null}
              />
            );
          })}
      </div>

      <TicketMessageInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        isDesktop={true}
        onFileSelected={handleFileSelected}
        className={styles["ticket-detail__input-area"]}
        iconsClassName={styles["ticket-detail__input-icons"]}
        disabled={false}
      />
    </div>
  );
}
