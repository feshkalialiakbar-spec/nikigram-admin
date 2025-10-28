import React from 'react'
import styles from './Button.module.scss'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  buttonClassName?: string
  paddingStyle?: 'equal-4' | 'equal-8' | 'equal-12' | 'custom'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  className?: string
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  buttonClassName = '',
  paddingStyle = 'equal-8',
  disabled = false,
  type = 'button',
  variant = 'ghost',
}) => {
  const paddingClass = {
    'equal-4': styles['button--padding-4'],
    'equal-8': styles['button--padding-8'],
    'equal-12': styles['button--padding-12'],
    custom: '',
  }[paddingStyle]

  const variantClass = {
    primary: styles['button--primary'],
    secondary: styles['button--secondary'],
    outline: styles['button--outline'],
    ghost: styles['button--ghost'],
  }[variant]

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.button} ${paddingClass} ${variantClass} ${buttonClassName}`}
    >
      {children}
    </button>
  )
}

export default Button

