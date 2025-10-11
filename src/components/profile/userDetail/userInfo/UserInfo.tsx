/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "@/stores/userStores/user/user.slice";
import { useRef, useState, useEffect } from "react";
import styles from "./UserInfo.module.scss";
import Button from "@/components/ui/actions/button/Button";
import TextField from "@/components/ui/forms/textField/TextField";
import ParsehImage from "@/components/ui/image/ParsehImage";
import { User } from "iconsax-react";
import NotFound from "../../../../../public/images/notFound/not-found.png";
import { useForm } from "@/hooks/useForm";
import {
  validateName,
  validateLastName,
  validatePhoneNumber,
  validateNationalCode,
  validateGender,
  validateDate,
} from "@/validations/NeedHelpValidations";
import Dropdown from "@/components/ui/forms/dropdown/Dropdown";
import CustomCalender from "@/components/global/customCalender/CustomCalender";
import PersonalDocuments from "./personalDocuments/PersonalDocuments";
import PersonalSocialNetworks from "./personalSocialNetworks/PersonalSocialNetworks";
import PersonalInfo from "./personalInfo/PersonalInfo";
import Text from "@/components/ui/text/Text";
import { useFullUserInfo, useUpdateUserInfo } from "@/hooks/useApiList";
import { getImageUrl, genderToNumber, educationToNumber, getChangedFields } from "@/utils/imageUtils";
import { uploadFile } from "@/services/api/files/files";

const educationOptions = [
  { label: "بی‌سواد", value: "بی‌سواد" },
  { label: "زیر دیپلم", value: "زیر دیپلم" },
  { label: "دیپلم", value: "دیپلم" },
  { label: "کاردانی", value: "کاردانی" },
  { label: "کارشناسی", value: "کارشناسی" },
  { label: "ارشد", value: "ارشد" },
  { label: "دکترا", value: "دکترا" },
  { label: "در حال ادامه تحصیل", value: "در حال ادامه تحصیل" },
];

