import React from "react";
import styles from "./ProfileNikiYarUserProfile.module.scss";
import { useNikiYarCheckInformation } from "@/hooks/api/useNikiYarCheckInformation";
import NikiYarLists from "../nikiYarLists/NikiYarLists";
import ProfileNikiYarUserChecker from "../profileNikiYarUserChecker/ProfileNikiYarUserChecker";
import Text from "@/components/ui/text/Text";

export default function ProfileNikiYarUserProfile() {
  const { data: checkInfo, isLoading, error } = useNikiYarCheckInformation();

  if (isLoading) {
    return (
      <div className={styles["profile-niki-yar-user-profile"]}>
        <Text textAlign="right" textStyle="14S5" textColor="gray-950">
          در حال بارگذاری...
        </Text>
      </div>
    );
  }

  if (error || !checkInfo) {
    // داده fallback در صورت خطا
    const fallbackCheckInfo = {
      is_valid: false,
      profile_is_complete: false,
      business_is_complete: false,
      message: "خطا در دریافت اطلاعات",
      profile_information: {
        FirstName: "",
        LastName: "",
        NationalID: "",
      },
      business_information: {
        legal_title: "",
        reg_code: "",
        id_number: "",
        business_status_id: 0,
      },
    };

    return <ProfileNikiYarUserChecker checkInfo={fallbackCheckInfo} />;
  }

  if (checkInfo.is_valid) {
    return <NikiYarLists />;
  }

  return <ProfileNikiYarUserChecker checkInfo={checkInfo} />;
}
