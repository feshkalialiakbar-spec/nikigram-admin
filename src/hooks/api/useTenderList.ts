import { useState, useEffect, useCallback, useMemo } from "react";
import { getTenderList, TenderListItem, TenderListQueryParams } from "@/services/api/projects/projects";
import { useApiOptimization } from "./useApiOptimization";

interface UseTenderListState {
  data: TenderListItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  totalCount: number;
  hasMore: boolean;
  loadMore: () => void;
}

// Cache برای ذخیره نتایج API
const cache = new Map<string, { data: TenderListItem[]; totalCount: number; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 دقیقه

export const useTenderList = (
  params?: TenderListQueryParams
): UseTenderListState => {
  const [data, setData] = useState<TenderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentOffset, setCurrentOffset] = useState(params?.offset || 0);
  
  const { optimizedCall } = useApiOptimization({
    debounceMs: 300,
    maxConcurrentRequests: 3
  });

  // ایجاد کلید cache بر اساس پارامترها
  const cacheKey = useMemo(() => {
    return JSON.stringify({ ...params, offset: currentOffset });
  }, [params, currentOffset]);

  const fetchData = useCallback(async (useCache = true) => {
    try {
      setLoading(true);
      setError(null);

      // بررسی cache
      if (useCache && cache.has(cacheKey)) {
        const cached = cache.get(cacheKey)!;
        const now = Date.now();
        if (now - cached.timestamp < CACHE_DURATION) {
          setData(cached.data);
          setTotalCount(cached.totalCount);
          setLoading(false);
          return;
        }
      }

      // استفاده از optimized call برای جلوگیری از duplicate requests
      const response = await optimizedCall(
        () => getTenderList({ ...params, offset: currentOffset }),
        `tender-list-${cacheKey}`,
        false // استفاده از deduplication به جای debounce
      );
      
      // ذخیره در cache
      cache.set(cacheKey, {
        data: response.data.tenders,
        totalCount: response.data.total_tenders_count,
        timestamp: Date.now()
      });

      setData(response.data.tenders);
      setTotalCount(response.data.total_tenders_count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطایی رخ داد");
    } finally {
      setLoading(false);
    }
  }, [params, currentOffset, cacheKey, optimizedCall]);

  const loadMore = useCallback(() => {
    const limit = params?.limit || 20;
    const nextOffset = currentOffset + limit;
    if (nextOffset < totalCount) {
      setCurrentOffset(nextOffset);
    }
  }, [currentOffset, totalCount, params?.limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // محاسبه hasMore
  const hasMore = useMemo(() => {
    const limit = params?.limit || 20;
    return currentOffset + limit < totalCount;
  }, [currentOffset, totalCount, params?.limit]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchData(false), // refetch بدون cache
    totalCount,
    hasMore,
    loadMore,
  };
};
