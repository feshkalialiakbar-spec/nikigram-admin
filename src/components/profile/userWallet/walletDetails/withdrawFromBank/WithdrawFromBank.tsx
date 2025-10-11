import React, { useState } from "react";
import styles from "./WithdrawFromBank.module.scss";
import Text from "@/components/ui/text/Text";
import Button from "@/components/ui/actions/button/Button";
import RadioButton from "@/components/ui/forms/radioButton/RadioButton";
import DrawerModal from "@/components/ui/modal/drawerModal/DrawerModal";
import WithdrawNikiToBank from "./withdrawNikiToBank/WithdrawNikiToBank";

interface WithdrawFromBankProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function WithdrawFromBank({
  isOpen,
  setIsOpen,
}: WithdrawFromBankProps) {
  const [selectedOption, setSelectedOption] = useState("withdraw-niki");
  const [showWithdrawNikiToBank, setShowWithdrawNikiToBank] = useState(false);

  const handleContinue = () => {
    setShowWithdrawNikiToBank(true);
  };

  return (
    <DrawerModal 
      isOpen={isOpen} 
      setIsOpen={(open) => {
        setIsOpen(open);
        if (!open) {
          setShowWithdrawNikiToBank(false);
        }
      }}
    >
      {showWithdrawNikiToBank ? (
        <WithdrawNikiToBank
          onBack={() => setShowWithdrawNikiToBank(false)}
          onClose={() => {
            setIsOpen(false);
            setShowWithdrawNikiToBank(false);
          }}
        />
      ) : (
        <div className={styles["withdraw-from-bank"]}>
          <div className={styles["withdraw-from-bank__drawer-modal"]}>
            <div className={styles["withdraw-from-bank__drawer-modal-title"]}>
              <Text textStyle="18S7" textColor="gray-950" fontFamily="moraba">
                عودت
              </Text>
            </div>

            <div className={styles["withdraw-from-bank__drawer-modal-body"]}>
              {/* Radio Options */}
              <div className={styles["withdraw-from-bank__radio-section"]}>
                <RadioButton
                  id="withdraw-niki"
                  name="withdraw-option"
                  value="withdraw-niki"
                  checked={selectedOption === "withdraw-niki"}
                  onChangeAction={() => setSelectedOption("withdraw-niki")}
                  textDetails={{
                    title: {
                      text: "عودت نیکی",
                      size: "16S5",
                      color: "gray-950",
                    },
                  }}
                />
                <RadioButton
                  id="buy-from-market"
                  name="withdraw-option"
                  disabled
                  value="buy-from-market"
                  checked={selectedOption === "buy-from-market"}
                  onChangeAction={() => setSelectedOption("buy-from-market")}
                  textDetails={{
                    title: {
                      text: "خرید از نیکی مارکت",
                      size: "16S5",
                      color: "gray-950",
                    },
                  }}
                />
              </div>
            </div>
            <div className={styles["withdraw-from-bank__button-section"]}>
              <Button
                bgColor="primary-700"
                shadow="primary-800"
                fullScreen={true}
                mode="side-rounded"
                paddingStyle="equal-12"
                onClick={handleContinue}
              >
                <Text
                  textStyle="16S5"
                  textColor="main-white"
                  fontFamily="moraba"
                >
                  ادامه
                </Text>
              </Button>
            </div>
          </div>
        </div>
      )}
    </DrawerModal>
  );
}