export default function UserInfo() {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const auth = useSelector((state: any) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "personal" | "documents" | "social"
  >("personal");
  const [hasSocialLinks, setHasSocialLinks] = useState<boolean>(false);
  const [changedFieldsCount, setChangedFieldsCount] = useState<number>(0);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState<boolean>(false);

  // Hooks for API
  const { fetchFullUserInfo, isLoading: isLoadingFetch, error: fetchError } = useFullUserInfo();
  const { updateUserInfoData, isLoading: isLoadingUpdate, error: updateError } = useUpdateUserInfo();

  // Combined loading and error states
  const isLoading = isLoadingFetch || isLoadingUpdate || isUploadingAvatar;
  const error = fetchError || updateError;

  // Fetch user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        await fetchFullUserInfo();
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, [fetchFullUserInfo]);

  // هندل آپلود عکس
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.error("نوع فایل پشتیبانی نمی‌شود. لطفاً تصویر انتخاب کنید.");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error("حجم فایل بیش از حد مجاز است. حداکثر 5 مگابایت مجاز است.");
      return;
    }

    try {
      setIsUploadingAvatar(true);

      // Show local preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setLocalAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);

      // Upload file to server
      const uploadResponse = await uploadFile({
        file: file,
        entity_type: "profile",
        is_private: false,
        sort_order: 0,
        is_featured: false,
      });

      // Update user store with new profile image
      dispatch(updateUser({ 
        profileImage: uploadResponse.file_uid 
      }));

      console.log("تصویر پروفایل با موفقیت آپلود شد");

      // Immediately update ProfileImage via API
      try {
        await updateUserInfoData({
          ProfileImage: uploadResponse.file_uid as string
        });
        console.log("ProfileImage در سرور با موفقیت آپدیت شد");
      } catch (updateError) {
        console.error("خطا در آپدیت ProfileImage:", updateError);
      }
      
    } catch (error) {
      console.error("خطا در آپلود تصویر:", error);
      // Remove local preview on error
      setLocalAvatar(null);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // هندل تغییر value برای TextFieldها
  const handleField = (field: string) => (value: string) => {
    dispatch(updateUser({ [field]: value }));
  };

  // دریافت شماره تلفن از user store یا auth store
  const phoneNumber =
    user.phone || (auth.isLoggedIn ? "" : auth.tempPhone) || "";

  const {
    values,
    errors,
    focused,
    isEditing,
    handleChange,
    handleFocus,
    handleBlur,
    resetForm,
  } = useForm({
    initialValues: {
      name: user.firstName || "",
      lastName: user.lastName || "",
      phoneNumber: user.mobile || user.phone || "",
      nationalCode: user.nationalCode || "",
      gender: user.gender || "",
      date: user.birthDate || "",
      education: user.education || "",
      nickname: user.alias || "",
      bio: user.bio || "",
    },
  });

  // Calculate changed fields count
  useEffect(() => {
    const originalData = {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      alias: user.alias,
      nationalCode: user.nationalCode || "",
      gender: user.gender,
      birthDate: user.birthDate || "",
      education: user.education || "",
      bio: user.bio || "",
    };

    const changedFields = getChangedFields(values, originalData);
    
    // Note: ProfileImage is updated immediately after upload, not counted here
    setChangedFieldsCount(Object.keys(changedFields).length);
  }, [values, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Get original data from user store
      const originalData = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        alias: user.alias,
        nationalCode: user.nationalCode || "",
        gender: user.gender,
        birthDate: user.birthDate || "",
        education: user.education || "",
        bio: user.bio || "",
      };

      // Get only changed fields
      const changedFields = getChangedFields(values, originalData);

      // If no changes, show message and return
      if (Object.keys(changedFields).length === 0) {
        console.log("هیچ تغییری در اطلاعات اعمال نشده است");
        return;
      }

      // Note: ProfileImage is updated immediately after upload, not here
      console.log("Final changed fields:", changedFields);

      // Call API to update user info with only changed fields
      await updateUserInfoData(changedFields);

      // Show success message
      console.log("اطلاعات کاربر با موفقیت بروزرسانی شد");
      
    } catch (error) {
      console.error("خطا در بروزرسانی اطلاعات:", error);
    }
  };

  return (
    <form className={styles["user-info"]} onSubmit={handleSubmit}>
      {/* Loading State */}
      {isLoading && (
        <div className={styles["user-info__loading"]}>
          <Text textStyle="16S5" textColor="gray-700">
            در حال بارگذاری اطلاعات...
          </Text>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className={styles["user-info__error"]}>
          <Text textStyle="16S5" textColor="error-700">
            {error}
          </Text>
        </div>
      )}

      {/* عکس پروفایل */}
      <div className={styles["user-info__avatar-box"]}>
        <ParsehImage
          imgSrc={localAvatar || getImageUrl(user.profileImage) || user.avatar || NotFound}
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
          className={styles["user-info__edit-avatar-btn"]}
          disabled={isUploadingAvatar}
        >
          {isUploadingAvatar ? (
            <div className={styles["user-info__upload-spinner"]}>
              {/* You can add a spinner component here */}
              <span>...</span>
            </div>
          ) : (
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
          )}
        </button>
      </div>
      {/* Tabs */}
      <div className={styles["user-info__tabs"]}>
        <Button
          bgColor={activeTab === "personal" ? "primary-50" : "transparent"}
          borderColor={activeTab === "personal" ? "primary-700" : "gray-300"}
          mode="side-rounded"
          onClick={() => setActiveTab("personal")}
          fullScreen={true}
        >
          <Text
            textStyle="16S5"
            textColor={activeTab === "personal" ? "primary-700" : "gray-300"}
          >
            اطلاعات فردی
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
            textStyle="16S5"
            textColor={activeTab === "social" ? "primary-700" : "gray-300"}
          >
            شبکه‌های اجتماعی
          </Text>
        </Button>
      </div>
      {/* محتوا بر اساس تب */}
      <div className={styles["user-info__fields-body"]}>
        {activeTab === "personal" && (
          <PersonalInfo
            values={values}
            errors={errors}
            focused={focused}
            isEditing={isEditing}
            handleChange={handleChange}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
            educationOptions={educationOptions}
          />
        )}
        {activeTab === "documents" && <PersonalDocuments />}
        {activeTab === "social" && (
          <PersonalSocialNetworks onHasLinksChange={setHasSocialLinks} />
        )}
      </div>
      {(() => {
        const showEditingBtn = !(activeTab === "social" && !hasSocialLinks);
        return showEditingBtn;
        // return activeTab !== "social";
      })() && (
        <div className={styles["user-info__actions"]}>
          <Button
            type="submit"
            bgColor="primary-700"
            mode="side-rounded"
            shadow="primary-800"
            paddingStyle="avg-8-32"
            disabled={isLoading || changedFieldsCount === 0}
          >
            {isLoading 
              ? "در حال بارگذاری..." 
              : changedFieldsCount === 0 
                ? "هیچ تغییری اعمال نشده" 
                : `تغییر اطلاعات (${changedFieldsCount} مورد)`
            }
          </Button>
        </div>
      )}
    </form>
  );
}
