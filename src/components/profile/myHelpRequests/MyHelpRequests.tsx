import React, { useEffect, useMemo, useState } from "react";
import styles from "./MyHelpRequests.module.scss";
import Text, { Colors } from "@/components/ui/text/Text";
import QuadInfoCard from "@/components/ui/cards/quadInfoCard/QuadInfoCard";
import { getUserProjectRequests } from "@/services/api/userProjectRequests";
import type { UserProjectRequestItemDto } from "@/dtos/userProjectRequests.dto";
import { Edit, Trash } from "iconsax-react";
import Badge from "@/components/ui/badge/Badge";

type TabColor = "secondary1" | "secondary2" | "error";

export default function MyHelpRequests() {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<UserProjectRequestItemDto[]>([]);

  const tabs: { id: number; label: string; color: TabColor }[] = [
    { id: 1, label: "تایید شده", color: "secondary1" },
    { id: 2, label: "در انتظار تایید", color: "secondary2" },
    { id: 3, label: "تایید نشده", color: "error" },
  ];

  const statusId = useMemo(() => {
    if (activeTab === 1) return 1 as const;
    if (activeTab === 2) return 2 as const;
    return 3 as const;
  }, [activeTab]);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setError(null);
    getUserProjectRequests({ status_id: statusId, limit: 20, offset: 0 })
      .then((res) => {
        if (!mounted) return;
        setItems(res.requests || []);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(String(e?.message || e));
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [statusId]);

  return (
    <div className={styles["my-help-requests"]}>
      <div className={styles["my-help-requests__tabs"]}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`${styles["my-help-requests__tab"]} ${
              activeTab === tab.id
                ? styles["my-help-requests__tab--active"]
                : ""
            }`}
            data-color={tab.color}
            onClick={() => setActiveTab(tab.id)}
          >
            <Text
              textStyle="14S5"
              textColor={
                activeTab === tab.id
                  ? (`${tab.color}-700` as unknown as Colors)
                  : ("gray-600" as Colors)
              }
            >
              {tab.label}
            </Text>
          </div>
        ))}
      </div>
      <div className={styles["my-help-requests__content"]}>
        {isLoading && (
          <Text textStyle="14S4" textColor="gray-600">
            در حال دریافت...
          </Text>
        )}
        {!isLoading && error && (
          <Text textStyle="14S4" textColor="error-600">
            {error}
          </Text>
        )}
        {!isLoading && !error && items.length === 0 && (
          <Text textStyle="14S4" textColor="gray-700">
            داده‌ای یافت نشد.
          </Text>
        )}
        {!isLoading && !error && items.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {items.map((item) => (
              <QuadInfoCard
                key={item.request_id}
                data={{
                  topRight: (
                    <Text textStyle="16S5" textColor="primary-950" wrap="wrap">
                      {item.title}
                    </Text>
                  ),
                  topLeft: (
                    <Text textStyle="12S4" textColor="gray-500">
                      {new Date(item.created_at).toLocaleDateString("fa-IR")}
                    </Text>
                  ),
                  bottomRight: (
                    <div className={styles["my-help-requests__bottom-right"]}>

                      <Badge 
                      size="md"
                      bgc={item.status === 1 ? "secondary1-50" : item.status === 2 ? "secondary2-50" : "error-50"}
                      >{item.status === 1 ? "تایید شده" : item.status === 2 ? "در انتظار تایید" : "تایید نشده"}</Badge>
                      <Edit
                        size={24}
                        color="var(--primary-700)"
                        variant="Bulk"
                      />
                      <Trash
                        size={24}
                        color="var(--error-700)"
                        variant="Bulk"
                      />
                    </div>
                  ),
                  bottomLeft: (
                    <div className={styles["my-help-requests__bottom-left"]}>
                      <Text textStyle="14S4" textColor="gray-600">
                        مبلغ دوره
                      </Text>
                      <Text textStyle="14S5" textColor="gray-900">
                        {/* {item.amount_in_period.toLocaleString("fa-IR")} تومان /  */}
                        {item.time_period} ماه
                      </Text>
                    </div>
                  ),
                }}
                styleBox={{
                  width: "100%",
                  bgColor: "gray-50",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
