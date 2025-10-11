import React, { useEffect, useState } from "react";
import styles from "./UserFinancialInfo.module.scss";
import UserFinancialInfoModal from "./userFinancialInfoModal/UserFinancialInfoModal";
import Button from "@/components/ui/actions/button/Button";
import Text from "@/components/ui/text/Text";
// import QuadInfoCard from "@/components/ui/cards/quadInfoCard/QuadInfoCard";
import FinancialInfoCard from "@/components/ui/cards/financialInfoCard/FinancialInfoCard";
// import type { UserCardInfo } from "./userFinancialInfoModal/UserFinancialInfoModal";
import { getUserBankCards, updateUserBankCard } from "@/services/api/bank";
import type { BankCardDto } from "@/dtos/bankCards.dto";
import { getImageUrl } from "@/utils/imageUtils";

export default function UserFinancialInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<BankCardDto[]>([]);

  const refreshCards = () => {
    setIsLoading(true);
    setError(null);
    getUserBankCards({ limit: 1000, offset: 0 })
      .then((items) => setCards(items || []))
      .catch((e) => setError(String(e?.message || e)))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    refreshCards();
  }, []);

  const handleAddCard = () => {
    // Placeholder: open modal will handle add flow later
  };
  return (
    <div className={styles["user-financial-info"]}>
      <div className={styles["user-financial-info_header"]}>
        <Button
          bgColor="primary-700"
          hoverColor="primary-800"
          shadow="primary-800"
          mode="side-rounded"
          paddingStyle="avg-8-32"
          onClick={() => setIsOpen(true)}
        >
          <Text fontFamily="moraba" textStyle="16S5" textColor="main-white">
            افزودن کارت
          </Text>
        </Button>

        <div className={styles["user-financial-info_content"]}>
          <div className={styles["user-financial-info_content_header"]}>
            <div className={styles["user-financial-info_content_header_cards"]}>
              {isLoading && (
                <Text textStyle="14S5" textColor="gray-700">
                  در حال بارگذاری...
                </Text>
              )}
              {!!error && !isLoading && (
                <Text textStyle="14S5" textColor="error-700">
                  {error}
                </Text>
              )}
              {!isLoading &&
                !error &&
                (() => {
                  const maxDefaultValue = cards.length
                    ? Math.max(...cards.map((x) => Number(x.is_default ?? 0)))
                    : 0;
                  const maxIndices = cards
                    .map((x, i) =>
                      Number(x.is_default ?? 0) === maxDefaultValue ? i : -1
                    )
                    .filter((i) => i !== -1);
                  const defaultIndex =
                    maxIndices.length === 1 ? maxIndices[0] : 0;
                  return cards.map((c, idx) => {
                    const bankName = c.bank_name || "بانک";
                    const numberLike =
                      c.iban || c.account_number || c.bank_code || "";
                    const isDefault = idx === defaultIndex;
                    const logoSrc = getImageUrl(c.bank_logo_url);
                    const accountId =
                      (c as { account_id?: number }).account_id || c.bank_id; // fallback if account_id not present
                    return (
                      <div
                        key={`${accountId}-${idx}`}
                        className={
                          styles["user-financial-info_content_header_card"]
                        }
                      >
                        <Text
                          fontFamily="moraba"
                          textStyle="16S7"
                          textColor="main-black"
                        >
                          {bankName}
                        </Text>
                        <FinancialInfoCard
                          bankName={bankName}
                          cardNumber={numberLike}
                          isDefault={isDefault}
                          bankLogoSrc={logoSrc}
                          onSetDefault={async () => {
                            try {
                              // افزایش مقدار is_default برای این کارت نسبت به بقیه، بدون رفرش لیست
                              const currentMax = cards.length
                                ? Math.max(
                                    ...cards.map((x) =>
                                      Number(x.is_default ?? 0)
                                    )
                                  )
                                : 0;
                              await updateUserBankCard(accountId, {
                                is_default: currentMax + 1,
                              });
                              setCards((prev) =>
                                prev.map((item) => {
                                  const id =
                                    (item as { account_id?: number })
                                      .account_id || item.bank_id;
                                  if (id === accountId) {
                                    return {
                                      ...item,
                                      is_default: currentMax + 1,
                                    } as BankCardDto;
                                  }
                                  return item;
                                })
                              );
                            } catch {
                              // handled globally
                            }
                          }}
                          onDelete={async () => {
                            try {
                              await updateUserBankCard(accountId, {
                                status_id: 9,
                                account_id: Number(accountId),
                              });
                              refreshCards();
                            } catch {
                              // handled globally
                            }
                          }}
                        />
                      </div>
                    );
                  });
                })()}
            </div>
          </div>
        </div>
      </div>
      <UserFinancialInfoModal
        isOpen={isOpen}
        setIsOpenAction={setIsOpen}
        onSubmit={handleAddCard}
      />
    </div>
  );
}
