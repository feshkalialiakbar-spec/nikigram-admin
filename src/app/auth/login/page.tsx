"use client";
import { useEffect, useState } from "react";
import styles from "./SignIn.module.scss";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/actions/button/Button";
import TextField from "@/components/ui/forms/textField/TextField";
import Logo from "@/components/logo/Logo";
import { Eye, EyeSlash, ArrowLeft2 } from "iconsax-react";
import { useLogin } from "@/components/auth/useLogin";

export default function Signin() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    values,
    errors,
    isLoading,
    isOtpLoading,
    handleChange,
    handleFocus,
    handleBlur,
    handleLogin,
    handleLoginWithOtp,
  } = useLogin();

  useEffect(() => {
    setHydrated(true);
  }, []);

  const validatePhone = (value: string) => {
    if (!value) return "شماره موبایل الزامی است";
    if (!/^09\d{9}$/.test(value))
      return "شماره موبایل باید با 09 شروع شود و 11 رقم باشد";
    return "";
  };

  const handlePasswordChange = (value: string) => {
    handleChange("password", value);
  };

  function handleShowPassword() {
    setShowPassword(!showPassword);
  }

  if (!hydrated) return null;

  return (
    <div className={styles["signin"]} role="main" aria-label="صفحه ورود">
      {/* Background Pattern */}
      <div className={styles["signin__background"]} aria-hidden="true">
        <div className={styles["signin__background-pattern"]}></div>
        <div className={styles["signin__background-gradient"]}></div>
      </div>



      {/* Main Content */}
      <div className={styles["signin__container"]}>
        <div className={styles["signin__right-panel"]}>
          <div className={styles["signin__form-container"]}>
            <div className={styles["signin__header"]}>
              <div className={styles["signin__logo"]}>
                <Logo size="60px" />
              </div>
              <h6 className={styles["signin__title"]}>ورود به حساب کاربری</h6>
              <p className={styles["signin__subtitle"]}>
                شماره موبایل و رمز عبور خود را وارد کنید
              </p>
            </div>

            <form className={styles["signin__form"]} noValidate aria-label="فرم ورود">
              <div className={styles["signin__field-group"]}>
                <TextField
                  id="phone"
                  value={values.phone}
                  onChangeAction={(val) => {
                    if (/^\d*$/.test(val) && val.length <= 11) {
                      handleChange("phone", val);
                    }
                  }}
                  onFocus={() => handleFocus("phone")}
                  onBlur={() => handleBlur("phone", validatePhone)}
                  placeholder="09123456789"
                  label="شماره موبایل"
                  errorIcon={errors.phone ? { text: errors.phone } : undefined}
                  className={styles["signin__input"]}
                  inputMode="numeric"
                  maxLength={11}
                  size="sm"
                  autoFocus={true}
                  normalizeDigits={true}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  aria-invalid={!!errors.phone}
                  baseColor={{
                    borderAndLabel: "gray-300",
                    inputBgColor: "main-white",
                    textInput: "gray-950",
                    textError: "error-700",
                  }}
                />
                {errors.phone && (
                  <div id="phone-error" role="alert" className={styles["signin__field-error"]}>
                    {errors.phone}
                  </div>
                )}
              </div>

              <div className={styles["signin__field-group"]}>
                <TextField
                  id="password"
                  size="sm"
                  baseColor={{
                    borderAndLabel: "gray-300",
                    inputBgColor: "main-white",
                    textInput: "gray-950",
                    textError: "error-700",
                  }}
                  type={showPassword ? "text" : "password"}
                  placeholder="رمز عبور خود را وارد کنید"
                  label="رمز عبور"
                  value={values.password}
                  onChangeAction={handlePasswordChange}
                  className={styles["signin__input"]}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  aria-invalid={!!errors.password}
                  leftContent={{
                    Icon: showPassword ? Eye : EyeSlash,
                    iconColor: showPassword
                      ? "var(--primary-700)"
                      : "var(--gray-500)",
                    iconSize: "20",
                    variant: "Bulk",
                    onClick: () => {
                      handleShowPassword();
                    },
                  }}
                />
                {errors.password && (
                  <div id="password-error" role="alert" className={styles["signin__field-error"]}>
                    {errors.password}
                  </div>
                )}
                <button
                  type="button"
                  className={styles["signin__forgot-password"]}
                  onClick={() => {
                    console.log("Forgot password clicked");
                  }}
                  aria-label="بازیابی رمز عبور"
                >
                  رمز عبور خود را فراموش کرده‌اید؟
                </button>
              </div>

              {errors.general && (
                <div className={styles["signin__error-message"]} role="alert" aria-live="polite">
                  {errors.general}
                </div>
              )}

              <div className={styles["signin__buttons"]}>
                <button

                  onClick={handleLogin}
                  disabled={
                    !!errors.phone ||
                    !!errors.password ||
                    isLoading ||
                    !values.password
                  }
                  className={'fill-button'}     >
                  {isLoading ? (
                    <>
                      <span className={styles["signin__loading-spinner"]} aria-hidden="true"></span>
                      در حال ورود...
                    </>
                  ) : (
                    "ورود"
                  )}
                </button>

                <div className={styles["signin__divider"]} aria-hidden="true">
                  <span>یا</span>
                </div>

                <button
                  disabled={
                    !!errors.phone ||
                    !values.phone ||
                    isLoading ||
                    isOtpLoading
                  }
                  onClick={handleLoginWithOtp}
                  className={'border-button'}
                  aria-label={isOtpLoading ? "در حال ارسال کد، لطفاً صبر کنید" : "ورود با کد یک بار مصرف"}
                >
                  {isOtpLoading ? (
                    <>
                      <span className={styles["signin__loading-spinner"]} aria-hidden="true"></span>
                      در حال ارسال کد...
                    </>
                  ) : (
                    "ورود با کد یک بار مصرف"
                  )}
                </button>
              </div>
            </form>

            <div className={styles["signin__signup-link"]}>
              <span>حساب کاربری ندارید؟</span>
              <button
                className={styles["signin__signup-button"]}
                onClick={() => router.push("/auth/signUp")}
                aria-label="ثبت‌نام در نیکی‌گرام"
                type="button"
              >
                ثبت‌نام کنید
              </button>
            </div>
          </div>
        </div>
        <div className={styles["signin__left-panel"]}>
          <div className={styles["signin__left-content"]}>
            <div className={styles["signin__welcome-text"]}>
              <h1 className={styles["signin__welcome-title"]}>
                به نیکی‌گرام خوش آمدید
              </h1>
              <p className={styles["signin__welcome-subtitle"]}>
                جایی که نیکی جریان دارد و تو هم می‌توانی بخشی از این مسیر باشی
              </p>
            </div>
            <div className={styles["signin__decoration"]}>
              <div className={styles["signin__decoration-circle"]}></div>
              <div className={styles["signin__decoration-circle"]}></div>
              <div className={styles["signin__decoration-circle"]}></div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}