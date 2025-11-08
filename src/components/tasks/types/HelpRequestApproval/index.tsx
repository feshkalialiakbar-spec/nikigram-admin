'use client';
import { useState } from 'react';
import Image from 'next/image';
import { HelpRequestApprovalProps } from '@/components/tasks/types';
import DrawerModal from '@/components/ui/modal/drawerModal/DrawerModal';
import FileDownload from '@/components/ui/fileDownload/FileDownload';
import { Add, Trash } from 'iconsax-react';
import styles from './index.module.scss';
import { AIAssistantSection } from '@/components/tasks/shared/AIAssistantSection';
import FileUpload, { FileUploadResult } from '@/components/ui/fileUpload/FileUpload';
import Button from '@/components/ui/actions/button/Button';
import { ActionButtons } from '../../shared/ActionButtons';
import Text from '@/components/ui/text/Text';
import { buildDocDownloadUrl } from '@/utils/docUrl';
import { getCookieByKey } from '@/actions/cookieToken';
import { useToast } from '@/components/ui';
import TemplateSelector from './TemplateSelector';
import {
  createProjectTemplateRequest,
  verifyProjectRequest,
  ProjectTemplateDetailResponse,
} from '@/services/projectTemplate';
interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  uploadDate: string;
  fileUid?: string;
}

interface DocumentPayload {
  document_name: string;
  document_type: string;
  file_uid: string;
  version: string;
  status_id: number;
}

interface FileUploadField {
  id: string;
  documentName: string;
  documentType: string;
  fileUid: string;
  version: string;
  statusId: number;
  uploadedFile: UploadedFile | null;
}

