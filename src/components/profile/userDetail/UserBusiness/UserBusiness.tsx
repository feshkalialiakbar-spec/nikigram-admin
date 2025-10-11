import React from "react";
import styles from "./UserBusiness.module.scss";
import Button from "@/components/ui/actions/button/Button";
import { useForm } from "@/hooks/useForm";
import { useRef, useState, useEffect } from "react";
import ParsehImage from "@/components/ui/image/ParsehImage";
import NotFound from "../../../../../public/images/notFound/not-found.png";
import Text from "@/components/ui/text/Text";
import BusinessPersonalDocuments from "./businessPersonalDocuments/BusinessPersonalDocuments";
import BusinessPersonalSocialNetworks from "./businessPersonalSocialNetworks/BusinessPersonalSocialNetworks";
import BusinessPersonalInfo from "./businessPersonalInfo/BusinessPersonalInfo";
import useWindowWidth from "@/hooks/useWindowWidth";
import { useBusinessData } from "@/hooks/useBusinessData";

// قبلا این اسمش یچی دیگه بود باید درست کنم اسم کلاسا رو
// قبلا این اسمش یچی دیگه بود باید درست کنم اسم کلاسا رو
// قبلا این اسمش یچی دیگه بود باید درست کنم اسم کلاسا رو
// قبلا این اسمش یچی دیگه بود باید درست کنم اسم کلاسا رو
// قبلا این اسمش یچی دیگه بود باید درست کنم اسم کلاسا رو

// استان‌ها (from NikiGraph)
export const provinceNames = [
  "آذربایجان شرقی",
  "آذربایجان غربی",
  "اصفهان",
  "ایلام",
  "بوشهر",
  "تهران",
  "چهارمحال و بختیاری",
  "خراسان رضوی",
  "خراسان جنوبی",
  "خراسان شمالی",
  "خوزستان",
  "زنجان",
  "سمنان",
  "سیستان و بلوچستان",
  "فارس",
  "قزوین",
  "قم",
  "کرمان",
  "کرمانشاه",
  "کردستان",
  "کهگیلویه و بویراحمد",
  "گلستان",
  "گیلان",
  "لرستان",
  "مازندران",
  "مرکزی",
  "هرمزگان",
  "همدان",
  "یزد",
  "البرز",
  "اردبیل",
];

// Placeholder options for dropdowns
const roleOptions = [
  { label: "مالک/سهام‌دار", value: "owner" },
  { label: "مدیرعامل", value: "ceo" },
  { label: "مدیر", value: "manager" },
  { label: "کارمند", value: "employee" },
  { label: "سایر", value: "other" },
];
const cityOptions = [
  { label: "تهران", value: "تهران" },
  { label: "شیراز", value: "شیراز" },
  { label: "مشهد", value: "مشهد" },
  { label: "کرمان", value: "کرمان" },
  { label: "بوشهر", value: "بوشهر" },
  { label: "ارومیه", value: "ارومیه" },
  { label: "گرگان", value: "گرگان" },
  { label: "کرمانشاه", value: "کرمانشاه" },
];
// Note: city/province options remain as before

