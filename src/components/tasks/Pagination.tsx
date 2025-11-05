import React from 'react';
import { ArrowSquareLeft, ArrowSquareRight } from 'iconsax-react';
import { PaginationProps } from './types';
import styles from './Pagination.module.scss';
import Button from '@/components/ui/actions/button/Button';

const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  className
}) => {
  const { currentPage, totalPages } = pagination;

  const handlePrevious = React.useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handleNext = React.useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  const handlePageClick = React.useCallback((page: number) => {
    onPageChange(page);
  }, [onPageChange]);

  const renderPageNumbers = React.useMemo(() => {
    const pages: React.ReactNode[] = [];
    const maxVisiblePages = 3;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          buttonClassName={`${styles.pageButton} ${i === currentPage ? styles.active : ''}`}
          onClick={() => handlePageClick(i)}
          type="button"
          ariaLabel={`برو به صفحه ${i}`}
          title={i === currentPage ? 'page' : undefined}
        >
          {i}
        </Button>
      );
    }

    return pages;
  }, [currentPage, totalPages, handlePageClick]);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className={`${styles.pagination} ${className || ''}`}
      aria-label="صفحه‌بندی"
    >
      <Button
        buttonClassName={`${styles.navButton} ${currentPage === 1 ? styles.disabled : ''}`}
        onClick={handlePrevious}
        disabled={currentPage === 1}
        type="button"
        ariaLabel="صفحه قبلی"
      >
        <ArrowSquareLeft variant={'Bulk'} size={32} color="#007BFF" />
      </Button>

      {renderPageNumbers}

      <Button
        buttonClassName={`${styles.navButton} ${currentPage === totalPages ? styles.disabled : ''}`}
        onClick={handleNext}
        disabled={currentPage === totalPages}
        type="button"
        ariaLabel="صفحه بعدی"
      >
        <ArrowSquareRight variant={'Bulk'} size={32} color="#007BFF" />
      </Button>
    </nav>
  );
};

export default Pagination;