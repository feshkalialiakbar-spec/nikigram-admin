import React from 'react'
import styles from './ItemCounter.module.scss'
import Text from '@/components/ui/text/Text'

interface ItemCounterProps {
  qty: number
  label?: string
}

const ItemCounter: React.FC<ItemCounterProps> = ({ qty, label = 'مورد' }) => {
  return (
    <div className={styles['item-counter']}>
      <Text textStyle="14S5" textColor="gray-700" textTag="span">
        {qty} {label}
      </Text>
    </div>
  )
}

export default ItemCounter