export default function UserBusiness() {
  // استان‌ها به فرمت options
  const provinceOptions = provinceNames.map((name) => ({
    label: name,
    value: name,
  }));

  const { width, hydrated } = useWindowWidth();
  const isDesktop = hydrated && width >= 1280;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // ترکیب مقادیر فرم با تغییرات pending
      const updateData = {
        company_name: pendingChanges.company_name ?? values.companyName,
        national_business_id:
          pendingChanges.national_business_id ?? values.businessId,
        city_id: businessData?.data.business_profile.city_id ?? 0,
        address_description:
          pendingChanges.address_description ?? values.address,
        company_type: businessData?.data.business_profile.CompanyType ?? 0,
        activity_type: pendingChanges.activity_type ?? values.description,
        website: pendingChanges.website ?? values.website,
        economic_code: pendingChanges.economic_code ?? values.economicCode,
        registration_code:
          pendingChanges.registration_code ?? values.registrationCode,
      };

      await updateBusiness(updateData);

      // پاک کردن تغییرات pending بعد از ارسال موفق
      setPendingChanges({});

      // نمایش پیام موفقیت
      console.log("اطلاعات کسب و کار با موفقیت به‌روزرسانی شد");
    } catch (error) {
      // خطا در handleSubmit مدیریت می‌شود
      console.error("خطا در به‌روزرسانی اطلاعات:", error);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "personal" | "documents" | "social"
  >("personal");
  const [hasSocialLinks, setHasSocialLinks] = useState<boolean>(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>(
    {}
  );

  // فراخوانی API برای دریافت اطلاعات کسب و کار
  const {
    data: businessData,
    loading,
    updateLoading,
    documentsUpdateLoading,
    fileUploadLoading,
    platformsUpdateLoading,
    updateBusiness,
    updateDocuments,
    updatePlatforms,
    uploadFile,
  } = useBusinessData();



  // هندل آپلود عکس
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setLocalAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // هندل تغییر value برای TextFieldها
  // const handleField = (field: string) => (value: string) => {
  //   dispatch(updateUser({ [field]: value }));
  // };

  // دریافت شماره تلفن از user store یا auth store
  // const phoneNumber =
  //   user.phone || (auth.isLoggedIn ? "" : auth.tempPhone) || "";

  const { values, handleChange } = useForm({
    initialValues: {
      companyName:
        businessData?.data.business_profile.CompanyName ??
        "",
      businessId:
        businessData?.data.business_profile.NationalID ?? "",
      roleInCompany: "",
      province:
        businessData?.data.business_profile.province_name ??
        "",
      city: businessData?.data.business_profile.city_name ?? "",
      address:
        businessData?.data.business_profile.address_description ??
        "",
      description:
        businessData?.data.business_profile.ActivityType ??
        "",
      economicCode: businessData?.data.business_profile.EconomicCode ?? "",
      registrationCode:
        businessData?.data.business_profile.RegistrationCode ?? "",
      website: businessData?.data.business_profile.Website ?? "",
    },
  });

  // به‌روزرسانی فرم وقتی businessData تغییر کرد
  useEffect(() => {
    if (businessData?.data.business_profile) {
      const profile = businessData.data.business_profile;
      handleChange("companyName", profile.CompanyName ?? "");
      handleChange("businessId", profile.NationalID ?? "");
      handleChange("province", profile.province_name ?? "");
      handleChange("city", profile.city_name ?? "");
      handleChange("address", profile.address_description ?? "");
      handleChange("description", profile.ActivityType ?? "");
      handleChange("economicCode", profile.EconomicCode ?? "");
      handleChange("registrationCode", profile.RegistrationCode ?? "");
      handleChange("website", profile.Website ?? "");
    }
  }, [businessData, handleChange]);

  return (
    <form className={styles["user-business"]} onSubmit={handleSubmit}>
      {/* عکس پروفایل */}
      <div className={styles["user-business__avatar-box"]}>
        <ParsehImage
          imgSrc={localAvatar || NotFound}
          imgAlt="پروفایل"
          width={96}
          height={96}
          borderRadius={999}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleAvatarChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={styles["user-business__edit-avatar-btn"]}
        >
          <svg width="24" height="24" fill="none">
            <circle cx="12" cy="12" r="12" fill="#007bff" />
            <path
              d="M8 16l8-8M8 8h8v8"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      {/* تب‌ها */}
      <div className={styles["user-business__tabs"]}>
        <Button
          bgColor={activeTab === "personal" ? "primary-50" : "transparent"}
          borderColor={activeTab === "personal" ? "primary-700" : "gray-300"}
          mode="side-rounded"
          onClick={() => setActiveTab("personal")}
          fullScreen={true}
        >
          <Text
            textStyle={isDesktop ? "16S5" : "14S5"}
            textColor={activeTab === "personal" ? "primary-700" : "gray-300"}
          >
            اطلاعات کسب و کار
          </Text>
        </Button>
        <Button
          bgColor={activeTab === "documents" ? "primary-50" : "transparent"}
          borderColor={activeTab === "documents" ? "primary-700" : "gray-300"}
          mode="side-rounded"
          onClick={() => setActiveTab("documents")}
          fullScreen={true}
        >
          <Text
            textStyle="16S5"
            textColor={activeTab === "documents" ? "primary-700" : "gray-300"}
          >
            مدارک
          </Text>
        </Button>
        <Button
          bgColor={activeTab === "social" ? "primary-50" : "transparent"}
          borderColor={activeTab === "social" ? "primary-700" : "gray-300"}
          mode="side-rounded"
          onClick={() => setActiveTab("social")}
          fullScreen={true}
        >
          <Text
            textStyle={isDesktop ? "16S5" : "14S5"}
            textColor={activeTab === "social" ? "primary-700" : "gray-300"}
          >
            شبکه‌های اجتماعی
          </Text>
        </Button>
      </div>
      {/* فیلدها */}
      <div className={styles["user-business__fields-body"]}>
        {activeTab === "personal" && (
          <BusinessPersonalInfo
            values={values}
            handleChange={handleChange}
            roleOptions={roleOptions}
            provinceOptions={provinceOptions}
            cityOptions={cityOptions}
            businessProfile={businessData?.data.business_profile}
            loading={loading}
            onFieldChange={(field, value) => {
              // ذخیره تغییرات در state
              setPendingChanges((prev) => ({
                ...prev,
                [field]: value,
              }));

              // ارسال real-time به API (اختیاری)
              // handleRealTimeUpdate(field, value);

              console.log(`Field changed: ${field} = ${value}`);
            }}
          />
        )}
        {activeTab === "documents" && (
          <BusinessPersonalDocuments
            documents={businessData?.data.documents}
            loading={loading}
            updateDocuments={updateDocuments}
            documentsUpdateLoading={documentsUpdateLoading}
            uploadFile={uploadFile}
            fileUploadLoading={fileUploadLoading}
          />
        )}
        {activeTab === "social" && (
          <BusinessPersonalSocialNetworks
            onHasLinksChange={setHasSocialLinks}
            platformAccounts={businessData?.data.platform_accounts}
            loading={loading}
            updatePlatforms={updatePlatforms}
            platformsUpdateLoading={platformsUpdateLoading}
          />
        )}
      </div>
      {(() => {
        const showBtn = !(activeTab === "social" && !hasSocialLinks);
        return showBtn;
      })() && (
        <div className={styles["user-business__fields-body-button"]}>
          <Button
            type="submit"
            bgColor="primary-700"
            mode="side-rounded"
            shadow="primary-800"
            fullScreen={true}
            paddingStyle="equal-12"
            disabled={updateLoading}
          >
            <Text textColor="main-white" fontFamily="moraba">
              {updateLoading ? "در حال ثبت..." : "ثبت اطلاعات"}
            </Text>
          </Button>
        </div>
      )}
    </form>
  );
}
