"use client";
import React, { JSX, ReactNode } from "react";
import styles from "./Button.module.scss";
import { Colors } from "../../text/Text";

type CustomPadding = string;

type PaddingStyles =
  | "thin"
  | "fat"
  | "none"
  | "equal-12"
  | "equal-8"
  | "equal-4"
  | "avg-4-12"
  | "avg-8-12"
  | "avg-8-24"
  | "avg-8-32";
type Modes = "side-rounded" | "full-rounded" | "simple";

/**
 * کامپوننت دکمه عمومی پروژه
 * برای ساخت دکمه‌هایی با رنگ، سایه، حالت و استایل‌های مختلف استفاده می‌شود.
 */
export type ButtonProps = {
  type?: "button" | "submit" | "reset";
  /**
   * مثال: `"primary-700"`
   * @default "transparent"
   */
  bgColor?: Colors | "transparent";

  borderColor?: Colors;

  hoverColor?: Colors;

  shadow?: Colors;

  /**
   * اکثرا side-rounded
   * `"side-rounded"` گوشه‌ گرد، `"full-rounded"` دایره‌ای کامل `"simple"` حالت ساده.
   */
  mode?: Modes;

  /**
   * غیرفعال کردن دکمه
   * وقتی `true` باشد، دکمه غیرقابل کلیک است.
   * @default false
   */
  disabled?: boolean;

  /**
   * true | false.
   */
  fullScreen?: boolean;

  /**
   * اگه استرینگ میدی باید px  باشه
   */
  paddingStyle?: PaddingStyles;
  /**
   * اگه paddingStyle باشه ، کار نمیکنه
   * مثال: (1px 1px)
   */
  customPadding?: CustomPadding;
  /**
   * تابعی که هنگام کلیک روی دکمه اجرا می‌شود.
   */
  onClick?: () => void;

  /**
   * تابعی که هنگام رفتن ماوس روی دکمه اجرا می‌شود.
   */
  onMouseEnter?: () => void;

  /**
   * تابعی که هنگام خروج ماوس از دکمه اجرا می‌شود.
   */
  onMouseLeave?: () => void;

  /**
   * محتوای درونی دکمه
   * معمولاً شامل <Text> یا آیکون است.
   */
  children: ReactNode;

  /**
   * نام کلاس سفارشی برای دکمه
   * برای افزودن استایل اختصاصی.
   */
  buttonClassName?: string;

  /**
   * عنوان دکمه (نمایش در tooltip مرورگر)
   */
  title?: string;

  /**
   * برچسب دسترسی (برای screen reader)
   */
  ariaLabel?: string;

  /**
   * زبان محتوای دکمه (مثلاً "fa" یا "en")
   */
  lang?: string;
};
export default function Button(props: ButtonProps): JSX.Element {
  const {
    type = "button",
    bgColor = "transparent",
    borderColor,
    hoverColor,
    shadow,
    mode,
    disabled = false,
    fullScreen = false,
    paddingStyle,
    customPadding,
    onClick,
    children,
    buttonClassName = "",
    title,
    ariaLabel,
    lang,
    onMouseEnter,
    onMouseLeave,
  }: ButtonProps = props;

  const classNames: string[] = [
    styles["ui-button"],
    buttonClassName ? styles[buttonClassName] : "",
    bgColor ? styles["bgc-" + bgColor] : "",
    hoverColor ? styles["hover-" + hoverColor] : "",
    shadow ? styles["shadow "] : "",
    shadow ? styles["shadow-" + shadow] : "",
    fullScreen ? styles["full-screen"] : "",
    paddingStyle ? styles["padding-style-" + paddingStyle] : "",
    mode ? styles["mode-" + mode] : "",
    disabled ? styles["disabled "] : "",
  ].filter(Boolean);
  if (buttonClassName) classNames.push(buttonClassName);

  return (
    <button
      type={type}
      className={classNames.join(" ")}
      disabled={disabled}
      onClick={onClick ? onClick : () => {}}
      onMouseEnter={onMouseEnter ? onMouseEnter : () => {}}
      onMouseLeave={onMouseLeave ? onMouseLeave : () => {}}
      title={title}
      aria-label={ariaLabel}
      lang={lang}
      style={{
        border: borderColor ? `2px solid  var(--${borderColor})` : "none",
        boxShadow: shadow
          ? `0 1px var(--${shadow as string}), 0 2px var(--${
              shadow as string
            }), 0 3px var(--${shadow as string}), 0 4px var(--${
              shadow as string
            })`
          : "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        pointerEvents: disabled ? "stroke" : "auto",
        padding: customPadding && !paddingStyle ? customPadding : undefined,
      }}
      suppressHydrationWarning
    >
      {children}
    </button>
  );
}
