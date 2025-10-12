 
import { Icon } from 'iconsax-react'
import styles from './BadgeItem.module.scss'
import Text from '@/components/ui/text/Text'

interface BadgeItemProps {
  Icon: Icon
  showBg: boolean
  onClick: () => void
  text: string
  className?: string
}

const BadgeItem: React.FC<BadgeItemProps> = ({
  Icon: IconComponent,
  showBg,
  onClick,
  text,
  className = '',
}) => {
  return (
    <button
      className={`${styles['badge-item']} ${showBg ? styles['badge-item--with-bg'] : ''} ${className}`}
      onClick={onClick}
      type="button"
    >
      <IconComponent size={18} variant="Outline" />
      <Text textStyle="14S5" textColor="gray-700" textTag="span">
        {text}
      </Text>
    </button>
  )
}

export default BadgeItem

