import ActivitiesSummaryCard from "@/components/ui/cards/ActivitiesSummaryCard/ActivitiesSummaryCard";
import React from "react";
import styles from "./ActivitiesSummary.module.scss";
import ParsehImage from "@/components/ui/image/ParsehImage";
import InboxEmpty from "@/assets/images/global/inboxEmpty.svg";
import Text from "@/components/ui/text/Text";
import Button from "@/components/ui/actions/button/Button";

const activitiesSummaryData = [
  {
    title: "ناظر ساخت مدرسه",
    time: new Date("2025-01-09T12:00:00"),
    yourStatus: "winner",
    winBadgeText: ["تبریک! شما در مناقصه برنده شدید"],
  },
  {
    title: "مناقصه های من",
    time: new Date("2025-09-09T12:00:00"),
    yourStatus: "pending",
    winBadgeText: [
      "پیشنهادی بهتر از شما وجود دارد.",
      "امیدواریم پیشنهاد خود را تعدیل نمایید.",
    ],
  },
  {
    title: "مددکاری مدرسه",
    time: new Date("2025-09-09T12:00:00"),
    yourStatus: "winner",
    winBadgeText: ["تبریک! شما در مناقصه برنده شدید"],
  },
  {
    title: "انجمن حمایت از ناهار",
    time: new Date("2025-06-09T12:00:00"),
    yourStatus: "loser",
    winBadgeText: ["متاسفانه برنده نشدید و زمان مناقصه به پایان رسید."],
  },
];

export default function ActivitiesSummary() {
  return (
    <>
      {activitiesSummaryData.length > 0 ? (
        <div className={styles["activities-summary"]}>
          {activitiesSummaryData.map((item, index) => (
            <ActivitiesSummaryCard
              key={index}
              showItem={{
                title: item.title,
                time: item.time,
                yourStatus: item.yourStatus as "winner" | "pending" | "loser",
                winBadgeText: item.winBadgeText,
              }}
            />
          ))}
        </div>
      ) : (
        <div className={styles["activities-summary_empty"]}>
          <div className={styles["activities-summary_empty-img-wrapper"]}>
            <ParsehImage
              imgSrc={InboxEmpty}
              imgAlt="ok"
              width={156}
              height={156}
              fitDirection="width"
              aspectRatio="1/1"
            />
          </div>
          <Text textStyle="16S7" textColor="main-black">
            شما هنوز در مناقصه‌ای شرکت نکرده‌اید
          </Text>
          <Text textStyle="16S4" textColor="gray-700">
            مناقصه‌های فعال و مهم منتظر پیشنهاد شما هستند. به آنها سر بزنید و
            پیشنهاد خود را ثبت کنید!
          </Text>
          <Button
            bgColor="primary-700"
            mode="side-rounded"
            paddingStyle="fat"
            shadow="primary-800"
          >
            <Text textStyle="16S5" textColor="main-white" fontFamily="moraba">
              مشاهده مناقصه‌ها
            </Text>
          </Button>
        </div>
      )}
    </>
  );
}
