import React from 'react';
import { Skeleton } from '../Skeleton';
import styles from './TaskTableSkeleton.module.scss';

interface TaskTableSkeletonProps {
  rows?: number;
  className?: string;
}

const TaskTableSkeleton: React.FC<TaskTableSkeletonProps> = ({ 
  rows = 5, 
  className 
}) => {
  // Fixed widths for task names to avoid hydration mismatch
  const taskNameWidths = [180, 200, 220, 190, 210, 195, 205, 185];
  
  return (
    <div className={`${styles.tableSkeletonContainer} ${className || ''}`}>
      {/* Beautiful Loading Animation */}
      <div className={styles.loadingOverlay}>
        <div className={styles.loadingContent}>
          <div className={styles.spinnerContainer}>
            <div className={styles.spinner}>
              <div className={styles.spinnerRing}></div>
              <div className={styles.spinnerRing}></div>
              <div className={styles.spinnerRing}></div>
            </div>
          </div>
          <p className={styles.loadingText}>در حال بارگذاری...</p>
        </div>
      </div>

      {/* Filter bar skeleton */}
      <div className={styles.filterSkeleton}>
        <div className={styles.filterRow}>
          <Skeleton width={200} height={40} borderRadius={8} />
          <Skeleton width={150} height={40} borderRadius={8} />
          <Skeleton width={120} height={40} borderRadius={8} />
          <Skeleton width={180} height={40} borderRadius={8} />
          <Skeleton width={100} height={40} borderRadius={8} />
          <Skeleton width={130} height={40} borderRadius={8} />
        </div>
      </div>

      {/* Table skeleton */}
      <div className={styles.tableSkeleton}>
        {/* Table header */}
        <div className={styles.tableHeader}>
          <div className={styles.headerCell}>
            <Skeleton width={80} height={16} />
          </div>
          <div className={styles.headerCell}>
            <Skeleton width={70} height={16} />
          </div>
          <div className={styles.headerCell}>
            <Skeleton width={120} height={16} />
          </div>
          <div className={styles.headerCell}>
            <Skeleton width={80} height={16} />
          </div>
          <div className={styles.headerCell}>
            <Skeleton width={90} height={16} />
          </div>
          <div className={styles.headerCell}>
            <Skeleton width={100} height={16} />
          </div>
        </div>

        {/* Table rows */}
        <div className={styles.tableBody}>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className={styles.tableRow}>
              {/* Operations column */}
              <div className={styles.tableCell}>
                <Skeleton width={100} height={32} borderRadius={6} />
              </div>
              
              {/* Status column */}
              <div className={styles.tableCell}>
                <Skeleton width={80} height={24} borderRadius={12} />
              </div>
              
              {/* Personnel column */}
              <div className={styles.tableCell}>
                <div className={styles.avatarGroup}>
                  {Array.from({ length: 3 }).map((_, avatarIndex) => (
                    <Skeleton 
                      key={avatarIndex}
                      width={32} 
                      height={32} 
                      variant="circular"
                      className={styles.avatarSkeleton}
                    />
                  ))}
                </div>
              </div>
              
              {/* Date column */}
              <div className={styles.tableCell}>
                <Skeleton width={90} height={16} />
              </div>
              
              {/* Process column */}
              <div className={styles.tableCell}>
                <Skeleton width={120} height={16} />
              </div>
              
              {/* Task name column */}
              <div className={styles.tableCell}>
                <Skeleton width={taskNameWidths[rowIndex % taskNameWidths.length]} height={16} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination skeleton */}
      <div className={styles.paginationSkeleton}>
        <Skeleton width={40} height={32} borderRadius={6} />
        <Skeleton width={32} height={32} borderRadius={6} />
        <Skeleton width={32} height={32} borderRadius={6} />
        <Skeleton width={32} height={32} borderRadius={6} />
        <Skeleton width={40} height={32} borderRadius={6} />
      </div>
    </div>
  );
};

export default TaskTableSkeleton;