const createEmptyFileField = (id: string): FileUploadField => ({
  id,
  documentName: '',
  documentType: '',
  fileUid: '',
  version: '1.0',
  statusId: 0,
  uploadedFile: null,
});
const HelpRequestApproval: React.FC<HelpRequestApprovalProps> = ({
  request,
  onApprove,
  onReject,
  className
}) => {
  const { showSuccess, showError } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [fileUploadFields, setFileUploadFields] = useState<FileUploadField[]>([
    createEmptyFileField('1')
  ]);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [description, setDescription] = useState('');
  const [focusedFieldId, setFocusedFieldId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  const [isRejectingTemplate, setIsRejectingTemplate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  const [isVerifyingTemplate, setIsVerifyingTemplate] = useState(false);
  const [lastSubmissionDescription, setLastSubmissionDescription] = useState('');

  const containerClassName = `${styles.container}${className ? ` ${className}` : ''}`;
  const safeText = (value?: string | number | null) =>
    value === null || value === undefined || String(value).trim() === '' ? '—' : String(value);

  const attachments = (request.attachedDocuments || []).map((doc) => ({
    ...doc,
    resolvedUrl: buildDocDownloadUrl(doc.url || ''),
  }));

  const userAvatarUrl = request.user.avatar
    ? buildDocDownloadUrl(request.user.avatar)
    : undefined;

  const detailItems = [
    {
      key: 'user', label: 'نام کاربر', value: (
        <div className={styles.userValue}>
          {userAvatarUrl && (
            <Image
              src={`${request.user.avatar}`}
              alt={request.user.name}
              className={styles.avatar}
              width={40}
              height={40}
            />
          )}
          <span>{safeText(request.user.name)}</span>
        </div>
      )
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
      key: 'sheba', label: 'شماره شبا', value: (
        <div className={styles.shebaValue}>
          <span>{safeText(request.shebaNumber)}</span>
          {request.isShebaVerified && <span className={styles.shebaBadge}>تایید شده</span>}
        </div>
      )
    }
  ];

  const resetFormState = () => {
    setFileUploadFields([createEmptyFileField('1')]);
    setDescription('');
    setValidationErrors({});
    setIsRejectingTemplate(false);
    setIsSubmitting(false);
    setIsVerifyingTemplate(false);
    setFocusedFieldId(null);
    setIsTemplateSelectorOpen(false);
    setLastSubmissionDescription('');
  };

  const handleApproveClick = () => {
    resetFormState();
    setIsDrawerOpen(true);
    setIsApproved(true);
  };
  const handleRejectClick = () => {
    resetFormState();
    setIsDrawerOpen(true);
    setIsApproved(false);
  };
  const handleDrawerClose = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset form when closing drawer
      resetFormState();
    }
    setIsDrawerOpen(isOpen);
  };

  const handleAddNewFile = () => {
    const newId = String(Date.now());
    setFileUploadFields([
      ...fileUploadFields,
      createEmptyFileField(newId)
    ]);
  };

const handleFileChange = (fieldId: string, file: File | null, meta?: FileUploadResult) => {
    if (!file) {
      setFileUploadFields(prev => {
        const updatedFields = prev.map(field =>
          field.id === fieldId ? createEmptyFileField(fieldId) : field
        );
        setValidationErrors(current => {
          const next = { ...current };
          delete next[fieldId];
          return next;
        });
        return updatedFields;
      });
      return;
    }

    if (!meta?.file_uid) {
      showError('شناسه فایل از سرور دریافت نشد. لطفاً دوباره تلاش کنید.');
      return;
    }

    const uploadedFile: UploadedFile = {
      id: String(Date.now()),
      file,
      name: file.name,
      size: file.size,
      uploadDate: new Date().toLocaleDateString('fa-IR'),
      fileUid: meta.file_uid
    };

    setFileUploadFields(prev => {
      const updatedFields = prev.map(field =>
        field.id === fieldId
          ? {
            ...field,
            documentType: getFileExtension(file.name),
            fileUid: meta.file_uid ?? '',
            uploadedFile
          }
          : field
      );
      const currentField = updatedFields.find(field => field.id === fieldId);
      setValidationErrors(current => {
        const next = { ...current };
        if (currentField?.uploadedFile && (!currentField.documentName || currentField.documentName.trim() === '')) {
          next[fieldId] = true;
        } else {
          delete next[fieldId];
        }
        return next;
      });
      return updatedFields;
    });
  };

  const handleDocumentNameChange = (fieldId: string, name: string) => {
    setFileUploadFields(prev => {
      const updatedFields = prev.map(field =>
        field.id === fieldId
          ? { ...field, documentName: name }
          : field
      );
      const currentField = updatedFields.find(field => field.id === fieldId);
      setValidationErrors(current => {
        const next = { ...current };
        if (currentField?.uploadedFile && (!currentField.documentName || currentField.documentName.trim() === '')) {
          next[fieldId] = true;
        } else {
          delete next[fieldId];
        }
        return next;
      });
      return updatedFields;
    });
  };

  const handleDeleteFile = (fieldId: string) => {
    setFileUploadFields(prev => {
      const updatedFields = prev.map(field =>
        field.id === fieldId ? createEmptyFileField(fieldId) : field
      );
      setValidationErrors(current => {
        const next = { ...current };
        delete next[fieldId];
        return next;
      });
      return updatedFields;
    });
  };

  const handleRemoveField = (fieldId: string) => {
    if (fileUploadFields.length > 1) {
      setFileUploadFields(prev => prev.filter(field => field.id !== fieldId));
      setValidationErrors(current => {
        const next = { ...current };
        delete next[fieldId];
        return next;
      });
      if (focusedFieldId === fieldId) {
        setFocusedFieldId(null);
      }
    }
  };

  const handleTemplateReject = async () => {
    setIsRejectingTemplate(true);
    const fallbackText = 'درخواست ایجاد تمپلیت جدید';
    const notesSource = lastSubmissionDescription || description;
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
      resetFormState();
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
      resetFormState();
      setIsDrawerOpen(false);
      onApprove?.(request.id);
    } catch (error) {
      console.error('Error verifying project request:', error);
      showError(error instanceof Error ? error.message : 'خطا در تایید تمپلیت انتخاب شده');
    } finally {
      setIsVerifyingTemplate(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getFileExtension = (fileName: string): string => {
    return fileName.split('.').pop()?.toUpperCase() || 'FILE';
  };

  const handleFinalSubmit = async () => {
    const fieldsWithFiles = fileUploadFields.filter(field => field.uploadedFile);
    if (fieldsWithFiles.length === 0) {
      showError('لطفاً حداقل یک مدرک بارگذاری کنید.');
      return;
    }

    const currentErrors: Record<string, boolean> = {};
    fieldsWithFiles.forEach(field => {
      if (!field.documentName || field.documentName.trim() === '') {
        currentErrors[field.id] = true;
      }
    });

    if (Object.keys(currentErrors).length > 0) {
      setValidationErrors(prev => ({ ...prev, ...currentErrors }));
      showError('لطفاً نام مدرک را برای تمامی فایل‌ها وارد کنید.');
      return;
    }

    const invalidFile = fieldsWithFiles.find(field => !field.fileUid || field.fileUid.trim() === '');
    if (invalidFile) {
      showError('شناسه فایل معتبر نیست. لطفاً فایل را مجدداً بارگذاری کنید.');
      return;
    }

    const filesPayload: DocumentPayload[] = fieldsWithFiles.map(field => ({
      document_name: field.documentName.trim(),
      document_type: field.documentType || getFileExtension(field.uploadedFile!.name),
      file_uid: field.fileUid,
      version: field.version,
      status_id: field.statusId
    }));

    const endpoint = `https://nikicity.com/api/admin/task/project/request/${request.id}/documents?is_verified=${isApproved}`;
    const token = await getCookieByKey('access_token') as string;

    setIsSubmitting(true);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(filesPayload)
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const detail = data?.detail ?? 'خطا در ارسال مدارک';
        showError(detail);
        return;
      }

      if (data?.detail) {
        showError(data.detail);
        return;
      }

      console.log('Document submission data:', {
        requestId: request.id,
        isApproved,
        description,
        documents: filesPayload
      });

      setLastSubmissionDescription(description);
      setFileUploadFields([createEmptyFileField('1')]);
      setValidationErrors({});
      setDescription('');
      setFocusedFieldId(null);
      setIsDrawerOpen(false);

      if (isApproved) {
        setIsTemplateSelectorOpen(true);
      } else {
        showSuccess(data?.message ?? 'مدارک با موفقیت ثبت شد.');
        resetFormState();
      }
    } catch (error) {
      console.error('Error submitting documents:', error);
      showError('خطا در ثبت اطلاعات نهایی');
    } finally {
      setIsSubmitting(false);
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
        <div className={styles.drawerContent}>
          <h2 className={styles.drawerTitle}>تایید درخواست کمک</h2>

          <div className={styles.uploadSection}>
            <h3 className={styles.uploadSectionTitle}>آپلود مدارک</h3>

            {fileUploadFields.map((field) => (
              <div key={field.id} className={styles.uploadField}>
                {field.uploadedFile ? (
                  <div className={styles.uploadedFileCard}>
                    <div className={styles.uploadedFileHeader}>
                      <Trash
                        size={20}
                        color="#e70218"
                        variant="Bulk"
                        className={styles.deleteIcon}
                        onClick={() => handleDeleteFile(field.id)}
                      />
                      <input
                        type="text"
                        className={`${styles.documentNameInput} ${validationErrors[field.id] ? styles.documentNameInputError : ''}`}
                        placeholder="نام مدرک"
                        value={field.documentName}
                        onChange={(e) => handleDocumentNameChange(field.id, e.target.value)}
                      />
                    </div>
                    {validationErrors[field.id] && (
                      <span className={styles.errorText}>نام مدرک الزامی است</span>
                    )}
                    <div className={styles.uploadStatus}>
                      <span className={styles.statusSuccess}>بارگذاری با موفقیت انجام شد</span>
                      <div className={styles.fileTypeBadge}>{getFileExtension(field.uploadedFile.name)}</div>
                    </div>
                    <div className={styles.fileDetails}>
                      {field.uploadedFile.name} | {formatFileSize(field.uploadedFile.size)}. {field.uploadedFile.uploadDate}
                    </div>
                    {fileUploadFields.length > 1 && (
                      <Button
                        bgColor='error-700'
                        onClick={() => handleRemoveField(field.id)}
                      >
                        <Text >
                          حذف فیلد
                        </Text>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className={styles.fileUploadWrapper}>
                    <input
                      type="text"
                      className={`${styles.documentNameInput} ${validationErrors[field.id] ? styles.documentNameInputError : ''}`}
                      placeholder="نام مدرک"
                      value={field.documentName}
                      onChange={(e) => handleDocumentNameChange(field.id, e.target.value)}
                    />
                    {validationErrors[field.id] && (
                      <span className={styles.errorText}>نام مدرک الزامی است</span>
                    )}
                    <FileUpload
                      value={null}
                      onChange={(file, meta) => handleFileChange(field.id, file, meta)}
                      onFocus={() => setFocusedFieldId(field.id)}
                      onBlur={() => setFocusedFieldId(null)}
                      isFocused={focusedFieldId === field.id}
                      isEditing={true}
                      accept="image/svg+xml,image/png,image/jpeg,image/jpg,image/gif,application/pdf"
                      allowedExtensions={['.svg', '.png', '.jpg', '.jpeg', '.gif', '.pdf']}
                      maxFileSize={10 * 1024 * 1024}
                      showException={{
                        row1: {
                          importIcon: true,
                          importImage: false,
                        },
                        row2: {
                          text1: 'بارگذاری کنید',
                          text2: '',
                        },
                        row3: {
                          beforeAddFile: 'SVG, PNG, JPG, GIF | 10MB max.',
                          afterAddFile: false,
                          showLoadingAddFile: false,
                          percentLoadingAddFile: -1,
                        },
                      }}
                    />
                  </div>
                )}
              </div>
            ))}

            <Add size={18} color='#0E315D' />
            <Button buttonClassName={styles.addFileButton} onClick={handleAddNewFile}>
              افزودن مدرک جدید
            </Button>
          </div>

          <div className={styles.descriptionField}>
            <label className={styles.descriptionLabel}>توضیحات</label>
            <textarea
              className={styles.descriptionTextarea}
              placeholder="توضیحات خود را وارد کنید..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
            />
          </div>
          <Button
            fullScreen
            bgColor='primary-900'
            buttonClassName={styles.submitButton}
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
          >
            <Text textColor="main-white" textStyle="14S7">
              {isSubmitting ? 'در حال ثبت...' : 'ثبت نهایی'}
            </Text>
          </Button>
        </div>
      </DrawerModal>
      {isTemplateSelectorOpen && (
        <TemplateSelector
          onClose={() => {
            setIsTemplateSelectorOpen(false);
            resetFormState();
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
