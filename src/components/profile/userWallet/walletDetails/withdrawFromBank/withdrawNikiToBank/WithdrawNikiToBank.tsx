import React, { useEffect, useState } from "react";
import styles from "./WithdrawNikiToBank.module.scss";
import Text from "@/components/ui/text/Text";
import Button from "@/components/ui/actions/button/Button"; 
import NikiInputAmountWalletSection from "../../walletComponents/nikiInputAmountWalletSection/NikiInputAmountWalletSection";
import Badge from "@/components/ui/badge/Badge";
import SelectBankForWithdrawNiki from "./selectBankForWithdrawNiki/SelectBankForWithdrawNiki";
import { walletService } from "@/services/walletService";
interface WithdrawNikiToBankProps {
  onBack: () => void;
  onClose: () => void;
}

export default function WithdrawNikiToBank({
  onBack,
  onClose,
}: WithdrawNikiToBankProps) {
  const [nikiAmount, setNikiAmount] = useState(0);
  const [showSelectBank, setShowSelectBank] = useState(false);
  const [availableBalance, setAvailableBalance] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(true);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setIsLoadingBalance(true);
        setBalanceError(null);
        const data = await walletService.getMyWallet();
        const withdrawable = parseFloat(data.detail.withdrawable_balance);
        setAvailableBalance(Number.isFinite(withdrawable) ? Math.floor(withdrawable) : 0);
      } catch {
        setBalanceError("خطا در دریافت موجودی نیکی");
        setAvailableBalance(0);
      } finally {
        setIsLoadingBalance(false);
      }
    };
    fetchBalance();
  }, []);

  const handleContinue = () => {
    setShowSelectBank(true);
  };


  return (
    <div className={styles["withdraw-niki-to-bank"]}>
      {showSelectBank ? (
        <SelectBankForWithdrawNiki
          onBack={() => setShowSelectBank(false)}
          onClose={() => {
            onClose();
            setShowSelectBank(false);
          }}
          nikiAmount={nikiAmount}
        />
      ) : (
        <div className={styles["withdraw-niki-to-bank__drawer-modal"]}>
          <div className={styles["withdraw-niki-to-bank__drawer-modal-title"]}>
            عودت
          </div>
          <div className={styles["withdraw-niki-to-bank__drawer-modal-body"]}>
            <div
              className={styles["withdraw-niki-to-bank__balance-badge-container"]}
            >
              <Badge size="md" bgc="gray-50">
                <div className={styles["withdraw-niki-to-bank__balance-badge"]}>
                  <Text textStyle="16S4" textColor="gray-950" fontFamily="moraba">
                    موجودی نیکی ~
                  </Text>
                  <Text textStyle="16S4" textColor="gray-950" fontFamily="moraba">
                    {isLoadingBalance ? "در حال بارگذاری..." : `${availableBalance} نیکی`}
                  </Text>
                </div>
              </Badge>
            </div>
            {balanceError && (
              <Text textStyle="12S4" textColor="error-600" textAlign="right">{balanceError}</Text>
            )}
            <NikiInputAmountWalletSection
              availableBalance={availableBalance}
              onAmountChange={setNikiAmount}
              maxAmount={availableBalance}
            />
            <Text textStyle="12S4" textColor="gray-600" textAlign="right">
              معادل {availableBalance} میلیون تومان
            </Text>
          </div>
          <div className={styles["withdraw-niki-to-bank__drawer-modal-footer"]}>
            <Button
              bgColor="transparent"
              borderColor="primary-700"
              fullScreen={true}
              mode="side-rounded"
              paddingStyle="equal-12"
              onClick={onBack}
            >
              <div
                className={
                  styles[
                    "withdraw-niki-to-bank__drawer-modal-footer-button--exception"
                  ]
                }
              >
                <Text
                  textStyle="16S5"
                  textColor="primary-700"
                  fontFamily="moraba"
                >
                  بازگشت
                </Text>
              </div>
            </Button>
            <Button
              bgColor="primary-700"
              shadow="primary-800"
              fullScreen={true}
              mode="side-rounded"
              paddingStyle="equal-12"
              onClick={handleContinue}
              disabled={nikiAmount <= 0 || isLoadingBalance}
            >
              <Text textStyle="16S5" textColor="main-white" fontFamily="moraba">
                ادامه
              </Text>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
