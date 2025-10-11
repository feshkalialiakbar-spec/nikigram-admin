import { useState, useEffect, useCallback } from "react";
import { getTopUsersByDonations, TopUserDonation, IntervalType } from "@/services/api/graph";

interface UseTopUsersByDonationsState {
  data: TopUserDonation[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTopUsersByDonations = (
  rankFrom: number = 1,
  rankTo: number = 10,
  interval: IntervalType = "last_7_days"
): UseTopUsersByDonationsState => {
  const [data, setData] = useState<TopUserDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTopUsersByDonations(rankFrom, rankTo, interval);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطایی رخ داد");
    } finally {
      setLoading(false);
    }
  }, [rankFrom, rankTo, interval]);

  useEffect(() => {
    fetchData();
  }, [rankFrom, rankTo, interval, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

