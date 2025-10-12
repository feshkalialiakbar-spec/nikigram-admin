import React from 'react';
import { ArrangeHorizontal, ArrowRotateRight, Eye } from 'iconsax-react';
import { convertToPersianDate } from '@/utils/dateUtils';
import { TaskTableProps } from './types';
import { getStatusClass, getStatusText } from './utils';
import styles from './TaskTable.module.scss';

const TaskTable: React.FC<TaskTableProps> = ({ 
  tasks, 
  onOperationClick, 
  className 
}) => {
  const getOperationIcon = React.useCallback((operation: string) => {
    switch (operation) {
      case 'perform':
        return <ArrangeHorizontal size={12} color="#3B82F6" variant="Bulk" />;
      case 'restart':
        return <ArrowRotateRight size={12} color="#3B82F6" variant="Bulk" />;
      case 'view':
        return <Eye size={12} color="#3B82F6" variant="Bulk" />;
      default:
        return <ArrowRotateRight size={12} color="#3B82F6" variant="Bulk" />;
    }
  }, []);

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
            <th>عملیات</th>
            <th>وضعیت</th>
            <th>تاریخ</th>
            <th>فرآیند</th>
            <th>نام وظیفه</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr 
              key={task.id} 
              className={index === 3 ? styles.highlightedRow : ''}
            >
              <td className={styles.operations}>
                <button
                  className={styles.operationButton}
                  data-operation={task.operation.type}
                  onClick={() => onOperationClick(task.id, task.operation.type)}
                  type="button"
                  aria-label={`انجام عملیات ${task.operation.label} برای وظیفه ${task.taskName}`}
                >
                  <span className={styles.operationIcon}>
                    {getOperationIcon(task.operation.type)}
                  </span>
                  {task.operation.label}
                </button>
              </td>
              <td className={styles.status}>
                <span 
                  className={`${styles.statusBadge} ${getStatusClass(task.status)}`}
                  role="status"
                  aria-label={`وضعیت: ${getStatusText(task.status)}`}
                >
                  {getStatusText(task.status)}
                </span>
              </td>
              <td className={styles.date}>
                {convertToPersianDate(task.date)}
              </td>
              <td className={styles.process}>{task.process}</td>
              <td className={styles.taskName}>{task.taskName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;