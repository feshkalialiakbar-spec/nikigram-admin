import React from "react";
import styles from "./DepositNikiInDeviceWalletSection.module.scss";
import RadioButton from "@/components/ui/forms/radioButton/RadioButton";

interface DepositNikiInDeviceWalletSectionProps {
  selectedOption: string;
  onOptionChange: (option: string) => void;
  actionType?: string; // نوع عملیات: افزایش، عودت، ارسال، دریافت
}

export default function DepositNikiInDeviceWalletSection({
  selectedOption,
  onOptionChange,
  actionType = "افزایش", // مقدار پیش‌فرض
}: DepositNikiInDeviceWalletSectionProps) {
  return (
    <div className={styles["deposit-niki-in-device-wallet-section"]}>
      <RadioButton
        id="increase-same-device"
        name="increase-option"
        textDetails={{
          title: {
            text: `${actionType} نیکی در همین دستگاه`,
            size: "14S5",
            color: "gray-950",
          },
        }}
        value="same-device"
        mode="filled-circle"
        checked={selectedOption === "same-device"}
        onChangeAction={() => onOptionChange("same-device")}
      />
      <RadioButton
        id="increase-other-devices"
        name="increase-option"
        textDetails={{
          title: {
            text: `${actionType} نیکی در دستگاه‌های دیگر`,
            size: "14S5",
            color: "gray-950",
          },
        }}
        value="other-devices"
        mode="filled-circle"
        checked={selectedOption === "other-devices"}
        onChangeAction={() => onOptionChange("other-devices")}
      />
    </div>
  );
}
