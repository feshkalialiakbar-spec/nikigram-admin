'use client';
import { useState } from 'react';
import Image from 'next/image';
import { HelpRequestApprovalProps } from '@/components/tasks/types';
import DrawerModal from '@/components/ui/modal/drawerModal/DrawerModal';
import FileDownload from '@/components/ui/fileDownload/FileDownload';
import { Add, Trash } from 'iconsax-react';
import styles from './index.module.scss';
import { AIAssistantSection } from '@/components/tasks/shared/AIAssistantSection';
import FileUpload from '@/components/ui/fileUpload/FileUpload';
import Button from '@/components/ui/actions/button/Button';
import { ActionButtons } from '../../shared/ActionButtons';
import Text from '@/components/ui/text/Text';
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
  const [focusedFieldId, setFocusedFieldId] = useState<string | null>(null);

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

  const handleFileChange = (fieldId: string, file: File | null) => {
    if (!file) {
      setFileUploadFields(fileUploadFields.map(field =>
        field.id === fieldId
          ? { ...field, uploadedFile: null }
          : field
      ));
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
  };

  const handleRemoveField = (fieldId: string) => {
    if (fileUploadFields.length > 1) {
      setFileUploadFields(fileUploadFields.filter(field => field.id !== fieldId));
      if (focusedFieldId === fieldId) {
        setFocusedFieldId(null);
      }
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
        <AIAssistantSection comment='این بخش شامل نظر AI هست که در مورد درخواست ارسال شده توضیحات لازم را در راستای کمک به ادمین می‌دهد.' />
        <ActionButtons
          onApprove={handleApproveClick}
          onReject={handleApproveClick}
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
                      className={styles.documentNameInput}
                      placeholder="نام مدرک"
                      value={field.documentName}
                      onChange={(e) => handleDocumentNameChange(field.id, e.target.value)}
                    />
                    <FileUpload
                      value={null}
                      onChange={(file) => handleFileChange(field.id, file)}
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
            bgColor='primary-900'
            buttonClassName={styles.submitButton} onClick={handleSubmit}>
            ثبت
          </Button>
        </div>
      </DrawerModal>
    </div>
  );
};

export default HelpRequestApproval;
