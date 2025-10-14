'use client';

import React from 'react';
import { PrimaryIndividual } from '@/components/tasks/types';
import { DocumentDisplay } from '../DocumentDisplay';
import styles from './index.module.scss';

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
  const handleDocumentView = (document: any) => {
    console.log('View document:', document);
  };

  const handleDocumentDownload = (document: any) => {
    console.log('Download document:', document);
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
                  <img 
                    src={individual.avatar} 
                    alt={individual.name}
                    className={styles.individualAvatar}
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
              <DocumentDisplay
                document={individual.document}
                onView={handleDocumentView}
                onDownload={handleDocumentDownload}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { PrimaryIndividualsSection };
