'use client';

import React from 'react';
import styles from './index.module.scss';
import { ArrowRight2, Forbidden } from 'iconsax-react';

const TaskDetailSkeleton: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Top Row Skeleton */}
      <div className={styles.topRow}>
        <div className={styles.backButtonRow}>
          <ArrowRight2 variant="Bulk" size={24} color="#007BFF" />
          <span>بازگشت</span>
        </div>
        <Forbidden variant="Bulk" size={24} color='#E70218' />
      </div>

      {/* Task Box with Loading Overlay */}
      <div className={styles.taskBox}>
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingContent}>
            <div className={styles.spinnerContainer}>
              <div className={styles.spinner}>
                <div className={styles.spinnerRing}></div>
                <div className={styles.spinnerRing}></div>
                <div className={styles.spinnerRing}></div>
              </div>
            </div>
            <p className={styles.loadingText}>در حال بارگذاری تسک...</p>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className={styles.contentSkeleton}>
          {/* Header Section */}
          <div className={styles.headerSection}>
            <div className={styles.avatarSkeleton}></div>
            <div className={styles.headerInfo}>
              <div className={styles.titleSkeleton}></div>
              <div className={styles.subtitleSkeleton}></div>
            </div>
          </div>

          {/* Info Cards */}
          <div className={styles.infoCards}>
            {[1, 2, 3].map((item) => (
              <div key={item} className={styles.infoCard}>
                <div className={styles.cardLabel}></div>
                <div className={styles.cardValue}></div>
              </div>
            ))}
          </div>

          {/* Content Sections */}
          <div className={styles.contentSections}>
            <div className={styles.contentSection}>
              <div className={styles.sectionTitle}></div>
              <div className={styles.sectionContent}></div>
              <div className={styles.sectionContent}></div>
              <div className={styles.sectionContentShort}></div>
            </div>

            <div className={styles.contentSection}>
              <div className={styles.sectionTitle}></div>
              <div className={styles.sectionContent}></div>
              <div className={styles.sectionContent}></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <div className={styles.actionButton}></div>
            <div className={styles.actionButtonSecondary}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailSkeleton;
