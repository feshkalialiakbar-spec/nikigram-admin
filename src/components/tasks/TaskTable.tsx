import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRotateRight, ExportSquare, Eye } from 'iconsax-react';
import { convertToPersianDate } from '@/utils/dateUtils';
import { TaskTableProps } from './types';
import { getStatusText, getStatusClass } from './utils';
import styles from './TaskTable.module.scss';
import Button from '@/components/ui/actions/button/Button';
import { useToast } from '@/components/ui';

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  className,
  onOperationClick,
}) => {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [pendingTaskId, setPendingTaskId] = React.useState<number | null>(null);

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

  const navigateToTask = React.useCallback((taskId: number) => {
    router.push(`/dashboard/my-tasks/${taskId}`);
  }, [router]);

  const handleOperation = React.useCallback(async (taskId: number) => {
    if (!onOperationClick) {
      navigateToTask(taskId);
      return;
    }

    setPendingTaskId(taskId);

    try {
      await onOperationClick(taskId, 'perform');
      showSuccess('تسک با موفقیت به شما اختصاص یافت');
      navigateToTask(taskId);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'خطا در اختصاص تسک';
      showError('خطا در اختصاص تسک', message);
      console.error('Failed to assign task before navigation:', error);
    } finally {
      setPendingTaskId(null);
    }
  }, [navigateToTask, onOperationClick, showError, showSuccess]);

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
                <Button
                  buttonClassName={styles.operationButton}
                  onClick={() => handleOperation(task.task_id)}
                  disabled={pendingTaskId === task.task_id}
                  type="button"
                  ariaLabel={`انجام عملیات برای وظیفه ${task.task_title}`}
                >
                  <span className={styles.operationIcon}>
                    {getOperationIcon('perform')}
                  </span>
                  {pendingTaskId === task.task_id ? 'در حال اختصاص...' : 'انجام عملیات'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;