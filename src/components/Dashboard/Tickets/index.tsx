'use client';

import { useMemo, useState, type FC } from 'react';
import { TaskDashboard } from '@/components/tasks';
import { fetchTickets } from '@/services/task/taskServices';
import { usePaginatedTaskService } from '@/components/tasks/hooks';
import styles from './index.module.scss';
import WithNavbarLayout from '@/components/layouts/withNavbarLayout/WithNavbarLayout';
import Button from '@/components/ui/actions/button/Button';
import { TaskTableSkeleton } from '@/components/ui/TaskTableSkeleton';

interface TicketsProps {
    className?: string;
}

const Tickets: FC<TicketsProps> = ({ className }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const paginationParams = useMemo(() => ({
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
    }), [itemsPerPage, currentPage]);

    const {
        tasks,
        total,
        loading,
        error,
        refetch,
    } = usePaginatedTaskService(fetchTickets, paginationParams);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (loading) {
        return (
            <WithNavbarLayout>
                <div className={`${styles.Tickets} ${className || ''}`}>
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
            <div className={`${styles.Tickets} ${className || ''}`}>
                <div className={styles.header}>
                    <h1 className={styles.title}>کارهای من</h1>
                </div>
                <div className={styles.error}>
                    <p>خطا در بارگذاری داده‌ها: {error}</p>
                    <Button onClick={() => void refetch()} buttonClassName={styles.retryButton}>
                        تلاش مجدد
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <WithNavbarLayout>
            <div className={`${styles.Tickets} ${className || ''}`}>
                <div className={styles.content} >
                    <TaskDashboard
                        tasks={tasks}
                        loading={loading}
                        error={error}
                        onRefetch={() => { void refetch(); }}
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

export default Tickets;
