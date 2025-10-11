// src/hooks/api/useClubLevels.ts
import { useEffect, useState } from "react";
import { getClubLevels } from "@/services/api/club";
import type { ClubLevelDto } from "@/dtos/clubLevels.dto";

interface UseClubLevelsOptions {
  autoFetch?: boolean;
  lanId?: string;
}

// Cache برای club levels
let clubLevelsCache: {
  [key: string]: {
    data: ClubLevelDto[];
    timestamp: number;
  };
} = {};

const CACHE_DURATION = 5 * 60 * 1000; // 5 دقیقه

export function useClubLevels(options: UseClubLevelsOptions = { autoFetch: true, lanId: "fa" }) {
  const [items, setItems] = useState<ClubLevelDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const lanId = options.lanId ?? "fa";
  const cacheKey = `club_levels_${lanId}`;

  const fetchLevels = async () => {
    // بررسی cache
    const cachedData = clubLevelsCache[cacheKey];
    const now = Date.now();
    
    if (cachedData && (now - cachedData.timestamp) < CACHE_DURATION) {
      console.log("📦 استفاده از cache برای club levels");
      setItems(cachedData.data);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log("🌐 دریافت club levels از API");
      const data = await getClubLevels(lanId);
      
      // ذخیره در cache
      clubLevelsCache[cacheKey] = {
        data,
        timestamp: now
      };
      
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در دریافت سطح‌های باشگاه");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.autoFetch) {
      fetchLevels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.autoFetch, lanId]);

  return { items, loading, error, refetch: fetchLevels };
}

export default useClubLevels;


