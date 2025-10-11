import React, { useState } from "react";
import styles from "./WithdrawNikiToOtherUser.module.scss";
import Text from "@/components/ui/text/Text";
import Button from "@/components/ui/actions/button/Button";
import TextField from "@/components/ui/forms/textField/TextField";
import { AddCircle, TickCircle } from "iconsax-react";
import Modal from "@/components/ui/modal/Modal";
interface WithdrawNikiToOtherUserProps {
  onBack: () => void;
  onClose: () => void;
}

export default function WithdrawNikiToOtherUser({
  onBack,
  onClose,
}: WithdrawNikiToOtherUserProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [mobile, setMobile] = useState("");
  const [desc, setDesc] = useState("");

  const handleIncreaseNiki = () => {
    setIsOpenModal(true);
  };

  const handleModalClose = () => {
    setIsOpenModal(false);
    onClose();
  };

  return (
    <div className={styles["withdraw-niki-to-other-user"]}>
      <div className={styles["withdraw-niki-to-other-user__drawer-modal"]}>
        <div
          className={styles["withdraw-niki-to-other-user__drawer-modal-title"]}
        >
          افزودن نیکی
        </div>
        <div
          className={styles["withdraw-niki-to-other-user__drawer-modal-body"]}
        >
          <div className={styles["withdraw-niki-to-other-user__form"]}>
            <Text textStyle="14S5" textColor="gray-700" textAlign="right">
              اطلاعات زیر را برای افزایش نیکی پر کنید
            </Text>
            <TextField
              type="number"
              placeholder="شماره موبایل دستگاه مد نظر برای افزایش نیکی"
              size="sm"
              baseColor={{
                textInput: "gray-800",
                borderAndLabel: "gray-300",
                inputBgColor: "main-white",
                textError: "error-500",
              }}
              label="شماره موبایل"
              value={mobile}
              onChangeAction={(value: string) => setMobile(value)}
            />
            <TextField
              type="text"
              placeholder="شرح افزایش نیکی را وارد کنید"
              size="sm"
              baseColor={{
                textInput: "gray-800",
                borderAndLabel: "gray-300",
                inputBgColor: "main-white",
                textError: "error-500",
              }}
              label="شرح افزایش نیکی"
              value={desc}
              onChangeAction={(value: string) => setDesc(value)}
            />
          </div>
        </div>
        <div
          className={styles["withdraw-niki-to-other-user__drawer-modal-footer"]}
        >
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
                  "withdraw-niki-to-other-user__drawer-modal-footer-button--exception"
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
            onClick={handleIncreaseNiki}
          >
            <div
              className={
                styles[
                  "withdraw-niki-to-other-user__drawer-modal-footer-button"
                ]
              }
            >
              <AddCircle size="24" color="var(--main-white)" variant="Bulk" />
              <Text textStyle="16S5" textColor="main-white" fontFamily="moraba">
                افزایش نیکی
              </Text>
            </div>
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
              لینک درخواست افزایش نیکی با موفقیت ارسال شد
            </Text>
          </div>
        }
        footer={<></>}
      />
    </div>
  );
}
