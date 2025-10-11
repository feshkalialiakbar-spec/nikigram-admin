import React, { useState } from "react";
import styles from "./DepositFromBank.module.scss";
import Text from "@/components/ui/text/Text";
import Button from "@/components/ui/actions/button/Button";
import { AddCircle, TickCircle } from "iconsax-react";
import DrawerModal from "@/components/ui/modal/drawerModal/DrawerModal";
import { UserWalletTransaction } from "@/mocks/userWalletPagination";
import NikiInputAmountWalletSection from "../walletComponents/nikiInputAmountWalletSection/NikiInputAmountWalletSection";
import DepositNikiInDeviceWalletSection from "../walletComponents/depositNikiInDeviceWalletSection/DepositNikiInDeviceWalletSection";
import DepositNikiForOtherUser from "./depositNikiForOtherUser/DepositNikiForOtherUser";
import Modal from "@/components/ui/modal/Modal";
import { walletService, type DepositRequest } from "@/services/walletService";
interface DepositFromBankProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onDepositSuccess?: () => void;
}

export default function DepositFromBank({
  isOpen,
  setIsOpen,
  onDepositSuccess,
}: DepositFromBankProps) {
  const [selectedIncreaseOption, setSelectedIncreaseOption] =
    useState("same-device");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showDepositNikiForOtherUser, setShowDepositNikiForOtherUser] = useState(false);
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // نمونه داده ماک برای TransactionDetails
  const mockTransaction: UserWalletTransaction = {
    id: 101,
    type: "افزایش",
    amount: 0,
    date: "2024-01-15",
    status: "موفق",
    accountNumber: "6442132975031529452615294",
    purpose: "صندوق معیشت",
  };

  const handleDepositForSameDevice = async () => {
    if (amount <= 0) {
      setError("لطفاً مقدار معتبری وارد کنید");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const depositData: DepositRequest = {
        amount: amount,
        currency_id: 1,
        message: "",
        ipg_name: "",
        ipg_tracking_code: "",
        ipg_description: ""
      };

      const result = await walletService.depositNiki(depositData);
      
      if (result.status === "SUCCEEDED") {
        setIsOpenModal(true);
        onDepositSuccess?.(); // Refresh wallet data
      } else {
        setError("تراکنش ناموفق بود. لطفاً دوباره تلاش کنید.");
      }
    } catch (err) {
      console.error('Error depositing niki:', err);
      setError("خطا در انجام تراکنش. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DrawerModal isOpen={isOpen} setIsOpen={setIsOpen}>
      {showDepositNikiForOtherUser ? (
        <DepositNikiForOtherUser 
          onBack={() => setShowDepositNikiForOtherUser(false)}
          onClose={() => setIsOpen(false)}
        />
      ) : (
        <div className={styles["deposit-from-bank__drawer-modal"]}>
          <div className={styles["deposit-from-bank__drawer-modal-title"]}>
            {mockTransaction.type} نیکی
          </div>
          <div className={styles["deposit-from-bank__drawer-modal-body"]}>
            <NikiInputAmountWalletSection 
              onAmountChange={setAmount}
              maxAmount={999999999} // حداکثر مقدار بالا برای افزایش نیکی
            />
            <DepositNikiInDeviceWalletSection
              selectedOption={selectedIncreaseOption}
              onOptionChange={setSelectedIncreaseOption}
              actionType="افزایش"
            />
            {error && (
              <div style={{ padding: '10px', marginTop: '10px', backgroundColor: 'var(--error-50)', borderRadius: '8px' }}>
                <Text textStyle="14S4" textColor="error-600">
                  {error}
                </Text>
              </div>
            )}
          </div>
          <div className={styles["deposit-from-bank__drawer-modal-footer"]}>
            <Button
              bgColor="primary-700"
              shadow="primary-800"
              fullScreen={true}
              mode="side-rounded"
              paddingStyle="equal-12"
              onClick={
                selectedIncreaseOption === "same-device"
                  ? handleDepositForSameDevice
                  : () => {
                      setShowDepositNikiForOtherUser(true);
                    }
              }
              disabled={isLoading || (selectedIncreaseOption === "same-device" && amount <= 0)}
            >
              {selectedIncreaseOption === "same-device" ? (
                <Text textStyle="16S5" textColor="main-white" fontFamily="moraba">
                  {isLoading ? "در حال پردازش..." : "ادامه"}
                </Text>
              ) : (
                <div
                  className={
                    styles["deposit-from-bank__drawer-modal-footer-button"]
                  }
                >
                  <AddCircle size="24" color="var(--main-white)" variant="Bulk" />
                  <Text
                    textStyle="16S5"
                    textColor="main-white"
                    fontFamily="moraba"
                  >
                    افزایش نیکی
                  </Text>
                </div>
              )}
            </Button>
          </div>
        </div>
      )}
      <Modal
        isOpen={isOpenModal}
        onClose={() => {
          setIsOpenModal(false);
          setIsOpen(false); // بستن DepositFromBank
        }}
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
