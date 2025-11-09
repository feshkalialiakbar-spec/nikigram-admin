'use client';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { HelpRequestApprovalProps } from '@/components/tasks/types';
import DrawerModal from '@/components/ui/modal/drawerModal/DrawerModal';
import FileDownload from '@/components/ui/fileDownload/FileDownload';
import styles from './index.module.scss';
import { AIAssistantSection } from '@/components/tasks/shared/AIAssistantSection';
import { ActionButtons } from '../../shared/ActionButtons';
import { buildDocDownloadUrl } from '@/utils/docUrl';
import { useToast } from '@/components/ui';
import TemplateSelector from './TemplateSelector/TemplateSelector';
import {
  createProjectTemplateRequest,
  verifyProjectRequest,
  ProjectTemplateDetailResponse,
} from '@/services/projectTemplate';
import { submitHelpRequestDocuments } from '@/services/helpRequest';
import DocumentUploadModal from './DocumentUploadModal';
import type { DocumentSubmissionForm } from './lib/types';
import { safeText } from '@/hooks/texedit';

const HelpRequestApproval: React.FC<HelpRequestApprovalProps> = ({
  request,
  onApprove,
  onReject,
  className,
  rawApiData,
}) => {
  const { showSuccess, showError } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  const [isRejectingTemplate, setIsRejectingTemplate] = useState(false);
  const [isVerifyingTemplate, setIsVerifyingTemplate] = useState(false);
  const [lastSubmissionDescription, setLastSubmissionDescription] = useState('');

  const taskStatusId = useMemo(
    () => rawApiData?.task_details?.status_id ?? null,
    [rawApiData?.task_details?.status_id]
  );

  useEffect(() => {
    if (taskStatusId === 41) {
      setIsApproved(true);
      setIsTemplateSelectorOpen(true);
    }
  }, [taskStatusId]);

  const containerClassName = `${styles.container}${className ? ` ${className}` : ''}`;

  const attachments = (request.attachedDocuments || []).map((doc) => {
    const resolvedUrl = buildDocDownloadUrl(doc.url || '');
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug('[HelpRequestApproval] attachment url', {
        original: doc.url,
        resolved: resolvedUrl,
        id: doc.id,
      });
    }
    return {
      ...doc,
      resolvedUrl,
    };
  });

  const userAvatarUrl = request.user.avatar
    ? buildDocDownloadUrl(request.user.avatar)
    : undefined;

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.debug('[HelpRequestApproval] user avatar', {
      original: request.user.avatar,
      resolved: userAvatarUrl,
      userId: request.user.id,
    });
  }

  const detailItems = [
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
  ];

  const handleApproveClick = () => {
    setIsApproved(true);
    setLastSubmissionDescription('');
    setIsTemplateSelectorOpen(false);
    setIsRejectingTemplate(false);
    setIsVerifyingTemplate(false);
    setIsDrawerOpen(true);
  };

  const handleRejectClick = () => {
    setIsApproved(false);
    setLastSubmissionDescription('');
    setIsTemplateSelectorOpen(false);
    setIsRejectingTemplate(false);
    setIsVerifyingTemplate(false);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = (isOpen: boolean) => {
    if (!isOpen) {
      setIsSubmitting(false);
      if (!isTemplateSelectorOpen) {
        setLastSubmissionDescription('');
      }
    }
    setIsDrawerOpen(isOpen);
  };

  const handleDocumentSubmit = async ({
    description,
    documents,
  }: DocumentSubmissionForm) => {
    setIsSubmitting(true);
    try {
      const data = await submitHelpRequestDocuments({
        requestId: request.id,
        isApproved,
        documents,
      });

      if (data?.detail) {
        showError(data.detail);
        return;
      }

      console.log('Document submission data:', {
        requestId: request.id,
        isApproved,
        description,
        documents,
      });

      setLastSubmissionDescription(description);
      setIsDrawerOpen(false);

      if (isApproved) {
        setIsTemplateSelectorOpen(true);
      } else {
        showSuccess(data?.message ?? 'مدارک با موفقیت ثبت شد.');
        setLastSubmissionDescription('');
      }
    } catch (error) {
      console.error('Error submitting documents:', error);
      if (error instanceof Error) {
        if (error.message === 'ACCESS_TOKEN_MISSING') {
          showError('توکن دسترسی یافت نشد. لطفاً مجدداً وارد شوید.');
          return;
        }
        if (error.message === 'API base URL is not configured.') {
          showError('آدرس سرور تنظیم نشده است.');
          return;
        }
        showError(error.message || 'خطا در ثبت اطلاعات نهایی');
        return;
      }
      showError('خطا در ثبت اطلاعات نهایی');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTemplateReject = async () => {
    setIsRejectingTemplate(true);
    const fallbackText = 'درخواست ایجاد تمپلیت جدید';
    const notesSource = lastSubmissionDescription;
    const notes = notesSource.trim() || fallbackText;
    try {
      const response = await createProjectTemplateRequest(request.id, {
        description: notes,
        assignment_notes: notes
      });
      if (response?.detail) {
        showError(response.detail);
        return;
      }
      showSuccess(response?.message ?? 'درخواست ایجاد تمپلیت ثبت شد.');
    } catch (error) {
      console.error('Error requesting new template:', error);
      showError(error instanceof Error ? error.message : 'خطا در ارسال درخواست تمپلیت جدید');
    } finally {
      setIsRejectingTemplate(false);
      setIsTemplateSelectorOpen(false);
      setLastSubmissionDescription('');
    }
  };

  const handleTemplateConfirm = async (detail: ProjectTemplateDetailResponse) => {
    setIsVerifyingTemplate(true);
    const verificationDescription = lastSubmissionDescription || detail.description || '';
    try {
      const verifyResponse = await verifyProjectRequest(request.id, {
        template_id: detail.project_temp_id,
        title: detail.title,
        description: verificationDescription,
        task_assignments: [],
      });

      if (verifyResponse?.detail) {
        showError(verifyResponse.detail);
        return;
      }

      showSuccess(verifyResponse?.message ?? 'تمپلیت با موفقیت تایید شد.');
      console.log('Template verification data:', {
        requestId: request.id,
        template: detail,
        description: verificationDescription
      });

      setIsTemplateSelectorOpen(false);
      setIsDrawerOpen(false);
      setLastSubmissionDescription('');
      onApprove?.(request.id);
    } catch (error) {
      console.error('Error verifying project request:', error);
      showError(error instanceof Error ? error.message : 'خطا در تایید تمپلیت انتخاب شده');
    } finally {
      setIsVerifyingTemplate(false);
    }
  };

  return (
    <div className={containerClassName}>
      <div className={styles.card}>
        <section className={styles.requestPanel}>
          <header className={styles.requestHeader}>
            <span className={styles.requestTitle}>درخواست کمک</span>
            <span className={styles.requestDate}>تاریخ درخواست: {safeText(request.requestDate)}</span>
          </header>

          <div className={styles.details}>
            {detailItems.map(item => (
              <div key={item.key} className={styles.detailRow}>
                <span className={styles.detailLabel}>{item.label}</span>
                <div className={styles.detailValue}>{item.value}</div>
              </div>
            ))}
          </div>

          <section className={styles.descriptionSection}>
            <h2 className={styles.sectionTitle}>شرح درخواست</h2>
            <p className={styles.descriptionText}>{safeText(request.description)}</p>
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
                      {doc.uploadDate && doc.uploadDate !== '—' && (
                        <span> · {doc.uploadDate}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </section>
        <AIAssistantSection comment='این بخش شامل نظر AI هست که در مورد درخواست ارسال شده توضیحات لازم را در راستای کمک به ادمین می‌دهد.' />
        <ActionButtons
          onApprove={handleApproveClick}
          onReject={handleRejectClick}
          className={styles.actionButtons}
        />
      </div>

      <DrawerModal isOpen={isDrawerOpen} setIsOpen={handleDrawerClose}>
        <DocumentUploadModal
          isApproved={isApproved}
          isSubmitting={isSubmitting}
          isOpen={isDrawerOpen}
          onSubmit={handleDocumentSubmit}
          onError={showError}
        />
      </DrawerModal>
      {isTemplateSelectorOpen && (
        <TemplateSelector
          onClose={() => {
            setIsTemplateSelectorOpen(false);
            setIsRejectingTemplate(false);
            setIsVerifyingTemplate(false);
            setLastSubmissionDescription('');
          }}
          onTemplateReject={handleTemplateReject}
          onConfirmTemplate={handleTemplateConfirm}
          isRejecting={isRejectingTemplate}
          isProcessing={isVerifyingTemplate}
        />
      )}
    </div>
  );
};

export default HelpRequestApproval;
