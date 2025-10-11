import React from 'react';
import { Task } from '@/types/task';
import { Refresh2, Eye, ExportSquare } from 'iconsax-react';
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
    switch (operation) {
      case 'perform':
        return <ExportSquare size={14} />;
      case 'restart':
        return <Refresh2 size={14} />;
      case 'view':
        return <Eye size={14} />;
      default:
        return <ExportSquare size={14} />;
    }
  };

  return (
    <div className={styles.tableContainer}>
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
            <tr key={task.id} className={index === 3 ? styles.highlightedRow : ''}>
              <td className={styles.taskName}>{task.taskName}</td>
              <td className={styles.process}>{task.process}</td>
              <td className={styles.date}>{task.date}</td>
              <td className={styles.status}>
                <span className={`${styles.statusBadge} ${getStatusClass(task.status)}`}>
                  {getStatusText(task.status)}
                </span>
              </td>
              <td className={styles.operations}>
                <button
                  className={styles.operationButton}
                  onClick={() => onOperationClick(task.id, task.operation.type)}
                >
                  <span className={styles.operationIcon}>
                    {getOperationIcon(task.operation.type)}
                  </span>
                  {task.operation.label}
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
