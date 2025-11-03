'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { HelpRequestApprovalProps } from '@/components/tasks/types';
import DrawerModal from '@/components/ui/modal/drawerModal/DrawerModal';
import FileDownload from '@/components/ui/fileDownload/FileDownload';
import { Add, Trash, DocumentUpload } from 'iconsax-react';
import styles from './index.module.scss';
interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  uploadDate: string;
}
interface FileUploadField {
  id: string;
  documentName: string;
  uploadedFile: UploadedFile | null;
}
const HelpRequestApproval: React.FC<HelpRequestApprovalProps> = ({
  request,
  onApprove,
  onReject,
  className
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [fileUploadFields, setFileUploadFields] = useState<FileUploadField[]>([
    { id: '1', documentName: '', uploadedFile: null }
  ]);
  const [description, setDescription] = useState('');
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const containerClassName = `${styles.container}${className ? ` ${className}` : ''}`;
  const safeText = (value?: string | number | null) =>
    value === null || value === undefined || String(value).trim() === '' ? '—' : String(value);

  const attachments = request.attachedDocuments || [];

  const detailItems = [
    {
      key: 'user', label: 'نام کاربر', value: (
        <div className={styles.userValue}>
          {request.user.avatar && <Image src={request.user.avatar} alt={request.user.name} className={styles.avatar} width={40} height={40} />}
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

  const handleApproveClick = () => {
    setFileUploadFields([{ id: '1', documentName: '', uploadedFile: null }]);
    setDescription('');
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset form when closing drawer
      setFileUploadFields([{ id: '1', documentName: '', uploadedFile: null }]);
      setDescription('');
    }
    setIsDrawerOpen(isOpen);
  };

  const handleAddNewFile = () => {
    const newId = String(Date.now());
    setFileUploadFields([...fileUploadFields, { id: newId, documentName: '', uploadedFile: null }]);
  };

  const handleFileSelect = (fieldId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'application/pdf'];
    if (!allowedTypes.some(type => file.type === type || file.type === 'image/jpg')) {
      alert('نوع فایل مجاز نیست. فقط SVG, PNG, JPG, GIF, PDF مجاز است.');
      return;
    }

    // Validate file size (10MB = 10 * 1024 * 1024 bytes)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('حجم فایل نباید بیشتر از 10 مگابایت باشد.');
      return;
    }

    const uploadedFile: UploadedFile = {
      id: String(Date.now()),
      file,
      name: file.name,
      size: file.size,
      uploadDate: new Date().toLocaleDateString('fa-IR')
    };

    setFileUploadFields(fileUploadFields.map(field =>
      field.id === fieldId
        ? { ...field, uploadedFile }
        : field
    ));
  };

  const handleDocumentNameChange = (fieldId: string, name: string) => {
    setFileUploadFields(fileUploadFields.map(field =>
      field.id === fieldId
        ? { ...field, documentName: name }
        : field
    ));
  };

  const handleDeleteFile = (fieldId: string) => {
    setFileUploadFields(fileUploadFields.map(field =>
      field.id === fieldId
        ? { ...field, uploadedFile: null }
        : field
    ));
    // Reset file input
    if (fileInputRefs.current[fieldId]) {
      fileInputRefs.current[fieldId]!.value = '';
    }
  };

  const handleRemoveField = (fieldId: string) => {
    if (fileUploadFields.length > 1) {
      setFileUploadFields(fileUploadFields.filter(field => field.id !== fieldId));
      delete fileInputRefs.current[fieldId];
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

  const handleSubmit = () => {
    const finalData = {
      requestId: request.id,
      description,
      files: fileUploadFields
        .filter(field => field.uploadedFile)
        .map(field => ({
          documentName: field.documentName,
          fileName: field.uploadedFile!.name,
          fileSize: formatFileSize(field.uploadedFile!.size),
          uploadDate: field.uploadedFile!.uploadDate,
          file: field.uploadedFile!.file
        }))
    };

    console.log('Final Data:', finalData);

    // Close drawer and call onApprove
    setIsDrawerOpen(false);
    onApprove(request.id);
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
                      fileUrl={doc.url || ''}
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

        <section className={styles.aiPanel}>
          <div className={styles.aiHeader}>
            <div className={styles.aiInfo}>
              <h3 className={styles.aiTitle}>دستیار هوشمند</h3>
              <span className={styles.aiSubtitle}>تولید شده توسط هوش‌مصنوعی</span>
            </div>
            <div className={styles.aiAvatar}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className={styles.aiComment}>{request.aiComment || 'این بخش شامل نظر AI هست که در مورد درخواست توضیحات لازم را ارائه می‌دهد.'}</p>
        </section>

        <div className={styles.actions}>
          <button className={styles.primaryButton} onClick={handleApproveClick}>تایید</button>
          <button className={styles.dangerButton} onClick={() => onReject(request.id)}>رد</button>
        </div>
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
                        className={styles.documentNameInput}
                        placeholder="نام مدرک"
                        value={field.documentName}
                        onChange={(e) => handleDocumentNameChange(field.id, e.target.value)}
                      />
                    </div>
                    <div className={styles.uploadStatus}>
                      <span className={styles.statusSuccess}>بارگذاری با موفقیت انجام شد</span>
                      <div className={styles.fileTypeBadge}>{getFileExtension(field.uploadedFile.name)}</div>
                    </div>
                    <div className={styles.fileDetails}>
                      {field.uploadedFile.name} | {formatFileSize(field.uploadedFile.size)}. {field.uploadedFile.uploadDate}
                    </div>
                    {fileUploadFields.length > 1 && (
                      <button
                        className={styles.removeFieldBtn}
                        onClick={() => handleRemoveField(field.id)}
                      >
                        حذف فیلد
                      </button>
                    )}
                  </div>
                ) : (
                  <div className={styles.uploadInputWrapper}>
                    <input
                      type="text"
                      className={styles.documentNameInput}
                      placeholder="نام مدرک"
                      value={field.documentName}
                      onChange={(e) => handleDocumentNameChange(field.id, e.target.value)}
                    />
                    <input
                      type="file"
                      ref={(el) => {
                        fileInputRefs.current[field.id] = el;
                      }}
                      onChange={(e) => handleFileSelect(field.id, e)}
                      accept=".svg,.png,.jpg,.jpeg,.gif,.pdf"
                      style={{ display: 'none' }}
                      id={`file-input-${field.id}`}
                    />
                    <button
                      className={styles.uploadButton}
                      onClick={() => fileInputRefs.current[field.id]?.click()}
                    >
                      <DocumentUpload size={20} />
                      بارگذاری
                    </button>
                    <div className={styles.uploadInstructions}>
                      <span>بارگذاری کنید</span>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 13l-4-4h3V4h2v5h3l-4 4z" />
                      </svg>
                      <span>SVG, PNG, JPG, GIF | 10MB max.</span>
                    </div>
                    {fileUploadFields.length > 1 && (
                      <button
                        className={styles.removeFieldBtn}
                        onClick={() => handleRemoveField(field.id)}
                      >
                        حذف فیلد
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            <button className={styles.addFileButton} onClick={handleAddNewFile}>
              <Add size={18} />
              افزودن مدرک جدید
            </button>
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

          <button className={styles.submitButton} onClick={handleSubmit}>
            ثبت
          </button>
        </div>
      </DrawerModal>
    </div>
  );
};

export default HelpRequestApproval;
