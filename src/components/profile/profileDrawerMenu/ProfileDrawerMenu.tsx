/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ProfileDrawerMenu.module.scss";
import { logout } from "@/stores/userStores/auth/auth.slice";
import useWindowWidth from "@/hooks/useWindowWidth";
import { useProfileSummary } from "@/hooks/useProfileSummary";
import { myTasksList } from "@/mocks/myTasks";
import { pendingTasksList } from "@/mocks/pendingTasks";
import { inProgressTasksList } from "@/mocks/inProgressTasks";
import { doneTasksList } from "@/mocks/doneTasks";
import {
  Activity,
  MessageQuestion,
  LogoutCurve,
  Scanning,
  ArrowRight3,
  Edit2,
  ArrowLeft2,
  Calendar,
  Crown,
  Verify,
  I3Dcube,
  ArrowDown2,
  Map1,
  Nexo,
  Flash,
  BagHappy,
  Crown1,
  Gift,
  MessageText1,
  DocumentFavorite,
} from "iconsax-react";
import Text, { TextStyles } from "@/components/ui/text/Text";
import Badge from "@/components/ui/badge/Badge";
import Divider from "@/components/ui/divider/Divider";
import Button from "@/components/ui/actions/button/Button";

interface ProfileDrawerMenuProps {
  onClose?: () => void;
}

