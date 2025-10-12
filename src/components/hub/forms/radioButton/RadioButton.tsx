"use client";

import React from "react";
import styles from "./RadioButton.module.scss";
import Text, { Colors, TextStyles } from "../text/Text";

export type ButtonMode = "ticked-circle" | "filled-circle" | "ticked-square";

type Props = {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  buttonClass?: string;
  mode?: ButtonMode;
  textDetails: {
    title: {
      size?: TextStyles;
      color?: Colors;
      text: string;
    };
    subtitle?: {
      size?: TextStyles;
      color?: Colors;
      text?: string;
    };
  };
};

export default function RadioButton({
  id,
  name,
  value,
  checked,
  onChangeAction,
  disabled = false,
  buttonClass = "",
  mode = "ticked-circle",
  textDetails,
}: Props) {
  const classNames: string[] = [styles["ui-radio-button"], buttonClass];

  if (disabled) classNames.push(styles["disabled"]);
  if (checked) classNames.push(styles["active"]);

  const buttonMode: string[] = [styles["button-mode"]];
  if (checked) buttonMode.push(styles["active"]);
  buttonMode.push(styles[mode]);

  return (
    <label className={classNames.filter(Boolean).join(" ")} htmlFor={id}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChangeAction}
        disabled={disabled}
      />
      <span className={buttonMode.filter(Boolean).join(" ")}>
        {checked && <span className={styles["checked-btn"]} />}
      </span>
      <div className={styles["radio-button__content"]}>
        <Text
          textClassName={styles["radio-button__title"]}
          textTag="h2"
          textStyle={textDetails?.title.size || "16S5"}
          textColor={textDetails?.title.color || "gray-950"}
          textAlign="right"
          wrap="wrap"
        >
          {textDetails.title.text}
        </Text>
        <Text
          textClassName={styles["radio-button__subtitle"]}
          textTag="h2"
          textStyle={textDetails?.subtitle?.size || "16S4"}
          textColor={textDetails?.subtitle?.color || "gray-700"}
          textAlign="right"
          wrap="wrap"
        >
          {textDetails.subtitle?.text}
        </Text>
      </div>
    </label>
  );
}
