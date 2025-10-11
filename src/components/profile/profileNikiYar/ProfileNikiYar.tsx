import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./ProfileNikiYar.module.scss";
import Text from "@/components/ui/text/Text";
import {
  ArrowLeft2,
  ArrowRight3,
  Profile as ProfileIcon,
  DiscountShape,
} from "iconsax-react";
import useWindowWidth from "@/hooks/useWindowWidth";
import Button from "@/components/ui/actions/button/Button";
import ProfileNikiYarUserProfile from "./nikiYarProfile/profileNikiYarUserProfile/ProfileNikiYarUserProfile";
import ProfileNikiYarSalesManagement from "./nikiYarSalesManagement/profileNikiYarSalesManagement/ProfileNikiYarSalesManagement";
import NikiYarOnlineServices from "./nikiYarProfile/nikiYarLists/nikiYarOnlineServices/NikiYarOnlineServices";
import NikiYarInPersonServices from "./nikiYarProfile/nikiYarLists/nikiYarInPersonServices/NikiYarInPersonServices";
import NikiYarNikiMarketServices from "./nikiYarProfile/nikiYarLists/nikiYarNikiMarketServices/NikiYarNikiMarketServices";

export default function ProfileNikiYar() {
  const router = useRouter();
  const currentSubTab = (router.query.nikiyartab as string) || "";
  const { width, hydrated } = useWindowWidth();
  const isDesktop = hydrated && width >= 1280;

  const subTabs = [
    {
      href: "/profile?tab=niki-yar&nikiyartab=profile",
      key: "profile",
      label: "پروفایل من",
      icon: ProfileIcon,
    },
    {
      href: "/profile?tab=niki-yar&nikiyartab=discount",
      key: "discount",
      label: "دادن تخفیف به خریدار",
      icon: DiscountShape,
    },
  ];

  return (
    <div className={styles["profile-niki-yar-container"]}>
      {!currentSubTab && !isDesktop && (
        <div className={styles["profile-niki-yar"]}>
          {subTabs.map((item) => (
            <Link
              href={item.href}
              key={item.key}
              className={styles["profile-niki-yar__item"]}
            >
              <div className={styles["profile-niki-yar__item-title"]}>
                <item.icon
                  size={24}
                  color="var(--primary-950)"
                  variant="Bulk"
                />
                <Text
                  textStyle="16S5"
                  textColor="primary-950"
                  fontFamily="moraba"
                >
                  {item.label}
                </Text>
              </div>
              <ArrowLeft2
                size={24}
                color="var(--primary-950)"
                variant="Outline"
              />
            </Link>
          ))}
        </div>
      )}
      {currentSubTab && (
        <div className={styles["profile-niki-yar__content"]}>
          {/* دکمه برگشت برای حالت دسکتاپ */}
          {isDesktop &&
            (currentSubTab === "online-services" ||
              currentSubTab === "inperson-services" ||
              currentSubTab === "nikimarket-services") && (
              <div className={styles["profile-niki-yar__desktop-back"]}>
                <Button
                  paddingStyle="equal-8"
                  onClick={() =>
                    router.push("/profile?tab=niki-yar&nikiyartab=profile")
                  }
                  bgColor="transparent"
                >
                  <ArrowRight3
                    size={20}
                    color="var(--primary-700)"
                    variant="Bulk"
                  />
                  <Text textColor="primary-700" textStyle="14S5">
                    بازگشت به لیست
                  </Text>
                </Button>
              </div>
            )}
          {!isDesktop && (
            <Button
              paddingStyle="equal-8"
              onClick={() => {
                if (
                  currentSubTab === "online-services" ||
                  currentSubTab === "inperson-services" ||
                  currentSubTab === "nikimarket-services"
                ) {
                  router.push("/profile?tab=niki-yar&nikiyartab=profile");
                } else {
                  router.push("/profile?tab=niki-yar");
                }
              }}
              bgColor="transparent"
            >
              <ArrowRight3
                size={20}
                color="var(--primary-700)"
                variant="Bulk"
              />
              <Text textColor="primary-700" textStyle="14S5">
                {currentSubTab === "profile"
                  ? "پروفایل من"
                  : currentSubTab === "discount"
                  ? "دادن تخفیف به خریدار"
                  : currentSubTab === "online-services"
                  ? "خدمات آنلاین"
                  : currentSubTab === "inperson-services"
                  ? "خدمات حضوری"
                  : currentSubTab === "nikimarket-services"
                  ? "خدمات نیکی مارکت"
                  : ""}
              </Text>
            </Button>
          )}
          <div className={styles["profile-niki-yar__component"]}>
            {currentSubTab === "profile" ? (
              <ProfileNikiYarUserProfile />
            ) : currentSubTab === "discount" ? (
              <ProfileNikiYarSalesManagement />
            ) : currentSubTab === "online-services" ? (
              <NikiYarOnlineServices />
            ) : currentSubTab === "inperson-services" ? (
              <NikiYarInPersonServices />
            ) : currentSubTab === "nikimarket-services" ? (
              <NikiYarNikiMarketServices />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