export default function ProfileDrawerMenu({ onClose }: ProfileDrawerMenuProps) {
  const { width, hydrated } = useWindowWidth();
  const isDesktop = hydrated && width >= 1280;
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const {
    nikiBalance,
    nikiWithdrawableBalance,
    taskCount,
    tenderProposalCount,
    projectDonationCount,
    charityDonationCount,
    clubLevelId,
    clubLevelLogoUid,
    clubLevelTitle,
  } = useProfileSummary();
  const currentTab =
    typeof router.query.tab === "string" ? router.query.tab : "";
  const [isActivitiesOpen, setIsActivitiesOpen] = useState(false);
  const [openTopSubmenu, setOpenTopSubmenu] = useState<string | null>(null);
  const currentNikiYarTab =
    typeof router.query.nikiyartab === "string" ? router.query.nikiyartab : "";
  const currentTaskTab =
    typeof router.query.tasktab === "string" ? router.query.tasktab : "";

  // اگر کاربر در صفحات فعالیت‌ها باشد، زیرمنوی «فعالیت‌های من» باز بماند
  const activityTabs = [
    "user-activities-donations-charities",
    "user-activities-donations-projects",
    "user-activities-tenders",
  ];
  const shouldKeepActivitiesOpen = activityTabs.includes(currentTab);

  // در دسکتاپ، اگر کاربر در تب‌های task باشد، زیرمنوی میزکار را باز نگه دار
  const shouldKeepTaskSubmenuOpen =
    isDesktop && currentTab === "task" && currentTaskTab;

  // نمایش نام کاربر یا شماره تماس
  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.phone || "کاربر";

  const summaryItems = [
    {
      href: "/profile?tab=niki-test1",
      label: "تست1 نیکی",
      icon: Calendar,
    },
    {
      href: "/profile?tab=niki-test2",
      label: "تست2 نیکی",
      icon: Verify,
    },
    {
      href: "/profile?tab=niki-test3",
      label: "تست3 نیکی",
      icon: Crown,
    },
    {
      href: "/profile?tab=niki-test4",
      label: "تست4 نیکی",
      icon: Map1,
    },
    {
      href: "/profile?tab=niki-test5",
      label: "تست5 نیکی",
      icon: Nexo,
    },
  ];

  type ActivitiesSubMenuItems = {
    href: string;
    label: string;
  };

  const activitiesSubMenuItems: ActivitiesSubMenuItems[] = [
    {
      href: "/profile?tab=user-activities-donations-charities",
      label: "نیکی‌های اهدایی به خیریه‌ها",
    },
    {
      href: "/profile?tab=user-activities-donations-projects",
      label: "نیکی‌های اهدایی به پروژه‌ها",
    },
    {
      href: "/profile?tab=user-activities-tenders",
      label: "مناقصه‌ها",
    },
  ];
  const topCustomItems = [
    {
      href: "/profile?tab=wednesday-list",
      label: "چهارشنبه‌های نیکی",
      icon: Calendar,
    },
    {
      href: "/profile?tab=activities-summary",
      label: "خلاصه فعالیت‌ها",
      icon: Flash,
    },
    {
      href: "/profile?tab=niki-yar",
      label: "نیکی‌یار",
      icon: Verify,
    },
    {
      href: "/profile?tab=sales-management",
      label: "مدیریت فروش",
      icon: BagHappy,
    },
    {
      href: "/profile?tab=nikigram-club",
      label: "باشگاه نیکی‌گرام",
      icon: Crown1,
    },
  ];
  const nikiYarSubMenuItems: ActivitiesSubMenuItems[] = [
    {
      href: "/profile?tab=niki-yar&nikiyartab=profile",
      label: "پروفایل من",
    },
    {
      href: "/profile?tab=niki-yar&nikiyartab=discount",
      label: "دادن تخفیف به خریدار",
    },
  ];

  const taskSubMenuItems = [
    {
      href: "/profile?tab=task&tasktab=my-tasks",
      label: "کارهای من",
      count: myTasksList.length,
    },
    {
      href: "/profile?tab=task&tasktab=pending",
      label: "در انتظار انجام",
      count: pendingTasksList.length,
    },
    {
      href: "/profile?tab=task&tasktab=in-progress",
      label: "در حال انجام",
      count: inProgressTasksList.length,
    },
    {
      href: "/profile?tab=task&tasktab=done",
      label: "انجام شده",
      count: doneTasksList.length,
    },
  ];
  const mainMenuItems = [
    {
      href: "/profile?tab=my-help-requests",
      label: "درخواست‌های کمک من",
      icon: DocumentFavorite,
    },
    {
      href: "/profile?tab=my-comments",
      label: "نظرات من",
      icon: MessageText1,
    },
    {
      href: "/profile?tab=tickets",
      label: "پشتیبانی (تیکت)",
      icon: MessageQuestion,
    },
    {
      href: "/profile?tab=invite-friends",
      label: "دعوت دوستان",
      icon: Gift,
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
    if (onClose) onClose();
  };

  const toggleActivities = () => {
    setIsActivitiesOpen(!isActivitiesOpen);
  };

  const isItemActive = (href: string): boolean => {
    try {
      const hrefTab = new URL(href, "http://localhost").searchParams.get("tab");
      return (hrefTab ?? "") === currentTab;
    } catch {
      return false;
    }
  };

  const isNikiYarSubActive = (href: string): boolean => {
    try {
      const url = new URL(href, "http://localhost");
      const tab = url.searchParams.get("tab") ?? "";
      const sub = url.searchParams.get("nikiyartab") ?? "";
      if (tab !== "niki-yar") return false;
      // Map service subtabs to profile highlighting
      const serviceTabs = [
        "online-services",
        "inperson-services",
        "nikimarket-services",
      ];
      const isInService = serviceTabs.includes(currentNikiYarTab);
      if (isInService && sub === "profile") return true;
      return sub === currentNikiYarTab && sub !== "";
    } catch {
      return false;
    }
  };

  const isTaskSubActive = (href: string): boolean => {
    try {
      const url = new URL(href, "http://localhost");
      const tab = url.searchParams.get("tab") ?? "";
      const sub = url.searchParams.get("tasktab") ?? "";
      if (tab !== "task") return false;
      return sub === currentTaskTab && sub !== "";
    } catch {
      return false;
    }
  };

  return (
    <div className={styles["profile-drawer-menu"]}>
      {!isDesktop && (
        <Link className={styles["profile-drawer-menu__navbar"]} href={"/"}>
          <ArrowRight3 size="24" color="var(--primary-700)" variant="Bulk" />
          <Text textStyle="16S5" textColor="primary-700" fontFamily="moraba">
            پروفایل
          </Text>
        </Link>
      )}
      <Link
        href="/profile?tab=user-detail"
        className={styles["profile-drawer-menu__user-info"]}
        onClick={() => onClose?.()}
      >
        <div className={styles["profile-drawer-menu__user-info-title"]}>
          <Text textStyle="16S7" textColor="main-black">
            {displayName}
          </Text>
          <Scanning size="24" color="var(--primary-700)" variant="Bulk" />
        </div>
        <Edit2 size={24} color="var(--primary-700)" variant="Bulk" />
      </Link>
      <div className={styles["profile-drawer-menu__wallet-wrapper"]}>
        <Link
          className={styles["profile-drawer-menu__wallet-info"]}
          href="/profile?tab=wallet"
        >
          <Text textStyle="16S4" fontFamily="moraba" textColor="gray-600">
            صندوقچه نیکی
          </Text>
          <Text textStyle="16S7" textColor="main-black">
            {nikiBalance > 999999 ? "+999999" : nikiBalance || 0} نیکی
          </Text>
        </Link>
        <Link
          href="/profile?tab=increase-niki"
          className={styles["profile-drawer-menu__wallet-increase-niki"]}
        >
          <Text textStyle="12S4" textColor="primary-700">
            افزایش نیکی
          </Text>
          <ArrowLeft2 size="16" color="var(--primary-700)" />
        </Link>
        {/* موقتا حذف شده */}
      </div>

      {/* بخش میزکار */}
      <div className={styles["profile-drawer-menu__task-section"]}>
        <div className={styles["profile-drawer-menu__task-item-wrapper"]}>
          <Link
            href="/profile?tab=task"
            className={`${styles["profile-drawer-menu__task-item"]} ${
              currentTab === "task"
                ? styles["profile-drawer-menu__task-item--active"]
                : ""
            }`}
            onClick={(e) => {
              if (isDesktop) {
                e.preventDefault();
                setOpenTopSubmenu((prev) =>
                  prev === "میزکار" ? null : "میزکار"
                );
                return;
              }
              onClose?.();
            }}
          >
            <div className={styles["profile-drawer-menu__task-item-content"]}>
              <I3Dcube
                size={24}
                color={
                  currentTab === "task"
                    ? "var(--primary-800)"
                    : "var(--gray-600)"
                }
                variant="Bulk"
              />
              <Text
                textStyle="16S5"
                textColor={currentTab === "task" ? "primary-800" : "gray-600"}
                fontFamily="moraba"
              >
                میزکار
              </Text>
            </div>
            <Badge bgc="primary-50" size="md">
              <Text textStyle="14S4" textColor="primary-700">
                {taskCount || 0} وظیفه جدید
              </Text>
            </Badge>
          </Link>
          {(openTopSubmenu === "میزکار" || shouldKeepTaskSubmenuOpen) && (
            <div className={styles["profile-drawer-menu__task-sub-menu"]}>
              {taskSubMenuItems.map((sub) => {
                const subActive = isTaskSubActive(sub.href);
                const submenuItemClasses = `${
                  styles["profile-drawer-menu__task-sub-menu-item"]
                } ${
                  subActive
                    ? styles["profile-drawer-menu__task-sub-menu-item--active"]
                    : ""
                }`;
                return (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className={submenuItemClasses}
                    onClick={() => onClose?.()}
                  >
                    <div
                      className={
                        styles[
                          "profile-drawer-menu__task-sub-menu-item-content"
                        ]
                      }
                    >
                      <Text
                        textStyle="14S5"
                        textColor={subActive ? "primary-800" : "gray-700"}
                        fontFamily="moraba"
                      >
                        {sub.label}
                      </Text>
                      <div
                        className={
                          styles[
                            "profile-drawer-menu__task-sub-menu-item-count"
                          ]
                        }
                      >
                        <Text textStyle="12S5" textColor="primary-700">
                          {sub.count}
                        </Text>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Divider direction="h" color="gray-200" />
      <div
        className={styles["profile-drawer-menu__summary-activities-wrapper"]}
      >
        <Text
          textStyle="16S4"
          textColor="gray-600"
          fontFamily="moraba"
          textAlign="right"
        >
          خلاصه فعالیت‌ها
        </Text>
        <div
          className={
            styles["profile-drawer-menu__summary-activities-horizontal-section"]
          }
        >
          {summaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                href={item.href}
                key={item.label}
                className={
                  styles["profile-drawer-menu__summary-activities-item"]
                }
              >
                <Icon size={40} variant="Bulk" />
              </Link>
            );
          })}
        </div>
      </div>

      <nav className={styles["profile-drawer-menu__activity-nav"]}>
        {topCustomItems.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item.href);
          return (
            <div
              key={item.href}
              className={styles["profile-drawer-menu__nav-item-wrapper"]}
            >
              <Link
                href={item.href}
                className={`${styles["profile-drawer-menu__nav-item"]} ${
                  active ? styles["profile-drawer-menu__nav-item--active"] : ""
                }`}
                onClick={(e) => {
                  if (isDesktop && item.label === "نیکی‌یار") {
                    e.preventDefault();
                    setOpenTopSubmenu((prev) =>
                      prev === "نیکی‌یار" ? null : "نیکی‌یار"
                    );
                    return;
                  }
                  onClose?.();
                }}
              >
                <div
                  className={styles["profile-drawer-menu__nav-item-content"]}
                >
                  <Icon
                    size={24}
                    color={active ? "var(--primary-800)" : "var(--gray-600)"}
                    variant="Bulk"
                  />
                  <Text
                    textStyle="16S5"
                    textColor={active ? "primary-800" : "gray-600"}
                    fontFamily="moraba"
                  >
                    {item.label}
                  </Text>
                </div>
              </Link>
              {isDesktop &&
                item.label === "نیکی‌یار" &&
                openTopSubmenu === "نیکی‌یار" && (
                  <div
                    className={
                      styles["profile-drawer-menu__activity-nav-sub-menu"]
                    }
                  >
                    {nikiYarSubMenuItems.map((sub) => {
                      const subActive = isNikiYarSubActive(sub.href);
                      const submenuItemClasses = `${
                        styles[
                          "profile-drawer-menu__activity-nav-sub-menu-item"
                        ]
                      } ${
                        subActive
                          ? styles[
                              "profile-drawer-menu__activity-nav-sub-menu-item--active"
                            ]
                          : ""
                      }`;
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={submenuItemClasses}
                          onClick={() => onClose?.()}
                        >
                          <Text textStyle="12S4" textColor="gray-700">
                            {sub.label}
                          </Text>
                        </Link>
                      );
                    })}
                  </div>
                )}
            </div>
          );
        })}
        <div
          className={
            styles["profile-drawer-menu__activity-nav-collapsible-wrapper"]
          }
        >
          <Button fullScreen onClick={toggleActivities}>
            <div
              className={
                styles[
                  "profile-drawer-menu__activity-nav-collapsible-btn-detail"
                ]
              }
            >
              <Activity size={24} color="var(--gray-700)" variant="Bulk" />
              <Text textStyle="16S5" textColor="gray-600">
                فعالیت‌های من
              </Text>
            </div>
            <ArrowDown2
              size={16}
              color="var(--gray-700)"
              className={`${
                styles["profile-drawer-menu__activity-nav-arrow"]
              } ${
              isActivitiesOpen || shouldKeepActivitiesOpen
                  ? styles["profile-drawer-menu__activity-nav-arrow--rotated"]
                  : ""
              }`}
            />
          </Button>
        {(isActivitiesOpen || shouldKeepActivitiesOpen) && (
            <div
              className={styles["profile-drawer-menu__activity-nav-sub-menu"]}
            >
              {activitiesSubMenuItems.map((item) => {
                const active = isItemActive(item.href);
                const submenuItemClasses = `${
                  styles["profile-drawer-menu__activity-nav-sub-menu-item"]
                } ${
                  active
                    ? styles[
                        "profile-drawer-menu__activity-nav-sub-menu-item--active"
                      ]
                    : ""
                }`;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={submenuItemClasses}
                    onClick={() => onClose?.()}
                  >
                    <Text textStyle="12S4" textColor="gray-700">
                      {item.label.length > 27
                        ? item.label?.substring(0, 24) + "..."
                        : item.label}
                    </Text>
                    <div
                      className={
                        styles[
                          "profile-drawer-menu__activity-nav-sub-menu-item-count"
                        ]
                      }
                    >
                      <Text textStyle="12S7" textColor="gray-700">
                        {item.label.length}
                      </Text>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {mainMenuItems.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles["profile-drawer-menu__nav-item"]} ${
                active ? styles["profile-drawer-menu__nav-item--active"] : ""
              }`}
              onClick={() => {
                if (onClose) onClose();
              }}
            >
              <div className={styles["profile-drawer-menu__nav-item-content"]}>
                <Icon
                  size={24}
                  color={active ? "var(--primary-700)" : "var(--gray-600)"}
                  variant="Bulk"
                />
                <Text
                  textStyle="16S5"
                  textColor={active ? "primary-700" : "gray-600"}
                  fontFamily="moraba"
                >
                  {item.label.length > 18
                    ? item.label?.substring(0, 15) + "..."
                    : item.label}
                </Text>
              </div>
            </Link>
          );
        })}
        {/* موقتا حذف شده */}
        <Button fullScreen onClick={handleLogout} paddingStyle="none">
          <div className={styles["profile-drawer-menu__logout-btn"]}>
            <Text fontFamily="moraba" textStyle="16S5" textColor="gray-600">
              خروج از حساب
            </Text>
            <LogoutCurve size={24} variant="Bulk" color="var(--error-500)" />
          </div>
        </Button>
      </nav>
      {/* موقتا حذف شده */}
    </div>
  );
}
