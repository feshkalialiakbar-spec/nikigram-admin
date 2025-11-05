"use client";
import React, { useState } from "react";
import styles from "./CounterButton.module.scss";
import { Add, Minus } from "iconsax-react";
import Button from "../button/Button";
import Text, { Colors } from "../../text/Text";

type Modes = "side-rounded" | "underline" | "simple";
type BorderMode = "full" | "footer";

type CounterButtonProps = {
  bgc?: Colors | "transparent";
  borderColor?: Colors | "none";
  borderMode?: BorderMode;
  hoverColor?: Colors;
  color?: {
    minColor: Colors;
    minTextColor: Colors;
    valueColor: Colors;
    maxColor: Colors;
    maxTextColor: Colors;
  };
  shadow?: Colors;
  mode: Modes;
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  counterButtonClassName?: string;
};

export default function CounterButton({
  bgc = "primary-100",
  borderColor,
  hoverColor,
  color = {
    minColor: "main-white",
    minTextColor: "primary-700",
    valueColor: "primary-700",
    maxTextColor: "primary-700",
    maxColor: "main-white",
  },
  shadow,
  borderMode,
  mode,
  initialValue = 0,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  counterButtonClassName,
}: CounterButtonProps) {
  const [value, setValue] = useState(initialValue);

  const classNames: string[] = [styles["ui-counter-button"]];
  if (bgc) classNames.push(styles["bgc-" + bgc]);
  if (hoverColor) classNames.push(styles["hover-" + hoverColor]);
  if (shadow) classNames.push(styles["shadow shadow-" + shadow]);
  if (borderColor) classNames.push(styles["border border-" + borderColor]);
  if (borderMode) classNames.push(styles["border-mode-" + borderMode]);
  if (mode) classNames.push(styles["mode mode-" + mode]);
  if (counterButtonClassName) classNames.push(styles[counterButtonClassName]);

  const handleIncrement = () => {
    const newValue = Math.min(value + step, max);
    setValue(newValue);
    onChange?.(newValue);
  };
  const handleDecrement = () => {
    const newValue = Math.max(value - step, min);
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={classNames.join(" ")}>
      <Button
        bgColor={color.minColor}
        onClick={handleDecrement}
        disabled={value <= min}
        ariaLabel="کم کردن"
        mode="side-rounded"
        paddingStyle="none"
      >
        <Minus size="24" style={{ color: `var(--${color.minTextColor})` }} />
      </Button>
      <Text
        textStyle="16S5"
        textColor={color.valueColor}
        textTag="p"
        wrap="wrap"
        textAlign="center"
        title="تعداد"
        lang="fa"
        textClassName="value"
        noTransition={true}
      >
        {value}
      </Text>
      <Button
        bgColor={color.maxColor}
        onClick={handleIncrement}
        disabled={value >= max}
        ariaLabel="افزودن"
        mode="side-rounded"
        paddingStyle="none"
      >
        <Add size="24" style={{ color: `var(--${color.maxTextColor})` }} />
      </Button>
    </div>
  );
}
