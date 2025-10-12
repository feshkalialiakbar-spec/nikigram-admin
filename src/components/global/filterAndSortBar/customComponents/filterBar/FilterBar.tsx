import React from 'react'
import styles from './FilterBar.module.scss'
import TextField from '@/components/hub/forms/textField/TextField'
import Dropdown from '@/components/hub/forms/dropdown/Dropdown'
import Checkbox from '@/components/hub/forms/checkbox/Checkbox'
import Button from '@/components/ui/actions/button/Button'
import Text from '@/components/ui/text/Text'
import { SearchNormal1 } from 'iconsax-react'

type FilterItem = {
  type: 'dropdown' | 'checkbox'
  id: string
  label: string
  placeholder?: string
  options?: Array<{ label: string; value: string }>
  value: string | boolean
  disabled?: boolean
}

interface FilterBarProps {
  filters: FilterItem[]
  onFilterChange: (id: string, value: string | boolean) => void
  onClearFilters: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
  searchPlaceholder?: string
  disabled?: boolean
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'جستجو...',
  disabled = false,
}) => {
  const baseColor = {
    borderAndLabel: 'gray-300' as const,
    inputBgColor: 'main-white' as const,
    textInput: 'gray-950' as const,
    textError: 'error-900' as const,
  }

  return (
    <div className={styles['filter-bar']}>
      <div className={styles['filter-bar__search']}>
        <TextField
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChangeAction={onSearchChange}
          baseColor={baseColor}
          leftContent={{
            Icon: SearchNormal1,
            iconColor: 'var(--gray-500)',
            iconSize: '20',
            variant: 'Outline',
          }}
          size="sm"
          disabled={disabled}
        />
      </div>

      <div className={styles['filter-bar__filters']}>
        {filters.map((filter) => {
          if (filter.type === 'dropdown') {
            return (
              <Dropdown
                key={filter.id}
                id={filter.id}
                label={filter.label}
                placeholder={filter.placeholder}
                value={filter.value as string}
                onChangeAction={(value) => onFilterChange(filter.id, value)}
                options={filter.options || []}
                baseColor={baseColor}
                size="sm"
                disabled={disabled || filter.disabled}
              />
            )
          } else if (filter.type === 'checkbox') {
            return (
              <Checkbox
                key={filter.id}
                id={filter.id}
                name={filter.id}
                title={filter.label}
                checked={filter.value as boolean}
                onChangeAction={() =>
                  onFilterChange(filter.id, !filter.value)
                }
                variant="square"
                disabled={disabled || filter.disabled}
              />
            )
          }
          return null
        })}
      </div>

      <div className={styles['filter-bar__actions']}>
        <Button
          onClick={onClearFilters}
          buttonClassName={styles['filter-bar__clear-button']}
          paddingStyle="equal-4"
          disabled={disabled}
        >
          <Text textColor="primary-700" textTag="span" textStyle="14S7">
            پاک کردن فیلترها
          </Text>
        </Button>
      </div>
    </div>
  )
}

export default FilterBar

