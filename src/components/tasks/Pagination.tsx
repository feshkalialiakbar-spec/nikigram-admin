import React from 'react';
import { PaginationInfo } from '@/types/task';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from './Pagination.module.scss';

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pagination, onPageChange }) => {
  const { currentPage, totalPages } = pagination;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
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
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className={styles.pagination}>
      <button
        className={`${styles.navButton} ${currentPage === 1 ? styles.disabled : ''}`}
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        <FaChevronLeft />
      </button>
      
      {renderPageNumbers()}
      
      <button
        className={`${styles.navButton} ${currentPage === totalPages ? styles.disabled : ''}`}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
