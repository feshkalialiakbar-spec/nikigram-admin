'use client';

import React from 'react';
import { RealProfile, LegalProfile } from '@/components/tasks/types';
import { DocumentDisplay } from '../DocumentDisplay';
import styles from './index.module.scss';

interface ProfileSectionProps {
  title: string;
  profile: RealProfile | LegalProfile;
  className?: string;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  title,
  profile,
  className
}) => {
  const isRealProfile = profile.profileType === 'حقیقی';

  const handleDocumentView = (document: any) => {
    console.log('View document:', document);
  };

  const handleDocumentDownload = (document: any) => {
    console.log('Download document:', document);
  };

  return (
    <div className={`${styles.profileSection} ${className || ''}`}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      
      <div className={styles.profileTable}>
        {isRealProfile ? (
          <>
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
                  <span className={styles.tableRowText}>{(profile as RealProfile).gender}</span>
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
                  <span className={styles.tableRowText}>{(profile as RealProfile).nationalId}</span>
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
                  <span className={styles.tableRowText}>{(profile as RealProfile).lastName}</span>
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
                  <span className={styles.tableRowText}>{(profile as RealProfile).firstName}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.tableColumn}>
              <div className={styles.tableHeader}>
                <div className={styles.tableHeaderContent}>
                  <span className={styles.tableHeaderText}>نام شرکت</span>
                </div>
                <div className={styles.tableSeparator}></div>
              </div>
              <div className={styles.tableRow}>
                <div className={styles.tableRowContent}>
                  <span className={styles.tableRowText}>{(profile as LegalProfile).companyName}</span>
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
                  <span className={styles.tableRowText}>{(profile as LegalProfile).roleInCompany}</span>
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
          </>
        )}
      </div>

      <div className={styles.documentsSection}>
        {profile.documents.map((document) => (
          <DocumentDisplay
            key={document.id}
            document={document}
            onView={handleDocumentView}
            onDownload={handleDocumentDownload}
            className={styles.documentItem}
          />
        ))}
      </div>
    </div>
  );
};

export { ProfileSection };
