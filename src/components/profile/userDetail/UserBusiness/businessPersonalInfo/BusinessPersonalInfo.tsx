import TextField from "@/components/ui/forms/textField/TextField";
import Dropdown from "@/components/ui/forms/dropdown/Dropdown";
import { FormState } from "@/hooks/useForm";
import styles from "./BusinessPersonalInfo.module.scss";
import { BusinessProfile } from "@/types/business";

type PersonalInfoProps = {
  values: FormState;
  handleChange: (
    field: keyof FormState,
    value: string | boolean | File | null
  ) => void;
  roleOptions: { label: string; value: string }[];
  provinceOptions: { label: string; value: string }[];
  cityOptions: { label: string; value: string }[];
  businessProfile?: BusinessProfile;
  loading: boolean;
  onFieldChange?: (field: string, value: string) => void;
};

export default function BusinessPersonalInfo({
  values,
  handleChange,
  roleOptions,
  provinceOptions,
  cityOptions,
  businessProfile,
  onFieldChange,
}: PersonalInfoProps) {
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
          placeholder="نام شرکت"
          id="companyName"
          label="نام شرکت"
          value={values.companyName ?? businessProfile?.CompanyName ?? ""}
          onChangeAction={(value) => {
            handleChange("companyName", value);
            onFieldChange?.("company_name", value);
          }}
        />
        <TextField
          baseColor={{
            borderAndLabel: "gray-300",
            inputBgColor: "main-white",
            textInput: "gray-950",
            textError: "error-900",
          }}
          size="sm"
          placeholder="شناسه ملی کسب و کار"
          id="businessId"
          label="شناسه ملی کسب و کار"
          value={values.businessId ?? businessProfile?.NationalID ?? ""}
          onChangeAction={(value) => {
            handleChange("businessId", value);
            onFieldChange?.("national_business_id", value);
          }}
        />
      </div>
      {/* <div className={styles["personal-info__fields-dual-input"]}>
        <TextField
          baseColor={{
            borderAndLabel: "gray-300",
            inputBgColor: "main-white",
            textInput: "gray-950",
            textError: "error-900",
          }}
          size="sm"
          placeholder="کد اقتصادی"
          id="economicCode"
          label="کد اقتصادی"
          value={values.economicCode ?? businessProfile?.EconomicCode ?? ""}
          onChangeAction={(value) => {
            handleChange("economicCode", value);
            onFieldChange?.("economic_code", value);
          }}
        />
        <TextField
          baseColor={{
            borderAndLabel: "gray-300",
            inputBgColor: "main-white",
            textInput: "gray-950",
            textError: "error-900",
          }}
          size="sm"
          placeholder="کد ثبت"
          id="registrationCode"
          label="کد ثبت"
          value={values.registrationCode ?? businessProfile?.RegistrationCode ?? ""}
          onChangeAction={(value) => {
            handleChange("registrationCode", value);
            onFieldChange?.("registration_code", value);
          }}
        />
      </div> */}
      {/* <div className={styles["personal-info__fields-dual-input"]}>
        <TextField
          baseColor={{
            borderAndLabel: "gray-300",
            inputBgColor: "main-white",
            textInput: "gray-950",
            textError: "error-900",
          }}
          size="sm"
          placeholder="وب‌سایت"
          id="website"
          label="وب‌سایت"
          value={values.website ?? businessProfile?.Website ?? ""}
          onChangeAction={(value) => {
            handleChange("website", value);
            onFieldChange?.("website", value);
          }}
        />
      </div> */}
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
          placeholder="نقش شما در شرکت"
          id="roleInCompany"
          label="نقش شما در شرکت"
          value={values.roleInCompany}
          onChangeAction={(value) => handleChange("roleInCompany", value)}
          options={roleOptions}
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
          placeholder="استان"
          id="province"
          label="استان"
          value={values.province ?? businessProfile?.province_name ?? ""}
          onChangeAction={(value) => handleChange("province", value)}
          options={provinceOptions}
        />
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
          placeholder="شهر"
          id="city"
          label="شهر"
          value={values.city ?? businessProfile?.city_name ?? ""}
          onChangeAction={(value) => handleChange("city", value)}
          options={cityOptions}
        />
      </div>
      <TextField
        baseColor={{
          borderAndLabel: "gray-300",
          inputBgColor: "main-white",
          textInput: "gray-950",
          textError: "error-900",
        }}
        size="sm"
        placeholder="آدرس محل کار"
        id="address"
        label="آدرس محل کار"
        value={values.address ?? businessProfile?.address_description ?? ""}
        onChangeAction={(value) => {
          handleChange("address", value);
          onFieldChange?.("address_description", value);
        }}
        isTextArea={true}
        rows={2}
      />
      <TextField
        baseColor={{
          borderAndLabel: "gray-300",
          inputBgColor: "main-white",
          textInput: "gray-950",
          textError: "error-900",
        }}
        size="sm"
        isTextArea={true}
        rows={4}
        placeholder="معرفی"
        id="description"
        label="معرفی"
        value={values.description ?? businessProfile?.ActivityType ?? ""}
        onChangeAction={(value) => {
          handleChange("description", value);
          onFieldChange?.("activity_type", value);
        }}
      />
      <div className={styles["personal-info__helper-text"]}>
        برای نمایش در پروفایل، شما باید نسبت به همکاری در «باشگاه مشتریان نیکی»
        موافقت داده‌باشید
      </div>
    </>
  );
}
