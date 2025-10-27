'use client';
import { RealProfile, LegalProfile, ProfileDocument } from '@/components/tasks/types';
import styles from './index.module.scss';
import FileDownload from '@/components/ui/fileDownload/FileDownload';

interface BaseProps {
  title: string;
  className?: string;
}

const handleDocumentView = (document: ProfileDocument) => {
  if (!document.url) return;
  const absoluteUrl = document.url.startsWith('http')
    ? document.url
    : `${process.env.NEXT_PUBLIC_API_URL as string}/api/sys/files/download/${document.url}`;
  window.open(absoluteUrl, '_blank', 'noopener,noreferrer');
};

const handleDocumentDownload = async (fileDoc: ProfileDocument) => {
  if (!fileDoc.url) return;
  const absoluteUrl = fileDoc.url.startsWith('http')
    ? fileDoc.url
    : `${process.env.NEXT_PUBLIC_API_URL as string}/api/sys/files/download/${fileDoc.url}`;
  try {
    const response = await fetch(absoluteUrl);
    const blob = await response.blob();
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

const RealProfileSection: React.FC<BaseProps & { profile: RealProfile }> = ({ title, profile, className }) => (
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
          key={document.id}
          fileUrl={document.url as string}
          fileName={document.filename}
          title={document.filename}
          // onView={() => handleDocumentView(document)}
          onDownload={() => handleDocumentDownload(document)}
        />
      ))}
    </div>
  </div>
);

const LegalProfileSection: React.FC<BaseProps & { profile: LegalProfile }> = ({ title, profile, className }) => (
  <div className={`${styles.profileSection} ${className || ''}`}>
    <h3 className={styles.sectionTitle}>{title}</h3>
    <div className={styles.profileTable}>
      <div className={styles.tableColumn}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderContent}>
            <span className={styles.tableHeaderText}>نام شرکت</span>
          </div>
          <div className={styles.tableSeparator}></div>
        </div>
        <div className={styles.tableRow}>
          <div className={styles.tableRowContent}>
            <span className={styles.tableRowText}>{profile.companyName}</span>
          </div>
        </div>
      </div>
      <div className={styles.tableColumn}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderContent}>
            <span className={styles.tableHeaderText}>شناسه ملی</span>
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
            <span className={styles.tableHeaderText}>نقش در شرکت</span>
          </div>
          <div className={styles.tableSeparator}></div>
        </div>
        <div className={styles.tableRow}>
          <div className={styles.tableRowContent}>
            <span className={styles.tableRowText}>{profile.roleInCompany}</span>
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
    </div>

    <div className={styles.documentsSection}>
      {profile.documents.map((document) => (
        <FileDownload
          key={document.id}
          fileUrl={document.url as string}
          fileName={document.filename}
          title={document.filename}
          // onView={() => handleDocumentView(document)}
          // onDownload={() => handleDocumentDownload(document)}
        />
      ))}
    </div>
  </div>
);

export { RealProfileSection, LegalProfileSection };
