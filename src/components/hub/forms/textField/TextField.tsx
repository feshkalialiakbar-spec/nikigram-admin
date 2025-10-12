import React, { useState, forwardRef } from "react";
import styles from "./TextField.module.scss";
import { Icon } from "iconsax-react";
import { normalizeDigits } from "@/utils/numberUtils";
import Text, { Colors } from "../text/Text";

type Sizes = "xsm" | "sm" | "md";
type IconMode = "Linear" | "Bulk" | "Outline" | "TwoTone";

export type IconProps = {
  Icon?: typeof Icon;
  iconColor?: string;
  iconSize?: string | number;
  variant?: IconMode;
};

export interface TextFieldProps {
  baseColor?: {
    borderAndLabel?: Colors;
    inputBgColor?: Colors;
    textInput?: Colors;
    textError?: Colors;
  };
  id?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeAction: (value: string) => void;
  rightContent?: IconProps;
  leftContent?: IconProps & { onClick?: () => void };
  leftContentText?: string;
  leftContentNode?: React.ReactNode;
  disabled?: boolean;
  errorIcon?: IconProps & { text: string };
  className?: string;
  size?: Sizes;
  onBlur?: () => void;
  onFocus?: () => void;
  isTextArea?: boolean;
  rows?: number;
  minLength?: number;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  onKeyDown?: React.KeyboardEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
  autoFocus?: boolean;
  type?: React.HTMLInputTypeAttribute;
  normalizeDigits?: boolean; // Auto-normalize Persian/Arabic digits to English
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      id,
      label,
      placeholder,
      value,
      onChangeAction,
      baseColor,
      rightContent = {},
      leftContent = {},
      leftContentText,
      leftContentNode,
      disabled = false,
      errorIcon,
      className = "",
      size,
      onBlur,
      onFocus,
      isTextArea = false,
      rows = 3,
      minLength,
      maxLength,
      inputMode,
      onKeyDown,
      autoFocus = false,
      type = "text",
      normalizeDigits: shouldNormalizeDigits = false,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const isFloating = isFocused || (value?.length ?? 0) > 0;

    // Handler to normalize digits if enabled
    const handleChange = (newValue: string) => {
      const processedValue = shouldNormalizeDigits
        ? normalizeDigits(newValue)
        : newValue;
      onChangeAction(processedValue);
    };

    const getClassNames = () => {
      const classes: string[] = [styles["text-field"]];
      if (className) classes.push(className);
      if (isFloating) classes.push(styles["floating"]);
      if (disabled) classes.push(styles["disabled"]);
      if (rightContent.Icon) classes.push(styles["right-icon"]);
      if (leftContent.Icon) classes.push(styles["left-icon"]);
      if (size) classes.push(styles["size"], styles["size-" + size]);
      if (isTextArea) classes.push(styles["text-area"]);
      return classes.filter(Boolean).join(" ");
    };

    return (
      <div className={styles["text-field-container"]}>
        <div
          className={getClassNames()}
          style={{
            borderColor: `var(--${baseColor?.borderAndLabel || "main-black"})`,
            backgroundColor: `var(--${baseColor?.inputBgColor || "main-white"
              })`,
          }}
        >
          {rightContent.Icon && (
            <div className={styles["text-field__icon"]}>
              <rightContent.Icon
                size={rightContent.iconSize}
                color={rightContent.iconColor}
                variant={rightContent.variant || "Linear"}
              />
            </div>
          )}

          <div className={styles["text-field__input-wrapper"]}>
            {label && (
              <Text
                textTag="label"
                textStyle="14S5"
                textColor={baseColor?.textInput || "main-black"}
                htmlFor={id}
                fontFamily="moraba"
                wrap="wrap"
                textAlign="right"
                bgColor={baseColor?.inputBgColor || "main-black"}
                textClassName={`${styles["text-field__label"]} ${isFloating ? styles["text-field__label--floating"] : ""
                  } ${isTextArea ? styles["text-field__label--textarea"] : ""}`}
              >
                {label}
              </Text>
            )}

            {isTextArea ? (
              <textarea
                id={id}
                value={value ?? ""}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={() => {
                  setIsFocused(true);
                  onFocus?.();
                }}
                onBlur={() => {
                  setIsFocused(false);
                  onBlur?.();
                }}
                placeholder={isFloating ? placeholder : ""}
                disabled={disabled}
                className={styles["text-field__input-textarea"]}
                rows={rows}
                minLength={minLength}
                maxLength={maxLength}
                inputMode={inputMode}
                onKeyDown={onKeyDown}
                autoFocus={autoFocus}
              />
            ) : (
              <input
                ref={ref}
                type={type}
                id={id}
                value={value ?? ""}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={() => {
                  setIsFocused(true);
                  onFocus?.();
                }}
                onBlur={() => {
                  setIsFocused(false);
                  onBlur?.();
                }}
                placeholder={isFloating ? placeholder : ""}
                disabled={disabled}
                className={styles["text-field__input"]}
                minLength={minLength}
                maxLength={maxLength}
                inputMode={inputMode}
                onKeyDown={onKeyDown}
                autoFocus={autoFocus}
              />
            )}
          </div>

          {leftContent.Icon && (
            <div className={styles["text-field__icon text-field__icon--right"]}>
              <leftContent.Icon
                size={leftContent.iconSize}
                color={leftContent.iconColor}
                variant={leftContent.variant || "Linear"}
                onClick={leftContent.onClick}
                style={{
                  cursor: leftContent.onClick ? "pointer" : "default",
                }}
              />
            </div>
          )}
          {!leftContent.Icon && leftContentText && (
            <div className={styles["text-field__text-left"]}>
              <Text
                textStyle="14S4"
                textColor={"main-black"}
                wrap="wrap"
                textAlign="left"
              >
                {leftContentText}
              </Text>
            </div>
          )}
          {!leftContent.Icon && !leftContentText && leftContentNode
            ? leftContentNode
            : undefined}
        </div>

        {errorIcon && (
          <div className={styles["text-field__helper"]}>
            {errorIcon.Icon && (
              <errorIcon.Icon
                size={errorIcon.iconSize || "16"}
                color={errorIcon.iconColor || "#999"}
                variant={errorIcon.variant || "Linear"}
              />
            )}
            <Text
              textTag="span"
              textStyle="10S4"
              textColor={baseColor?.textError || "main-black"}
              wrap="wrap"
              textAlign="right"
              fontFamily="moraba"
            >
              {errorIcon.text}
            </Text>
          </div>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";
export default TextField;
