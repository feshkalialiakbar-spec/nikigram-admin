'use client';

import React from 'react';
import styles from './index.module.scss';

interface ActionButtonsProps {
  onApprove: () => void;
  onReject: () => void;
  className?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onApprove,
  onReject,
  className
}) => {
  return (
    <div className={`${styles.actionButtons} ${className || ''}`}>
      <button
        className={styles.approveButton}
        onClick={onApprove}
        type="button"
      >
        تایید
      </button>
      <button
        className={styles.rejectButton}
        onClick={onReject}
        type="button"
      >
        رد
      </button>
    </div>
  );
};

export { ActionButtons };
