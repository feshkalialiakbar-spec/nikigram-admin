'use client';

import React, { useState } from 'react';
import { ProfileChangeApprovalProps } from '@/components/tasks/types';
import Image from 'next/image';
import { RealProfileSection, LegalProfileSection } from './ProfileSection';
import { PrimaryIndividualsSection } from './PrimaryIndividualsSection';
import { ActionButtons } from './ActionButtons';
import { AIAssistantSection } from './AIAssistantSection';
import DetailsModal from './DetailsModal';
import styles from './index.module.scss';

const ProfileChangeApproval: React.FC<ProfileChangeApprovalProps> = ({
  request,
  rawApiData,
  onApprove,
  onReject,
  onSelectPrimary,
  className
}) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  return (
    <div className={`${styles.container} ${className}`}>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.profileContainer}>
            <div className={styles.profileCard}>
              <div className={styles.profileContent}>
                <div className={styles.profileHeader}>
                  <div className={styles.headerLeft}>
                    <span className={styles.requestDateLabel}>تاریخ درخواست :</span>
                    <span className={styles.requestDate}>{request.requestDate}</span>
                  </div>
                  <div className={styles.headerRight}>
                    <div className={styles.titleSection}>
                      <h1 className={styles.title}>تایید تغییرات (پروفایل)</h1>
                      {rawApiData && (
                        <button
                          className={styles.detailsButton}
                          onClick={() => setIsDetailsModalOpen(true)}
                        >
                          <svg className={styles.detailsIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          جزئیات کامل
                        </button>
                      )}
                    </div>
                    <div className={styles.userInfo}>
                      <span className={styles.userLabel}>نام کاربر</span>
                      <div className={styles.userDetails}>
                        <span className={styles.userName}>{request.userName}</span>
                        {request.userAvatar && (
                          <Image
                            src={request.userAvatar}
                            alt={request.userName}
                            className={styles.userAvatar}
                            width={48}
                            height={48}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.userSection}>

                  {/* Real Profile Section */}
                  <RealProfileSection
                    title="پروفایل حقیقی"
                    profile={request.realProfile}
                    className={styles.profileSection}
                  />

                  {/* Legal Profile Section */}
                  <LegalProfileSection
                    title="پروفایل حقوقی"
                    profile={request.legalProfile}
                    className={styles.profileSection}
                  />

                  {/* Primary Individuals Section */}
                  <PrimaryIndividualsSection
                    individuals={request.primaryIndividuals}
                    onSelectPrimary={onSelectPrimary}
                    className={styles.primaryIndividualsSection}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI Assistant Section */}
          {request.aiComment && (
            <AIAssistantSection
              comment={request.aiComment}
              className={styles.aiSection}
            />
          )}

          {/* Action Buttons */}
          <ActionButtons
            onApprove={() => onApprove(request.id)}
            onReject={() => onReject(request.id)}
            className={styles.actionButtons}
          />
        </div>
      </div>

      {/* Details Modal */}
      {rawApiData && (
        <DetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          data={rawApiData}
        />
      )}
    </div>
  );
};

export default ProfileChangeApproval;
