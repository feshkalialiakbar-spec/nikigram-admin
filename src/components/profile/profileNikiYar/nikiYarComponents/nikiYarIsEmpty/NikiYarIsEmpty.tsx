import React, { useState } from "react";
import styles from "./NikiYarIsEmpty.module.scss";
import Text from "@/components/ui/text/Text";
import InboxEmpty from "../../../../../assets/images/global/inboxEmpty.svg";
import ParsehImage from "@/components/ui/image/ParsehImage";
import Button from "@/components/ui/actions/button/Button";
import { AddCircle } from "iconsax-react";
import NikiYarCreateServices from "../../nikiYarComponents/nikiYarCreateServices/NikiYarCreateServices";

interface NikiYarIsEmptyProps {
  showAddressSelector?: boolean;
}

export default function NikiYarIsEmpty({
  showAddressSelector = false,
}: NikiYarIsEmptyProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={styles["niki-yar-is-empty"]}>
      <div className={styles["niki-yar-is-empty__image"]}>
        <ParsehImage
          imgSrc={InboxEmpty}
          imgAlt="خدمات آنلاین"
          width={156}
          height={156}
        />
      </div>
      <div className={styles["niki-yar-is-empty__content"]}>
        <Text textStyle="16S7" textColor="gray-950">
          شما هنوز سرویس یا خدمتی ثبت نکرده‌اید
        </Text>
        <Text textStyle="16S4" textColor="gray-700">
          از طریق دکمه ایجاد خدمت می‌توانید سرویس مورد نظر خود را ثبت کنید
        </Text>
        <Button
          paddingStyle="avg-8-32"
          bgColor="primary-700"
          borderColor="primary-700"
          mode="side-rounded"
        >
          <div
            className={styles["niki-yar-is-empty__button"]}
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <AddCircle size={24} color="var(--main-white)" variant="Bulk" />
            <Text textStyle="16S5" textColor="main-white" fontFamily="moraba">
              ایجاد سرویس / خدمت
            </Text>
          </div>
        </Button>
      </div>
      {isOpen && (
        <NikiYarCreateServices
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          showAddressSelector={showAddressSelector}
          serviceType="discount"
        />
      )}
    </div>
  );
}
