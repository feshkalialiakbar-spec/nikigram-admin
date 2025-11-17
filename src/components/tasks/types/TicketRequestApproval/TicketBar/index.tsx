'use client';

import { useCallback, useMemo, useState } from 'react';
import styles from './TicketBar.module.scss';
import { ConfirmationModal, useToast } from '@/components/ui';
import { getoken } from '@/actions/cookieToken';
import { closeTicket } from '@/services/ticketChat';

interface TicketInfo {
  subject?: string;
  category_name?: string;
  status_value?: string;
  ticket_id?: number;
  created_at?: string;
  updated_at?: string;
}

interface TicketBarProps {
  ticket: TicketInfo | null;
  loading: boolean;
  className?: string;
  onTicketStatusChange?: (nextStatus: string) => void;
}

const CLOSED_TOKENS = ['closed', 'close', 'بسته', 'بسته شده', 'closed_ticket'];

export default function TicketBar({ ticket, loading, className, onTicketStatusChange }: TicketBarProps) {
  const { showSuccess, showError } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const sidebarClassName = useMemo(
    () => [styles.profileSidebar, className].filter(Boolean).join(' '),
    [className]
  );

  const formatDate = useCallback((date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fa-IR');
  }, []);

  const formatDateTime = useCallback((date?: string) => {
    if (!date) return '-';
    const dt = new Date(date);
    return `${dt.toLocaleDateString('fa-IR')} ${dt.toLocaleTimeString('fa-IR')}`;
  }, []);

  const normalizedStatus = (ticket?.status_value || '').trim().toLowerCase();
  const isClosed = CLOSED_TOKENS.includes(normalizedStatus);
  const disableClose = !ticket?.ticket_id || isProcessing || isClosed;
  const statusText = isClosed ? 'بسته شده' : (ticket?.status_value ?? '-');
  const statusValueClassName = isClosed ? styles.ticketInfoValueDanger : styles.ticketInfoValueSuccess;

  const handleConfirmClose = useCallback(async () => {
    if (!ticket?.ticket_id) return;
    try {
      setIsProcessing(true);
      const token = (await getoken('TICKETS')) || '';
      if (!token) {
        throw new Error('Missing auth token');
      }
      const message = await closeTicket({ ticketId: ticket.ticket_id, token });
      showSuccess(message || 'تیکت با موفقیت بسته شد.');
      onTicketStatusChange?.('closed');
    } catch (error) {
      const description =
        (error instanceof Error && error.message) || 'بستن تیکت با خطا مواجه شد.';
      showError(description);
    } finally {
      setIsProcessing(false);
      setIsModalOpen(false);
    }
  }, [showError, showSuccess, ticket?.ticket_id, onTicketStatusChange]);

  return (
    <>
      <div className={sidebarClassName}>
        <div className={styles.ticketInfoSection}>
          <div className={styles.profileHeader}>
            <div className={styles.profileIcon}>
              <svg fill="none" preserveAspectRatio="none" viewBox="0 0 40 40" />
            </div>
            <div className={styles.profileText}>
              <p className={styles.profileName} dir="auto">
                نیکی میزانی
              </p>
              <p className={styles.profileRole} dir="auto">
                پشتیبانی
              </p>
            </div>
          </div>

          <div className={styles.ticketDetailsSection}>
            <p className={styles.ticketDetailsTitle} dir="auto">
              اطلاعات تیکت
            </p>

            {loading ? (
              <div className={styles.loadingText}>در حال بارگذاری...</div>
            ) : ticket ? (
              <div className={styles.ticketInfoContainer}>
                <div className={styles.ticketInfoRow}>
                  <p className={styles.ticketInfoValue} dir="auto">
                    {ticket.subject}
                  </p>
                  <p className={styles.ticketInfoLabel} dir="auto">
                    عنوان تیکت
                  </p>
                </div>
                <div className={styles.ticketInfoRow}>
                  <p className={styles.ticketInfoValue} dir="auto">
                    {formatDate(ticket.created_at)}
                  </p>
                  <p className={styles.ticketInfoLabel} dir="auto">
                    زمان ایجاد تیکت
                  </p>
                </div>
                <div className={styles.ticketInfoRow}>
                  <p className={styles.ticketInfoValue} dir="auto">
                    {formatDateTime(ticket.updated_at)}
                  </p>
                  <p className={styles.ticketInfoLabel} dir="auto">
                    آخرین به‌روزرسانی
                  </p>
                </div>
                <div className={styles.ticketInfoRow}>
                  <p className={styles.ticketInfoValue} dir="auto">
                    نیکی میزانی
                  </p>
                  <p className={styles.ticketInfoLabel} dir="auto">
                    آخرین پاسخ توسط
                  </p>
                </div>
                <div className={styles.ticketInfoRow}>
                  <p className={styles.ticketInfoValue} dir="auto">
                    ۲
                  </p>
                  <p className={styles.ticketInfoLabel} dir="auto">
                    تعداد کل پاسخ‌ها
                  </p>
                </div>
                <div className={styles.ticketInfoRow}>
                  <p className={styles.ticketInfoValue} dir="auto">
                    {ticket.category_name}
                  </p>
                  <p className={styles.ticketInfoLabel} dir="auto">
                    دپارتمان تیکت
                  </p>
                </div>
                <div className={styles.ticketInfoRow}>
                  <p className={statusValueClassName} dir="auto">
                    {statusText}
                  </p>
                  <p className={styles.ticketInfoLabel} dir="auto">
                    وضعیت
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className={styles.closeTicketSection}>
          <div className={styles.closeTicketInfo}>
            <p className={styles.closeTicketTitle} dir="auto">
              بستن تیکت
            </p>
            <p className={styles.closeTicketDescription} dir="auto">
              بسته شدن تیکت به منزله‌ی پایان گفتگو و پیگیری از سوی کارشناسان لینگومسترز
              می‌باشد، لطفا در نظر داشته باشید اگر سفارش یا درخواست شما انجام نگرفته است،
              تیکت را نبندید.
            </p>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => setIsModalOpen(true)}
            disabled={disableClose}
            aria-disabled={disableClose}
          >
            بستن تیکت
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmClose}
        title="بستن تیکت"
        message="آیا از بستن این تیکت مطمئن هستید؟"
        confirmText="بستن تیکت"
        cancelText="انصراف"
        type="warning"
        loading={isProcessing}
      />
    </>
  );
}
