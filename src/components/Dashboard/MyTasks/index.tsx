'use client';
import { useApiList } from '@/hooks/useTaskServices';
import { fetchMyTasks } from '@/services/taskServices';
import { TaskDashboard } from '@/components/tasks';
import styles from './index.module.scss';

interface MyTasksProps {
    className?: string;
}

const MyTasks: React.FC<MyTasksProps> = ({ className }) => {
    const { data: tasks, isLoading, error, refetch } = useApiList({
        fetcher: fetchMyTasks,
        queryKey: ['tasks', 'my-tasks'],
        enabled: true,
        retry: 3,
    });

    if (isLoading) {
        return (
            <div className={`${styles.myTasks} ${className || ''}`}>
                <div className={styles.header}>
                    <h1 className={styles.title}>کارهای من</h1>
                </div>
                <div className={styles.content}>
                    <TaskDashboard />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`${styles.myTasks} ${className || ''}`}>
                <div className={styles.header}>
                    <h1 className={styles.title}>کارهای من</h1>
                </div>
                <div className={styles.error}>
                    <p>خطا در بارگذاری داده‌ها: {error.message}</p>
                    <button onClick={() => refetch()} className={styles.retryButton}>
                        تلاش مجدد
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.myTasks} ${className || ''}`}>
            <div className={styles.header}>
                <h1 className={styles.title}>کارهای من</h1>
            </div>
            <div className={styles.content}>
                <TaskDashboard />
            </div>
        </div>
    );
};

export default MyTasks;
