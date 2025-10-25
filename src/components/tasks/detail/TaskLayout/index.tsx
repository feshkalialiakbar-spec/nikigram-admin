'use client';

import { ReactNode } from 'react';
import styles from './index.module.scss';
import { ArrowRight2, Forbidden } from 'iconsax-react';
import { useRouter } from 'next/navigation';

interface TaskLayoutProps {
  children: ReactNode;
  className?: string;
}

const TaskLayout: React.FC<TaskLayoutProps> = ({ children, className }) => {
  const router = useRouter();
  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.topRow}>

        <div className={styles.backButtonRow} onClick={() => router.back()}>
          <ArrowRight2 variant="Bulk" size={24} color="#007BFF" />
          <span>بازگشت</span>
        </div>
        <Forbidden variant="Bulk" size={24} color='#E70218' />
      </div>
      <div className={styles.taskBox}>
        {children}
      </div>
    </div>
  );
};

export default TaskLayout;
