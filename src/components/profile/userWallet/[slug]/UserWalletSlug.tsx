import React from "react";
import styles from "./UserWalletSlug.module.scss";
import { userWalletTransactions } from "@/mocks/userWalletPagination";
import Button from "@/components/ui/actions/button/Button";
import { ArrowRight3 } from "iconsax-react";
import Text from "@/components/ui/text/Text";

type Props = {
  slug: string;
  onBack?: () => void;
};

export default function UserWalletSlug({ slug, onBack }: Props) {
  const withIndex = userWalletTransactions.map((t, i) => ({
    ...t,
    __slug: `${t.date}-${i}`,
  }));
  const tx = withIndex.find((t) => t.__slug === slug);

  if (!tx) {
    return (
      <div className={styles["wallet-slug"]}>
        <p>موردی با این شناسه پیدا نشد.</p>
        {onBack && (
          <Button onClick={onBack} paddingStyle="equal-8">
            بازگشت
          </Button>
        )}
      </div>
    );
  }

  const formatJalaliDate = (isoDate: string) => {
    const d = new Date(`${isoDate}T11:33:45`);
    return d.toLocaleDateString("fa-IR-u-ca-persian", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const format24Time = (isoDate: string) => {
    const d = new Date(`${isoDate}T11:33:45`);
    return d.toLocaleTimeString("fa-IR", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className={styles["wallet-slug"]}>
      {onBack && (
        <Button onClick={onBack} paddingStyle="equal-8" bgColor="transparent">
          <ArrowRight3 size={20} color="var(--primary-700)" variant="Bulk" />
          <Text textColor="primary-700" textStyle="14S5">
            بازگشت
          </Text>
        </Button>
      )}
      <div className={styles["header"]}>
        <h2>جزئیات تراکنش</h2>
      </div>
      <ul className={styles["details"]}>
        <li>
          <strong>نوع تراکنش:</strong> {tx.type}
        </li>
        <li>
          <strong>مقدار نیکی:</strong> {tx.amount} نیکی
        </li>
        <li>
          <strong>تاریخ:</strong> {formatJalaliDate(tx.date)}
        </li>
        <li>
          <strong>ساعت:</strong> {format24Time(tx.date)}
        </li>
        <li>
          <strong>وضعیت:</strong> {tx.status}
        </li>
      </ul>
    </div>
  );
}
