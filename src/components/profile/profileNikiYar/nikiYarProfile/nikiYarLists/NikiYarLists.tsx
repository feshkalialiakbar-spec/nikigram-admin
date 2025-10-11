import React from "react";
import { useRouter } from "next/router";
import styles from "./NikiYarLists.module.scss";
import { ArrowLeft2, Global, Profile, ShoppingBag } from "iconsax-react";
import Text from "@/components/ui/text/Text";

export default function NikkiYarLists() {
  const router = useRouter();

  const services = [
    {
      key: "online",
      label: "سرویس / خدمت آنلاین",
      icon: Global,
      href: "/profile?tab=niki-yar&nikiyartab=online-services",
    },
    {
      key: "inperson",
      label: "سرویس / خدمت حضوری",
      icon: Profile,
      href: "/profile?tab=niki-yar&nikiyartab=inperson-services",
    },
    {
      key: "nikimarket",
      label: "سرویس / خدمت نیکی مارکت",
      icon: ShoppingBag,
      href: "/profile?tab=niki-yar&nikiyartab=nikimarket-services",
    },
  ];

  const handleServiceClick = (href: string) => {
    router.push(href);
  };

  return (
    <div className={styles["niki-yar-lists"]}>
      <div className={styles["niki-yar-lists__header"]}>
        <Text
          textStyle="18S5"
          textColor="primary-950"
          fontFamily="moraba"
          textAlign="right"
        >
          لیست نیکی‌یار
        </Text>
      </div>
      <div className={styles["niki-yar-lists__services"]}>
        {services.map((service) => (
          <div
            key={service.key}
            className={styles["niki-yar-lists__service-item"]}
            onClick={() => handleServiceClick(service.href)}
          >
            <div className={styles["niki-yar-lists__service-content"]}>
              <service.icon
                size={24}
                color="var(--primary-950)"
                variant="Bulk"
              />
              <Text
                textStyle="16S5"
                textColor="primary-950"
                fontFamily="moraba"
              >
                {service.label}
              </Text>
            </div>
            <ArrowLeft2
              size={24}
              color="var(--primary-950)"
              variant="Outline"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
