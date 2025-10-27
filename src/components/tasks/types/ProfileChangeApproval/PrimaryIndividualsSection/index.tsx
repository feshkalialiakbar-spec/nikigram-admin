'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PrimaryIndividual } from '@/components/tasks/types';
import styles from './index.module.scss';
import FileDownload from '@/components/ui/fileDownload/FileDownload';
import FileViewerModal from '@/components/ui/FileViewerModal';

interface PrimaryIndividualsSectionProps {
  individuals: PrimaryIndividual[];
  onSelectPrimary: (individualId: string) => void;
  className?: string;
}

const PrimaryIndividualsSection: React.FC<PrimaryIndividualsSectionProps> = ({
  individuals,
  onSelectPrimary,
  className
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<PrimaryIndividual['document'] | null>(null);

  const handleDocumentView = (document: PrimaryIndividual['document']) => {
    setSelectedDocument(document);
    setIsModalOpen(true);
  };

  const handleDocumentDownload = (document: PrimaryIndividual['document']) => {
    console.log('Download document:', document);
    // The actual download is handled by the Link component in FileDownload
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDocument(null);
  };

  return (
    <div className={`${styles.primaryIndividualsSection} ${className || ''}`}>
      <h3 className={styles.primaryTitle}>
        افرادی با این نقش و شناسه ملی قبلا ثبت شده اند بررسی کرده و فرد اصلی را به عنوان نقش اصلی انتخاب کنید
      </h3>

      <div className={styles.individualsContainer}>
        {individuals.map((individual) => (
          <div key={individual.id} className={styles.individualCard}>
            <div className={styles.individualHeader}>
              <button
                className={styles.selectButton}
                onClick={() => onSelectPrimary(individual.id)}
                type="button"
              >
                انتخاب به عنوان فرد اصلی
              </button>

              <div className={styles.individualDetails}>
                <div className={styles.individualInfo}>
                  <span className={styles.individualName}>{individual.name}</span>
                  <span className={styles.individualRole}>{individual.role}</span>
                </div>
                {individual.avatar ? (
                  <Image
                    src={individual.avatar}
                    alt={individual.name}
                    className={styles.individualAvatar}
                    width={48}
                    height={48}
                  />
                ) : (
                  <div className={styles.individualAvatarPlaceholder}>
                    <span className={styles.avatarText}>
                      {individual.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.individualDocument}>
              <FileDownload
                fileUrl={individual.document.url as string}
                fileName={individual.document.filename}
                title={individual.document.filename}
                onView={() => handleDocumentView(individual.document)}
                onDownload={() => handleDocumentDownload(individual.document)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* File Viewer Modal */}
      {selectedDocument && (
        <FileViewerModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          fileUrl={selectedDocument.url as string}
          fileName={selectedDocument.filename}
        />
      )}
    </div>
  );
};

export { PrimaryIndividualsSection };
