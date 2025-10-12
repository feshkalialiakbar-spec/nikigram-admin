import React, { JSX, ReactNode } from "react";
import styles from "./Text.module.scss";

type TextTags =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "span"
  | "p"
  | "strong"
  | "em"
  | "b"
  | "label";
export type TextStyles =
  | "40S7"
  | "40S5"
  | "40S4"
  | "36S7"
  | "36S5"
  | "36S4"
  | "32S7"
  | "32S5"
  | "32S4"
  | "28S7"
  | "28S5"
  | "28S4"
  | "24S7"
  | "24S5"
  | "24S4"
  | "22S7"
  | "22S5"
  | "22S4"
  | "20S7"
  | "20S5"
  | "20S4"
  | "18S7"
  | "18S5"
  | "18S4"
  | "16S7"
  | "16S5"
  | "16S4"
  | "14S7"
  | "14S5"
  | "14S4"
  | "12S7"
  | "12S5"
  | "12S4"
  | "10S7"
  | "10S5"
  | "10S4"
  | "8S7"
  | "8S5"
  | "8S4";
export type Colors =
  | "primary-950"
  | "primary-900"
  | "primary-800"
  | "primary-700"
  | "primary-600"
  | "primary-500"
  | "primary-400"
  | "primary-300"
  | "primary-200"
  | "primary-100"
  | "primary-50"
  | "secondary1-950"
  | "secondary1-900"
  | "secondary1-800"
  | "secondary1-700"
  | "secondary1-600"
  | "secondary1-500"
  | "secondary1-400"
  | "secondary1-300"
  | "secondary1-200"
  | "secondary1-100"
  | "secondary1-50"
  | "secondary2-950"
  | "secondary2-900"
  | "secondary2-800"
  | "secondary2-700"
  | "secondary2-600"
  | "secondary2-500"
  | "secondary2-400"
  | "secondary2-300"
  | "secondary2-200"
  | "secondary2-100"
  | "secondary2-50"
  | "error-950"
  | "error-900"
  | "error-800"
  | "error-700"
  | "error-600"
  | "error-500"
  | "error-400"
  | "error-300"
  | "error-200"
  | "error-100"
  | "error-50"
  | "success-950"
  | "success-900"
  | "success-800"
  | "success-700"
  | "success-600"
  | "success-500"
  | "success-400"
  | "success-300"
  | "success-200"
  | "success-100"
  | "success-50"
  | "gray-950"
  | "gray-900"
  | "gray-800"
  | "gray-700"
  | "gray-600"
  | "gray-500"
  | "gray-400"
  | "gray-300"
  | "gray-200"
  | "gray-100"
  | "gray-50"
  | "main-black"
  | "main-white"
  | "main-bg"
  | "inherit"
  | "transparent"
  | "none";
type FontFamily = "iran-sans" | "moraba";
export type TextProps = {
  textStyle?: TextStyles;
  textColor?: Colors;
  bgColor?: Colors;
  wrap?: "nowrap" | "wrap";
  textTag?: TextTags;
  textAlign?: "right" | "center" | "left";
  noTransition?: boolean;
  hoverColor?: Colors;
  children: ReactNode;
  textClassName?: string;
  title?: string;
  ariaLabel?: string;
  lang?: string;
  htmlFor?: string;
  fontFamily?: FontFamily;
  userSelect?: "not-selected" | "auto";
};

export default function Text(props: TextProps): JSX.Element {
  const {
    textStyle = "14S5",
    textColor = "main-black",
    bgColor,
    wrap = "wrap",
    textTag = "p",
    textAlign = "center",
    noTransition,
    textClassName,
    hoverColor,
    children,
    title,
    ariaLabel,
    lang,
    htmlFor,
    fontFamily,
    userSelect,
  }: TextProps = props;
  const classNames: string[] = [
    styles["ui-text"],
    textClassName ? styles[textClassName] : "",
    styles["typo-" + textStyle],
    styles["text-color-" + textColor],
    styles["text-align-" + textAlign],
    styles["wrapper-" + wrap],
    noTransition ? styles["no-transition"] : "",
    fontFamily ? styles["font-family-" + fontFamily] : "",
    hoverColor ? styles["hover-color-" + hoverColor] : "",
    userSelect ? styles["user-select-" + userSelect] : "",
  ].filter(Boolean);
  if (textClassName) classNames.push(textClassName);

  return React.createElement(
    textTag,
    {
      className: classNames.join(" "),
      title,
      "aria-label": ariaLabel,
      lang,
      htmlFor: htmlFor,
      style: {
        backgroundColor: bgColor ? `var(--${bgColor})` : undefined,
      },
    },
    children
  );
}
