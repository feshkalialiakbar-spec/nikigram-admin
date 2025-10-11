import React, { useMemo, useState } from "react";
import styles from "./UserSecurityAndPrivacy.module.scss";
import TextField from "@/components/ui/forms/textField/TextField";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/actions/button/Button";
import Text from "@/components/ui/text/Text";
import { useDispatch, useSelector } from "react-redux";
import { addToast } from "@/stores/ui/toast.slice";
import { sendLoginOtp, forgotPassword } from "@/services/api/endpoints/auth";
import { useRouter } from "next/router";
import { RootState } from "@/stores/userStores/userMerge.store";

export default function UserSecurityAndPrivacy() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const rules = useMemo(() => {
    const hasNumber = /\d/.test(newPassword);
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?#@!]/.test(
      newPassword
    );
    const min8 = newPassword.length >= 8;
    return { hasNumber, hasUpper, hasLower, hasSpecial, min8 };
  }, [newPassword]);

  const passwordsMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword;

  const submitChangePassword = async () => {
    if (!passwordsMatch || code.length !== 6) return;
    try {
      setIsSubmitting(true);
      await forgotPassword(
        { otp_code: code, newpassword: newPassword },
        auth.token || undefined
      );
      dispatch(
        addToast({
          text: "رمز عبور با موفقیت تغییر کرد.",
          closable: true,
          duration: 3000,
        })
      );
      router.push("/");
    } catch {
      dispatch(
        addToast({
          text: "تغییر رمز عبور با خطا مواجه شد.",
          closable: true,
          duration: 3000,
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitChangePassword();
  };

  const handleSendVerifyCode = async () => {
    if (!passwordsMatch) return;
    const mobile = user.mobile || user.phone;
    if (!mobile) {
      dispatch(
        addToast({
          text: "شماره موبایل یافت نشد.",
          closable: true,
          duration: 3000,
        })
      );
      return;
    }
    try {
      setIsSending(true);
      await sendLoginOtp(mobile);
      dispatch(
        addToast({ text: "کد تایید ارسال شد.", closable: true, duration: 3000 })
      );
    } catch {
      dispatch(
        addToast({
          text: "ارسال کد با خطا مواجه شد.",
          closable: true,
          duration: 3000,
        })
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form
      className={styles["user-security-and-privacy"]}
      onSubmit={handleSubmit}
    >
      <div className={styles["user-security-and-privacy__row"]}>
        <div className={styles["user-security-and-privacy__field-with-hints"]}>
          <TextField
            id="newPassword"
            value={newPassword}
            onChangeAction={setNewPassword}
            placeholder="رمز عبور جدید"
            label="رمز عبور جدید"
            size="sm"
            className={styles.input}
            baseColor={{
              borderAndLabel: "gray-300",
              inputBgColor: "main-white",
              textInput: "gray-950",
              textError: "error-900",
            }}
          />

          <div className={styles["user-security-and-privacy__rules"]}>
            <Badge
              size="sm"
              bgc={rules.min8 ? "secondary1-100" : "gray-100"}
              color="gray-900"
            >
              <Text
                textStyle="12S5"
                textColor={rules.min8 ? "secondary1-700" : "gray-900"}
              >
                حداقل 8 کاراکتر
              </Text>
            </Badge>
            <Badge
              size="sm"
              bgc={rules.hasNumber ? "secondary1-100" : "gray-100"}
              color="gray-900"
            >
              <Text
                textStyle="12S5"
                textColor={rules.hasNumber ? "secondary1-700" : "gray-900"}
              >
                استفاده از عدد
              </Text>
            </Badge>
            <Badge
              size="sm"
              bgc={rules.hasUpper ? "secondary1-100" : "gray-100"}
              color="gray-900"
            >
              <Text
                textStyle="12S5"
                textColor={rules.hasUpper ? "secondary1-700" : "gray-900"}
              >
                استفاده از حروف بزرگ
              </Text>
            </Badge>
            <Badge
              size="sm"
              bgc={rules.hasLower ? "secondary1-100" : "gray-100"}
              color="gray-900"
            >
              <Text
                textStyle="12S5"
                textColor={rules.hasLower ? "secondary1-700" : "gray-900"}
              >
                استفاده از حروف کوچک
              </Text>
            </Badge>
            <Badge
              size="sm"
              bgc={rules.hasSpecial ? "secondary1-100" : "gray-100"}
              color="gray-900"
            >
              <Text
                textStyle="12S5"
                textColor={rules.hasSpecial ? "secondary1-700" : "gray-900"}
              >
                استفاده از علامت‌های خاص (#@!)
              </Text>
            </Badge>
          </div>
        </div>

        <div className={styles["user-security-and-privacy__field"]}>
          <TextField
            id="confirmPassword"
            value={confirmPassword}
            onChangeAction={setConfirmPassword}
            placeholder="تکرار رمز عبور"
            label="تکرار رمز عبور"
            size="sm"
            className={styles.input}
            baseColor={{
              borderAndLabel:
                passwordsMatch || confirmPassword.length === 0
                  ? "gray-300"
                  : "error-500",
              inputBgColor: "main-white",
              textInput: "gray-950",
              textError: "gray-950",
            }}
          />
        </div>
      </div>

      <div className={styles["user-security-and-privacy__row"]}>
        <div className={styles["user-security-and-privacy__field"]}>
          <TextField
            id="verifyCode"
            value={code}
            onChangeAction={(v) => {
              if (/^\d*$/.test(v) && v.length <= 6) {
                setCode(v);
              }
            }}
            placeholder="کد تایید را وارد کنید"
            label="کد تایید"
            size="sm"
            className={styles.input}
            inputMode="numeric"
            disabled={!passwordsMatch}
            baseColor={{
              borderAndLabel: "gray-300",
              inputBgColor: "main-white",
              textInput: "gray-950",
              textError: "error-900",
            }}
          />
        </div>
        <div className={styles["user-security-and-privacy__send-code"]}>
          <Button
            bgColor="transparent"
            borderColor="primary-700"
            hoverColor="primary-100"
            mode="side-rounded"
            paddingStyle="avg-8-32"
            disabled={!passwordsMatch || isSending}
            onClick={handleSendVerifyCode}
          >
            <Text fontFamily="moraba" textStyle="16S5" textColor="primary-700">
              ارسال کد تایید
            </Text>
          </Button>
        </div>
      </div>
      <div className={styles["user-security-and-privacy__actions"]}>
        <Button
          type="submit"
          bgColor="primary-700"
          hoverColor="primary-800"
          shadow="primary-800"
          mode="side-rounded"
          paddingStyle="avg-8-32"
          disabled={!passwordsMatch || code.length !== 6 || isSubmitting}
          onClick={submitChangePassword}
        >
          <Text fontFamily="moraba" textStyle="16S5" textColor="main-white">
            تغییر اطلاعات
          </Text>
        </Button>
      </div>
    </form>
  );
}
