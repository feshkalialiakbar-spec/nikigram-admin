import React, { useEffect, useState } from "react";
import styles from "./SelectBankForWithdrawNiki.module.scss";
import Text from "@/components/ui/text/Text";
import Button from "@/components/ui/actions/button/Button";
import RadioButton from "@/components/ui/forms/radioButton/RadioButton";
import { AddCircle, TickCircle } from "iconsax-react";  
import Modal from "@/components/ui/modal/Modal"; 
import ParsehImage from "@/components/ui/image/ParsehImage";
import { fetchUserBankCards, type BankCardDto, withdrawNiki } from "@/services/walletService";
import { getImageUrl } from "@/utils/imageUtils";

interface SelectBankForWithdrawNikiProps {
  onBack: () => void;
  onClose: () => void;
  nikiAmount: number;
}

export default function SelectBankForWithdrawNiki({
  onBack,
  onClose,
  nikiAmount,
}: SelectBankForWithdrawNikiProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [bankCards, setBankCards] = useState<BankCardDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleWithdraw = async () => {
    if (!selectedBank) return;
    try {
      setIsOpenModal(false);
      const res = await withdrawNiki({
        currency_id: 1,
        account_id: Number(selectedBank),
        amount: nikiAmount,
        originalAmount: nikiAmount,
        trackingCode: "",
      });
      if (res.status === "SUCCEEDED") {
        setIsOpenModal(true);
      } else {
        setError("خطا در انجام عودت");
      }
    } catch {
      setError("خطا در انجام عودت");
    }
  };

  const handleModalClose = () => {
    setIsOpenModal(false);
    onClose();
  };
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const cards = await fetchUserBankCards();
        const verified = cards.filter((c) => c.is_verified === 1);
        setBankCards(verified);
        if (verified.length > 0) {
          setSelectedBank(String(verified[0].account_id));
        }
      } catch {
        setError("خطا در دریافت کارت‌های بانکی");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);
  return (
    <div className={styles["select-bank-for-withdraw-niki"]}>
      <div className={styles["select-bank-for-withdraw-niki__drawer-modal"]}>
        <div className={styles["select-bank-for-withdraw-niki__drawer-modal-title"]}>
          <Text textStyle="18S7" textColor="gray-950" fontFamily="moraba">
            عودت
          </Text>
        </div>
        
        <div className={styles["select-bank-for-withdraw-niki__drawer-modal-body"]}>
          <Text textStyle="16S5" textColor="gray-700" textAlign="right">
            شبا مد نظر را انتخاب کنید.
          </Text>
          
          <div className={styles["select-bank-for-withdraw-niki__bank-cards"]}>
            {isLoading && (
              <div style={{ padding: "12px", textAlign: "center" }}>
                <Text textStyle="14S4" textColor="gray-600">در حال دریافت کارت‌ها...</Text>
              </div>
            )}
            {error && (
              <div style={{ padding: "12px", textAlign: "center" }}>
                <Text textStyle="14S4" textColor="error-600">{error}</Text>
              </div>
            )}
            {!isLoading && !error && bankCards.map((bank) => (
              <div 
                key={bank.account_id} 
                className={styles["select-bank-for-withdraw-niki__bank-card"]}
                onClick={() => setSelectedBank(String(bank.account_id))}
              >
                <RadioButton
                  id={`${bank.account_id}-card`}
                  name="bank-selection"
                  textDetails={{
                    title: {
                      text: bank.bank_name,
                      size: "16S5",
                      color: "gray-950",
                    },
                  }}
                  value={String(bank.account_id)}
                  mode="filled-circle"
                  checked={selectedBank === String(bank.account_id)}
                  onChangeAction={() => setSelectedBank(String(bank.account_id))}
                />
                <div className={styles["select-bank-for-withdraw-niki__card-visual"]}>
                  <div 
                    className={styles["select-bank-for-withdraw-niki__bank-card-visual"]}
                    style={{
                      backgroundImage: `url(${getImageUrl(bank.bank_background_url)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    <div className={styles["select-bank-for-withdraw-niki__card-header"]}>
                      <div className={styles["select-bank-for-withdraw-niki__bank-logo"]}>
                        <div className={styles["select-bank-for-withdraw-niki__logo-icon"]}>
                          <ParsehImage  
                            imgSrc={getImageUrl(bank.bank_logo_url)}
                            imgAlt={bank.bank_name}
                            width={38}
                            height={38}
                           
                          />
                        </div>
                      </div>
                      <div className={styles["select-bank-for-withdraw-niki__bank-name"]}>
                        <Text textStyle="16S7" textColor="main-black" fontFamily="moraba">
                          {bank.bank_name}
                        </Text>
                        {!!bank.bank_code && (
                          <Text textStyle="12S5" textColor="main-black" fontFamily="moraba">
                            کد بانک: {bank.bank_code}
                          </Text>
                        )}
                      </div>
                    </div>
                    <div className={styles["select-bank-for-withdraw-niki__card-number"]}>
                      <Text textStyle="14S5" textColor="main-black" fontFamily="moraba">
                        {bank.iban || ""}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles["select-bank-for-withdraw-niki__add-new-iban"]}>
            <AddCircle size="20" color="var(--primary-500)" variant="Bulk" />
            <Text textStyle="14S5" textColor="primary-500" fontFamily="moraba">
              ثبت شبا جدید
            </Text>
          </div>
        </div>
        
        <div className={styles["select-bank-for-withdraw-niki__drawer-modal-footer"]}>
          <Button
            bgColor="transparent"
            borderColor="primary-700"
            fullScreen={true}
            mode="side-rounded"
            paddingStyle="avg-8-24"
            onClick={onBack}
          >
            <Text textStyle="16S5" textColor="primary-700" fontFamily="moraba">
              بازگشت
            </Text>
          </Button>
          <Button
            bgColor="error-700"
            shadow="error-800"
            hoverColor="error-600"
            mode="side-rounded"
            paddingStyle="avg-8-24"
            fullScreen={true}
            onClick={handleWithdraw}
          >
            <Text textStyle="16S5" textColor="main-white" fontFamily="moraba">
              عودت
            </Text>
          </Button>
        </div>
      </div>
      
      <Modal
        isOpen={isOpenModal}
        onClose={handleModalClose}
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
              عودت نیکی از صندوق حسنه با موفقیت انجام شد
            </Text>
          </div>
        }
        footer={<></>}
      />
    </div>
  );
}