import React, { useEffect, useMemo, useState } from "react";
import styles from "./NikiSendSettings.module.scss";
import Text from "@/components/ui/text/Text";
import Dropdown from "@/components/ui/forms/dropdown/Dropdown";
import Button from "@/components/ui/actions/button/Button";
import { getFunds, setDefaultFund } from "@/services/api/funds";
import type { FundDto } from "@/dtos/funds.dto";

const fundTypeOptions = [
  { label: "مهربانی", value: "kindness" },
  { label: "آموزش", value: "education" },
  { label: "سلامت", value: "health" },
];


export default function NikiSendSettings() {
  const [fundType, setFundType] = useState<string>(fundTypeOptions[0].value);
  // const [project, setProject] = useState<string>(projectOptions[0].value);
  const [funds, setFunds] = useState<FundDto[]>([]);
  const [selectedFundId, setSelectedFundId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    getFunds({ pid: undefined })
      .then((response) => {
        setFunds(response.data || []);
        if (response.data && response.data.length > 0) setSelectedFundId(String(response.data[0].id));
      })
      .catch((e) => console.error("Error fetching funds:", e))
      .finally(() => setIsLoading(false));
  }, []);

  const fundOptions = useMemo(
    () =>
      funds.map((f) => ({ label: f.title || String(f.id), value: String(f.id) })),
    [funds]
  );

  const selectedFund = useMemo(
    () => funds.find((f) => String(f.id) === selectedFundId),
    [funds, selectedFundId]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFundId) return;
    try {
      await setDefaultFund(Number(selectedFundId));
    } catch {
      // خطاها به صورت سراسری مدیریت می‌شود
    }
  };

  return (
    <form className={styles["niki-send-settings"]} onSubmit={handleSubmit}>
      <div className={styles["niki-send-settings__info"]}>
        <Text textStyle="14S5" textColor="primary-700" textAlign="right">
          صندوق پیش‌فرض برای ارسال نیکی، صندوق مهربانی است. نیکی‌هایی که از طرف
          شما اهدا می‌شوند، به‌صورت پیش‌فرض به این صندوق واریز می‌شوند. می‌توانید
          هر زمان خواستید، صندوق دیگری را انتخاب کنید.
        </Text>
      </div>

      <Text
        textTag="h3"
        textStyle="16S7"
        textColor="primary-950"
        fontFamily="moraba"
        textAlign="right"
      >
        صندوق مد نظر خود را انتخاب کنید
      </Text>

      <div className={styles["niki-send-settings__fields"]}>
        <Dropdown
          id="fundId"
          value={selectedFundId}
          onChangeAction={setSelectedFundId}
          placeholder={isLoading ? "در حال بارگذاری صندوق‌ها..." : "انتخاب صندوق"}
          label="انتخاب صندوق"
          size="sm"
          options={fundOptions}
          baseColor={{
            borderAndLabel: "gray-300",
            inputBgColor: "main-white",
            textInput: "gray-950",
            textError: "error-900",
            listBgColor: "main-white",
            listTextColor: "gray-950",
          }}
        />
        {selectedFund?.description && (
          <div style={{ marginTop: "8px" }}>
            <Text textStyle="14S5" textColor="gray-700" textAlign="right">
              {selectedFund.description}
            </Text>
          </div>
        )}

        <Dropdown
          id="fundType"
          value={fundType}
          onChangeAction={setFundType}
          placeholder="نوع صندوق"
          label="نوع صندوق"
          size="sm"
          options={fundTypeOptions}
          baseColor={{
            borderAndLabel: "gray-300",
            inputBgColor: "main-white",
            textInput: "gray-950",
            textError: "error-900",
            listBgColor: "main-white",
            listTextColor: "gray-950",
          }}
        />
 
      </div>

      <div className={styles["niki-send-settings__actions"]}>
        <Button
          type="submit"
          bgColor="primary-700"
          hoverColor="primary-800"
          shadow="primary-800"
          mode="side-rounded"
          paddingStyle="avg-8-32"
        >
          <Text fontFamily="moraba" textStyle="16S5" textColor="main-white">
            تغییر اطلاعات
          </Text>
        </Button>
      </div>
    </form>
  );
}
