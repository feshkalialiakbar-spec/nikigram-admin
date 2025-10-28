import React from 'react';
import { SearchNormal } from 'iconsax-react';
import { FilterBarProps } from './types';
import {
  PROCESS_OPTIONS,
  STATUS_OPTIONS
} from './utils';
import TextField from '@/components/hub/forms/textField/TextField';
import Dropdown from '@/components/hub/forms/dropdown/Dropdown';
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
        {/* Search Input */}
        <div className={styles.searchField}>
          <TextField
            placeholder="جستجو"
            value={filters.search}
            onChangeAction={(value) => handleInputChange('search', value)}
            rightContent={{
              Icon: SearchNormal,
              iconSize: 16,
              iconColor: '#1F2B37',
              variant: 'Bulk'
            }}
            size="sm"
            baseColor={{
              borderAndLabel: 'gray-300',
              inputBgColor: 'main-white',
              textInput: 'main-black'
            }}
          />
        </div>

        {/* Process Dropdown */}
        <div className={styles.dropdownField}>
          <Dropdown
            placeholder="انتخاب فرآیند"
            value={filters.process}
            onChangeAction={(value) => handleInputChange('process', value)}
            options={PROCESS_OPTIONS}
            size="sm"
            baseColor={{
              borderAndLabel: 'gray-300',
              inputBgColor: 'main-white',
              textInput: 'main-black',
              listTextColor: 'main-black',
              listBgColor: 'main-white'
            }}
          />
        </div>

        {/* Date Dropdown */}
        <div className={styles.dropdownField}>
          <Dropdown
            placeholder="تاریخ"
            value={filters.date}
            onChangeAction={(value) => handleInputChange('date', value)}
            options={[
              { label: '۱۴۰۴/۰۵/۲۴', value: '1404/05/24' },
              { label: '۱۴۰۴/۰۵/۲۳', value: '1404/05/23' },
              { label: '۱۴۰۴/۰۵/۲۲', value: '1404/05/22' },
            ]}
            size="sm"
            baseColor={{
              borderAndLabel: 'gray-300',
              inputBgColor: 'main-white',
              textInput: 'main-black',
              listTextColor: 'main-black',
              listBgColor: 'main-white'
            }}
          />
        </div>

        {/* Status Dropdown */}
        <div className={styles.dropdownField}>
          <Dropdown
            placeholder="وضعیت"
            value={filters.status}
            onChangeAction={(value) => handleInputChange('status', value)}
            options={STATUS_OPTIONS}
            size="sm"
            baseColor={{
              borderAndLabel: 'gray-300',
              inputBgColor: 'main-white',
              textInput: 'main-black',
              listTextColor: 'main-black',
              listBgColor: 'main-white'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;