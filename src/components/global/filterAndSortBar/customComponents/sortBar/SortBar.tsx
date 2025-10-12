import React, { useState } from 'react'
import styles from './SortBar.module.scss'
import Dropdown from '@/components/hub/forms/dropdown/Dropdown'

interface SortBarProps {
  options: Array<{ id: string; label: string }>
  onSortChange: (sortId: string) => void
}

const SortBar: React.FC<SortBarProps> = ({ options, onSortChange }) => {
  const [selectedSort, setSelectedSort] = useState(options[0]?.id || '')

  const handleSortChange = (value: string) => {
    setSelectedSort(value)
    onSortChange(value)
  }

  const baseColor = {
    borderAndLabel: 'gray-300' as const,
    inputBgColor: 'main-white' as const,
    textInput: 'gray-950' as const,
    textError: 'error-900' as const,
  }

  return (
    <div className={styles['sort-bar']}>
      <Dropdown
        id="sort-dropdown"
        label="مرتب‌سازی"
        value={selectedSort}
        onChangeAction={handleSortChange}
        options={options.map((option) => ({
          label: option.label,
          value: option.id,
        }))}
        baseColor={baseColor}
        size="sm"
      />
    </div>
  )
}

export default SortBar

