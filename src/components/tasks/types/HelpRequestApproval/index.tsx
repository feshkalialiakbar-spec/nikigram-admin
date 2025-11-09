'use client';
import { useState, useMemo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import styles from './index.module.scss';

import { HelpRequestApprovalProps } from '@/components/tasks/types';
import { useToast } from '@/components/ui';
import DrawerModal from '@/components/ui/modal/drawerModal/DrawerModal';
import FileDownload from '@/components/ui/fileDownload/FileDownload';
import TemplateSelector from './TemplateSelector/TemplateSelector';
import DocumentUploadModal from './DocumentUploadModal';
import { AIAssistantSection } from '@/components/tasks/shared/AIAssistantSection';
import { ActionButtons } from '../../shared/ActionButtons';
import { buildDocDownloadUrl } from '@/utils/docUrl';
import {
  createProjectTemplateRequest,
  verifyProjectRequest,
  ProjectTemplateDetailResponse,
} from '@/services/projectTemplate';
import { submitHelpRequestDocuments } from '@/services/helpRequest';
import { safeText } from '@/hooks/texedit';
import type { DocumentSubmissionForm } from './lib/types';

const HelpRequestApproval: React.FC<HelpRequestApprovalProps> = ({
  request,
  onApprove,
  onReject,
  className,
  rawApiData,
}) => {
  const { showSuccess, showError } = useToast();

  // ---- State Management ----
  const [modalState, setModalState] = useState({
    drawerOpen: false,
    templateOpen: false,
    submitting: false,
    rejectingTemplate: false,
    verifyingTemplate: false,
    approved: false,
  });

  const [lastDescription, setLastDescription] = useState('');

  const taskStatusId = rawApiData?.task_details?.status_id ?? null;
  const taskId = rawApiData?.task_details?.task_id ?? request.id;

  // ---- Effects ----
  useEffect(() => {
    if (taskStatusId === 41) {
      setModalState((s) => ({ ...s, approved: true, templateOpen: true }));
    }
  }, [taskStatusId]);

  // ---- Data Preparation ----
  const attachments = useMemo(
    () =>
      (request.attachedDocuments || []).map((doc) => ({
        ...doc,
        resolvedUrl: buildDocDownloadUrl(doc.url || ''),
      })),
    [request.attachedDocuments]
  );

  const userAvatarUrl = request.user.avatar
    ? buildDocDownloadUrl(request.user.avatar)
    : undefined;

  const detailItems = useMemo(
    () => [
      {
        key: 'user',
        label: 'نام کاربر',
        value: (
          <div className={styles.userValue}>
            {userAvatarUrl && (
              <Image
                src={userAvatarUrl}
                alt={request.user.name}
                className={styles.avatar}
                width={40}
                height={40}
              />
            )}
            <span>{safeText(request.user.name)}</span>
          </div>
        ),
      },
      { key: 'level', label: 'سطح کاربر', value: safeText(request.user.level) },
      { key: 'type', label: 'نوع درخواست', value: safeText(request.requestType) },
      { key: 'title', label: 'عنوان درخواست', value: safeText(request.requestTitle) },
      { key: 'category', label: 'طبقه', value: safeText(request.category) },
      { key: 'subcategory', label: 'زیر طبقه', value: safeText(request.subcategory) },
      { key: 'timeframe', label: 'بازه زمانی نیاز به کمک', value: safeText(request.timeframe) },
      { key: 'amount', label: 'مقدار مبلغ موردنیاز', value: safeText(request.requiredAmount) },
      { key: 'contact', label: 'اطلاعات تماس', value: safeText(request.contactInfo) },
      {
        key: 'sheba',
        label: 'شماره شبا',
        value: (
          <div className={styles.shebaValue}>
            <span>{safeText(request.shebaNumber)}</span>
            {request.isShebaVerified && <span className={styles.shebaBadge}>تایید شده</span>}
          </div>
        ),
      },
    ],
    [request, userAvatarUrl]
  );

  // ---- Handlers ----
  const openDrawer = useCallback((approved: boolean) => {
    setModalState((s) => ({
      ...s,
      drawerOpen: true,
      approved,
      templateOpen: false,
      rejectingTemplate: false,
      verifyingTemplate: false,
    }));
    setLastDescription('');
  }, []);

  const handleDrawerClose = useCallback((isOpen: boolean) => {
    setModalState((s) => ({ ...s, drawerOpen: isOpen, submitting: false }));
    if (!isOpen) setLastDescription('');
  }, []);

  const handleDocumentSubmit = useCallback(
    async ({ description, documents }: DocumentSubmissionForm) => {
      setModalState((s) => ({ ...s, submitting: true }));

      try {
        const res = await submitHelpRequestDocuments({
          requestId: taskId,
          isApproved: modalState.approved,
          documents,
        });

        if (res?.detail) return showError(res.detail);

        setLastDescription(description);
        setModalState((s) => ({ ...s, drawerOpen: false, submitting: false }));

        if (modalState.approved) {
          setModalState((s) => ({ ...s, templateOpen: true }));
        } else {
          showSuccess(res?.message ?? 'مدارک با موفقیت ثبت شد.');
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'خطا در ثبت اطلاعات نهایی';
        showError(message);
      } finally {
        setModalState((s) => ({ ...s, submitting: false }));
      }
    },
    [modalState.approved, taskId, showError, showSuccess]
  );

  const handleTemplateReject = useCallback(async () => {
    setModalState((s) => ({ ...s, rejectingTemplate: true }));
    const notes = lastDescription.trim() || 'درخواست ایجاد تمپلیت جدید';
    try {
      const res = await createProjectTemplateRequest(request.id, {
        description: notes,
        assignment_notes: notes,
      });
      if (res?.detail) return showError(res.detail);
      showSuccess(res?.message ?? 'درخواست ایجاد تمپلیت ثبت شد.');
    } catch (err) {
      showError(
        err instanceof Error ? err.message : 'خطا در ارسال درخواست تمپلیت جدید'
      );
    } finally {
      setModalState((s) => ({
        ...s,
        rejectingTemplate: false,
        templateOpen: false,
      }));
      setLastDescription('');
    }
  }, [request.id, lastDescription, showError, showSuccess]);

  const handleTemplateConfirm = useCallback(
    async (detail: ProjectTemplateDetailResponse) => {
      setModalState((s) => ({ ...s, verifyingTemplate: true }));
      const desc = lastDescription || detail.description || '';
      try {
        const res = await verifyProjectRequest(request.id, {
          template_id: detail.project_temp_id,
          title: detail.title,
          description: desc,
          task_assignments: [],
        });
        if (res?.detail) return showError(res.detail);
        showSuccess(res?.message ?? 'تمپلیت تایید شد.');
        setModalState((s) => ({
          ...s,
          verifyingTemplate: false,
          templateOpen: false,
          drawerOpen: false,
        }));
        setLastDescription('');
        onApprove?.(request.id);
      } catch (err) {
        showError(
          err instanceof Error ? err.message : 'خطا در تایید تمپلیت انتخاب‌شده'
        );
      } finally {
        setModalState((s) => ({ ...s, verifyingTemplate: false }));
      }
    },
    [request.id, lastDescription, onApprove, showError, showSuccess]
  );

  // ---- Render ----
  return (
    <div className={`${styles.container} ${className ?? ''}`}>
      <div className={styles.card}>
        <section className={styles.requestPanel}>
          <header className={styles.requestHeader}>
            <span className={styles.requestTitle}>درخواست کمک</span>
            <span className={styles.requestDate}>
              تاریخ درخواست: {safeText(request.requestDate)}
            </span>
          </header>

          <div className={styles.details}>
            {detailItems.map((item) => (
              <div key={item.key} className={styles.detailRow}>
                <span className={styles.detailLabel}>{item.label}</span>
                <div className={styles.detailValue}>{item.value}</div>
              </div>
            ))}
          </div>

          <section className={styles.descriptionSection}>
            <h2 className={styles.sectionTitle}>شرح درخواست</h2>
            <p className={styles.descriptionText}>
              {safeText(request.description)}
            </p>
          </section>

          {attachments.length > 0 && (
            <section className={styles.documentsSection}>
              <h2 className={styles.sectionTitle}>مدارک پیوست</h2>
              <div className={styles.documentsList}>
                {attachments.map((doc) => (
                  <div key={doc.id} className={styles.documentItem}>
                    <FileDownload
                      title={doc.filename}
                      fileName={doc.filename}
                      fileUrl={doc.resolvedUrl}
                    />
                    <div className={styles.documentMeta}>
                      <span>{doc.fileSize || '—'}</span>
                      {doc.uploadDate && <span> · {doc.uploadDate}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </section>

        <AIAssistantSection comment='این بخش شامل نظر AI درباره درخواست است.' />

        <ActionButtons
          onApprove={() => openDrawer(true)}
          onReject={() => openDrawer(false)}
          className={styles.actionButtons}
        />
      </div>

      <DrawerModal
        isOpen={modalState.drawerOpen}
        setIsOpen={handleDrawerClose}
      >
        <DocumentUploadModal
          isApproved={modalState.approved}
          isSubmitting={modalState.submitting}
          isOpen={modalState.drawerOpen}
          onSubmit={handleDocumentSubmit}
          onError={showError}
        />
      </DrawerModal>

      {modalState.templateOpen && (
        <TemplateSelector
          onClose={() =>
            setModalState((s) => ({
              ...s,
              templateOpen: false,
              rejectingTemplate: false,
              verifyingTemplate: false,
            }))
          }
          onTemplateReject={handleTemplateReject}
          onConfirmTemplate={handleTemplateConfirm}
          isRejecting={modalState.rejectingTemplate}
          isProcessing={modalState.verifyingTemplate}
        />
      )}
    </div>
  );
};

export default HelpRequestApproval;
