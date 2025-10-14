'use client';

import React from 'react';
import { DocumentText, ArrowUp2, Eye } from 'iconsax-react';
import { ProfileDocument } from '@/components/tasks/types';
import styles from './index.module.scss';

interface DocumentDisplayProps {
  document: ProfileDocument;
  onView?: (document: ProfileDocument) => void;
  onDownload?: (document: ProfileDocument) => void;
  className?: string;
}

const DocumentDisplayComponent: React.FC<DocumentDisplayProps> = ({
  document,
  onView,
  onDownload,
  className
}) => {
  const getFileIcon = () => {
    switch (document.fileType) {
      case 'jpg':
        return <DocumentText size={20} color="#6B7280" variant="Bulk" />;
      case 'pdf':
        return <DocumentText size={20} color="#EF4444" variant="Bulk" />;
      default:
        return <DocumentText size={20} color="#6B7280" variant="Bulk" />;
    }
  };

  return (
    <div className={`${styles.documentDisplay} ${className || ''}`}>
      <div className={styles.documentInfo}>
        <div className={styles.fileIcon}>
          {getFileIcon()}
        </div>
        <div className={styles.fileDetails}>
          <span className={styles.filename}>{document.filename}</span>
          <span className={styles.uploadDate}>امروز</span>
          <span className={styles.fileSize}>{document.fileSize}</span>
        </div>
      </div>
      <div className={styles.documentActions}>
        {onDownload && (
          <button
            className={styles.actionButton}
            onClick={() => onDownload(document)}
            type="button"
            aria-label={`دانلود ${document.filename}`}
          >
            <ArrowUp2 size={16} color="#3B82F6" variant="Bulk" />
          </button>
        )}
        {onView && (
          <button
            className={styles.actionButton}
            onClick={() => onView(document)}
            type="button"
            aria-label={`مشاهده ${document.filename}`}
          >
            <Eye size={16} color="#3B82F6" variant="Bulk" />
          </button>
        )}
      </div>
    </div>
  );
};

export { DocumentDisplayComponent as DocumentDisplay };
