import React from 'react';
import { ArrowLeft2 } from 'iconsax-react';
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
    return <ArrowLeft2 size={12} />;
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
            <th>پرسنل انجام دهنده</th>
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
                  {task.operation.label}
                  <span className={styles.operationIcon}>
                    {getOperationIcon(task.operation.type)}
                  </span>
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
              <td className={styles.performerPersonnel}>
                <div className={styles.avatarGrid}>
                  {task.performerPersonnel.slice(0, 4).map((person) => (
                    <div key={person.id} className={styles.avatar}>
                      {person.avatar ? (
                        <img 
                          src={person.avatar} 
                          alt={person.name}
                          loading="lazy"
                        />
                      ) : (
                        <div className={styles.avatarPlaceholder}>
                          {person.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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