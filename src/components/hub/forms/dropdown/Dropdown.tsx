"use client";

import React, { useState, useRef } from "react";
import styles from "./Dropdown.module.scss";
import Text, { Colors } from "../text/Text";
import { ArrowDown3, Icon } from "iconsax-react";
import useClickOutside from "@/hooks/useClickOutside";

type Sizes = "sm" | "md";
type IconMode = "Linear" | "Bulk" | "Outline" | "TwoTone";
type IconProps = {
  Icon?: typeof Icon;
  iconColor?: string;
  iconSize?: string | number;
  variant?: IconMode;
};
interface DropdownProps {
  baseColor?: {
    borderAndLabel?: Colors;
    inputBgColor?: Colors;
    textInput?: Colors;
    textError?: Colors;
    listTextColor?: Colors;
    listBgColor?: Colors;
  };
  id?: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChangeAction: (value: string) => void;
  disabled?: boolean;
  errorIcon?: IconProps & { text: string };
  className?: string;
  size?: Sizes;
  options: { label: string; value: string }[];
  onFocus?: () => void;
  onBlur?: () => void;
  showSearch?: boolean;
}

export default function Dropdown({
  id,
  label,
  placeholder,
  value,
  onChangeAction,
  baseColor,
  disabled = false,
  errorIcon,
  className = "",
  size,
  options,
  onFocus,
  onBlur,
  showSearch = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isFloating = value.length > 0;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useClickOutside(dropdownRef, () => {
    if (isOpen) {
      setIsOpen(false);
      onBlur?.();
    }
  });

  const handleSelect = (selectedValue: string) => {
    onChangeAction(selectedValue);
    setIsOpen(false);
    onBlur?.();
  };

  const getClassNames = () => {
    const classes: string[] = [styles["ui-dropdown-button"]];

    if (className) classes.push(className);
    if (isFloating) classes.push(styles["floating"]);
    if (disabled) classes.push(styles["disabled"]);
    if (size) classes.push(styles["size"], styles["size-" + size]);
    if (isOpen) classes.push(styles["open"]);

    return classes.filter(Boolean).join(" ");
  };

  const filteredOptions = showSearch && searchQuery.trim().length > 0
    ? options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.trim().toLowerCase())
    )
    : options;

  return (
    <div
      className={styles["ui-dropdown-container"]}
      ref={dropdownRef}
      style={{
        marginBottom: errorIcon === undefined ? "0" : "16px",
        borderColor: `var(--${baseColor?.borderAndLabel || "main-black"})`,
        backgroundColor: `var(--${baseColor?.inputBgColor || "main-white"})`,
      }}
    >
      <div
        className={getClassNames()}
        onClick={() => {
          if (!disabled) {
            const opening = !isOpen;
            setIsOpen(opening);
            if (opening) {
              setSearchQuery("");
              onFocus?.();
            }
          }
        }}
        style={{
          borderColor: `var(--${baseColor?.borderAndLabel || "gray-500"})`,
        }}
      >
        <div className={styles["ui-dropdown-button__input-wrapper"]}>
          {label && (
            <Text
              textTag="label"
              textStyle={isFloating ? "14S5" : "14S4"}
              textColor={baseColor?.textInput || "main-black"}
              htmlFor={id}
              fontFamily="moraba"
              wrap="wrap"
              textAlign="right"
              bgColor={"main-white"}
              textClassName={`${styles["ui-dropdown-button__label"]} ${isFloating ? styles["ui-dropdown-button__label--floating"] : ""
                }`}
            >
              {label}
            </Text>
          )}
          <div className={styles["ui-dropdown-button__input"]}>
            {options.find((option) => option.value === value)?.label || placeholder}
          </div>
        </div>
        <div
          className={
            styles["ui-dropdown-button__icon"] +
            styles[" ui-dropdown-button__icon--right"]
          }
          style={{
            paddingTop: "3px",
          }}
        >
          <ArrowDown3
            size="16"
            color={`var(--${baseColor?.borderAndLabel || "gray-500"})`}
            variant="Bulk"
          />
        </div>
      </div>
      {isOpen && (
        <div
          className={styles["ui-dropdown-list"]}
          style={{
            borderColor: `var(--${baseColor?.borderAndLabel || "main-black"})`,
            backgroundColor: `var(--${baseColor?.listBgColor || "main-white"})`,
          }}
        >
          {showSearch && (
            <div style={{ padding: "8px" }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو"
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: `1px solid var(--${baseColor?.borderAndLabel || "gray-300"})`,
                  outline: "none",
                  backgroundColor: `var(--${baseColor?.inputBgColor || "main-white"})`,
                  color: `var(--${baseColor?.textInput || "main-black"})`,
                }}
              />
            </div>
          )}
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              className={styles["ui-dropdown-list__item"]}
              onClick={() => handleSelect(option.value)}
              style={{
                color: `var(--${baseColor?.listTextColor || "gray-950"})`,
              }}
            >
              {option.label}
            </div>
          ))}
          {filteredOptions.length === 0 && (
            <div
              className={styles["ui-dropdown-list__item"]}
              style={{
                color: `var(--${baseColor?.listTextColor || "gray-600"})`,
                cursor: "default",
              }}
            >
              موردی یافت نشد
            </div>
          )}
        </div>
      )}
      {errorIcon && (
        <div
          className={styles["ui-dropdown-button__helper"]}
          style={{
            top: size === "md" ? "80px" : "40px",
          }}
        >
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
