import React from 'react'
import styles from './OpenModal.module.scss'
import Text from '@/components/ui/text/Text'
import { CloseCircle } from 'iconsax-react'

interface OpenModalProps {
  isOpen: boolean
  onClose: () => void
  modalTitle: string
  modalContent?: React.ReactNode
  modalFooter?: React.ReactNode
}

const OpenModal: React.FC<OpenModalProps> = ({
  isOpen,
  onClose,
  modalTitle,
  modalContent,
  modalFooter,
}) => {
  if (!isOpen) return null

  return (
    <div className={styles['modal-overlay']} onClick={onClose}>
      <div
        className={styles['modal-container']}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles['modal-header']}>
          <Text textStyle="18S7" textColor="gray-950" textTag="h2">
            {modalTitle}
          </Text>
          <button
            className={styles['modal-close-button']}
            onClick={onClose}
            type="button"
            aria-label="Close modal"
          >
            <CloseCircle size={24} variant="Outline" />
          </button>
        </div>
        <div className={styles['modal-content']}>{modalContent}</div>
        {modalFooter && (
          <div className={styles['modal-footer']}>{modalFooter}</div>
        )}
      </div>
    </div>
  )
}

export default OpenModal

