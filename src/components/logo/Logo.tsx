import Image from "next/image";
import React from "react";
import LogoImg from "@/assets/images/logo/logo.png";
import styles from "./Logo.module.scss";
import Link from "next/link";

type Filters = "white" | "none";
interface LogoProps {
  size: string;
  filters?: Filters;
}

export default function Logo({ size, filters = "none" }: LogoProps) {
  const classNames: string[] = [
    styles["logo"],
    filters ? styles[filters] : "",
    
  ];
  return (
    <Link href="/" className={classNames.join(" ")} style={{ width: size }}>
      <Image
        src={LogoImg}
        alt="نیکی گرام"
        width={parseInt(size)}
        className={styles["logo__img"]}
        suppressHydrationWarning
      />
    </Link>
  );
}
