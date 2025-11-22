'use client';

import React from 'react';
import styles from './index.module.scss';
import Button from '@/components/ui/actions/button/Button';

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
            <Button
                buttonClassName={styles.rejectButton}
                onClick={onReject}
                type="button"
                borderColor='error-700'
            >
                رد
            </Button>
            <Button
                buttonClassName={styles.approveButton}
                onClick={onApprove}
                type="button"
                bgColor='primary-700'     >
                تایید
            </Button>
        </div>
    );
};

export { ActionButtons };


