'use client';

import React from 'react';
import { ProfileChangeApprovalProps } from '@/components/tasks/types';
import { DocumentDisplay } from './DocumentDisplay';
import { ProfileSection } from './ProfileSection';
import { PrimaryIndividualsSection } from './PrimaryIndividualsSection';
import { ActionButtons } from './ActionButtons';
import { AIAssistantSection } from './AIAssistantSection';
import styles from './index.module.scss';

const ProfileChangeApproval: React.FC<ProfileChangeApprovalProps> = ({
  request,
  onApprove,
  onReject,
  onSelectPrimary,
  className
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.requestDateLabel}>تاریخ درخواست :</span>
          <span className={styles.requestDate}>{request.requestDate}</span>
        </div>
        <div className={styles.headerRight}>
          <h1 className={styles.title}>تایید تغییرات (پروفایل)</h1>
          <div className={styles.userInfo}>
            <span className={styles.userLabel}>نام کاربر</span>
            <div className={styles.userDetails}>
              <span className={styles.userName}>{request.userName}</span>
              {request.userAvatar && (
                <img
                  src={request.userAvatar}
                  alt={request.userName}
                  className={styles.userAvatar}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.profileContainer}>
            <div className={styles.profileCard}>
              <div className={styles.profileContent}>
                <div className={styles.profileHeader}>
                  <span className={styles.profileTitle}>تایید تغییرات (پروفایل)</span>
                  <span className={styles.profileDate}>تاریخ درخواست : {request.requestDate}</span>
                </div>

                <div className={styles.userSection}>
                  <div className={styles.userHeader}>
                    <div className={styles.userDetailsContainer}>
                      <span className={styles.userLabel}>نام کاربر</span>
                      <div className={styles.userDetails}>
                        <span className={styles.userName}>{request.userName}</span>
                        {request.userAvatar && (
                          <img
                            src={request.userAvatar}
                            alt={request.userName}
                            className={styles.userAvatar}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Real Profile Section */}
                  <ProfileSection
                    title="پروفایل حقیقی"
                    profile={request.realProfile}
                    className={styles.profileSection}
                  />

                  {/* Legal Profile Section */}
                  <ProfileSection
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
    </div>
  );
};

export default ProfileChangeApproval;
