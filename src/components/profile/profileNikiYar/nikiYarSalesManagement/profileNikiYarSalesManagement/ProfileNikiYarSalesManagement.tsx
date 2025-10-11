import React, { useState } from "react";
import styles from "./ProfileNikiYarSalesManagement.module.scss";
import Button from "@/components/ui/actions/button/Button";
import Text from "@/components/ui/text/Text";
import useClubLevels from "@/hooks/api/useClubLevels";
import NikiLevelCard from "@/components/ui/cards/nikiLevelCard/NikiLevelCard";

export default function ProfileNikiYarSalesManagement() {
  const [open, setOpen] = useState(false);
  const { refetch } = useClubLevels({
    autoFetch: true,
    lanId: "fa",
  });

  return (
    <div className={styles["profile-niki-yar-sales-management"]}>
      <Button
        bgColor="primary-700"
        hoverColor="primary-800"
        shadow="primary-700"
        mode="side-rounded"
        onClick={async () => {
          setOpen(!open);
          await refetch();
        }}
      >
        <Text textColor="main-white">بررسی سطح</Text>
      </Button>
      {open && <NikiLevelCard isOpen={open} onClose={() => setOpen(false)} />}
      <div className={styles["profile-niki-yar-sales-management__desc"]}>
        <Text textStyle="14S5" textColor="gray-500">
          این صفحه در حال ساخت و توسعه است.
        </Text>
        <Text textStyle="14S5" textColor="gray-500">
          از این که همراه ما هستید متشکریم.
        </Text>
      </div>
    </div>
  );
}
