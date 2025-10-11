import React, { useState, useEffect } from "react";
import styles from "./WithdrawFromOther.module.scss";
import Text from "@/components/ui/text/Text";
import Button from "@/components/ui/actions/button/Button";
import Dropdown from "@/components/ui/forms/dropdown/Dropdown";
import Checkbox from "@/components/ui/forms/checkbox/Checkbox";
import DrawerModal from "@/components/ui/modal/drawerModal/DrawerModal";
import Modal from "@/components/ui/modal/Modal";
import NikiInputAmountWalletSection from "../walletComponents/nikiInputAmountWalletSection/NikiInputAmountWalletSection";
import DepositNikiInDeviceWalletSection from "../walletComponents/depositNikiInDeviceWalletSection/DepositNikiInDeviceWalletSection";
import WithdrawNikiToOtherUser from "./withdrawNikiToOtherUser/WithdrawNikiToOtherUser";
import Badge from "@/components/ui/badge/Badge";
import { TickCircle } from "iconsax-react";
import {
  walletService,
  type WalletApiResponse,
} from "@/services/walletService";

interface WithdrawFromOtherProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function WithdrawFromOther({
  isOpen,
  setIsOpen,
}: WithdrawFromOtherProps) {
  const [nikiAmount, setNikiAmount] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [useCredit, setUseCredit] = useState(false);
  const [increaseOption, setIncreaseOption] = useState("same-device");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [showWithdrawNikiToOtherUser, setShowWithdrawNikiToOtherUser] =
    useState(false);
  const [walletData, setWalletData] = useState<WalletApiResponse | null>(null);
  const [subOptions, setSubOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [subSelected, setSubSelected] = useState("");
  const [subLoading, setSubLoading] = useState(false);
  const [subError, setSubError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");


  // دریافت اطلاعات کیف پول
  const fetchWalletData = async () => {
    try {
      const data = await walletService.getMyWallet();
      setWalletData(data);
    } catch (err) {
      console.error("Error fetching wallet data:", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchWalletData();
    }
  }, [isOpen]);

  const availableBalanceNumber = walletData
    ? parseFloat(walletData.detail.withdrawable_balance)
    : 0;
  const parsedAmount = parseInt(nikiAmount || "0");

  // اعتبارسنجی مقدار با هر تغییر
  useEffect(() => {
    if (!parsedAmount || parsedAmount <= 0) {
      setAmountError("");
      return;
    }
    if (parsedAmount > availableBalanceNumber) {
      setAmountError(
        `مقدار وارد شده نمی 1 d8 aa ac a7 f0 9f 9f a9د از ${availableBalanceNumber.toLocaleString(
          "fa-IR"
        )} نیکی بیشتر باشد`
      );
    } else {
      setAmountError("");
    }
  }, [parsedAmount, availableBalanceNumber]);

  // واکشی لیست‌های وابسته به selectedOption
  useEffect(() => {
    const controller = new AbortController();
    async function fetchSubOptions() {
      if (!selectedOption) {
        setSubOptions([]);
        setSubSelected("");
        setSubError("");
        return;
      }
      try {
        setSubLoading(true);
        setSubError("");
        let url = "";
        if (selectedOption === "fund") {
          url = `${process.env.NEXT_PUBLIC_API_URL}/donation/funds/niki/all/list`;
        } else if (selectedOption === "charity") {
          url = `${process.env.NEXT_PUBLIC_API_URL}/charity/organizations`;
        } else if (selectedOption === "project") {
          url = `${process.env.NEXT_PUBLIC_API_URL}/proj/projects/all/summary`;
        }
        const res = await fetch(url, {
          method: "GET",
          headers: { accept: "application/json" },
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        let options: Array<{ value: string; label: string }> = [];
        if (selectedOption === "fund") {
          options = (Array.isArray(data) ? data : []).map((f: unknown) => {
            const fund = f as { id: number; title?: string };
            return {
              value: String(fund.id),
              label: String(fund.title ?? fund.id),
            };
          });
        } else if (selectedOption === "charity") {
          const list = Array.isArray(data?.data) ? data.data : [];
          options = list.map((c: unknown) => {
            const charity = c as { charity_id: number; name?: string };
            return {
              value: String(charity.charity_id),
              label: String(charity.name ?? charity.charity_id),
            };
          });
        } else if (selectedOption === "project") {
          options = (Array.isArray(data) ? data : []).map((p: unknown) => {
            const project = p as { project_id: number; project_name?: string };
            return {
              value: String(project.project_id),
              label: String(project.project_name ?? project.project_id),
            };
          });
        }
        setSubOptions(options);
        setSubSelected("");
      } catch (e) {
        console.error("Error fetching sub options:", e);
        setSubError("خطا در دریافت لیست");
        setSubOptions([]);
        setSubSelected("");
      } finally {
        setSubLoading(false);
      }
    }
    fetchSubOptions();
    return () => controller.abort();
  }, [selectedOption]);


  const ensureValidAmount = () => {
    if (!parsedAmount || parsedAmount <= 0) {
      setAmountError("مقدار نیکی را وارد کنید");
      return false;
    }
    if (parsedAmount > availableBalanceNumber) {
      setAmountError(
        `مقدار وارد شده نمی aa ce a7 f0 9f 9f a9د از ${availableBalanceNumber.toLocaleString(
          "fa-IR"
        )} نیکی بیشتر باشد`
      );
      return false;
    }
    setAmountError("");
    return true;
  };

  const handleIncreaseNiki = async () => {
    if (!ensureValidAmount()) return;

    // اگر از اعتبار موجودی استفاده می aa b4 af aa af a7 aa و گزینه همین دستگاه است، فراخوانی API
    if (useCredit && increaseOption === "same-device") {
      try {
        setSubmitLoading(true);
        setSubmitError("");
        // گارد: اگر نوع و مقصد انتخاب نشده باشد اصلاً ارسال نکن
        if (!selectedOption) {
          setSubmitError("نوع ارسال نیکی را انتخاب کنید");
          return;
        }
        if (!subSelected) {
          setSubmitError("مقصد را انتخاب کنید");
          return;
        }
        // map type
        const typeMap: Record<string, number> = {
          fund: 1,
          project: 2,
          charity: 3,
        };
        const fund_type = typeMap[selectedOption] || 1;
        const payload: Record<string, unknown> = {
          fund_type,
          // acb_code: walletData?.detail?.cacb_code || "",
          fund_id:
            fund_type === 1 && subSelected ? Number(subSelected) : undefined,
          project_id:
            fund_type === 2 && subSelected ? Number(subSelected) : undefined,
          charity_id:
            fund_type === 3 && subSelected ? Number(subSelected) : undefined,
          amount: parsedAmount,
          // currency_id: 1,
          // is_anonymous: false,
          // message: "",
        };
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/donation/funds/payment/wallet`,
          {
            method: "POST",
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        // به a8 b6 b1 f8 99 af b1 bf مقدارهای جدید
        if (data?.user_new_balance) {
          await fetchWalletData();
        }
        setIsSuccessModalOpen(true);
      } catch (e) {
        console.error("Error paying from wallet:", e);
        setSubmitError("خطا در پرداخت از کیف پول");
      } finally {
        setSubmitLoading(false);
      }
      return;
    }

    // حالت ac 75 ac a7 cd دیگر (ارسال به کاربر یا درگاه) - فعلا فقط نمایش موفقیت
    setIsSuccessModalOpen(true);
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    setIsOpen(false); // بستن کل مودال
  };

  const handleSendNiki = () => {
    if (!ensureValidAmount()) return;
    if (!selectedOption) {
      setSubmitError("نوع ارسال نیکی را انتخاب کنید");
      return;
    }
    if (!subSelected) {
      setSubmitError("مقصد را انتخاب کنید");
      return;
    }
    setShowWithdrawNikiToOtherUser(true);
  };

  return (
    <DrawerModal isOpen={isOpen} setIsOpen={setIsOpen}>
      {showWithdrawNikiToOtherUser ? (
        <WithdrawNikiToOtherUser
          onBack={() => setShowWithdrawNikiToOtherUser(false)}
          onClose={() => setIsOpen(false)}
        />
      ) : (
        <div className={styles["withdraw-from-other"]}>
          <div className={styles["withdraw-from-other__drawer-modal"]}>
            <div className={styles["withdraw-from-other__drawer-modal-title"]}>
              <Text textStyle="18S7" textColor="gray-950" fontFamily="moraba">
                ارسال نیکی
              </Text>
            </div>

            {/* Body */}
            <div className={styles["withdraw-from-other__drawer-modal-body"]}>
              {/* Niki Amount Section */}
              <NikiInputAmountWalletSection
                availableBalance={
                  walletData
                    ? parseFloat(walletData.detail.withdrawable_balance)
                    : 0
                }
                onAmountChange={(amount: number) =>
                  setNikiAmount(amount.toString())
                }
              />
              {amountError && (
                <Text textStyle="12S4" textColor="error-500">
                  {amountError}
                </Text>
              )}
              {submitError && (
                <Text textStyle="12S4" textColor="error-500">
                  {submitError}
                </Text>
              )}

              {/* Fund Selection Section */}
              <div className={styles["withdraw-from-other__section"]}>
                {/* <div className={styles["section-title"]}>
                  <Text textStyle="14S5" textColor="gray-700">
                    صندوق مد نظر خود را انتخاب کنید
                  </Text>
                </div>

                <TextField
                  type="text"
                  placeholder="شناسه صندوق را در صورت داشتن وارد کنید"
                  value={fundId}
                  onChangeAction={(value: string) => setFundId(value)}
                  size="sm"
                  baseColor={{
                    textInput: "gray-800",
                    borderAndLabel: "gray-300",
                    inputBgColor: "main-white",
                    textError: "error-500",
                  }}
                /> */}
                <Dropdown
                  placeholder="نوع ارسال نیکی را انتخاب کنید"
                  id="option-select"
                  label="نوع ارسال نیکی"
                  size="sm"
                  value={selectedOption}
                  onChangeAction={(value: string) => setSelectedOption(value)}
                  options={[
                    { value: "fund", label: "صندوق نیکی" },
                    { value: "project", label: "پروژه" },
                    { value: "charity", label: "خیریه" },
                  ]}
                  baseColor={{
                    textInput: "gray-800",
                    borderAndLabel: "gray-300",
                    inputBgColor: "main-white",
                    textError: "error-500",
                  }}
                />
                {selectedOption && (
                  <Dropdown
                    showSearch={true}
                    placeholder={`${
                      selectedOption === "fund"
                        ? "صندوق نیکی"
                        : selectedOption === "project"
                        ? "پروژه"
                        : "خیریه"
                    } را انتخاب کنید`}
                    id="sub-option-select"
                    label={`${
                      selectedOption === "fund"
                        ? "صندوق نیکی"
                        : selectedOption === "project"
                        ? "پروژه"
                        : "خیریه"
                    } را انتخاب کنید`}
                    size="sm"
                    value={subSelected}
                    onChangeAction={(value: string) => setSubSelected(value)}
                    options={subOptions}
                    baseColor={{
                      textInput: "gray-800",
                      borderAndLabel: "gray-300",
                      inputBgColor: "main-white",
                      textError: "error-500",
                    }}
                  />
                )}
                {subLoading && (
                  <Text textStyle="14S5" textColor="gray-600">
                    در حال دریافت...
                  </Text>
                )}
                {subError && (
                  <Text textStyle="14S5" textColor="error-500">
                    {subError}
                  </Text>
                )}
              </div>

              {/* Use Credit Switch */}
              <div className={styles["withdraw-from-other__switch-section"]}>
                <Checkbox
                  id="use-credit"
                  title="می‌خواهم از اعتبار موجودیم استفاده کنم"
                  name="use-credit"
                  checked={useCredit}
                  onChangeAction={() => setUseCredit(!useCredit)}
                  variant="toggle"
                />
                {useCredit && (
                  <Badge size="md" bgc="gray-50">
                    <div
                      className={styles["withdraw-from-other__balance-badge"]}
                    >
                      <Text
                        textStyle="16S4"
                        textColor="gray-950"
                        fontFamily="moraba"
                      >
                        موجودی نیکی ~
                      </Text>
                      <Text
                        textStyle="16S4"
                        textColor="gray-950"
                        fontFamily="moraba"
                      >
                        {walletData
                          ? parseFloat(
                              walletData.detail.withdrawable_balance
                            ).toLocaleString("fa-IR")
                          : "0"}{" "}
                        نیکی
                      </Text>
                    </div>
                  </Badge>
                )}
              </div>
              {useCredit && (
                <DepositNikiInDeviceWalletSection
                  onOptionChange={setIncreaseOption}
                  selectedOption={increaseOption}
                  actionType="ارسال"
                />
              )}
            </div>
            <div className={styles["withdraw-from-other__drawer-modal-footer"]}>
              <Button
                borderColor="primary-700"
                fullScreen={true}
                mode="side-rounded"
                shadow="primary-800"
                paddingStyle="equal-12"
                onClick={() => setIsOpen(false)}
              >
                <Text
                  textStyle="16S5"
                  textColor="primary-700"
                  fontFamily="moraba"
                >
                  بازگشت
                </Text>
              </Button>
              <Button
                bgColor={submitLoading ? "gray-400" : "primary-700"}
                shadow="primary-800"
                fullScreen={true}
                mode="side-rounded"
                paddingStyle="equal-12"
                onClick={
                  increaseOption === "same-device"
                    ? handleIncreaseNiki
                    : handleSendNiki
                }
              >
                {increaseOption === "same-device" ? (
                  <Text
                    textStyle="16S5"
                    textColor="main-white"
                    fontFamily="moraba"
                  >
                    {submitLoading ? "در حال پردازش..." : "افزایش نیکی"}
                  </Text>
                ) : (
                  <Text
                    textStyle="16S5"
                    textColor="main-white"
                    fontFamily="moraba"
                  >
                    ارسال نیکی
                  </Text>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose}
        title=""
        headerIcon={
          <TickCircle
            size="48"
            color="var(--success-500)"
            variant="Bulk"
            className={styles["success-icon"]}
          />
        }
        body={
          <div className={styles["success-modal-body"]}>
            <Text
              textStyle="16S5"
              textColor="gray-950"
              fontFamily="moraba"
              textAlign="center"
            >
              افزایش نیکی با موفقیت انجام شد
            </Text>
          </div>
        }
        footer={<></>}
      />
    </DrawerModal>
  );
}
