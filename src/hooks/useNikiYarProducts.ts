import { useEffect, useState, useMemo } from "react";
import { nikiYarProfileService } from "@/services/api/nikiYarProfile.service";
import { MyProductItem } from "@/types/nikiYarProfile.dto";

interface UseNikiYarProductsParams {
  deliveryMethod?: "0" | "1" | "2"; // 0=آنلاین، 1=حضوری، 2=نیکی مارکت
  autoRefresh?: boolean;
}

interface UseNikiYarProductsReturn {
  items: MyProductItem[];
  filteredItems: MyProductItem[];
  vipItems: MyProductItem[];
  discountItems: MyProductItem[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * Custom hook برای مدیریت محصولات نیکی یار
 * با بهینه‌سازی برای عدم نیاز به API call جداگانه برای offers
 */
export function useNikiYarProducts({
  deliveryMethod,
  autoRefresh = true,
}: UseNikiYarProductsParams = {}): UseNikiYarProductsReturn {
  const [items, setItems] = useState<MyProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // استفاده از API با پارامترهای بهینه‌شده
      // offers و description حالا مستقیماً در response موجودند
      const data = await nikiYarProfileService.getMyProducts({
        sort_by: "newest",
        limit: 100, // تعداد بیشتر برای coverage بهتر
        offset: 0,
        ...(deliveryMethod && { delivery_method: parseInt(deliveryMethod) }),
      });
      
      setItems(data.items || []);
    } catch (err) {
      console.error("Error fetching NikiYar products:", err);
      setError(err as Error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch در mounting - فقط یک بار و وقتی deliveryMethod تغییر کند
  useEffect(() => {
    if (autoRefresh) {
      let mounted = true;
      
      (async () => {
        await fetchProducts();
      })();
      
      return () => {
        mounted = false;
      };
    }
    // فقط در mounting یا تغییر deliveryMethod - نه به خاطر تغییر تب
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh, deliveryMethod]);

  // فیلتر محصولات بر اساس delivery method
  const filteredItems = useMemo(() => {
    if (!deliveryMethod) return items;
    
    return items.filter((item) => 
      (item.delivery_methods || "").includes(deliveryMethod)
    );
  }, [items, deliveryMethod]);

  // محصولات VIP و تخفیف‌دار
  const vipItems = useMemo(() => 
    filteredItems.filter((item) => item.category_is_vip), 
    [filteredItems]
  );
  
  const discountItems = useMemo(() => 
    filteredItems.filter((item) => !item.category_is_vip), 
    [filteredItems]
  );

  return {
    items,
    filteredItems,
    vipItems,
    discountItems,
    loading,
    error,
    refresh: fetchProducts,
  };
}
