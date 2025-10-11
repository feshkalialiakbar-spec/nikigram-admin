import React, { useMemo, useState } from "react";
import styles from "./SalesManagementModal.module.scss";
import Text from "@/components/ui/text/Text";
import Button from "@/components/ui/actions/button/Button";
import TextField from "@/components/ui/forms/textField/TextField";
import Dropdown from "@/components/ui/forms/dropdown/Dropdown";
import Modal from "@/components/ui/modal/Modal";
import FileUpload from "@/components/ui/fileUpload/FileUpload";
import Badge from "@/components/ui/badge/Badge";
import { Warning2 } from "iconsax-react";

type SaleRow = {
  __i: number;
  amount: number;
  source: string;
  date: string;
  time: string;
  status: string;
};

interface SalesManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRow?: SaleRow | null;
}

export default function SalesManagementModal({
  isOpen,
  onClose,
  selectedRow,
}: SalesManagementModalProps) {
  const amount = selectedRow ? `${selectedRow.amount} نیکی` : "200 نیکی";
  const time = selectedRow
    ? new Date(`${selectedRow.date}T${selectedRow.time}`).toLocaleTimeString(
        "fa-IR",
        {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }
      )
    : new Date().toLocaleTimeString("fa-IR", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

  const date = selectedRow
    ? new Date(`${selectedRow.date}T${selectedRow.time}`).toLocaleDateString(
        "fa-IR-u-ca-persian",
        {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }
      )
    : new Date().toLocaleDateString("fa-IR-u-ca-persian", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

  const [category, setCategory] = useState<string>("");
  const [subCategory, setSubCategory] = useState<string>("");
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const categoryOptions = useMemo(
    () => [
      { label: "انتخاب کالا / خدمت", value: "" },
      { label: "کالا", value: "product" },
      { label: "خدمت", value: "service" },
    ],
    []
  );

  const subCategoryOptions = useMemo(
    () => [
      { label: "انتخاب زیرشاخه کالا / خدمت", value: "" },
      { label: "زیرشاخه ۱", value: "sub1" },
      { label: "زیرشاخه ۲", value: "sub2" },
    ],
    []
  );

  const handleSubmit = () => {
    // در این مرحله می‌توان ارسال به سرور را اضافه کرد
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={selectedRow ? "ویرایش مدارک" : "بارگذاری مدارک"}
      body={
        <div className={styles["sales-management-modal"]}>
          {selectedRow && (
            <div style={{ width: "100%" }}>
              <Badge
                size="md"
                bgc="error-50"
                fullWidth={true}
                borderRadius="12px"
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Warning2 size={24} color="var(--error-700)" variant="Bulk" />
                  <div>
                    <Text
                      textAlign="right"
                      textStyle="14S5"
                      textColor="error-700"
                    >
                      تاریخ فاکتور آپلود شده با تاریخ تراکنش مطابقت ندارد.
                    </Text>
                    <Text
                      textAlign="right"
                      textStyle="14S5"
                      textColor="error-700"
                    >
                      لطفاً فاکتور جدیدی با تاریخ تراکنش صادر و آپلود کنید.
                    </Text>
                  </div>
                </div>
              </Badge>
            </div>
          )}
          <div className={styles["sales-management-modal__section-title"]}>
            <Text textTag="p" textStyle="14S5" textColor="gray-950">
              اطلاعات مورد نیاز را برای رکورد زیر وارد کنید
            </Text>
          </div>
          <div className={styles["sales-management-modal__first-row"]}>
            <div
              className={`${styles["sales-management-modal__first-row-item"]} ${styles["sales-management-modal__first-row-item--right"]}`}
            >
              <Text textTag="p" textStyle="14S4" textColor="gray-800">
                {amount}
              </Text>
            </div>
            <div
              className={`${styles["sales-management-modal__first-row-item"]} ${styles["sales-management-modal__first-row-item--center"]}`}
            >
              <Text textTag="p" textStyle="14S4" textColor="gray-800">
                {date}
              </Text>
            </div>
            <div
              className={`${styles["sales-management-modal__first-row-item"]} ${styles["sales-management-modal__first-row-item--left"]}`}
            >
              <Text textTag="p" textStyle="14S4" textColor="gray-800">
                {time}
              </Text>
            </div>
          </div>

          <div
            className={`${styles["sales-management-modal__row-shifter"]} ${styles["sales-management-modal__row-shifter--exception"]}`}
          >
            <Dropdown
              baseColor={{
                borderAndLabel: "gray-200",
                inputBgColor: "main-white",
                textInput: "gray-400",
                listBgColor: "main-white",
                listTextColor: "gray-950",
              }}
              value={category}
              onChangeAction={setCategory}
              size="sm"
              options={categoryOptions}
              placeholder="انتخاب کالا / خدمت"
            />
            <Dropdown
              baseColor={{
                borderAndLabel: "gray-200",
                inputBgColor: "main-white",
                textInput: "gray-400",
                listBgColor: "main-white",
                listTextColor: "gray-950",
              }}
              value={subCategory}
              onChangeAction={setSubCategory}
              size="sm"
              options={subCategoryOptions}
              placeholder="انتخاب زیرشاخه کالا / خدمت"
            />
          </div>

          <div className={styles["sales-management-modal__row-shifter"]}>
            <TextField
              baseColor={{
                borderAndLabel: "gray-200",
                inputBgColor: "main-white",
                textInput: "gray-800",
              }}
              label="تاریخ فاکتور"
              placeholder="مثلا ۱۴۰۳/۰۲/۲۹"
              size="sm"
              value={invoiceDate}
              onChangeAction={setInvoiceDate}
            />
            <TextField
              baseColor={{
                borderAndLabel: "gray-200",
                inputBgColor: "main-white",
                textInput: "gray-800",
              }}
              label="شماره فاکتور"
              placeholder="شماره فاکتور"
              size="sm"
              value={invoiceNumber}
              onChangeAction={setInvoiceNumber}
            />
          </div>

          <div className={styles["sales-management-modal__section-title"]}>
            <Text textTag="p" textStyle="14S5" textColor="gray-950">
              بارگذاری فاکتور فروش
            </Text>
          </div>

          <div className={styles["sales-management-modal__upload"]}>
            <FileUpload
              label=""
              value={file}
              onChange={setFile}
              onFocus={() => {}}
              onBlur={() => {}}
              isFocused={false}
              isEditing={true}
              accept="image/png, image/jpeg, image/svg+xml, image/gif, application/pdf"
              showException={{
                row1: { importIcon: true, importImage: false },
                row2: {
                  text1: "کلیک کنید",
                  text2: " یا فایل خود را اینجا رها کنید",
                },
                row3: {
                  beforeAddFile: true,
                  afterAddFile: file ? "" : "",
                },
              }}
            />

            {file && (
              <div className={styles["sales-management-modal__uploaded-file"]}>
                <Text textStyle="12S5" textColor="gray-700">
                  نام فایل آپلود شده
                </Text>
                <div
                  className={
                    styles["sales-management-modal__uploaded-file-box"]
                  }
                >
                  <Text textStyle="12S4" textColor="gray-950">
                    {file.name}
                  </Text>
                  <Button onClick={() => setFile(null)}>
                    <Text textStyle="10S5" textColor="error-700">
                      پاک کردن فایل
                    </Text>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      }
      footer={
        <div className={styles["sales-management-modal__footer"]}>
          <Button
            bgColor="primary-700"
            mode="side-rounded"
            shadow="primary-800"
            hoverColor="primary-700"
            fullScreen
            onClick={handleSubmit}
          >
            <Text
              textTag="span"
              textStyle="14S7"
              textColor="main-white"
              fontFamily="moraba"
            >
              {selectedRow ? "بروزرسانی مدارک" : "ثبت مدارک"}
            </Text>
          </Button>
        </div>
      }
    />
  );
}
