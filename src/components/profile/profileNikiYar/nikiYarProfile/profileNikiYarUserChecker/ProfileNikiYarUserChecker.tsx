import React from "react";
import { useRouter } from "next/router";
import styles from "./ProfileNikiYarUserChecker.module.scss";
import Button from "@/components/ui/actions/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { CheckInformationResponse } from "@/types/nikiYarProfile.dto";

interface ProfileNikiYarUserCheckerProps {
  checkInfo: CheckInformationResponse;
}

export default function ProfileNikiYarUserChecker({
  checkInfo,
}: ProfileNikiYarUserCheckerProps) {
  const router = useRouter();

  const handleCompleteInformation = () => {
    if (!checkInfo.profile_is_complete) {
      // اگر profile_is_complete = false باشد، به user-info برو
      router.push("/profile?tab=user-detail&usertab=user-info");
    } else if (
      checkInfo.profile_is_complete &&
      !checkInfo.business_is_complete
    ) {
      // اگر profile_is_complete = true و business_is_complete = false باشد، به user-business برو
      router.push("/profile?tab=user-detail&usertab=user-business");
    }
  };

  const getButtonText = () => {
    if (!checkInfo.profile_is_complete) {
      return "تکمیل اطلاعات پروفایل";
    } else if (
      checkInfo.profile_is_complete &&
      !checkInfo.business_is_complete
    ) {
      return "تکمیل اطلاعات کسب و کار";
    }
    return "تکمیل اطلاعات";
  };

  const getMissingInfoMessage = () => {
    if (!checkInfo.profile_is_complete) {
      // بررسی فیلدهای خالی در اطلاعات پروفایل
      const missingFields = [];
      if (!checkInfo.profile_information.FirstName) missingFields.push("نام");
      if (!checkInfo.profile_information.LastName)
        missingFields.push("نام خانوادگی");
      if (!checkInfo.profile_information.NationalID)
        missingFields.push("کد ملی");

      if (missingFields.length > 0) {
        return missingFields.join("، ") + " را وارد نکردی";
      }
      return "اطلاعات پروفایل ناقص است";
    } else if (
      checkInfo.profile_is_complete &&
      !checkInfo.business_is_complete
    ) {
      // بررسی فیلدهای خالی در اطلاعات کسب و کار
      const missingFields = [];
      if (!checkInfo.business_information.legal_title)
        missingFields.push("عنوان قانونی");
      if (!checkInfo.business_information.reg_code)
        missingFields.push("کد ثبت");
      if (!checkInfo.business_information.id_number)
        missingFields.push("شماره شناسه");

      if (missingFields.length > 0) {
        return missingFields.join("، ") + " را وارد نکردی";
      }
      return "اطلاعات کسب و کار ناقص است";
    }
    return "اطلاعات ناقص است";
  };

  return (
    <div className={styles["profile-niki-yar-user-checker"]}>
      <div className={styles["profile-niki-yar-user-checker__warning"]}>
        <p className={styles["profile-niki-yar-user-checker__warning-text"]}>
          اطلاعات پروفایل شما کامل نیست، ابتدا اطلاعات مروبوط به پروفایل را کامل
          کنید
        </p>
        <Badge
          size="sm"
          bgc="error-100"
          color="error-700"
          badgeClassName={styles["profile-niki-yar-user-checker__badge"]}
        >
          {getMissingInfoMessage()}
        </Badge>
      </div>
      <Button
        bgColor="primary-700"
        onClick={handleCompleteInformation}
        buttonClassName={styles["profile-niki-yar-user-checker__button"]}
      >
        {getButtonText()}
      </Button>
    </div>
  );
}
