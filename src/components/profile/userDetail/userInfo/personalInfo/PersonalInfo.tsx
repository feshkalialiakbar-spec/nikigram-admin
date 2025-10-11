//
import { useSelector } from "react-redux";
import TextField from "@/components/ui/forms/textField/TextField";
import Dropdown from "@/components/ui/forms/dropdown/Dropdown";
import CustomCalender from "@/components/global/customCalender/CustomCalender";
import { User } from "iconsax-react";
import {
  validateName,
  validateLastName,
  validatePhoneNumber,
  validateNationalCode,
  validateGender,
  validateDate,
} from "@/validations/NeedHelpValidations";
import { FormEditing, FormErrors, FormFocus, FormState } from "@/hooks/useForm";
import styles from "./PersonalInfo.module.scss";

interface UserInfo {
  firstName?: string;
  lastName?: string;
  nationalCode?: string;
  mobile?: string;
  phone?: string;
  gender?: string;
  birthDate?: string;
  education?: string;
  alias?: string;
  bio?: string;
}

type PersonalInfoProps = {
  values: FormState;
  errors: FormErrors;
  focused: FormFocus;
  isEditing: FormEditing;
  handleChange: (
    field: keyof FormState,
    value: string | boolean | File | null
  ) => void;
  handleFocus: (field: keyof FormState) => void;
  handleBlur: <T extends keyof FormState>(
    field: T,
    validator?: (value: FormState[T]) => string
  ) => void;
  educationOptions: { label: string; value: string }[];
};

