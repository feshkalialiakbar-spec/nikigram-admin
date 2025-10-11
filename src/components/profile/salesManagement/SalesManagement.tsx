import React, { useMemo, useState } from "react";
import styles from "./SalesManagement.module.scss";
import Badge from "@/components/ui/badge/Badge";
import Text from "@/components/ui/text/Text";
import {
  Lock1,
  Receipt1,
  ExportSquare,
  DocumentUpload,
  Edit,
  More,
} from "iconsax-react";
import Pagination from "@/components/ui/pagination/Pagination";
import useWindowWidth from "@/hooks/useWindowWidth";
import SalesManagementModal from "./salesManagementModal/SalesManagementModal";
import TransactionDetails from "@/components/ui/cards/transactionDetails/TransactionDetails";
import { UserWalletTransaction } from "@/mocks/userWalletPagination";

export default function SalesManagement() {
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState<
    | "همه"
    | "در انتظار آزادسازی"
    | "مدرک بارگذاری شده"
    | "آزاد شده"
    | "رد شده"
    | "نیکی ارسالی"
  >("همه");
  const pageSize = 10;

  type SaleStatus =
    | "درانتظار"
    | "مدرک بارگذاری شده"
    | "آزاد شده"
    | "رد شده"
    | "نیکی ارسالی";
  type OperationType = "export" | "upload" | "edit" | "more";
  type SaleRow = {
    __i: number;
    amount: number;
    source: string;
    date: string; // ISO date like 2024-05-18
    time: string; // HH:mm:ss
    status: SaleStatus;
    ops: OperationType[];
  };

  const rows: SaleRow[] = useMemo(() => {
    const pickRandomOps = (): OperationType[] => {
      const all: OperationType[] = ["export", "upload", "edit", "more"];
      const count = Math.random() < 0.5 ? 1 : 2; // 1 یا 2 آیکن
      const shuffled = [...all].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
    };
    return [
      {
        __i: 1,
        amount: 200,
        source: "محمد حسین احمدی",
        date: "2024-05-18",
        time: "11:33:45",
        status: "درانتظار",
        ops: pickRandomOps(),
      },
      {
        __i: 2,
        amount: 320,
        source: "زهرا محمدی",
        date: "2024-05-19",
        time: "12:05:10",
        status: "مدرک بارگذاری شده",
        ops: pickRandomOps(),
      },
      {
        __i: 3,
        amount: 150,
        source: "رضا کریمی",
        date: "2024-05-20",
        time: "09:22:31",
        status: "رد شده",
        ops: pickRandomOps(),
      },
      {
        __i: 4,
        amount: 450,
        source: "فاطمه رستمی",
        date: "2024-05-21",
        time: "14:17:59",
        status: "آزاد شده",
        ops: pickRandomOps(),
      },
      {
        __i: 5,
        amount: 80,
        source: "سینا جلالی",
        date: "2024-05-22",
        time: "18:46:03",
        status: "نیکی ارسالی",
        ops: pickRandomOps(),
      },
      {
        __i: 6,
        amount: 275,
        source: "نگین موسوی",
        date: "2024-05-23",
        time: "10:11:44",
        status: "درانتظار",
        ops: pickRandomOps(),
      },
      {
        __i: 7,
        amount: 600,
        source: "علی رضوی",
        date: "2024-05-24",
        time: "16:35:27",
        status: "مدرک بارگذاری شده",
        ops: pickRandomOps(),
      },
      {
        __i: 8,
        amount: 95,
        source: "هدی اکبری",
        date: "2024-05-25",
        time: "08:03:12",
        status: "آزاد شده",
        ops: pickRandomOps(),
      },
      {
        __i: 9,
        amount: 410,
        source: "محمدجواد صادقی",
        date: "2024-05-26",
        time: "13:58:06",
        status: "رد شده",
        ops: pickRandomOps(),
      },
      {
        __i: 10,
        amount: 220,
        source: "مریم فرهمند",
        date: "2024-05-27",
        time: "19:21:49",
        status: "درانتظار",
        ops: pickRandomOps(),
      },
      {
        __i: 11,
        amount: 130,
        source: "حسین امیری",
        date: "2024-05-28",
        time: "07:45:20",
        status: "آزاد شده",
        ops: pickRandomOps(),
      },
      {
        __i: 12,
        amount: 360,
        source: "نرگس یوسفی",
        date: "2024-05-29",
        time: "15:29:55",
        status: "نیکی ارسالی",
        ops: pickRandomOps(),
      },
    ];
  }, []);

  const filteredRows = useMemo(() => {
    if (filterType === "همه") return rows;
    if (filterType === "در انتظار آزادسازی")
      return rows.filter((r) => r.status === "درانتظار");
    return rows.filter((r) => r.status === filterType);
  }, [rows, filterType]);

  const { width, hydrated } = useWindowWidth();
  const isDesktop = hydrated && width >= 1280;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRowForEdit, setSelectedRowForEdit] = useState<SaleRow | null>(null);
  const onClose = () => {
    setIsOpen(false);
    setSelectedRowForEdit(null);
  };

  // Details modal state
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<UserWalletTransaction | null>(null);
  const onCloseDetails = () => setIsDetailsOpen(false);

  const handleOpenModal = () => setIsOpen(true);
  return (
    <div className={styles["sales-management"]}>
      <Badge size="md" bgc="primary-50" fullWidth={true} borderRadius="24px">
        <div className={styles["sales-management__badge"]}>
          <Lock1 size={24} color="var(--primary-700)" variant="Linear" />
          <div className={styles["sales-management__badge-text"]}>
            <Text textAlign="right" textStyle="14S5" textColor="primary-700">
              کاربر نیکی‌گرام،
            </Text>
            <Text textAlign="right" textStyle="14S5" textColor="primary-700">
              برای آزادسازی نیکی‌های دریافتی، باید فاکتورهای فروش خود را به ازای
              هر رکورد فروش بارگذاری کنید.
            </Text>
          </div>
        </div>
      </Badge>
      <div className={styles["sales-management__table"]}>
        <div className={styles["sales-management__table-header"]}>
          <Receipt1 size={24} color="var(--gray-700)" variant="Bulk" />
          <Text textStyle="16S5" textColor="gray-700" textTag="p">
            لیست تراکنش‌های فروش
          </Text>
        </div>
        <div className={styles["filter-bar"]}>
          {(
            [
              "همه",
              "در انتظار آزادسازی",
              "مدرک بارگذاری شده",
              "آزاد شده",
              "رد شده",
              "نیکی ارسالی",
            ] as const
          ).map((label) => (
            <button
              key={label}
              type="button"
              className={[
                styles["filter-option"],
                filterType === label ? styles["active"] : "",
              ].join(" ")}
              onClick={() => {
                setFilterType(label);
                setPage(1);
              }}
            >
              <span className={styles["radio"]} />
              {label}
            </button>
          ))}
        </div>
        <div className={styles["pagination-container"]}>
          <Pagination
            items={filteredRows}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            renderHeader={(classes) => (
              <tr>
                <th>{isDesktop ? "مقدار نیکی" : "مقدار"}</th>
                <th>{isDesktop ? "مبدا" : "مبدا"}</th>
                <th>تاریخ</th>
                {isDesktop && <th>ساعت</th>}
                <th>{isDesktop ? "وضعیت تراکنش" : "وضعیت"}</th>
                <th className={classes.detailsCell}>عملیات</th>
              </tr>
            )}
            renderRow={(row, classes) => (
              <tr>
                <td>{row.amount} نیکی</td>
                <td>{row.source}</td>
                <td>
                  {new Date(`${row.date}T${row.time}`).toLocaleDateString(
                    "fa-IR-u-ca-persian",
                    { year: "numeric", month: "2-digit", day: "2-digit" }
                  )}
                </td>
                {isDesktop && (
                  <td>
                    {new Date(`${row.date}T${row.time}`).toLocaleTimeString(
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
                <td className={classes.status(row.status)}>{row.status}</td>
                <td className={classes.detailsCell}>
                  <div
                    className={
                      styles["sales-management__operation-btn-container"]
                    }
                  >
                    {row.ops.map((op, idx) => (
                      <a
                        key={idx}
                        className={[
                          classes.detailsBtn,
                          styles["sales-management__operation-btn"],
                        ].join(" ")}
                        aria-label="عملیات"
                      >
                        {op === "export" && (
                          <ExportSquare
                            size={24}
                            color="#3B82F6"
                            variant="Bulk"
                          />
                        )}
                        {op === "upload" && (
                          <DocumentUpload
                            size={24}
                            color="#3B82F6"
                            variant="Bulk"
                            onClick={handleOpenModal}
                          />
                        )}
                        {op === "edit" && (
                          <Edit 
                            size={24} 
                            color="#3B82F6" 
                            variant="Bulk"
                            onClick={() => {
                              setSelectedRowForEdit(row);
                              setIsOpen(true);
                            }}
                          />
                        )}
                        {op === "more" && (
                          <More
                            size={24}
                            color="#3B82F6"
                            variant="Bulk"
                            onClick={() => {
                              const tx: UserWalletTransaction = {
                                id: row.__i,
                                type: "ارسال",
                                amount: row.amount,
                                date: row.date,
                              };
                              setSelectedTransaction(tx);
                              setIsDetailsOpen(true);
                            }}
                          />
                        )}
                      </a>
                    ))}
                  </div>
                </td>
              </tr>
            )}
          />
        </div>
      </div>
      {
        <TransactionDetails
          isOpen={isDetailsOpen}
          onClose={onCloseDetails}
          transaction={selectedTransaction ?? undefined}
        />
      }
      {isOpen && <SalesManagementModal isOpen={isOpen} onClose={onClose} selectedRow={selectedRowForEdit} />}
    </div>
  );
}
