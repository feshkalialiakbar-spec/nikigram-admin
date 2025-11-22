'use client';
import { RealProfile, ProfileDocument } from '@/components/tasks/types';
import styles from './index.module.scss';
import FileDownload from '@/components/ui/fileDownload/FileDownload';
import { buildDocDownloadUrl } from '@/utils/docUrl';
import { downloadFileBlob } from '@/services/file';

interface RealProfileSectionProps {
  title: string;
  profile: RealProfile;
  className?: string;
}

const handleDocumentDownload = async (fileDoc: ProfileDocument) => {
  if (!fileDoc.url) return;
  const fileUrl = fileDoc.url || '';
  const absoluteUrl = buildDocDownloadUrl(fileUrl);
  try {
    const blob = await downloadFileBlob(absoluteUrl);
    const blobUrl = window.URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = blobUrl;
    a.download = fileDoc.filename || 'document';
    window.document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch {
    window.open(absoluteUrl, '_blank', 'noopener,noreferrer');
  }
};

export const RealProfileSection: React.FC<RealProfileSectionProps> = ({ title, profile, className }) => (
  <div className={`${styles.profileSection} ${className || ''}`}>
    <h3 className={styles.sectionTitle}>{title}</h3>
    <div className={styles.profileTable}>
      <div className={styles.tableColumn}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderContent}>
            <span className={styles.tableHeaderText}>نوع پروفایل</span>
          </div>
          <div className={styles.tableSeparator}></div>
        </div>
        <div className={styles.tableRow}>
          <div className={styles.tableRowContent}>
            <span className={styles.tableRowText}>{profile.profileType}</span>
          </div>
        </div>
      </div>
      <div className={styles.tableColumn}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderContent}>
            <span className={styles.tableHeaderText}>جنسیت</span>
          </div>
          <div className={styles.tableSeparator}></div>
        </div>
        <div className={styles.tableRow}>
          <div className={styles.tableRowContent}>
            <span className={styles.tableRowText}>{profile.gender}</span>
          </div>
        </div>
      </div>
      <div className={styles.tableColumn}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderContent}>
            <span className={styles.tableHeaderText}>شماره تماس</span>
          </div>
          <div className={styles.tableSeparator}></div>
        </div>
        <div className={styles.tableRow}>
          <div className={styles.tableRowContent}>
            <span className={styles.tableRowText}>{profile.contactNumber}</span>
          </div>
        </div>
      </div>
      <div className={styles.tableColumn}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderContent}>
            <span className={styles.tableHeaderText}>کد ملی</span>
          </div>
          <div className={styles.tableSeparator}></div>
        </div>
        <div className={styles.tableRow}>
          <div className={styles.tableRowContent}>
            <span className={styles.tableRowText}>{profile.nationalId}</span>
          </div>
        </div>
      </div>
      <div className={styles.tableColumn}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderContent}>
            <span className={styles.tableHeaderText}>نام خانوادگی</span>
          </div>
          <div className={styles.tableSeparator}></div>
        </div>
        <div className={styles.tableRow}>
          <div className={styles.tableRowContent}>
            <span className={styles.tableRowText}>{profile.lastName}</span>
          </div>
        </div>
      </div>
      <div className={styles.tableColumn}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderContent}>
            <span className={styles.tableHeaderText}>نام</span>
          </div>
          <div className={styles.tableSeparator}></div>
        </div>
        <div className={styles.tableRow}>
          <div className={styles.tableRowContent}>
            <span className={styles.tableRowText}>{profile.firstName}</span>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.documentsSection}>
      {profile.documents.map((document) => (
        <FileDownload
          key={document.document_id || document.id}
          fileUrl={(document.url || '') as string}
          fileName={document.fileType || 'document'}
          title={document.filename || 'document'}
          date={document.upload_date}
          size={document.fileSize}
          onDownload={() => handleDocumentDownload(document)}
        />
      ))}
    </div>
  </div>
);

