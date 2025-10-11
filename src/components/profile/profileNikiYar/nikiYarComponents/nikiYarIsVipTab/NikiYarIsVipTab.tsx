import React, { useState } from "react";
import Text from "@/components/ui/text/Text";
import styles from "./NikiYarIsVipTab.module.scss";
import Button from "@/components/ui/actions/button/Button";

interface NikiYarIsVipTabProps {
  onTabChange?: (activeTab: string) => void;
  value?: "discount" | "vip";
}

export default function NikiYarIsVipTab({ onTabChange, value }: NikiYarIsVipTabProps) {
  const [activeTab, setActiveTab] = useState<"discount" | "vip">(value ?? "discount");

  const handleTabClick = (tab: "discount" | "vip") => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className={styles["niki-yar-is-vip-tab"]}>
      <div className={styles["niki-yar-is-vip-tab__tabs"]}>
        <Button
          onClick={() => handleTabClick("discount")}
          borderColor={activeTab === "discount" ? "primary-700" : "gray-300"}
          bgColor={activeTab === "discount" ? "primary-50" : "gray-50"}
          paddingStyle="thin"
          mode="side-rounded"
          fullScreen={true}
        >
          <Text
            textStyle="16S5"
            fontFamily="moraba"
            textColor={activeTab === "discount" ? "primary-700" : "gray-400"}
          >
            تخفیف دار
          </Text>
        </Button>
        <Button
          onClick={() => handleTabClick("vip")}
          borderColor={activeTab === "vip" ? "primary-700" : "gray-300"}
          bgColor={activeTab === "vip" ? "primary-50" : "gray-50"}
          paddingStyle="thin"
          mode="side-rounded"
          fullScreen={true}
        >
          <Text
            textStyle="16S5"
            fontFamily="moraba"
            textColor={activeTab === "vip" ? "primary-700" : "gray-400"}
          >
            VIP
          </Text>
        </Button>
      </div>
    </div>
  );
}
