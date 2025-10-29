import React from "react";
import styles from "./Modal.module.scss";
import { CloseCircle } from "iconsax-react";
import Text from "../text/Text";
import useWindowWidth from "@/hooks/useWindowWidth";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  headerIcon?: React.ReactNode;
  body: React.ReactNode;
  footer: React.ReactNode;
  customWidth?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  headerIcon = <></>,
  body,
  footer,
  customWidth,
}: ModalProps) {
  const { width, hydrated } = useWindowWidth();
  const isDesktop = hydrated && width >= 1280;

  if (!isOpen) return null;

  return (
    <div
      className={`${styles["ui-modal"]} ${
        isOpen ? styles["ui-modal--open"] : ""
      }`}
    >
      <div className={styles["ui-modal__overlay"]} onClick={onClose}></div>
      <div
        className={styles["ui-modal__content"]}
        style={{
          maxWidth: isDesktop ? (customWidth ? customWidth : "628px") : "100%",
        }}
      >
        <div className={styles["ui-modal__header"]}>
          <CloseCircle
            size="24"
            className={styles["ui-modal__close-icon"]}
            color="var(--error-700)"
            variant="Bulk"
            onClick={onClose}
          />
          {title && (
            <div className={styles["ui-modal__title-wrapper"]}>
              {headerIcon}
              <Text
                textColor="gray-950"
                fontFamily="moraba"
                textTag="p"
                textStyle="14S7"
                textAlign="right"
              >
                {title}
              </Text>
            </div>
          )}
        </div>
        <div className={styles["ui-modal__body"]}>{body}</div>
        {footer && <div className={styles["ui-modal__footer"]}>{footer}</div>}
      </div>
    </div>
  );
}
