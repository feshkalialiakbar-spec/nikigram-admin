'use client'
import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker2'
import moment from 'moment-jalaali'
import { Colors } from "@/components/hub/forms/text/Text"
import { IconProps } from "@/components/hub/forms/textField/TextField"
import Styles from './CustomCalender.module.scss'

interface DateRangeProps {
  type: "birthday" | "future" | "custom"
  minAge?: number
  maxAge?: number
  minDate?: Date
  maxDate?: Date
}

interface BaseColorProps {
  borderAndLabel: Colors
  inputBgColor: Colors
  textInput: Colors
  textError: Colors
  listTextColor: Colors
  listBgColor: Colors
}

interface CustomCalenderProps {
  setDate: (date: string) => void
  placeholder?: string
  value: string
  onChangeAction: (value: string) => void
  baseColor?: BaseColorProps
  size?: "sm" | "md"
  errorIcon?: IconProps & { text: string }
  label?: string
  dateRange?: DateRangeProps
  onFocus?: () => void
  onBlur?: () => void
}

const CustomCalender: React.FC<CustomCalenderProps> = ({
  setDate,
  placeholder,
  value,
  onChangeAction,
  baseColor,
  size = "md",
  errorIcon,
  label,
  dateRange,
  onFocus,
  onBlur,
}) => {
  const [selectedDay, setSelectedDay] = useState<{
    value: moment.Moment | undefined
  }>({ value: value ? moment(value, 'jYYYY-jMM-jDD') : undefined })

  useEffect(() => {
    if (value) {
      setSelectedDay({ value: moment(value, 'jYYYY-jMM-jDD') })
    } else {
      setSelectedDay({ value: undefined })
    }
  }, [value])

  const getMinMaxDates = () => {
    if (!dateRange) return {}

    switch (dateRange.type) {
      case 'birthday':
        const minAge = dateRange.minAge || 18
        const maxAge = dateRange.maxAge || 100
        return {
          min: moment().subtract(maxAge, 'years'),
          max: moment().subtract(minAge, 'years'),
        }
      case 'future':
        return {
          min: moment(),
          max: undefined,
        }
      case 'custom':
        return {
          min: dateRange.minDate ? moment(dateRange.minDate) : undefined,
          max: dateRange.maxDate ? moment(dateRange.maxDate) : undefined,
        }
      default:
        return {}
    }
  }

  const { min, max } = getMinMaxDates()

  const handleChange = (newValue: moment.Moment) => {
    setSelectedDay({ value: newValue })
    const formattedDate = moment(newValue).format('jYYYY-jMM-jDD')
    setDate(formattedDate)
    onChangeAction(formattedDate)
  }

  return (
    <div 
      className={`${Styles['custom-calender']} ${size === 'sm' ? Styles['custom-calender--sm'] : ''}`}
      style={{
        '--border-color': baseColor?.borderAndLabel ? `var(--${baseColor.borderAndLabel})` : 'var(--gray-300)',
        '--bg-color': baseColor?.inputBgColor ? `var(--${baseColor.inputBgColor})` : 'var(--main-white)',
        '--text-color': baseColor?.textInput ? `var(--${baseColor.textInput})` : 'var(--gray-950)',
      } as React.CSSProperties}
    >
      {label && (
        <label className={Styles['custom-calender__label']}>
          {label}
        </label>
      )}
      <div 
        className={Styles['custom-calender__wrapper']}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <DatePicker
          className={Styles['custom-calender__input']}
          onChange={handleChange}
          value={selectedDay.value}
          isGregorian={false}
          timePicker={false}
          removable
          min={min}
          max={max}
        />
        {!selectedDay.value && placeholder && (
          <span className={Styles['custom-calender__placeholder']}>
            {placeholder}
          </span>
        )}
        {errorIcon && (
          <div className={Styles['custom-calender__error']}>
            {errorIcon.Icon && (
              <errorIcon.Icon
                size={errorIcon.iconSize}
                color={errorIcon.iconColor}
                variant={errorIcon.variant}
              />
            )}
            {errorIcon.text && (
              <span className={Styles['custom-calender__error-text']}>
                {errorIcon.text}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomCalender

