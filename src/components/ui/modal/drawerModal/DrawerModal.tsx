import React, { useState } from "react";
import styles from "./DrawerModal.module.scss";
import { CloseCircle } from "iconsax-react";

interface DrawerModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function DrawerModal({
  children,
  isOpen,
  setIsOpen,
}: DrawerModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  if (!isOpen) return null;

  return (
    <div className={styles["drawer-modal"]}>
      <div
        className={`${styles["drawer-modal__cover"]} ${
          isClosing ? styles.closing : ""
        }`}
        onClick={handleClose}
      ></div>
      <div
        className={`${styles["drawer-modal__body"]} ${
          isClosing ? styles.closing : ""
        }`}
      >
        <CloseCircle
          size={24}
          color="var(--error-500)"
          variant="Bulk"
          className={styles["drawer-modal__body-close-btn"]}
          onClick={handleClose}
        />
        {children}
      </div>
    </div>
  );
}
