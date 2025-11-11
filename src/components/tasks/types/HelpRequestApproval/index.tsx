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
  ProjectTemplateDetailResponse,
} from '@/services/projectTemplate';
import { submitHelpRequestDocuments } from '@/services/helpRequest';
import { safeText } from '@/hooks/texedit';
import type {
  DocumentSubmissionForm,
  ApprovalWorkflowState,
  ApprovalPhaseStatus,
} from './lib/types';
import SelectedTemplateOverview from './SelectedTemplateOverview';

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
  const [selectedTemplate, setSelectedTemplate] =
    useState<ProjectTemplateDetailResponse | null>(null);
  const [approvalWorkflow, setApprovalWorkflow] = useState<ApprovalWorkflowState>({
    currentStage: 'review',
    phases: [],
  });
  const storageKey = useMemo(
    () => `helpRequestApproval:selectedTemplate:${request.id}`,
    [request.id]
  );
  const persistSelectedTemplate = useCallback(
    (detail: ProjectTemplateDetailResponse) => {
      if (typeof window === 'undefined') return;
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(detail));
      } catch (error) {
        console.error('Failed to persist selected template detail', error);
      }
    },
    [storageKey]
  );
  const clearPersistedTemplate = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Failed to clear stored template detail', error);
    }
  }, [storageKey]);
  const taskStatusId = rawApiData?.task_details?.status_id ?? null;
  const taskId = rawApiData?.task_details?.task_id ?? request.id;
  // ---- Effects ----
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (!stored) return;
      const parsed = JSON.parse(stored) as ProjectTemplateDetailResponse;
      setSelectedTemplate(parsed);
    } catch (error) {
      console.error('Failed to load stored template detail', error);
    }
  }, [storageKey]);

  useEffect(() => {
    if (taskStatusId !== 41) return;
    setModalState((s) => {
      if (selectedTemplate) {
        if (!s.approved || s.templateOpen) {
          return { ...s, approved: true, templateOpen: false };
        }
        return s;
      }
      if (!s.approved || !s.templateOpen) {
        return { ...s, approved: true, templateOpen: true };
      }
      return s;
    });
  }, [taskStatusId, selectedTemplate]);

  useEffect(() => {
    if (!selectedTemplate) {
      setApprovalWorkflow((prev) =>
        prev.currentStage === 'review' && prev.phases.length === 0
          ? prev
          : { currentStage: 'review', phases: [] }
      );
      return;
    }

    setApprovalWorkflow((prev) => ({
      currentStage: prev.currentStage === 'completed' ? prev.currentStage : 'template',
      phases:
        selectedTemplate.phases?.map((phase) => {
          const existing = prev.phases.find((item) => item.phaseId === phase.phase_id);
          return (
            existing ?? {
              phaseId: phase.phase_id,
              status: 'pending',
            }
          );
        }) ?? [],
    }));
  }, [selectedTemplate]);

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
    setApprovalWorkflow((prev) => ({
      ...prev,
      currentStage: approved ? 'documents' : 'review',
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
      const isApprovalFlow = modalState.approved;

      try {
        const res = await submitHelpRequestDocuments({
          requestId: taskId,
          isApproved: modalState.approved,
          documents,
        });

        if (res?.detail) return showError(res.detail);

        setLastDescription(description);
        const successMessage = res?.message ?? 'مدارک با موفقیت ثبت شد.';

        setModalState((s) => ({
          ...s,
          drawerOpen: false,
          submitting: false,
          templateOpen: s.approved && !selectedTemplate,
        }));

        setApprovalWorkflow((prev) => ({
          ...prev,
          currentStage: isApprovalFlow ? 'template' : prev.currentStage,
        }));

        if (!modalState.approved || selectedTemplate) {
          showSuccess(successMessage);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'خطا در ثبت اطلاعات نهایی';
        showError(message);
      } finally {
        setModalState((s) => ({ ...s, submitting: false }));
      }
    },
    [modalState.approved, selectedTemplate, taskId, showError, showSuccess]
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
      clearPersistedTemplate();
      setSelectedTemplate(null);
      setApprovalWorkflow({
        currentStage: 'review',
        phases: [],
      });
      setModalState((s) => ({
        ...s,
        rejectingTemplate: false,
        templateOpen: false,
      }));
      setLastDescription('');
    }
  }, [request.id, lastDescription, clearPersistedTemplate, showError, showSuccess]);

  const handleTemplateConfirm = useCallback(
    async (detail: ProjectTemplateDetailResponse) => {
      setModalState((s) => ({ ...s, verifyingTemplate: true }));
      try {
        setSelectedTemplate(detail);
        persistSelectedTemplate(detail);
        setLastDescription('');
        showSuccess('تمپلیت انتخاب‌شده ذخیره شد.');
        setModalState((s) => ({
          ...s,
          verifyingTemplate: false,
          templateOpen: false,
        }));
        setApprovalWorkflow((prev) => ({
          ...prev,
          currentStage: 'completed',
        }));
        onApprove?.(request.id);
      } catch (err) {
        console.error('Failed to store selected template detail', err);
        showError(
          err instanceof Error
            ? err.message
            : 'خطا در ذخیره تمپلیت انتخاب‌شده'
        );
        setModalState((s) => ({ ...s, verifyingTemplate: false }));
      }
    },
    [onApprove, persistSelectedTemplate, request.id, showError, showSuccess]
  );

  const handleTemplateChange = useCallback(() => {
    setModalState((s) => ({
      ...s,
      templateOpen: true,
      verifyingTemplate: false,
      rejectingTemplate: false,
    }));
  }, []);

  const handlePhaseStatusChange = useCallback(
    (phaseId: number, status: ApprovalPhaseStatus) => {
      setApprovalWorkflow((prev) => ({
        ...prev,
        phases: prev.phases.map((phase) =>
          phase.phaseId === phaseId ? { ...phase, status } : phase
        ),
      }));
    },
    []
  );

  // ---- Render ----
  return (
    <>

      {selectedTemplate && (
        <SelectedTemplateOverview
          template={selectedTemplate}
          onChangeTemplate={handleTemplateChange}
          workflow={approvalWorkflow}
          onPhaseStatusChange={handlePhaseStatusChange}
          isLoading={modalState.verifyingTemplate}
        />
      )
      }
      {modalState.templateOpen ? (
        <TemplateSelector
          defaultTemplateId={selectedTemplate?.project_temp_id ?? null}
          defaultTemplateDetail={selectedTemplate ?? undefined}
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
      ) : !selectedTemplate && (
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
        </div >
      )}
    </>);
};

export default HelpRequestApproval;
