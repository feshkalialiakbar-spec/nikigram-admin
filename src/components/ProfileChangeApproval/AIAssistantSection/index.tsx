'use client';

import React from 'react';
 import styles from './index.module.scss';
import { BatteryCharging } from 'iconsax-react';

interface AIAssistantSectionProps {
  comment: string;
  className?: string;
}

const AIAssistantSection: React.FC<AIAssistantSectionProps> = ({
  comment,
  className
}) => {
  return (
    <div className={`${styles.aiSection} ${className || ''}`}>
      <div className={styles.aiHeader}>
        <div className={styles.aiTitleContainer}>
          <span className={styles.aiTitle}>دستیار هوشمند</span>
          <span className={styles.aiSubtitle}>تولید شده توسط هوش مصنوعی</span>
        </div>
        <div className={styles.aiIcon}>
          <BatteryCharging size={16} color="#0E315D" variant="Bulk" />
        </div>
      </div>
      
      <div className={styles.aiContent}>
        <div className={styles.aiComment}>
          این بخش شامل نظر AI هست که در مورد درخواست ارسال شده توضیحات لازم را در راستای کمک به ادمین می‌دهد.
        </div>
      </div>
    </div>
  );
};

export { AIAssistantSection };
