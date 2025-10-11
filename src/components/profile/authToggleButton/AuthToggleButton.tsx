/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, useState, useEffect, JSX } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  Profile,
  User,
  LogoutCurve,
  Map,
  ArrowDown2,
  ArrowDown3,
  MessageQuestion,
  Message,
  Icon,
  ArrowLeft3,
} from "iconsax-react";
import Button from "@/components/ui/actions/button/Button";
import ParsehImage from "@/components/ui/image/ParsehImage";
import type { RootState } from "@/stores/userStores/userMerge.store";
import { logout } from "@/stores/userStores/auth/auth.slice";
import { clearUser } from "@/stores/userStores/user/user.slice";
import styles from "./AuthToggleButton.module.scss";
import Text from "@/components/ui/text/Text";
import LoadingModal from "@/components/ui/modal/loadingModal/LoadingModal";
import { getImageUrl } from "@/utils/imageUtils";

interface AuthToggleButtonProps {
  isDesktop: boolean;
}

const phoneToRGB = (
  phone: string
): { backgroundColor: string; borderColor: string } => {
  if (!phone || phone.length < 9) {
    return {
      backgroundColor: "#6b7280",
      borderColor: "#4b5563",
    };
  }

  const last9Digits = phone.slice(-9);
  const r = parseInt(last9Digits.slice(0, 3)) % 256;
  const g = parseInt(last9Digits.slice(3, 6)) % 256;
  const b = parseInt(last9Digits.slice(6, 9)) % 256;

  // Calculate opposite color for border
  const borderR = 220 - r;
  const borderG = 220 - g;
  const borderB = 220 - b;

  return {
    backgroundColor: `rgb(${r}, ${g}, ${b})`,
    borderColor: `rgb(${borderR}, ${borderG}, ${borderB})`,
  };
};

