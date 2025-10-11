import React from 'react';
import { Task } from '@/types/task';
import { ArrowLeft2 } from 'iconsax-react';
import { convertToPersianDate } from '@/utils/dateUtils';
import styles from './TaskTable.module.scss';

interface TaskTableProps {
  tasks: Task[];
  onOperationClick: (taskId: string, operation: string) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onOperationClick }) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return styles.statusPending;
      case 'stopped':
        return styles.statusStopped;
      case 'rejected':
        return styles.statusRejected;
      case 'completed':
        return styles.statusCompleted;
      default:
        return styles.statusPending;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'در انتظار انجام';
      case 'stopped':
        return 'متوقف شده';
      case 'rejected':
        return 'رد شده';
      case 'completed':
        return 'انجام شده';
      default:
        return 'در انتظار انجام';
    }
  };

  const getOperationIcon = (operation: string) => {
    return <ArrowLeft2 size={12} />;
  };

  return (
    <div className={styles.tableContainer}>
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
            <tr key={task.id} className={index === 3 ? styles.highlightedRow : ''}>
              <td className={styles.operations}>
                <button
                  className={styles.operationButton}
                  onClick={() => onOperationClick(task.id, task.operation.type)}
                >
                  {task.operation.label}
                  <span className={styles.operationIcon}>
                    {getOperationIcon(task.operation.type)}
                  </span>
                </button>
              </td>
              <td className={styles.status}>
                <span className={`${styles.statusBadge} ${getStatusClass(task.status)}`}>
                  {getStatusText(task.status)}
                </span>
              </td>
              <td className={styles.performerPersonnel}>
                <div className={styles.avatarGrid}>
                  {task.performerPersonnel.slice(0, 4).map((person, idx) => (
                    <div key={person.id} className={styles.avatar}>
                      {person.avatar ? (
                        <img src={person.avatar} alt={person.name} />
                      ) : (
                        <div className={styles.avatarPlaceholder}>
                          {person.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </td>
              <td className={styles.date}>{convertToPersianDate(task.date)}</td>
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
