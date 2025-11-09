'use client';
import { useState } from 'react';
import { useApiList } from '@/hooks/useTaskServices';
import { fetchMyTasks } from '@/services/task/taskServices';
import { TaskDashboard } from '@/components/tasks';
import styles from './index.module.scss';
import WithNavbarLayout from '@/components/layouts/withNavbarLayout/WithNavbarLayout';
import Button from '@/components/ui/actions/button/Button';
import { TaskTableSkeleton } from '@/components/ui/TaskTableSkeleton';

interface MyTasksProps {
    className?: string;
}

const MyTasks: React.FC<MyTasksProps> = ({ className }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const paginationParams = {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
    };

    const { data: tasks, total, isLoading, error, refetch } = useApiList({
        fetcher: fetchMyTasks,
        queryKey: ['my-tasks', 'profile', paginationParams],
        enabled: true,
        retry: 3,
        paginationParams,
    });

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (isLoading) {
        return (
            <WithNavbarLayout>
                <div className={`${styles.myTasks} ${className || ''}`}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>کارهای من</h1>
                    </div>
                    <div className={styles.content}>
                        <TaskTableSkeleton rows={itemsPerPage} />
                    </div>
                </div>
            </WithNavbarLayout>
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
                    <Button onClick={() => refetch()} buttonClassName={styles.retryButton}>
                        تلاش مجدد
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <WithNavbarLayout>
            <div className={`${styles.myTasks} ${className || ''}`}>
                <div className={styles.content} >
                    <TaskDashboard
                        tasks={tasks}
                        loading={isLoading}
                        error={error ? (error as unknown as Error)?.message || null : null}
                        onRefetch={refetch}
                        currentPage={currentPage}
                        totalItems={total}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </WithNavbarLayout>
    );
};

export default MyTasks;
