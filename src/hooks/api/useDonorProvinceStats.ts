import { useState, useEffect, useCallback } from "react";
import { getDonorProvinceStats, ProvinceStats, IntervalType } from "@/services/api/graph";

interface UseDonorProvinceStatsState {
  data: ProvinceStats[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDonorProvinceStats = (
  interval: IntervalType = "today"
): UseDonorProvinceStatsState => {
  const [data, setData] = useState<ProvinceStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDonorProvinceStats(interval);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطایی رخ داد");
    } finally {
      setLoading(false);
    }
  }, [interval]);

  useEffect(() => {
    fetchData();
  }, [interval, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};


