import React, { useEffect, useState } from "react";
import styles from "./LoadingModal.module.scss";
import Text from "../../text/Text";
import Button from "../../actions/button/Button";

interface LoadingModalProps {
  title?: string;
  description?: string;
  showButton?: boolean;
  buttonText?: string;
  buttonVariant?: "primary" | "secondary" | "danger";
  onButtonClick?: () => void;
  isLoading?: boolean;
  loadingType?:
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20;
}

export default function LoadingModal({
  title,
  description,
  showButton = false,
  buttonText = "بستن",
  buttonVariant: _buttonVariant = "primary",
  onButtonClick,
  loadingType = 5,
}: LoadingModalProps) {
  // State داخلی برای شماره انیمیشن
  const [type, setType] = useState<number>(loadingType);

  // اگر prop تغییر کرد، مقدار state را sync کن
  useEffect(() => {
    setType(loadingType);
  }, [loadingType]);

  // توابع جابجایی
  const next = () => setType((prev) => (prev < 20 ? prev + 1 : 1));
  const prev = () => setType((prev) => (prev > 1 ? prev - 1 : 20));

  // تابع برای نمایش لودینگ‌های مختلف
  const renderLoading = () => {
    switch (type) {
      case 1:
        return (
          <div className={styles["loading-modal__spinner"]}>
            <div className={styles["loading-modal__spinner-ring"]}></div>
            <div className={styles["loading-modal__spinner-ring"]}></div>
            <div className={styles["loading-modal__spinner-ring"]}></div>
          </div>
        );
      case 2:
        return (
          <div className={styles["loading-modal__dots"]}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        );
      case 3:
        return (
          <div className={styles["loading-modal__bar"]}>
            <div></div>
          </div>
        );
      case 4:
        return (
          <div className={styles["loading-modal__bounce"]}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        );
      case 5:
        return <div className={styles["loading-modal__pulse"]}></div>;
      case 6:
        return <div className={styles["loading-modal__dual-ring"]}></div>;
      case 7:
        return (
          <div className={styles["loading-modal__wave"]}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        );
      case 8:
        return (
          <div className={styles["loading-modal__circle"]}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        );
      case 9:
        return (
          <div className={styles["loading-modal__cube"]}>
            <span></span>
            <span></span>
          </div>
        );
      case 10:
        return (
          <div className={styles["loading-modal__custom"]}>LOADING...</div>
        );
      case 11:
        return (
          <div className={styles["loading-modal__clock"]}>
            <span></span>
            <i></i>
          </div>
        );
      case 12:
        return (
          <div className={styles["loading-modal__spiral"]}>
            <span></span>
          </div>
        );
      case 13:
        return (
          <div className={styles["loading-modal__doubletriangle"]}>
            <span></span>
            <i></i>
          </div>
        );
      case 14:
        return (
          <div className={styles["loading-modal__lines"]}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        );
      case 15:
        return (
          <div className={styles["loading-modal__dotline"]}>
            <span></span>
            <div></div>
          </div>
        );
      case 16:
        return (
          <div className={styles["loading-modal__circlewave"]}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        );
      case 17:
        return (
          <div className={styles["loading-modal__fadesquares"]}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        );
      case 18:
        return (
          <div className={styles["loading-modal__arrowfade"]}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        );
      case 19:
        return (
          <div className={styles["loading-modal__scalecircles"]}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        );
      case 20:
        return (
          <div className={styles["loading-modal__loadingtext"]}>
            <span>L</span>
            <span>O</span>
            <span>A</span>
            <span>D</span>
            <span>I</span>
            <span>N</span>
            <span>G</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles["loading-modal"]}>
      <div className={styles["loading-modal__overlay"]}></div>
      <div className={styles["loading-modal__content"]}>
        {/* Loading Animation */}
        {renderLoading()}
        {/* Title */}
        {title && (
          <div className={styles["loading-modal__title"]}>
            <Text textStyle="20S7" textColor="gray-950" textTag="h3">
              {title}
            </Text>
          </div>
        )}
        {/* Description */}
        {description && (
          <div className={styles["loading-modal__description"]}>
            <Text textStyle="16S5" textColor="gray-700" textTag="p">
              {description} ( {type})
            </Text>
          </div>
        )}
        {/* Button */}
        {showButton && (
          <div className={styles["loading-modal__button"]}>
            <Button
              onClick={onButtonClick}
            >
              <Text textStyle="16S5" textColor="main-white" textTag="span">
                {buttonText}
              </Text>
            </Button>
          </div>
        )}
        {/* دکمه‌های قبلی/بعدی */}
        {loadingType && loadingType !== 5 && <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            margin: "16px 0 0 0",
          }}
        >
          <Button
            onClick={prev}
          >
            <Text textStyle="16S5" textColor="main-white" textTag="span">
              قبلی
            </Text>
          </Button>
          <span
            style={{ minWidth: 60, textAlign: "center", fontWeight: "bold" }}
          >
            انیمیشن {type}
          </span>
          <Button
            onClick={next}
          >
            <Text textStyle="16S5" textColor="main-white" textTag="span">
              بعدی
            </Text>
          </Button>
        </div>}
      </div>
    </div>
  );
}
