import  { ReactNode } from "react";
import styles from "./AuthLayout.module.scss";
import Logo from "@/components/logo/Logo";
import Text from "@/components/ui/text/Text";
import ParsehImage from "@/components/ui/image/ParsehImage";
import signinImg from "../../../../assets/images/signIn/SignIn.png";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string; 
  showLogo?: boolean;
  showImage?: boolean;
}

export default function AuthLayout({ 
  children, 
  title = "به نیکی گرام خوش آمدید",
   showLogo = true,
  showImage = true
}: AuthLayoutProps) {
  return (
    <div className={styles["auth-layout"]}>
      <div className={styles["auth-layout__right-panel"]}>
        {showLogo && (
          <div className={styles["auth-layout__right-panel-logo"]}>
            <Logo size="90px" />
            <Text
              textStyle="20S7"
              textColor="primary-950"
              textTag="h1"
              fontFamily="moraba"
              textAlign="center"
              textClassName={styles["auth-layout__logo-title"]}
            >
              ثبت‌نام در نیکی‌گرام
            </Text>
          </div>
        )}
        {showImage && (
          <div className={styles["auth-layout__right-panel-image"]}>
            <ParsehImage
              imgSrc={signinImg}
              imgAlt="ثبت نام نیکی گرام"
              height="250px"
            />
          </div>
        )}
        <div className={styles["auth-layout__right-panel-content"]}>
          {children}
        </div>
      </div>
      <div className={styles["auth-layout__left-panel"]}>
        <Text
          textStyle="32S7"
          textColor="main-white"
          textTag="h2"
          textAlign="center"
          textClassName={styles["auth-layout__title"]}
        >
          {title}
        </Text>
        <Text
          textStyle="18S7"
          textColor="main-white"
          textTag="p"
          textAlign="center"
          textClassName={styles["auth-layout__title--subtitle"]}
        >
           
           جایی که نیکی جریان دارد
           <br />
           و
           <br />
           تو هم می‌توانی بخشی از این مسیر باشی 
        
        </Text>
        <div className={styles["auth-layout__left-panel-image"]}>
          <ParsehImage
            imgSrc={signinImg}
            imgAlt="ثبت نام نیکی گرام"
            height="250px"
          />
        </div>
      </div>
    </div>
  );
} 