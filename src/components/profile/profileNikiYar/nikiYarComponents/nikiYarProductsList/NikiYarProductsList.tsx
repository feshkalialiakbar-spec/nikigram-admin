import React from "react";
import styles from "./NikiYarProductsList.module.scss";
import Text from "@/components/ui/text/Text";
import { Trash, Edit } from "iconsax-react";
import { MyProductItem } from "@/types/nikiYarProfile.dto";
import { useClubLevels } from "@/hooks/api/useClubLevels";

type Props = {
  items: MyProductItem[];
  mode: "discount" | "vip";
  onEditProduct?: (productId: number) => void;
  onDeleteProduct?: (productId: number) => void;
};

export default function NikiYarProductsList({
  items,
  mode,
  onEditProduct,
  onDeleteProduct,
}: Props) {
  const { items: clubLevels, loading } = useClubLevels();


  // دیگر نیازی به فراخوانی API جزئیات محصول نیست
  // تمام اطلاعات در items موجود است
  return (
    <div className={styles["niki-yar-products-list"]}>
      {items.map((item) => (
        <div
          key={item.customer_product_id}
          className={styles["niki-yar-products-list__product-card"]}
        >
          <div
            className={styles["niki-yar-products-list__product-card-header"]}
          >
            <div
              className={styles["niki-yar-products-list__product-card-title"]}
            >
              <Text textStyle="16S5" textColor="gray-950">
                {item.parent_category_name
                  ? `${item.parent_category_name} - `
                  : ""}
                {item.main_category_name || "-"}
              </Text>
              <Text textStyle="14S4" textColor="gray-700">
                {item.description 
                  ? (item.description.length > 50 ? item.description.slice(0, 50) + "..." : item.description)
                  : "بدون توضیحات"}
              </Text>
            </div>
            <div
              className={styles["niki-yar-products-list__product-card-actions"]}
            >
              <Edit
                size={22}
                color="var(--primary-700)"
                variant="Bulk"
                style={{ cursor: "pointer" }}
                onClick={() => onEditProduct?.(item.customer_product_id)}
              />
              <Trash
                size={20}
                color="var(--error-700)"
                variant="Bulk"
                style={{ cursor: "pointer" }}
                onClick={() => onDeleteProduct?.(item.customer_product_id)}
              />
            </div>
          </div>

          <div
            className={styles["niki-yar-products-list__product-card-levels"]}
          >
            {loading ? (
              <Text textStyle="14S5" textColor="gray-600">
                در حال بارگذاری سطح‌های باشگاه...
              </Text>
            ) : item.offers?.length > 0 ? (
              item.offers.map((offer, index) => {
                const clubLevel = clubLevels.find(cl => cl.level_id === offer.cust_level);
                const levelName = clubLevel?.level_name || `سطح ${offer.cust_level}`;
                
                return (
                  <div
                    key={`${item.customer_product_id}-${offer.cust_level}-${index}`}
                    className={
                      styles["niki-yar-products-list__product-card-levels-level"]
                    }
                  >
                    <Text textStyle="16S4" fontFamily="moraba" textColor="gray-950">
                      {levelName}
                    </Text>
                    {mode === "discount" && offer.discount_percent > 0 && (
                      <Text textStyle="16S5" textColor="primary-800">
                        ٪{offer.discount_percent}
                      </Text>
                    )}
                  </div>
                );
              })
            ) : (
              <Text textStyle="14S5" textColor="gray-500">
                هیچ سطحی تعریف نشده
              </Text>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
