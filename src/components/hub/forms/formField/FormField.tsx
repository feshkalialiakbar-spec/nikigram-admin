import React from "react";
import { TagUser } from "iconsax-react";
import TextField, { IconProps } from "@/components/ui/forms/textField/TextField";
import Dropdown from "@/components/ui/forms/dropdown/Dropdown";
import CustomCalender from "@/components/global/customCalender/CustomCalender";
import RadioButton from "@/components/ui/forms/radioButton/RadioButton";
import Styles from "./FormField.module.scss";
import { Colors, TextStyles } from "@/components/ui/text/Text";

interface FormFieldProps {
  type: "text" | "dropdown" | "calendar" | "radio";
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  error?: string;
  isFocused: boolean;
  isEditing: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  dateRange?: { 
    type: "birthday" | "future" | "custom"; 
    minAge?: number; 
    maxAge?: number;
    minDate?: Date;
    maxDate?: Date;
  };
  radioOptions?: Array<{ label: string; value: string }>;
  name?: string;
  className?: string;
  disabled?: boolean;
  isTextArea?: boolean;
  leftContent?: IconProps;
  rightContent?: IconProps;
  rows?: number;
  size?: "sm" | "md";
  textDetails?: {
    title: {
      size?: TextStyles;
      color?: Colors;
      text?: string;
    };
    subtitle?: {
      size?: TextStyles;
      color?: Colors;
      text?: string;
    };
  };
}

export const FormField: React.FC<FormFieldProps> = ({
  type,
  id,
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  isFocused,
  isEditing,
  placeholder,
  options,
  dateRange,
  radioOptions,
  name,
  className,
  disabled,
  isTextArea,
  leftContent,
  rightContent,
  rows,
  size,
  textDetails,
}) => {
  const baseColor = {
    borderAndLabel: "gray-300" as Colors,
    inputBgColor: "main-white" as Colors,
    textInput: "gray-950" as Colors,
    textError: "error-900" as Colors,
    listTextColor: "gray-950" as Colors,
    listBgColor: "main-white" as Colors,
  };

  const errorIcon = isFocused && !isEditing && error
    ? {
        Icon: TagUser,
        iconColor: "var(--error-900)",
        iconSize: "16",
        variant: "Bulk" as const,
        text: error,
      }
    : undefined;

  switch (type) {
    case "text":
      return (
        <TextField
          placeholder={placeholder}
          id={id}
          label={label}
          value={value}
          onChangeAction={onChange}
          baseColor={baseColor}
          onFocus={onFocus}
          onBlur={onBlur}
          errorIcon={errorIcon}
          className={className}
          disabled={disabled}
          isTextArea={isTextArea}
          leftContent={leftContent}
          rightContent={rightContent}
          rows={rows}
          size={size}
        />
      );

    case "dropdown":
      return (
        <Dropdown
          placeholder={placeholder}
          id={id}
          label={label}
          value={value}
          onChangeAction={onChange}
          options={options || []}
          baseColor={baseColor}
          errorIcon={errorIcon}
          size="sm"
          onFocus={onFocus}
          onBlur={onBlur}
        />
      );

    case "calendar":
      return (
        <CustomCalender
          setDate={onChange}
          placeholder={placeholder}
          value={value}
          onChangeAction={onChange}
          baseColor={baseColor}
          size="sm"
          errorIcon={errorIcon}
          label={label}
          dateRange={dateRange}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      );

    case "radio":
      return (
        <div className={Styles["form-field__radio-row"]}>
          <span className={Styles["form-field__radio-label"]}>
            {label}
          </span>
          <div className={Styles["form-field__radio-group"]}>
            {radioOptions?.map((option) => (
              <RadioButton
                key={option.value}
                id={`${id}-${option.value}`}
                name={name || id}
                value={option.value}
                checked={value === option.value}
                onChangeAction={() => onChange(option.value)}
                mode="filled-circle"
                textDetails={{
                  title: { 
                    size: textDetails?.title?.size || "14S5", 
                    color: textDetails?.title?.color || "gray-950", 
                    text: textDetails?.title?.text || option.label 
                  },
                  subtitle: textDetails?.subtitle
                }}
                disabled={disabled} 
                buttonClass={className}  
              />
            ))}
          </div>
          {isFocused && !isEditing && error && (
            <span className={Styles["form-field__radio-error"]}>
              {error}
            </span>
          )}
        </div>
      );

    default:
      return null;
  }
}; 