"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/ui/actions/button/Button";
import UserAddressModal from "./userAddressModal/UserAddressModal";
import styles from "./UserAddresses.module.scss";
import QuadInfoCard from "@/components/ui/cards/quadInfoCard/QuadInfoCard";
import { Edit, Trash } from "iconsax-react";
import Text from "@/components/ui/text/Text";
import { useAddresses } from "@/hooks/useAddresses";
import { AddressItemDto } from "@/dtos/address.dto";

interface UserAddressesProps {
  onAddClick?: () => void;
}

export default function UserAddresses({ onAddClick }: UserAddressesProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedAddressUid, setSelectedAddressUid] = useState<string | null>(
    null
  );
  const { items, isLoading, error, fetchAddresses } = useAddresses();

  useEffect(() => {
    fetchAddresses({ limit: 10, offset: 0 }).catch(() => {});
  }, [fetchAddresses]);

  return (
    <div className={styles["user-addresses"]}>
      <UserAddressModal
        isOpen={isOpen}
        setIsOpenAction={setIsOpen}
        onSubmit={undefined}
        addressUid={selectedAddressUid}
        onUpdated={() => {
          fetchAddresses({ limit: 10, offset: 0 }).catch(() => {});
        }}
      />
      <div className={styles["user-addresses__add-address"]}>
        <Button
          bgColor="primary-600"
          hoverColor="primary-700"
          mode="side-rounded"
          paddingStyle="avg-8-32"
          shadow="primary-800"
          onClick={() => {
            if (onAddClick) {
              onAddClick();
              return;
            }
            setSelectedAddressUid(null);
            setIsOpen(true);
          }}
        >
          <Text textStyle="14S7" textColor="main-white" fontFamily="moraba">
            افزودن آدرس
          </Text>
        </Button>
      </div>
      <div className={styles["user-addresses__list"]}>
        {isLoading && (
          <Text textStyle="14S5" textColor="gray-700">
            در حال بارگذاری...
          </Text>
        )}
        {!!error && (
          <Text textStyle="14S5" textColor="error-700">
            {String(error)}
          </Text>
        )}
        {!isLoading &&
          !error &&
          items.map((a: AddressItemDto) => {
            const title = a.address_title || "بدون عنوان";
            const addressFull = [a.address_line1, a.address_line2]
              .filter((x) => x && x.trim())
              .join(" ");
            const display =
              addressFull && addressFull.length > 0
                ? addressFull
                : [
                    a.province,
                    a.county,
                    a.city,
                    a.neighborhood,
                    a.plaque,
                    a.unit,
                  ]
                    .filter((x) => x && String(x).trim())
                    .join("، ");
            return (
              <QuadInfoCard
                key={a.address_uid || String(a.address_id)}
                data={{
                  topRight: (
                    <div className={styles["user-addresses__item-top-right"]}>
                      <Text
                        textStyle="14S7"
                        textColor="main-black"
                        fontFamily="moraba"
                        wrap="nowrap"
                      >
                        {title.length > 42 ? title.slice(0, 40) + "..." : title}
                      </Text>
                    </div>
                  ),
                  topLeft: (
                    <div className={styles["user-addresses__item-actions"]}>
                      <Trash
                        size={18}
                        color="var(--error-700)"
                        variant="Bulk"
                      />
                      <Edit
                        size={18}
                        color="var(--primary-700)"
                        variant="Bulk"
                        onClick={() => {
                          setSelectedAddressUid(a.address_uid);
                          setIsOpen(true);
                        }}
                      />
                    </div>
                  ),
                  bottomRight: (
                    <Text
                      textStyle="14S5"
                      wrap="nowrap"
                      textColor="main-black"
                      textClassName={styles["user-addresses__item-address"]}
                      textAlign="right"
                    >
                      {display.length > 52
                        ? display.slice(0, 50) + "..."
                        : display}
                    </Text>
                  ),
                }}
                styleBox={{
                  bgColor: "gray-50",
                  width: "100%",
                  gap: "4px",
                }}
              />
            );
          })}
      </div>
    </div>
  );
}
