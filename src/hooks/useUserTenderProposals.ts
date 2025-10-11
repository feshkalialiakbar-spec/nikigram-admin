import { useEffect, useState } from "react";
import { getUserTenderProposals, UserTenderProposalsResponse, UserTenderProposalItem } from "@/services/api/profile/activities";

export function useUserTenderProposals() {
  const [data, setData] = useState<UserTenderProposalItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getUserTenderProposals();
      setData(result.proposals || []);
      setTotalCount(result.total_count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در دریافت اطلاعات");
      console.error("Error fetching user tender proposals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = async () => {
    await fetchData();
  };

  return { data, totalCount, loading, error, refetch };
}



