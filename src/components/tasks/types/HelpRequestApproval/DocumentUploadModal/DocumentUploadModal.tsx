import { useEffect, useState } from 'react';
import { Add, Trash } from 'iconsax-react';
import FileUpload, {
  FileUploadResult,
} from '@/components/ui/fileUpload/FileUpload';
import Button from '@/components/ui/actions/button/Button';
import Text from '@/components/ui/text/Text';
import {
  buildDocumentPayloads,
  createEmptyFileField,
  DocumentSubmissionForm,
  FileUploadField,
  findFieldsMissingFileUid,
  findFieldsMissingNames,
  formatFileSize,
  generateFieldId,
  getFileExtension,
  ValidationErrors,
} from '../lib';
import styles from '../index.module.scss';

interface DocumentUploadModalProps {
  isApproved: boolean;
  isSubmitting: boolean;
  isOpen: boolean;
  onSubmit: (payload: DocumentSubmissionForm) => void;
  onError: (message: string) => void;
}

const createInitialFieldState = (): FileUploadField[] => [
  createEmptyFileField(generateFieldId()),
];

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isApproved,
  isSubmitting,
  isOpen,
  onSubmit,
  onError,
}) => {
  const [fileUploadFields, setFileUploadFields] = useState<FileUploadField[]>(
    createInitialFieldState,
  );
  const [validationErrors, setValidationErrors] =
    useState<ValidationErrors>({});
  const [description, setDescription] = useState('');
  const [focusedFieldId, setFocusedFieldId] = useState<string | null>(null);

  const resetState = () => {
    setFileUploadFields(createInitialFieldState());
    setValidationErrors({});
    setDescription('');
    setFocusedFieldId(null);
  };

  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);

  const handleAddNewFile = () => {
    setFileUploadFields((prev) => [
      ...prev,
      createEmptyFileField(generateFieldId()),
    ]);
  };

  const handleFileChange = (
    fieldId: string,
    file: File | null,
    meta?: FileUploadResult,
  ) => {
    if (!file) {
      setFileUploadFields((prev) =>
        prev.map((field) =>
          field.id === fieldId ? createEmptyFileField(fieldId) : field,
        ),
      );
      setValidationErrors((current) => {
        const next = { ...current };
        delete next[fieldId];
        return next;
      });
      return;
    }

    if (!meta?.file_uid) {
      onError('شناسه فایل از سرور دریافت نشد. لطفاً دوباره تلاش کنید.');
      return;
    }

    const uploadedFile = {
      id: generateFieldId(),
      file,
      name: file.name,
      size: file.size,
      uploadDate: new Date().toLocaleDateString('fa-IR'),
      fileUid: meta.file_uid,
    };

    setFileUploadFields((prev) =>
      prev.map((field) =>
        field.id === fieldId
          ? {
              ...field,
              documentType: getFileExtension(file.name),
              fileUid: meta.file_uid ?? '',
              uploadedFile,
            }
          : field,
      ),
    );

    setValidationErrors((current) => {
      const next = { ...current };
      delete next[fieldId];
      return next;
    });
  };

  const handleDocumentNameChange = (fieldId: string, name: string) => {
    setFileUploadFields((prev) =>
      prev.map((field) =>
        field.id === fieldId ? { ...field, documentName: name } : field,
      ),
    );
    setValidationErrors((current) => {
      const next = { ...current };
      const trimmedName = name.trim();
      if (!trimmedName) {
        next[fieldId] = true;
      } else {
        delete next[fieldId];
      }
      return next;
    });
  };

  const handleDeleteFile = (fieldId: string) => {
    setFileUploadFields((prev) =>
      prev.map((field) =>
        field.id === fieldId ? createEmptyFileField(fieldId) : field,
      ),
    );
    setValidationErrors((current) => {
      const next = { ...current };
      delete next[fieldId];
      return next;
    });
  };

  const handleRemoveField = (fieldId: string) => {
    setFileUploadFields((prev) =>
      prev.filter((field) => field.id !== fieldId),
    );
    setValidationErrors((current) => {
      const next = { ...current };
      delete next[fieldId];
      return next;
    });
    if (focusedFieldId === fieldId) {
      setFocusedFieldId(null);
    }
  };

  const handleSubmit = () => {
    if (isSubmitting) {
      return;
    }

    const missingNameIds = findFieldsMissingNames(fileUploadFields);
    if (missingNameIds.length > 0) {
      const nextErrors: ValidationErrors = {};
      missingNameIds.forEach((id) => {
        nextErrors[id] = true;
      });
      setValidationErrors(nextErrors);
      onError('لطفاً نام مدرک را برای تمامی فایل‌ها وارد کنید.');
      return;
    }

    const missingFileUidIds = findFieldsMissingFileUid(fileUploadFields);
    if (missingFileUidIds.length > 0) {
      onError('شناسه فایل معتبر نیست. لطفاً فایل را مجدداً بارگذاری کنید.');
      return;
    }

    const documents = buildDocumentPayloads(fileUploadFields);
    onSubmit({
      description: description.trim(),
      documents,
    });
  };

  const modalTitle = isApproved ? 'تایید درخواست کمک' : 'ثبت مدارک درخواست';

  return (
    <div className={styles.drawerContent}>
      <h2 className={styles.drawerTitle}>{modalTitle}</h2>

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
                    className={`${styles.documentNameInput} ${
                      validationErrors[field.id]
                        ? styles.documentNameInputError
                        : ''
                    }`}
                    placeholder="نام مدرک"
                    value={field.documentName}
                    onChange={(e) =>
                      handleDocumentNameChange(field.id, e.target.value)
                    }
                  />
                </div>
                {validationErrors[field.id] && (
                  <span className={styles.errorText}>
                    نام مدرک الزامی است
                  </span>
                )}
                <div className={styles.uploadStatus}>
                  <span className={styles.statusSuccess}>
                    بارگذاری با موفقیت انجام شد
                  </span>
                  <div className={styles.fileTypeBadge}>
                    {getFileExtension(field.uploadedFile.name)}
                  </div>
                </div>
                <div className={styles.fileDetails}>
                  {field.uploadedFile.name} |{' '}
                  {formatFileSize(field.uploadedFile.size)}.{' '}
                  {field.uploadedFile.uploadDate}
                </div>
                {fileUploadFields.length > 1 && (
                  <Button
                    bgColor="error-700"
                    onClick={() => handleRemoveField(field.id)}
                  >
                    <Text>حذف فیلد</Text>
                  </Button>
                )}
              </div>
            ) : (
              <div className={styles.fileUploadWrapper}>
                <input
                  type="text"
                  className={`${styles.documentNameInput} ${
                    validationErrors[field.id]
                      ? styles.documentNameInputError
                      : ''
                  }`}
                  placeholder="نام مدرک"
                  value={field.documentName}
                  onChange={(e) =>
                    handleDocumentNameChange(field.id, e.target.value)
                  }
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
                  isEditing
                  accept="image/svg+xml,image/png,image/jpeg,image/jpg,image/gif,application/pdf"
                  allowedExtensions={[
                    '.svg',
                    '.png',
                    '.jpg',
                    '.jpeg',
                    '.gif',
                    '.pdf',
                  ]}
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

        <Add size={18} color="#0E315D" />
        <Button
          buttonClassName={styles.addFileButton}
          onClick={handleAddNewFile}
        >
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
        bgColor="primary-900"
        buttonClassName={styles.submitButton}
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        <Text textColor="main-white" textStyle="14S7">
          {isSubmitting ? 'در حال ثبت...' : 'ثبت نهایی'}
        </Text>
      </Button>
    </div>
  );
};

export default DocumentUploadModal;

