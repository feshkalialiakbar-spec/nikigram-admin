import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./UserDetail.module.scss";
import {
  ArrowLeft2,
  ArrowRight3,
  Briefcase,
  Card,
  Map,
  Profile,
  Setting2,
  ShieldSecurity,
} from "iconsax-react";
import Text from "@/components/ui/text/Text";
import UserInfo from "./userInfo/UserInfo";
import UserBusiness from "./UserBusiness/UserBusiness";
import UserAddresses from "./userAddresses/UserAddresses";
import UserFinancialInfo from "./userFinancialInfo/UserFinancialInfo";
import UserSecurityAndPrivacy from "./UserSecurityAndPrivacy/UserSecurityAndPrivacy";
import NikiSendSettings from "./NikiSendSettings/NikiSendSettings";
import Button from "@/components/ui/actions/button/Button";
import useWindowWidth from "@/hooks/useWindowWidth";
export default function UserDetail() {
  const router = useRouter();
  const currentUserTab = (router.query.usertab as string) || "";
  const { width, hydrated } = useWindowWidth();
  const isDesktop = hydrated && width >= 1280;
  const UserDetailList = [
    {
      href: "/profile?tab=user-detail&usertab=user-info",
      usertab: "user-info",
      label: "اطلاعات من",
      icon: Profile,
    },
    {
      href: "/profile?tab=user-detail&usertab=user-business",
      usertab: "user-business",
      label: "کسب و کار من",
      icon: Briefcase,
    },
    {
      href: "/profile?tab=user-detail&usertab=user-addresses",
      usertab: "user-addresses",
      label: "آدرس‌های من",
      icon: Map,
    },
    {
      href: "/profile?tab=user-detail&usertab=user-financial-info",
      usertab: "user-financial-info",
      label: "اطلاعات مالی من",
      icon: Card,
    },
    {
      href: "/profile?tab=user-detail&usertab=user-security-privacy",
      usertab: "user-security-privacy",
      label: "امنیت و حریم خصوصی",
      icon: ShieldSecurity,
    },
    {
      href: "/profile?tab=user-detail&usertab=niki-send-settings",
      usertab: "niki-send-settings",
      label: "تنظیمات ارسال نیکی",
      icon: Setting2,
    },
  ];

  const usertabToComponent: Record<string, React.ReactNode> = {
    "user-info": <UserInfo />,
    "user-business": <UserBusiness />,
    "user-addresses": <UserAddresses />,
    "user-financial-info": <UserFinancialInfo />,
    "user-security-privacy": <UserSecurityAndPrivacy />,
    "niki-send-settings": <NikiSendSettings />,
  };

  if (currentUserTab && usertabToComponent[currentUserTab]) {
    return (
      <div className={styles["user-detail__content"]}>
        {isDesktop && (
          <Button
            paddingStyle="equal-8"
            onClick={() => router.push("/profile")}
            bgColor="transparent"
          >
            <ArrowRight3 size={20} color="var(--primary-700)" variant="Bulk" />
            <Text textColor="primary-700" textStyle="14S5">
              {currentUserTab === "user-info"
                ? "اطلاعات من"
                : currentUserTab === "user-business"
                ? "کسب و کار من"
                : currentUserTab === "user-addresses"
                ? "آدرس‌های من"
                : currentUserTab === "user-financial-info"
                ? "اطلاعات مالی من"
                : currentUserTab === "user-security-privacy"
                ? "امنیت و حریم خصوصی"
                : currentUserTab === "niki-send-settings"
                ? "تنظیمات ارسال نیکی"
                : ""}
            </Text>
          </Button>
        )}
        {usertabToComponent[currentUserTab]}
      </div>
    );
  }
  return (
    <div className={styles["user-detail"]}>
      {UserDetailList.map((item, index) => (
        <Link
          href={item.href}
          key={index}
          className={styles["user-detail__item"]}
        >
          <div className={styles["user-detail__item-title"]}>
            <item.icon size={24} color="var(--primary-950)" variant="Bulk" />
            <Text textStyle="16S5" textColor="primary-950" fontFamily="moraba">
              {item.label}
            </Text>
          </div>
          <ArrowLeft2 size={24} color="var(--primary-950)" variant="Outline" />
        </Link>
      ))}
    </div>
  );
}