export default function PersonalInfo({
  values,
  errors,
  focused,
  isEditing,
  handleChange,
  handleFocus,
  handleBlur,
  educationOptions,
}: PersonalInfoProps) {
  const user = useSelector((state: { user: UserInfo }) => state.user);

  return (
    <>
      <div className={styles["personal-info__fields-dual-input"]}>
        <TextField
          baseColor={{
            borderAndLabel: "gray-300",
            inputBgColor: "main-white",
            textInput: "gray-950",
            textError: "error-900",
          }}
          size="sm"
          placeholder="نام"
          id="firstName"
          label="نام"
          value={values.name !== undefined ? values.name : (user.firstName || "")}
          onChangeAction={(value) => handleChange("name", value)}
          onFocus={() => handleFocus("name")}
          onBlur={() => handleBlur("name", validateName)}
          errorIcon={
            focused.name && !isEditing.name && errors.name
              ? {
                  Icon: User,
                  iconColor: "var(--error-900)",
                  iconSize: "16",
                  variant: "Bulk",
                  text: errors.name,
                }
              : undefined
          }
        />
        <TextField
          baseColor={{
            borderAndLabel: "gray-300",
            inputBgColor: "main-white",
            textInput: "gray-950",
            textError: "error-900",
          }}
          size="sm"
          placeholder="نام خانوادگی"
          id="lastName"
          label="نام خانوادگی"
          value={values.lastName !== undefined ? values.lastName : (user.lastName || "")}
          onChangeAction={(value) => handleChange("lastName", value)}
          onFocus={() => handleFocus("lastName")}
          onBlur={() => handleBlur("lastName", validateLastName)}
          errorIcon={
            focused.lastName && !isEditing.lastName && errors.lastName
              ? {
                  Icon: User,
                  iconColor: "var(--error-900)",
                  iconSize: "16",
                  variant: "Bulk",
                  text: errors.lastName,
                }
              : undefined
          }
        />
      </div>
      <div className={styles["personal-info__fields-dual-input"]}>
        <TextField
          baseColor={{
            borderAndLabel: "gray-300",
            inputBgColor: "main-white",
            textInput: "gray-950",
            textError: "error-900",
          }}
          size="sm"
          placeholder="کدملی"
          id="nationalId"
          label="کدملی"
          value={values.nationalCode !== undefined ? values.nationalCode : (user.nationalCode || "")}
          onChangeAction={(value) => {
            const numericValue = value.replace(/[^0-9]/g, "");
            const truncatedValue = numericValue.slice(0, 10);
            handleChange("nationalCode", truncatedValue);
          }}
          onFocus={() => handleFocus("nationalCode")}
          onBlur={() => handleBlur("nationalCode", validateNationalCode)}
          errorIcon={
            focused.nationalCode &&
            !isEditing.nationalCode &&
            errors.nationalCode
              ? {
                  Icon: User,
                  iconColor: "var(--error-900)",
                  iconSize: "16",
                  variant: "Bulk",
                  text: errors.nationalCode,
                }
              : undefined
          }
        />
        <TextField
          baseColor={{
            borderAndLabel: "gray-300",
            inputBgColor: "main-white",
            textInput: "gray-950",
            textError: "error-900",
          }}
          size="sm"
          placeholder="شماره تماس"
          id="phone"
          label="شماره تماس"
          value={values.phoneNumber !== undefined ? values.phoneNumber : (user.mobile || user.phone || "")}
          onChangeAction={(value) => handleChange("phoneNumber", value)}
          onFocus={() => handleFocus("phoneNumber")}
          onBlur={() => handleBlur("phoneNumber", validatePhoneNumber)}
          errorIcon={
            focused.phoneNumber && !isEditing.phoneNumber && errors.phoneNumber
              ? {
                  Icon: User,
                  iconColor: "var(--error-900)",
                  iconSize: "16",
                  variant: "Bulk",
                  text: errors.phoneNumber,
                }
              : undefined
          }
          disabled={true}
        />
      </div>
      <div className={styles["personal-info__fields-dual-input"]}>
        <Dropdown
          baseColor={{
            borderAndLabel: "gray-300",
            inputBgColor: "main-white",
            textInput: "gray-950",
            textError: "error-900",
            listTextColor: "gray-950",
            listBgColor: "main-white",
          }}
          size="sm"
          placeholder="جنسیت"
          id="gender"
          label="جنسیت"
          value={values.gender !== undefined ? values.gender : (user.gender || "")}
          onChangeAction={(value) => handleChange("gender", value)}
          options={[
            { label: "مرد", value: "مرد" },
            { label: "زن", value: "زن" },
          ]}
          errorIcon={
            focused.gender && !isEditing.gender && errors.gender
              ? {
                  Icon: User,
                  iconColor: "var(--error-900)",
                  iconSize: "16",
                  variant: "Bulk",
                  text: errors.gender,
                }
              : undefined
          }
          onFocus={() => handleFocus("gender")}
          onBlur={() => handleBlur("gender", validateGender)}
        />
        <CustomCalender
          setDate={(date) => handleChange("date", date)}
          placeholder="تاریخ تولد"
          onChangeAction={(value) => handleChange("date", value)}
          value={values.date !== undefined ? values.date : (user.birthDate || "")}
          baseColor={{
            borderAndLabel: "gray-300",
            inputBgColor: "main-white",
            textInput: "gray-950",
            textError: "error-900",
          }}
          size="sm"
          errorIcon={
            focused.date && !isEditing.date && errors.date
              ? {
                  Icon: User,
                  iconColor: "var(--error-900)",
                  iconSize: "16",
                  variant: "Bulk",
                  text: errors.date,
                }
              : undefined
          }
          label="تاریخ تولد"
          dateRange={{
            type: "birthday",
            minAge: 10,
            maxAge: 100,
          }}
          onFocus={() => handleFocus("date")}
          onBlur={() => handleBlur("date", validateDate)}
        />
      </div>
      <Dropdown
        baseColor={{
          borderAndLabel: "gray-300",
          inputBgColor: "main-white",
          textInput: "gray-950",
          textError: "error-900",
          listTextColor: "gray-950",
          listBgColor: "main-white",
        }}
        size="sm"
        placeholder="تحصیلات"
        id="education"
        label="تحصیلات"
        value={values.education !== undefined ? values.education : (user.education || "")}
        onChangeAction={(value) => handleChange("education", value)}
        options={educationOptions}
      />
      <TextField
        baseColor={{
          borderAndLabel: "gray-300",
          inputBgColor: "main-white",
          textInput: "gray-950",
          textError: "error-900",
        }}
        size="sm"
        placeholder="نام مستعار"
        maxLength={30}
        id="nickname"
        label="نام مستعار"
        value={values.nickname !== undefined ? values.nickname : (user.alias || "")}
        onChangeAction={(value) => handleChange("nickname", value)}
      />
      <br />
      <br />
      <br /> 
      <TextField
        baseColor={{
          borderAndLabel: "gray-300",
          inputBgColor: "main-white",
          textInput: "gray-950",
          textError: "error-900",
        }}
        size="sm"
        isTextArea={true}
        rows={3}
        placeholder="معرفی"
        id="bio"
        label="معرفی"
        value={values.bio !== undefined ? values.bio : (user.bio || "")}
        onChangeAction={(value) => handleChange("bio", value)}
      />
    </>
  );
}
