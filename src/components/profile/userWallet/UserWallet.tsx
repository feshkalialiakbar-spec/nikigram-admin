import React, { useMemo, useState, useEffect } from "react";
import styles from "./UserWallet.module.scss";
import Pagination from "@/components/ui/pagination/Pagination";
import {
  type TransactionType,
  type UserWalletTransaction,
  transformApiTransactionToLocal,
} from "@/mocks/userWalletPagination";
import { Receipt1, Receive, Transmit } from "iconsax-react";
import WalletCard from "@/components/ui/cards/walletCard/WalletCard";
import Text from "@/components/ui/text/Text";
import useWindowWidth from "@/hooks/useWindowWidth";
import TransactionDetails from "@/components/ui/cards/transactionDetails/TransactionDetails";
import { walletService, type WalletApiResponse } from "@/services/walletService";
// Link no longer needed since table renders inside Pagination

export default function UserWallet() {
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState<"همه" | TransactionType>("همه");
  const pageSize = 10;
  const [isTransactionDetailsOpen, setIsTransactionDetailsOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<UserWalletTransaction | undefined>();
  const [walletData, setWalletData] = useState<WalletApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  type WithIndex = UserWalletTransaction & { __i: number };

  // Fetch wallet data from API
  const fetchWalletData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await walletService.getMyWallet();
      setWalletData(data);
    } catch (err) {
      console.error('Error fetching wallet data:', err);
      setError('خطا در دریافت اطلاعات کیف پول');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const transactions = useMemo(() => {
    if (!walletData) return [];
    return walletData.transactions.map(transformApiTransactionToLocal);
  }, [walletData]);

  const filteredItems: WithIndex[] = useMemo(() => {
    const withIndex = transactions.map((t, i) => ({ ...t, __i: i }));
    if (filterType === "همه") return withIndex;
    return withIndex.filter((t) => t.type === filterType);
  }, [transactions, filterType]);

  // جدول و فرمت‌ها داخل Pagination مدیریت می‌شود

  const { width, hydrated } = useWindowWidth();
  const isDesktop = hydrated && width >= 1280;
  return (
    <div className={styles["user-wallet"]}>
      <TransactionDetails
        isOpen={isTransactionDetailsOpen}
        onClose={() => {
          setIsTransactionDetailsOpen(false);
          setSelectedTransaction(undefined);
        }}
        transaction={selectedTransaction}
      />
      <div className={styles["user-wallet__wallet-card"]}>
        <WalletCard 
          availableBalance={walletData ? parseFloat(walletData.detail.withdrawable_balance) : 0}
          lockedBalance={walletData ? parseFloat(walletData.detail.balance) - parseFloat(walletData.detail.withdrawable_balance) : 0}
          isLoading={isLoading}
          onDepositSuccess={fetchWalletData}
        />
      </div>
      <div className={styles["user-wallet__table-wrapper"]}>
        <div className={styles["user-wallet__table-wrapper-header"]}>
          <Receipt1 size={24} color="var(--gray-700)" variant="Bulk" />
          <Text textStyle="16S5" textColor="gray-700" textTag="p">
            گزارشات
          </Text>
        </div>
        <div className={styles["filter-bar"]}>
          {(["همه", "ارسال", "افزایش", "عودت", "دریافت"] as const).map(
            (label) => (
              <button
                key={label}
                type="button"
                className={[
                  styles["filter-option"],
                  filterType === label ? styles["active"] : "",
                ].join(" ")}
                onClick={() => {
                  setFilterType(label as TransactionType | "همه");
                  setPage(1);
                }}
              >
                <span className={styles["radio"]} />
                {label}
              </button>
            )
          )}
        </div>
        {error && (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--error-600)' }}>
            <Text textStyle="14S4" textColor="error-600">
              {error}
            </Text>
          </div>
        )}
        {isLoading && (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <Text textStyle="14S4" textColor="gray-500">
              در حال بارگذاری تراکنش‌ها...
            </Text>
          </div>
        )}
        {!isLoading && !error && (
          <div className={styles["pagination-container"]}>
            <Pagination
            items={filteredItems}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            renderHeader={(classes) => (
              <tr>
                <th>{isDesktop ? "نوع تراکنش" : "نوع"}</th>
                <th>{isDesktop ? "مقدار نیکی" : "مقدار"}</th>
                <th>تاریخ</th>
                {isDesktop && <th>ساعت</th>}
                <th>{isDesktop ? "وضعیت تراکنش" : "وضعیت"}</th>
                <th className={classes.detailsCell}>جزئیات</th>
              </tr>
            )}
            renderRow={(tx, classes) => (
              <tr>
                <td>
                  <div className={styles["transaction-type"]}>
                    <div
                      className={styles["transaction-type-icons"]}
                      style={{
                        borderColor:
                          tx.type === "ارسال" || tx.type === "عودت"
                            ? "var(--secondary1-600)"
                            : "var(--error-600)",
                      }}
                    >
                      {tx.type === "ارسال" || tx.type === "عودت" ? (
                        <Receive
                          size={12}
                          color="var(--secondary1-600)"
                          variant="Bulk"
                        />
                      ) : (
                        <Transmit
                          size={12}
                          color="var(--error-600)"
                          variant="Bulk"
                        />
                      )}
                    </div>
                    {tx.type}
                  </div>
                </td>
                <td>{tx.amount} نیکی</td>
                <td>
                  {new Date(`${tx.date}T11:33:45`).toLocaleDateString(
                    "fa-IR-u-ca-persian",
                    { year: "numeric", month: "2-digit", day: "2-digit" }
                  )}
                </td>
                {isDesktop && (
                  <td>
                    {new Date(`${tx.date}T11:33:45`).toLocaleTimeString(
                      "fa-IR",
                      {
                        hour12: false,
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      }
                    )}
                  </td>
                )}
                <td className={classes.status(tx.status)}>{tx.status}</td>
                <td className={classes.detailsCell}>
                  <a
                    onClick={() => { 
                      setSelectedTransaction(tx);
                      setIsTransactionDetailsOpen(true);
                    }}
                    className={classes.detailsBtn}
                    aria-label="جزئیات"
                  >
                    …
                  </a>
                </td>
              </tr>
            )}
          />
          </div>
        )}
      </div>
    </div>
  );
}
