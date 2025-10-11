import { FilterOptions } from '@/types/task'
import { FaSearch, FaCalendarAlt } from 'react-icons/fa'
import styles from './FilterBar.module.scss'

interface FilterBarProps {
  filters: FilterOptions
  onFilterChange: (filters: FilterOptions) => void
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  const handleInputChange = (field: keyof FilterOptions, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value,
    })
  }

  return (
    <div className={styles.filterBar}>
      <div className={styles.filterContainer}>
        <div className={styles.searchInput}>
          <input
            type="text"
            placeholder="جستجو"
            value={filters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
            className={styles.input}
          />
          <FaSearch className={styles.searchIcon} />
        </div>

        <select
          value={filters.process}
          onChange={(e) => handleInputChange('process', e.target.value)}
          className={styles.select}
        >
          <option value="">انتخاب فرآیند</option>
          <option value="cooperation">درخواست همکاری</option>
          <option value="help">درخواست کمک</option>
          <option value="template">تمپلیت پروژه</option>
          <option value="critical">بحرانی شدن پروژه</option>
          <option value="tender">مناقصه</option>
          <option value="comments">نظرات</option>
          <option value="support">پشتیبانی</option>
          <option value="sales">مدیریت فروش</option>
          <option value="profile">پروفایل</option>
          <option value="financial">مالی</option>
          <option value="niki-yar">نیکی یار</option>
          <option value="pos">درخواست پوز</option>
        </select>

        <div className={styles.dateInput}>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className={styles.input}
          />
          <FaCalendarAlt className={styles.calendarIcon} />
        </div>

        <select
          value={filters.performerPersonnel}
          onChange={(e) => handleInputChange('performerPersonnel', e.target.value)}
          className={styles.select}
        >
          <option value="">پرسنل انجام دهنده</option>
          <option value="ahmad">احمد محمدی</option>
          <option value="ali">علی رضایی</option>
          <option value="hassan">حسن کریمی</option>
          <option value="mohammad">محمد احمدی</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
          className={styles.select}
        >
          <option value="">وضعیت</option>
          <option value="pending">در انتظار انجام</option>
          <option value="stopped">متوقف شده</option>
          <option value="rejected">رد شده</option>
          <option value="completed">انجام شده</option>
        </select>

        <select
          value={filters.operations}
          onChange={(e) => handleInputChange('operations', e.target.value)}
          className={styles.select}
        >
          <option value="">عملیات</option>
          <option value="perform">انجام عملیات</option>
          <option value="view">مشاهده</option>
          <option value="restart">شروع مجدد</option>
        </select>
      </div>
    </div>
  )
}

export default FilterBar
