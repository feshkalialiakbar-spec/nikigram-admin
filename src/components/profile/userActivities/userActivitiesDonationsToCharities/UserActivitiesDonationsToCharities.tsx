import DualSkewCard from "@/components/ui/cards/dualSkewCard/DualSkewCard";
import React, { useEffect, useState } from "react";
import Text from "@/components/ui/text/Text";
import styles from "./UserActivitiesDonationsToCharities.module.scss";
import Button from "@/components/ui/actions/button/Button";
import InboxEmpty from "@/assets/images/global/inboxEmpty.svg";
import ParsehImage from "@/components/ui/image/ParsehImage";
import {
  getUserCharityDonations,
  UserCharityDonationItem,
} from "@/services/api/profile/activities";
import { getImageUrl } from "@/utils/imageUtils";
import { useRouter } from "next/router";
 

export default function UserActivitiesDonationsToCharities() {
  const router = useRouter();
  const [list, setList] = useState<UserCharityDonationItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getUserCharityDonations();
        if (!isMounted) return;
        setList(data);
      } catch (e) {
        if (!isMounted) return;
        setError("دریافت اطلاعات با خطا مواجه شد");
        setList([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <div className={styles["user-activities-donations-to-charities"]}>
      {loading ? (
        <div
          className={styles["user-activities-donations-to-charities__empty"]}
        >
          <Text textStyle="16S7" textColor="gray-700">
            در حال بارگذاری...
          </Text>
        </div>
      ) : list && list.length <= 0 ? (
        <div
          className={styles["user-activities-donations-to-charities__empty"]}
        >
          <div
            className={
              styles[
                "user-activities-donations-to-charities__empty-img-wrapper"
              ]
            }
          >
            <ParsehImage
              imgSrc={InboxEmpty}
              imgAlt="ok"
              fitDirection="width"
              fill
              aspectRatio="1/1"
            />
          </div>
          <Text textStyle="16S7" textColor="gray-950">
            شما هنوز به خیریه‌ای نیکی نکرده‌اید.
          </Text>
          <Text textStyle="16S4" textColor="gray-700">
            خیریه‌های فعال منتظر همراهی و حمایت شما هستند. به آنها سر بزنید و
            تفاوت را رقم بزنید!
          </Text>
          <Button
            bgColor="primary-700"
            mode="side-rounded"
            paddingStyle="avg-8-32"
            shadow="primary-800"
            onClick={() => {}}
          >
            <Text textStyle="16S5" textColor="main-white" fontFamily="moraba">
              مشاهده خیریه‌ها
            </Text>
          </Button>
        </div>
      ) : list && list.length > 0 ? (
        <div className={styles["user-activities-donations-to-charities__list"]}>
          {list.map((item, index) => (
            <DualSkewCard
              key={`${item.charity_id}-${index}`}
              imageBox={
                <ParsehImage
                  imgSrc={getImageUrl(item.logo_file_uid)}
                  imgAlt={item.charity_name}
                  fitDirection="width"
                  fill
                  aspectRatio="1/1"
                />
              }
              infoBox={
                <div
                  className={
                    styles[
                      "user-activities-donations-to-charities__list-item-info-wrapper"
                    ]
                  }
                >
                  <Text textStyle="14S7" textColor="main-black">
                    {item.charity_name}
                  </Text>
                  <div
                    className={
                      styles[
                        "user-activities-donations-to-charities__list-item-info"
                      ]
                    }
                  >
                    <Text textStyle="14S4" textColor="gray-800">
                      مقدار نیکی:
                    </Text>
                    <Text textStyle="14S7" textColor="main-black">
                      {item.total_amount.toLocaleString("fa-IR")} نیکی
                    </Text>
                  </div>
                  <div
                    className={
                      styles[
                        "user-activities-donations-to-charities__list-item-info"
                      ]
                    }
                  >
                    <Text textStyle="14S4" textColor="gray-800">
                      تاریخ آخرین پرداخت :
                    </Text>
                  <Text textStyle="14S7" textColor="main-black">
                    {new Date(item.last_donation_date).toLocaleDateString(
                      "fa-IR-u-ca-persian",
                      { day: "2-digit", month: "long", year: "numeric" }
                    )}
                  </Text>
                  </div>
                </div>
              }
              btnItem={
                <div
                  className={
                    styles[
                      "user-activities-donations-to-charities__list-item-btn-wrapper"
                    ]
                  }
                >
                  <Button
                    bgColor="primary-700"
                    mode="side-rounded"
                    fullScreen={true}
                    paddingStyle="equal-8"
                    shadow="primary-800"
                    onClick={() => router.push(`/charities/${item.charity_id}`)}
                  >
                    <Text
                      textStyle="16S5"
                      textColor="main-white"
                      fontFamily="moraba"
                    >
                      مشاهده
                    </Text>
                  </Button>
                </div>
              }
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
