'use client';
import React, { useState } from 'react';
import { useApiList } from '@/hooks/useTaskServices';
import { fetchMyTasks } from '@/services/taskServices';
import { TaskDashboard } from '@/components/tasks';
import styles from './index.module.scss';

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
        queryKey: ['tasks', 'my-tasks', paginationParams],
        enabled: true,
        retry: 3,
        paginationParams,
    });

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

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
    );
};

export default MyTasks;
