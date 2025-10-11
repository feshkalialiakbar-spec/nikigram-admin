import React, { useState } from "react";
import styles from "./NikiInputAmountWalletSection.module.scss";
import Text from "@/components/ui/text/Text";
import TextField from "@/components/ui/forms/textField/TextField";
import Button from "@/components/ui/actions/button/Button";

interface NikiInputAmountWalletSectionProps {
  availableBalance?: number;
  onAmountChange?: (amount: number) => void;
  maxAmount?: number;
}

export default function NikiInputAmountWalletSection({
  availableBalance = 0,
  onAmountChange,
  maxAmount,
}: NikiInputAmountWalletSectionProps) {
  const [amount, setAmount] = useState(0);
  const [displayValue, setDisplayValue] = useState("");
  const [error, setError] = useState("");
  const maxAllowedAmount = maxAmount || availableBalance;

  // تابع فرمت سه رقم سه رقم با نقطه
  function formatNumberWithDots(value: string) {
    if (!value) return "";
    // حذف صفرهای ابتدایی
    value = value.replace(/^0+/, "");
    // حذف هر چیزی غیر از عدد
    value = value.replace(/\D/g, "");
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // فقط ارقام را نگه می‌دارد و فرمت نمایش جداست
  const handleAmountChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length > 15) {
      // محدودیت معقول برای جلوگیری از اعداد خیلی بزرگ
      return;
    }
    
    const inputAmount = parseInt(digitsOnly) || 0;
    
    // بررسی محدودیت موجودی
    if (inputAmount > maxAllowedAmount) {
      setError(`مقدار وارد شده نمی‌تواند از ${maxAllowedAmount.toLocaleString('fa-IR')} نیکی بیشتر باشد`);
      return;
    } else {
      setError("");
    }
    
    setAmount(inputAmount);
    setDisplayValue(formatNumberWithDots(inputAmount.toString()));
    onAmountChange?.(inputAmount);
  };

  // جلوگیری از ورود غیر عدد
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, and navigation keys
    if ([8, 9, 27, 13, 46, 37, 38, 39, 40].includes(e.keyCode)) {
      return;
    }
    // Allow only numbers
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className={styles["niki-input-amount-wallet-section"]}>
      <Text textStyle="16S7" textColor="gray-700">
        مقدار نیکی مورد نظر را وارد کنید.
      </Text>
      <TextField
        type="text"
        placeholder="نیکی"
        size="sm"
        baseColor={{
          textInput: "gray-800",
          borderAndLabel: "gray-300",
          inputBgColor: "main-white",
          textError: "error-500",
        }}
        label="مقدار نیکی"
        leftContentText={amount ? "نیکی" : ""}
        value={displayValue}
        onChangeAction={handleAmountChange}
        onKeyDown={handleKeyDown}
        inputMode="numeric"
        maxLength={20}
      />
      {error && (
        <div className={styles["error-message"]}>
          <Text textStyle="14S5" textColor="error-500">
            {error}
          </Text>
        </div>
      )}
      <div className={styles["niki-input-amount-wallet-section__buttons"]}>
        <Button
          borderColor={amount === 50 ? "primary-500" : "gray-400"}
          mode="side-rounded"
          paddingStyle="equal-8"
          onClick={() => {
            const newAmount = 50;
            if (newAmount <= maxAllowedAmount) {
              setAmount(newAmount);
              setDisplayValue(formatNumberWithDots(newAmount.toString()));
              onAmountChange?.(newAmount);
              setError("");
            } else {
              setError(`مقدار وارد شده نمی‌تواند از ${maxAllowedAmount.toLocaleString('fa-IR')} نیکی بیشتر باشد`);
            }
          }}
          fullScreen={true}
        >
          <Text
            textStyle="14S5"
            textColor={amount === 50 ? "primary-500" : "gray-400"}
          >
            50 نیکی
          </Text>
        </Button>
        <Button
          borderColor={amount === 100 ? "primary-500" : "gray-400"}
          mode="side-rounded"
          paddingStyle="equal-8"
          onClick={() => {
            const newAmount = 100;
            if (newAmount <= maxAllowedAmount) {
              setAmount(newAmount);
              setDisplayValue(formatNumberWithDots(newAmount.toString()));
              onAmountChange?.(newAmount);
              setError("");
            } else {
              setError(`مقدار وارد شده نمی‌تواند از ${maxAllowedAmount.toLocaleString('fa-IR')} نیکی بیشتر باشد`);
            }
          }}
          fullScreen={true}
        >
          <Text
            textStyle="14S5"
            textColor={amount === 100 ? "primary-500" : "gray-400"}
          >
            100 نیکی
          </Text>
        </Button>
        <Button
          borderColor={amount === 150 ? "primary-500" : "gray-400"}
          mode="side-rounded"
          paddingStyle="equal-8"
          onClick={() => {
            const newAmount = 150;
            if (newAmount <= maxAllowedAmount) {
              setAmount(newAmount);
              setDisplayValue(formatNumberWithDots(newAmount.toString()));
              onAmountChange?.(newAmount);
              setError("");
            } else {
              setError(`مقدار وارد شده نمی‌تواند از ${maxAllowedAmount.toLocaleString('fa-IR')} نیکی بیشتر باشد`);
            }
          }}
          fullScreen={true}
        >
          <Text
            textStyle="14S5"
            textColor={amount === 150 ? "primary-500" : "gray-400"}
          >
            150 نیکی
          </Text>
        </Button>
      </div>
    </div>
  );
}
