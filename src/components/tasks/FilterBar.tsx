import React from 'react';
import { FaSearch, FaCalendarAlt } from 'react-icons/fa';
import { FilterBarProps } from './types';
import { 
  PROCESS_OPTIONS, 
  PERSONNEL_OPTIONS, 
  STATUS_OPTIONS, 
  OPERATION_OPTIONS 
} from './utils';
import styles from './FilterBar.module.scss';

const FilterBar: React.FC<FilterBarProps> = ({ 
  filters, 
  onFilterChange, 
  className 
}) => {
  const handleInputChange = React.useCallback((
    field: keyof typeof filters, 
    value: string
  ) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  }, [filters, onFilterChange]);

  return (
    <div className={`${styles.filterBar} ${className || ''}`}>
      <div className={styles.filterContainer}>
        <div className={styles.searchInput}>
          <input
            type="text"
            placeholder="جستجو"
            value={filters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
            className={styles.input}
            aria-label="جستجو در وظایف"
          />
          <FaSearch className={styles.searchIcon} aria-hidden="true" />
        </div>

        <select
          value={filters.process}
          onChange={(e) => handleInputChange('process', e.target.value)}
          className={styles.select}
          aria-label="انتخاب عنوان"
        >
          <option value="">انتخاب عنوان</option>
          {PROCESS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className={styles.dateInput}>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className={styles.input}
            aria-label="انتخاب تاریخ"
          />
          <FaCalendarAlt className={styles.calendarIcon} aria-hidden="true" />
        </div>

        <select
          value={filters.performerPersonnel}
          onChange={(e) => handleInputChange('performerPersonnel', e.target.value)}
          className={styles.select}
          aria-label="انتخاب پرسنل انجام دهنده"
        >
          <option value="">پرسنل انجام دهنده</option>
          {PERSONNEL_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
          className={styles.select}
          aria-label="انتخاب وضعیت"
        >
          <option value="">وضعیت</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={filters.operations}
          onChange={(e) => handleInputChange('operations', e.target.value)}
          className={styles.select}
          aria-label="انتخاب عملیات"
        >
          <option value="">عملیات</option>
          {OPERATION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterBar;