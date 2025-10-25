'use client';

import { ReactNode } from 'react';
import styles from './index.module.scss';
import { ArrowRight2 } from 'iconsax-react';

interface TaskLayoutProps {
  children: ReactNode;
  className?: string;
}

const TaskLayout: React.FC<TaskLayoutProps> = ({ children, className }) => {
  return (
    <div className={`${styles.container} ${className || ''}`}>
    <div className="">

      <div className={styles.backButtonRow}>
        <ArrowRight2 variant="Bulk" size={24} color="#007BFF" />
        <span>بازگشت</span>
      </div>
   
    </div>
      <div className={styles.taskBox}>
        {children}
      </div>
    </div>
  );
};

export default TaskLayout;
