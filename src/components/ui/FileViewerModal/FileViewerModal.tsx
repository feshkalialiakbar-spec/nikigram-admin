'use client';

import React from 'react';
import { CloseCircle } from 'iconsax-react';
import styles from './FileViewerModal.module.scss';
import Text from '@/components/ui/text/Text';

interface FileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
  fileType?: string;
}

const FileViewerModal: React.FC<FileViewerModalProps> = ({
  isOpen,
  onClose,
  fileUrl,
  fileName,
  fileType
}) => {
  if (!isOpen) return null;

  // Determine file type from filename if not provided
  const getFileType = (filename: string, providedType?: string): string => {
    if (providedType) return providedType;
    
    const extension = filename.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
      case 'svg':
        return 'image';
      case 'mp4':
      case 'webm':
      case 'ogg':
      case 'avi':
      case 'mov':
        return 'video';
      case 'mp3':
      case 'wav':
      case 'ogg':
      case 'aac':
        return 'audio';
      case 'pdf':
        return 'pdf';
      case 'txt':
      case 'json':
      case 'xml':
      case 'csv':
        return 'text';
      case 'doc':
      case 'docx':
      case 'xls':
      case 'xlsx':
      case 'ppt':
      case 'pptx':
        return 'office';
      default:
        return 'unknown';
    }
  };

  const detectedFileType = getFileType(fileName, fileType);

  const renderFileContent = () => {
    switch (detectedFileType) {
      case 'image':
        return (
          <div className={styles.imageContainer}>
            <img 
              src={fileUrl} 
              alt={fileName}
              className={styles.imageContent}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove(styles.hidden);
              }}
            />
            <div className={`${styles.errorMessage} ${styles.hidden}`}>
              <Text textStyle="14R4" textColor="gray-600">
                خطا در بارگذاری تصویر
              </Text>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className={styles.videoContainer}>
            <video 
              src={fileUrl} 
              controls 
              className={styles.videoContent}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove(styles.hidden);
              }}
            >
              مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
            </video>
            <div className={`${styles.errorMessage} ${styles.hidden}`}>
              <Text textStyle="14R4" textColor="gray-600">
                خطا در بارگذاری ویدیو
              </Text>
            </div>
          </div>
        );

      case 'audio':
        return (
          <div className={styles.audioContainer}>
            <audio 
              src={fileUrl} 
              controls 
              className={styles.audioContent}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove(styles.hidden);
              }}
            >
              مرورگر شما از پخش صوت پشتیبانی نمی‌کند.
            </audio>
            <div className={`${styles.errorMessage} ${styles.hidden}`}>
              <Text textStyle="14R4" textColor="gray-600">
                خطا در بارگذاری فایل صوتی
              </Text>
            </div>
          </div>
        );

      case 'pdf':
        return (
          <div className={styles.pdfContainer}>
            <iframe 
              src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              className={styles.pdfContent}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove(styles.hidden);
              }}
            />
            <div className={`${styles.errorMessage} ${styles.hidden}`}>
              <Text textStyle="14R4" textColor="gray-600">
                خطا در بارگذاری فایل PDF
              </Text>
              <a 
                href={fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.downloadLink}
              >
                <Text textStyle="14S4" textColor="primary-700">
                  دانلود فایل
                </Text>
              </a>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className={styles.textContainer}>
            <iframe 
              src={fileUrl}
              className={styles.textContent}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove(styles.hidden);
              }}
            />
            <div className={`${styles.errorMessage} ${styles.hidden}`}>
              <Text textStyle="14R4" textColor="gray-600">
                خطا در بارگذاری فایل متنی
              </Text>
            </div>
          </div>
        );

      case 'office':
        return (
          <div className={styles.officeContainer}>
            <iframe 
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`}
              className={styles.officeContent}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove(styles.hidden);
              }}
            />
            <div className={`${styles.errorMessage} ${styles.hidden}`}>
              <Text textStyle="14R4" textColor="gray-600">
                خطا در بارگذاری فایل آفیس
              </Text>
              <a 
                href={fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.downloadLink}
              >
                <Text textStyle="14S4" textColor="primary-700">
                  دانلود فایل
                </Text>
              </a>
            </div>
          </div>
        );

      default:
        return (
          <div className={styles.unsupportedContainer}>
            <Text textStyle="16R4" textColor="gray-700">
              نوع فایل پشتیبانی نمی‌شود
            </Text>
            <Text textStyle="14R4" textColor="gray-500">
              برای مشاهده فایل، آن را دانلود کنید
            </Text>
            <a 
              href={fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.downloadLink}
            >
              <Text textStyle="14S4" textColor="primary-700">
                دانلود فایل
              </Text>
            </a>
          </div>
        );
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div 
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <Text textStyle="18S7" textColor="gray-950" textTag="h2">
            {fileName}
          </Text>
          <button
            className={styles.modalCloseButton}
            onClick={onClose}
            type="button"
            aria-label="بستن"
          >
            <CloseCircle size={24} variant="Outline" color="var(--gray-500)" />
          </button>
        </div>
        
        <div className={styles.modalContent}>
          {renderFileContent()}
        </div>
      </div>
    </div>
  );
};

export default FileViewerModal;
