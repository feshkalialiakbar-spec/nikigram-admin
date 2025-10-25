import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowRotateRight, ExportSquare, Eye } from 'iconsax-react';
import { convertToPersianDate } from '@/utils/dateUtils';
import { getTaskDetailRoute } from '@/utils/dashboardUtils';
import { TaskTableProps } from './types';
import { getStatusText, getStatusClass } from './utils';
import styles from './TaskTable.module.scss';

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onOperationClick,
  className
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const getOperationIcon = React.useCallback((operation: string) => {
    switch (operation) {
      case 'perform':
        return <ExportSquare size={24} color="#007BFF" variant="Bulk" />;
      case 'restart':
        return <ArrowRotateRight size={12} color="#3B82F6" variant="Bulk" />;
      case 'view':
        return <Eye size={12} color="#3B82F6" variant="Bulk" />;
      default:
        return <ArrowRotateRight size={12} color="#3B82F6" variant="Bulk" />;
    }
  }, []);

  const handleRowClick = (taskId: number) => {
    // Navigate to task detail page based on current dashboard context
    const taskDetailRoute = getTaskDetailRoute(pathname, String(taskId));
    router.push(taskDetailRoute);
  };

  if (tasks.length === 0) {
    return (
      <div className={`${styles.tableContainer} ${className || ''}`}>
        <div className={styles.emptyState}>
          هیچ وظیفه‌ای یافت نشد
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.tableContainer} ${className || ''}`}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>نام وظیفه</th>
            <th>فرآیند</th>
            <th>تاریخ</th>
            <th>وضعیت</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr
              key={task.task_id}
              className={`${index === 3 ? styles.highlightedRow : ''} ${styles.clickableRow}`}
              onClick={() => handleRowClick(task.task_id)}
            >
              <td className={styles.taskName}>{task.task_title}</td>
              <td className={styles.process}>{task.ref_id || task.ref_type}</td>
              <td className={styles.date}>
                {convertToPersianDate(task.created_at)}
              </td>
              <td className={styles.status}>
                <span
                  className={`${styles.statusBadge} ${styles[getStatusClass(task.status_id)]}`}
                  role="status"
                  aria-label={`وضعیت: ${getStatusText(task.status_id)}`}
                >
                  {getStatusText(task.status_id)}
                </span>
              </td>
              <td className={styles.operations}>
                <button
                  className={styles.operationButton}
                  data-operation="perform"
                  onClick={() => handleRowClick(task.task_id)}
                  type="button"
                  aria-label={`انجام عملیات برای وظیفه ${task.task_title}`}
                >
                  <span className={styles.operationIcon}>
                    {getOperationIcon('perform')}
                  </span>
                  انجام عملیات
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;