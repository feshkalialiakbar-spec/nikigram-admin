import { useState, useEffect } from 'react';
import { getUserProjectDonations, UserProjectDonationItem } from '@/services/api/profile/activities';

export function useUserProjectDonations() {
  const [data, setData] = useState<UserProjectDonationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getUserProjectDonations();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطا در دریافت اطلاعات');
        console.error('Error fetching user project donations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getUserProjectDonations();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در دریافت اطلاعات');
      console.error('Error refetching user project donations:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
}
