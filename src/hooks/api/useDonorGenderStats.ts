import { useState, useEffect, useCallback } from "react";
import { getDonorGenderStats, GenderStats, IntervalType } from "@/services/api/graph";

interface UseDonorGenderStatsState {
  data: GenderStats[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDonorGenderStats = (
  interval: IntervalType = "today"
): UseDonorGenderStatsState => {
  const [data, setData] = useState<GenderStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDonorGenderStats(interval);
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


