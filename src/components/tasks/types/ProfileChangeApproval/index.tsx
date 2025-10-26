'use client';

import { ProfileChangeApprovalProps } from '@/components/tasks/types';
import Image from 'next/image';
import { RealProfileSection, LegalProfileSection } from './ProfileSection';
import { PrimaryIndividualsSection } from './PrimaryIndividualsSection';
import { ActionButtons } from './ActionButtons';
import { AIAssistantSection } from './AIAssistantSection';
import styles from './index.module.scss';

const ProfileChangeApproval: React.FC<ProfileChangeApprovalProps> = ({
  request,
  rawApiData,
  onApprove,
  onReject,
  onSelectPrimary,
  className
}) => {

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Header Section */}
      <div className={styles.profileHeader}>
        <div className={styles.rightSideHeader}>
          <h1 className={styles.title}>تایید پروفایل  </h1>
          <div className={styles.requestInfo}>
            <div className={styles.userInfo}>
              <span className={styles.userLabel}>نام کاربر</span>
              <div className={styles.userDetails}>
                {request.userAvatar && (
                  <Image
                    src={request.userAvatar}
                    alt={request.userName}
                    className={styles.userAvatar}
                    width={24}
                    height={24}
                  />
                )}
                <span className={styles.userName}>{request.userName}</span>
              </div>
            </div>
          </div>
          <div className={styles.leftHeaderContent}>
          </div>
        </div>
        <div className={styles.leftHeaderContent}>
          <div className={styles.requestDate}>
            <span className={styles.requestDateLabel}>تاریخ درخواست :</span>
            <span className={styles.requestDateValue}>{request.requestDate}</span>
          </div>
        </div>

      </div>
      <div className={styles.userSection}>
        <RealProfileSection
          title="پروفایل حقیقی"
          profile={request.realProfile}
          className={styles.profileSection}
        />
        <LegalProfileSection
          title="پروفایل حقوقی"
          profile={request.legalProfile}
          className={styles.profileSection}
        />
        <PrimaryIndividualsSection
          individuals={request.primaryIndividuals}
          onSelectPrimary={onSelectPrimary}
          className={styles.primaryIndividualsSection}
        />
      </div>
      {request.aiComment && (
        <AIAssistantSection
          comment={request.aiComment}
          className={styles.aiSection}
        />
      )}
      <ActionButtons
        onApprove={() => onApprove(request.id)}
        onReject={() => onReject(request.id)}
        className={styles.actionButtons}
      />

    </div>
  );
};
export default ProfileChangeApproval;
