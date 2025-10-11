import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { PaginationProps } from './types';
import styles from './Pagination.module.scss';

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
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`${styles.pageButton} ${i === currentPage ? styles.active : ''}`}
          onClick={() => handlePageClick(i)}
          type="button"
          aria-label={`برو به صفحه ${i}`}
          aria-current={i === currentPage ? 'page' : undefined}
        >
          {i}
        </button>
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
      <button
        className={`${styles.navButton} ${currentPage === 1 ? styles.disabled : ''}`}
        onClick={handlePrevious}
        disabled={currentPage === 1}
        type="button"
        aria-label="صفحه قبلی"
      >
        <FaChevronLeft aria-hidden="true" />
      </button>
      
      {renderPageNumbers}
      
      <button
        className={`${styles.navButton} ${currentPage === totalPages ? styles.disabled : ''}`}
        onClick={handleNext}
        disabled={currentPage === totalPages}
        type="button"
        aria-label="صفحه بعدی"
      >
        <FaChevronRight aria-hidden="true" />
      </button>
    </nav>
  );
};

export default Pagination;