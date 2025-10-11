import ParsehImage from "@/components/ui/image/ParsehImage";
import React, { useMemo, useState } from "react";
import InboxEmpty from "@/assets/images/global/inboxEmpty.svg";
import styles from "./UserActivitiesTenders.module.scss";
import Text, { Colors } from "@/components/ui/text/Text";
import Button from "@/components/ui/actions/button/Button";
import DualSkewCard from "@/components/ui/cards/dualSkewCard/DualSkewCard";
import ProjectCard from "@/components/ui/cards/projectCard/ProjectCard";
import TenderCard, {
  TenderCardProps,
} from "@/components/ui/cards/tenderCard/TenderCard";
import { Edit, Edit2, Map, Money, Trash } from "iconsax-react";
import { useNumberFormatter } from "@/composables/useNumberFormatter";
import { useUserTenderProposals } from "@/hooks/useUserTenderProposals";
import { getImageUrlWithFallback } from "@/utils/imageUtils";
// تابع تبدیل داده‌های پروژه به فرمت TenderCard
const transformToTenderCard = (item: any): any => {
  // تعیین وضعیت بر اساس status عددی
  let tenderStatus = "active";

  switch (item.status) {
    case 1: // COLLECTING_MONEY
      tenderStatus = "better_offer";
      break;
    case 2: // PRICE_ESTIMATION
      tenderStatus = "better_offer";
      break;
    case 3: // IN_PROGRESS
      tenderStatus = "winner";
      break;
    case 4: // COMPLETED
      tenderStatus = "loser";
      break;
    default:
      tenderStatus = "active";
  }

  return {
    id: item.proj_request_id || item.project_id,
    title: item.project_name || "مناقصه",
    imageDetails: {
      imgSrc: item.charity?.logo || "/images/home/school.png",
      imgAlt: item.project_name || "تصویر مناقصه",
    },
    status: tenderStatus,
    proposedAmount: Math.round((item.total_awarded_price || 0) / 1000000), // تبدیل به میلیون تومان
    endDate: item.exp_date ? new Date(item.exp_date) : undefined,
    btnNode: {
      text: "مشاهده جزئیات",
      onClick: () => console.log("مشاهده جزئیات", item.id),
    },
    secondBtn: {
      text: "شرکت در مناقصه",
      onClick: () => console.log("شرکت در مناقصه", item.id),
    },
  };
};

