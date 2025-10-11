import { useState, useEffect, useCallback } from "react";
import { getDonorAgeGroupStats, AgeGroupStats, IntervalType } from "@/services/api/graph";

interface UseDonorAgeGroupStatsState {
  data: AgeGroupStats[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDonorAgeGroupStats = (
  interval: IntervalType = "today"
): UseDonorAgeGroupStatsState => {
  const [data, setData] = useState<AgeGroupStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDonorAgeGroupStats(interval);
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


