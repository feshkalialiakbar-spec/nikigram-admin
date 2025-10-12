"use client";

import React from "react";
import styles from "./Checkbox.module.scss";
import Text, { Colors } from "../../text/Text";
type Variant = "toggle" | "square";
type Props = {
  id: string;
  title: string;
  subtitle?: string;
  name: string;
  checked: boolean;
  onChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  variant?: Variant;
  direction?: "rtl" | "ltr";
  color?: {
    title: Colors;
    subtitle?: Colors;
  };
};

export default function Checkbox({
  id,
  title,
  subtitle,
  name,
  checked,
  onChangeAction,
  disabled = false,
  direction = "rtl",
  color,
  variant = "toggle",
}: Props) {
  const classNames = [styles["ui-checkbox"]];
  if (checked) classNames.push(styles["active"]);
  if (disabled) classNames.push(styles["disabled"]);
  if (variant) classNames.push(styles[variant]);
  if (direction) classNames.push(styles[direction]);
  return (
    <label className={classNames.join(" ")} htmlFor={id}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChangeAction}
        disabled={disabled}
      />

      {variant === "toggle" ? (
        <span className={styles["toggle-slider"]} />
      ) : (
        <span className={styles["ticked-square"]}>
          {checked && <span className={styles["checked-btn"]} />}
        </span>
      )}
      <div className={styles["toggle-checkbox__content"]}>
        <Text
          textClassName={styles["toggle-checkbox__title"]}
          textTag="h2"
          textStyle="16S5"
          textColor={color?.title || "gray-950"}
          textAlign="right"
          wrap="wrap"
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            textClassName={styles["toggle-checkbox__subtitle"]}
            textTag="h2"
            textStyle="16S4"
            textColor={color?.subtitle || "gray-700"}
            textAlign="right"
            wrap="wrap"
          >
            {subtitle}
          </Text>
        )}
      </div>
    </label>
  );
}
