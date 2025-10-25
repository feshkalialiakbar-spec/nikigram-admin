'use client';

import React from 'react';
import { TaskDashboard } from '@/components/tasks';
import styles from './index.module.scss';
import WithNavbarLayout from '../layouts/withNavbarLayout/WithNavbarLayout';

interface DashboardProps {
  className?: string;
  title?: string;
}

const Dashboard: React.FC<DashboardProps> = ({
  className,
  title = 'میز کار من'
}) => {
  return (
    <WithNavbarLayout>
      <div className={`${styles.dashboard} ${className || ''}`}>
        <div className={styles.dashboardHeader}>
          <h1 className={styles.dashboardTitle}>{title}</h1>
        </div>
        <div className={styles.dashboardContent}>
          <TaskDashboard />
        </div>
      </div>
    </WithNavbarLayout>
  );
};

export default Dashboard;