const getInitials = (fullName: string): string => {
  if (!fullName || fullName.trim() === "") return "";
  return fullName
    .trim()
    .split(" ")
    .filter((name) => name.length > 0)
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export default function AuthToggleButton({ isDesktop }: AuthToggleButtonProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const user = useSelector((state: RootState) => state.user);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [openPopup, isOpenPopup] = useState(false);

  // نمایش نام کاربر یا شماره تماس
  const displayName =
    user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : "";

  // حرف اول نام کاربر
  const userInitials = displayName ? getInitials(displayName) : "";

  type MenuList = {
    label: string;
    tab: string;
    icon?: Icon;
    extra?: JSX.Element;
  };

  const menuList: MenuList[] = [
    {
      label: "کیف نیکی",
      tab: "wallet",
      extra: (
        <Text textAlign="left" textColor="gray-700" textTag="span">
          {user.nikiBalance || 0} نیکی
        </Text>
      ),
    },
    {
      label: "پیام‌های من",
      tab: "messages",
      icon: Message,
    },
    {
      label: "پشتیبانی (تیکت)",
      tab: "support",
      icon: MessageQuestion,
    },
    // { label: "دعوت دوستان", tab: "invite" },
  ];
  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUser());
    setProfileMenuOpen(false);
    router.push("/");
  };

  useEffect(() => {
    if (!profileMenuOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileMenuOpen]);

  if (auth.isLoggedIn) {
    const avatarSrc = getImageUrl(user.profileImage) || user.avatar;
    return (
      <div className={styles["auth-toggle-button"]}>
        <div
          onClick={() => setProfileMenuOpen((isOpen) => !isOpen)}
          className={styles["auth-toggle-button__profile-wrapper"]}
        >
          <div
            className={styles["auth-toggle-button__profile-avatar"]}
            style={{
              backgroundColor: phoneToRGB(user.phone || "").backgroundColor,
              borderColor: phoneToRGB(user.phone || "").borderColor,
              color: phoneToRGB(user.phone || "").borderColor,
            }}
          >
            {avatarSrc ? (
              <div
                className={styles["auth-toggle-button__profile-avatar-wrapper"]}
              >
                <ParsehImage
                  imgSrc={avatarSrc}
                  imgAlt={displayName}
                  width={32}
                  height={32}
                  borderRadius={999}
                />
              </div>
            ) : userInitials ? (
              <Text textStyle="16S5" textColor="inherit" textTag="span">
                {userInitials}
              </Text>
            ) : user.phone ? (
              <Text textStyle="16S5" textColor="inherit" textTag="span">
                {user.phone.slice(-2)}
              </Text>
            ) : null}
          </div>
          <div className={styles["auth-toggle-button__profile-icon"]}>
            <ArrowDown3 size="16" color="var(--gray-500)" variant="Bulk" />
          </div>
        </div>
        <div
          ref={profileMenuRef}
          className={styles["auth-toggle-button__dropdown-menu"]}
        >
          {profileMenuOpen &&
            (isDesktop ? (
              <div
                ref={profileMenuRef}
                className={styles["auth-toggle-button__dropdown-menu-wrapper"]}
              >
                <div
                  className={styles["auth-toggle-button__dropdown-menu-header"]}
                  onClick={() => {
                    console.log(
                      "🔄 Profile menu clicked, navigating to /profile"
                    );
                    setProfileMenuOpen(false);
                    window.location.href = "/profile";
                  }}
                >
                  <div
                    className={
                      styles["auth-toggle-button__dropdown-menu-header-info"]
                    }
                  >
                    <div
                      className={styles["auth-toggle-button__profile-avatar"]}
                      style={{
                        backgroundColor: phoneToRGB(user.phone || "")
                          .backgroundColor,
                        borderColor: phoneToRGB(user.phone || "").borderColor,
                        color: phoneToRGB(user.phone || "").borderColor,
                      }}
                    >
                      {avatarSrc ? (
                        <div
                          className={
                            styles["auth-toggle-button__profile-avatar-wrapper"]
                          }
                        >
                          <ParsehImage
                            imgSrc={avatarSrc}
                            imgAlt={displayName}
                            // variant="avatar"
                            width={32}
                            height={32}
                            borderRadius={"50%"}
                            fitDirection="cover"
                          />
                        </div>
                      ) : userInitials ? (
                        <Text
                          textStyle="16S5"
                          textColor="inherit"
                          textTag="span"
                          userSelect="not-selected"
                        >
                          {userInitials}
                        </Text>
                      ) : user.phone ? (
                        <Text
                          textStyle="16S5"
                          textColor="inherit"
                          textTag="span"
                          userSelect="not-selected"
                        >
                          {user.phone.slice(-2)}
                        </Text>
                      ) : null}
                    </div>
                    <Text
                      textAlign="center"
                      textStyle="14S5"
                      textColor="gray-950"
                      userSelect="not-selected"
                    >
                      {displayName || user.phone}
                    </Text>
                  </div>
                  <div
                    className={
                      styles["auth-toggle-button__dropdown-menu-header-icon"]
                    }
                  >
                    <ArrowLeft3
                      size="16"
                      color="var(--gray-500)"
                      variant="Bulk"
                    />
                  </div>
                </div>
                {/* {menuList.map((item) => (
                  <div
                    key={item.tab}
                    className={`${
                      styles["auth-toggle-button__dropdown-menu-item"]
                    } ${
                      item.tab === "wallet" &&
                      styles["auth-toggle-button__dropdown-menu-item--wallet"]
                    }`}
                  >
                    <Button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        router.push(`/profile?tab=${item.tab}`);
                      }}
                      paddingStyle="none"
                      mode="simple"
                      fullScreen
                      bgColor="transparent"
                    >
                      <div
                        className={`${
                          styles[
                            "auth-toggle-button__dropdown-menu-item-detail-wrapper"
                          ]
                        } ${
                          item.tab === "wallet" &&
                          styles[
                            "auth-toggle-button__dropdown-menu-item-detail--wallet"
                          ]
                        }`}
                      >
                        <div
                          className={
                            styles[
                              "auth-toggle-button__dropdown-menu-item-detail"
                            ]
                          }
                        >
                          {item.icon && (
                            <item.icon
                              size="24"
                              color="var(--gray-600)"
                              variant="Bulk"
                            />
                          )}
                          <Text
                            textAlign="right"
                            textStyle="14S5"
                            textColor="gray-950"
                          >
                            {item.label}
                          </Text>
                        </div>
                        {item.extra}
                      </div>
                    </Button>
                  </div>
                ))} */}
                {/* <Button
                  onClick={() => {
                    isOpenPopup(true);
                  }}
                >
                  <Text>باز کردن پاپ اپ</Text>
                </Button> */}
                <div
                  className={styles["auth-toggle-button__dropdown-menu-item"]}
                >
                  <Button
                    onClick={() => {
                      handleLogout();
                    }}
                    paddingStyle="none"
                    mode="simple"
                    fullScreen
                    bgColor="transparent"
                  >
                    <div
                      className={
                        styles[
                          "auth-toggle-button__dropdown-menu-item-detail-wrapper"
                        ]
                      }
                    >
                      <Text
                        textAlign="right"
                        textStyle="14S5"
                        textColor="error-400"
                      >
                        خروج از حساب
                      </Text>
                      <LogoutCurve
                        size="24"
                        color="var(--error-400)"
                        variant="Bulk"
                      />
                    </div>
                  </Button>
                </div>
              </div>
            ) : (
              <div
                ref={profileMenuRef}
                className={styles["auth-toggle-button__dropdown-menu-wrapper"]}
              >
                <div
                  className={styles["auth-toggle-button__dropdown-menu-item"]}
                >
                  <Button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      router.push("/profile");
                    }}
                    paddingStyle="none"
                    mode="simple"
                    fullScreen
                    bgColor="transparent"
                  >
                    <div
                      className={
                        styles[
                          "auth-toggle-button__dropdown-menu-item-detail--mobile"
                        ]
                      }
                    >
                      <User size="18" color="var(--gray-600)" variant="Bulk" />
                      <Text
                        textAlign="right"
                        textStyle="14S5"
                        textColor="gray-950"
                      >
                        پروفایل
                      </Text>
                    </div>
                  </Button>
                </div>
                {/* <Button
                  onClick={() => {
                    isOpenPopup(true);
                  }}
                >
                  <Text>باز کردن پاپ اپ</Text>
                </Button> */}
                {/* موقتا حذف شده */}
                <div
                  className={styles["auth-toggle-button__dropdown-menu-item"]}
                >
                  <Button
                    onClick={handleLogout}
                    paddingStyle="none"
                    mode="simple"
                    fullScreen
                    bgColor="transparent"
                  >
                    <div
                      className={
                        styles[
                          "auth-toggle-button__dropdown-menu-item-detail-wrapper"
                        ]
                      }
                    >
                      <Text
                        textAlign="right"
                        textStyle="14S5"
                        textColor="error-400"
                      >
                        خروج از حساب
                      </Text>
                      <LogoutCurve size="18" color="red" variant="Bulk" />
                    </div>
                  </Button>
                </div>
              </div>
            ))}
        </div>
        {openPopup && (
          <LoadingModal
            title="در حال بارگذاری..."
            description="لطفا صبر کنید"
            showButton={true}
            buttonText="بستن"
            buttonVariant="primary"
            onButtonClick={() => {
              isOpenPopup(false);
            }}
            isLoading={openPopup}
            loadingType={19}
          />
        )}
      </div>
    );
  }

  return (
    <Button
      buttonClassName={styles["auth-toggle-button__login-btn"]}
      onClick={() => router.push("/auth/signIn")}
      paddingStyle="avg-8-24"
      mode="side-rounded"
      fullScreen
      bgColor="primary-700"
      shadow="primary-800"
    >
      <Text
        textStyle={isDesktop ? "16S5" : "12S5"}
        textColor="main-white"
        textTag="span"
        textAlign="center"
        fontFamily="moraba"
      >
        {isDesktop ? "ورود / ثبت‌نام" : "ورود"}
      </Text>
      {isDesktop && (
        <Profile size="22" color="var(--main-white)" variant="Bulk" />
      )}
    </Button>
  );
}