export default function UserActivitiesTenders() {
  const [activeTab, setActiveTab] = useState(1);
  const { formatNumber } = useNumberFormatter();
  const { data: proposals, loading, error } = useUserTenderProposals();
  enum cardMode {
     inProgressTenders = "inProgressTenders",
    wonTenders = "wonTenders",
    endedTenders = "endedTenders",
    cancelledTenders = "cancelledTenders",
  }
  const tabs = [
    {
      id: 1,
      label: "مناقصه در حال انجام",
      color: "primary",
      model: cardMode.inProgressTenders,
    },
    {
      id: 2,
      label: "مناقصه برنده شده",
      color: "secondary1",
      model: cardMode.wonTenders,
    },
    { id: 3, 
      label: "مناقصه پایان یافته", 
      color: "error",
       model: cardMode.endedTenders },
    { id: 4, 
      label: "مناقصه لغو شده", 
      color: "gray",
       model: cardMode.cancelledTenders },
  ];

  type TenderSourceItem = {
    id: number;
    model: cardMode;
    tenderCardProps: TenderCardProps;
  };
  const tendersList: TenderSourceItem[] = useMemo(() => {
    if (!proposals || proposals.length === 0) return [];

    return proposals.map((p) => {
      // Map statuses to card model and badge
      let model: cardMode = cardMode.inProgressTenders;
      // tender_status: 1 collecting, 2 price estimation, 3 in progress, 4 completed (based on sample above in file)
      if (p.tender_status === 3) model = cardMode.wonTenders;
      else if (p.tender_status === 4) model = cardMode.endedTenders;

      if (p.proposal_status === 4) model = cardMode.cancelledTenders;

      const imageUrl = getImageUrlWithFallback(p.project_main_image, "/images/home/school.png");

      const baseBadge =
        model === cardMode.inProgressTenders
          ? { bgColor: "primary-50" as Colors, textColor: "primary-700" as Colors }
          : model === cardMode.wonTenders
          ? { bgColor: "secondary1-50" as Colors, textColor: "secondary1-700" as Colors }
          : model === cardMode.endedTenders
          ? { bgColor: "error-50" as Colors, textColor: "error-700" as Colors }
          : { bgColor: "gray-100" as Colors, textColor: "gray-700" as Colors };

      const statusText =
        model === cardMode.inProgressTenders
          ? p.is_lowest_price
            ? "پیشنهاد شما کمترین است"
            : "پیشنهاد بهتر از شما وجود دارد"
          : model === cardMode.wonTenders
          ? p.is_winner
            ? "شما برنده مناقصه شدید"
            : "در حال بررسی"
          : model === cardMode.endedTenders
          ? p.is_winner
            ? "مناقصه پایان یافت - برنده شدید"
            : "مناقصه پایان یافت"
          : "لغو شده";

      return {
        id: model === cardMode.inProgressTenders
          ? 1
          : model === cardMode.wonTenders
          ? 2
          : model === cardMode.endedTenders
          ? 3
          : 4,
        model,
        tenderCardProps: {
          title: p.tender_title || "مناقصه",
          imageDetails: {
            id: p.tender_id,
            imgSrc: imageUrl,
            imgAlt: p.tender_title || "تصویر مناقصه",
          },
          endDate: model === cardMode.inProgressTenders && p.end_date ? new Date(p.end_date) : undefined,
          badgeConfig: {
            status: statusText,
            bgColor: baseBadge.bgColor,
            textColor: baseBadge.textColor,
          },
          quadInfoNode:
            model === cardMode.inProgressTenders || model === cardMode.wonTenders || model === cardMode.endedTenders
              ? {
                  data: {
                    topLeft:
                      model === cardMode.wonTenders ? (
                        <Text textStyle="12S4" textColor="gray-500">
                          {new Date(p.proposal_date).toLocaleDateString("fa-IR")}
                        </Text>
                      ) : undefined,
                    bottomRight: (
                      <div
                        style={{
                          width: "fit-content",
                          height: "fit-content",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px",
                        }}
                      >
                        <Money size={20} color="var(--gray-950)" variant="Bulk" />
                        <Text textStyle="14S5" textColor="gray-500">
                          مبلغ پیشنهادی
                        </Text>
                      </div>
                    ),
                    bottomLeft: formatNumber(p.proposed_price || 0),
                  },
                  singleLine: true,
                  styleBox: {
                    alignItems: { top: "space-between", bottom: "space-between" },
                    justifyContent: { top: "space-between", bottom: "space-between" },
                  },
                }
              : undefined,
          onClick: () => {},
        },
      } as TenderSourceItem;
    });
  }, [proposals, formatNumber]);

  if (loading) {
    return (
      <div className={styles["user-activities-tenders"]}>
        <div className={styles["user-activities-tenders__empty"]}>
          <Text textStyle="16S4" textColor="gray-700">در حال بارگذاری...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles["user-activities-tenders"]}>
        <div className={styles["user-activities-tenders__empty"]}>
          <Text textStyle="16S4" textColor="error-500">خطا در دریافت اطلاعات: {error}</Text>
        </div>
      </div>
    );
  }

  const filteredList = tendersList.filter((item) => item.id === activeTab);
  return (
    <div className={styles["user-activities-tenders"]}>
      <div className={styles["user-activities-tenders__tabs"]}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`${styles["user-activities-tenders__tab"]} ${
              activeTab === tab.id
                ? styles["user-activities-tenders__tab--active"]
                : ""
            }`}
            data-color={tab.color}
            onClick={() => setActiveTab(tab.id)}
          >
            <Text
              textStyle="14S5"
              textColor={
                activeTab === tab.id
                  ? (`${tab.color}-700` as Colors)
                  : "gray-600"
              }
            >
              {tab.label}
            </Text>
          </div>
        ))}
      </div>
      {filteredList.length <= 0 ? (
        <div className={styles["user-activities-tenders__empty"]}>
          <div className={styles["user-activities-tenders__empty-img-wrapper"]}>
            <ParsehImage
              imgSrc={InboxEmpty}
              imgAlt="ok"
              fitDirection="width"
              fill
              aspectRatio="1/1"
            />
          </div>
          <Text textStyle="16S7" textColor="gray-950">
            شما هنوز در مناقصه‌ای شرکت نکرده‌اید.
          </Text>
          <Text textStyle="16S4" textColor="gray-700">
            مناقصه‌های فعال و مهم منتظر پیشنهاد شما هستند. به آنها سر بزنید و
            پیشنهاد خود را ثبت کنید!
          </Text>
          <Button
            bgColor="primary-700"
            mode="side-rounded"
            paddingStyle="avg-8-32"
            shadow="primary-800"
            onClick={() => {}}
          >
            <Text textStyle="16S5" textColor="main-white" fontFamily="moraba">
              مشاهده مناقصه‌ها
            </Text>
          </Button>
        </div>
      ) : (
        <div className={styles["user-activities-tenders__list"]}>
          {filteredList.map((item, index) => (
            <TenderCard
              key={index}
              imageDetails={item.tenderCardProps.imageDetails}
              title={item.tenderCardProps.title}
              endDate={
                item.model === cardMode.inProgressTenders
                  ? item.tenderCardProps.endDate
                  : undefined
              }
              badgeConfig={{
                status: item.tenderCardProps.badgeConfig?.status || "",
                bgColor:
                  item.model === cardMode.inProgressTenders
                    ? "primary-50"
                    : item.model === cardMode.wonTenders
                    ? "secondary1-50"
                    : item.model === cardMode.endedTenders
                    ? "error-50"
                    : "gray-100",
                textColor:
                  item.model === cardMode.inProgressTenders
                    ? "primary-700"
                    : item.model === cardMode.wonTenders
                    ? "secondary1-700"
                    : item.model === cardMode.endedTenders
                    ? "error-700"
                    : "gray-700",
              }}
              onClick={item.tenderCardProps.onClick}
              quadInfoNode={
                item.model === cardMode.inProgressTenders
                  ? {
                      data: {
                        topLeft: (
                          <div
                            style={{
                              width: "fit-content",
                              height: "fit-content",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "4px",
                            }}
                          >
                            <Edit
                              size={20}
                              color="var(--primary-700)"
                              variant="Bulk"
                            />
                            <Trash
                              size={20}
                              color="var(--error-500)"
                              variant="Bulk"
                            />
                          </div>
                        ),
                        bottomRight: (
                          <div
                            style={{
                              width: "fit-content",
                              height: "fit-content",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "4px",
                            }}
                          >
                            <Money
                              size={20}
                              color="var(--gray-950)"
                              variant="Bulk"
                            />
                            <Text textStyle="14S5" textColor="gray-500">
                              مبلغ پیشنهادی
                            </Text>
                          </div>
                        ),
                        bottomLeft: formatNumber(
                          (item.tenderCardProps.quadInfoNode?.data
                            ?.bottomLeft as number) || 0
                        ),
                      },
                      styleBox: {
                        alignItems: {
                          top:
                            item.tenderCardProps.quadInfoNode?.styleBox
                              ?.alignItems?.top || "space-between",
                          bottom:
                            item.tenderCardProps.quadInfoNode?.styleBox
                              ?.alignItems?.bottom || "space-between",
                        },
                        justifyContent: {
                          top:
                            item.tenderCardProps.quadInfoNode?.styleBox
                              ?.justifyContent?.top || "space-between",
                          bottom:
                            item.tenderCardProps.quadInfoNode?.styleBox
                              ?.justifyContent?.bottom || "space-between",
                        },
                      },
                    }
                  : item.model === cardMode.wonTenders
                  ? {
                      data: {
                        topLeft: (
                          <Text textStyle="12S4" textColor="gray-500">
                            {
                              item.tenderCardProps.quadInfoNode?.data
                                ?.topLeft as number
                            }{" "}
                            روز پیش
                          </Text>
                        ),
                        bottomRight: (
                          <div
                            style={{
                              width: "fit-content",
                              height: "fit-content",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "4px",
                            }}
                          >
                            <Money
                              size={20}
                              color="var(--gray-950)"
                              variant="Bulk"
                            />
                            <Text textStyle="14S5" textColor="gray-500">
                              مبلغ پیشنهادی
                            </Text>
                          </div>
                        ),
                        bottomLeft: formatNumber(
                          (item.tenderCardProps.quadInfoNode?.data
                            ?.bottomLeft as number) || 0
                        ),
                      },
                      styleBox: {
                        alignItems: {
                          top:
                            item.tenderCardProps.quadInfoNode?.styleBox
                              ?.alignItems?.top || "space-between",
                          bottom:
                            item.tenderCardProps.quadInfoNode?.styleBox
                              ?.alignItems?.bottom || "space-between",
                        },
                        justifyContent: {
                          top:
                            item.tenderCardProps.quadInfoNode?.styleBox
                              ?.justifyContent?.top || "space-between",
                          bottom:
                            item.tenderCardProps.quadInfoNode?.styleBox
                              ?.justifyContent?.bottom || "space-between",
                        },
                      },
                    }
                    : item.model === cardMode.endedTenders
                  ? {
                      data: {
                        topLeft: (
                          <div
                            style={{
                              width: "fit-content",
                              height: "fit-content",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "4px",
                            }}
                          >
                            <Edit
                              size={20}
                              color="var(--primary-700)"
                              variant="Bulk"
                            />
                            <Trash
                              size={20}
                              color="var(--error-500)"
                              variant="Bulk"
                            />
                          </div>
                        ),
                        bottomRight: (
                          <div
                            style={{
                              width: "fit-content",
                              height: "fit-content",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "4px",
                            }}
                          >
                            <Money
                              size={20}
                              color="var(--gray-950)"
                              variant="Bulk"
                            />
                            <Text textStyle="14S5" textColor="gray-500">
                              مبلغ پیشنهادی
                            </Text>
                          </div>
                        ),
                        bottomLeft: formatNumber(
                          (item.tenderCardProps.quadInfoNode?.data
                            ?.bottomLeft as number) || 0
                        ),
                      },
                      styleBox: {
                        alignItems: {
                          top:
                            item.tenderCardProps.quadInfoNode?.styleBox
                              ?.alignItems?.top || "space-between",
                          bottom:
                            item.tenderCardProps.quadInfoNode?.styleBox
                              ?.alignItems?.bottom || "space-between",
                        },
                        justifyContent: {
                          top:
                            item.tenderCardProps.quadInfoNode?.styleBox
                              ?.justifyContent?.top || "space-between",
                          bottom:
                            item.tenderCardProps.quadInfoNode?.styleBox
                              ?.justifyContent?.bottom || "space-between",
                        },
                      },
                    }
                  : undefined
              }
              actionsNode={
                item.model === cardMode.inProgressTenders ? null : item.model ===
                  cardMode.wonTenders ? (
                  <Button
                    bgColor="primary-700"
                    mode="side-rounded"
                    paddingStyle="avg-8-32"
                    shadow="primary-800"
                    fullScreen={true}
                    onClick={item.tenderCardProps.onClick}
                  >
                    <Text
                      textStyle="16S5"
                      textColor="main-white"
                      fontFamily="moraba"
                    >
                      مشاهده وظایف
                    </Text>
                  </Button>
                ) : item.model === cardMode.endedTenders ? null : item.model ===
                    cardMode.cancelledTenders ? (
                  <Button
                    bgColor="transparent"
                    mode="side-rounded"
                    paddingStyle="avg-8-32"
                    borderColor="primary-700"
                    fullScreen={true}
                    onClick={() => {}}
                  >
                    <Text
                      textStyle="16S5"
                      textColor="primary-700"
                      fontFamily="moraba"
                    >
                      مشاهده جزئیات
                    </Text>
                  </Button>
                ) : null
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
