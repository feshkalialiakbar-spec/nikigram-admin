import { useState, useEffect } from 'react';
import { charityApi } from '@/services/api/charity';
import { TargetGroup } from '@/dtos/charity.dto';

export const useCharityGroups = () => {
  const [charityGroups, setCharityGroups] = useState<TargetGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharityGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const groups = await charityApi.getCharityGroups();
      setCharityGroups(groups);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در دریافت گروه‌های خیریه');
      console.error('Error fetching charity groups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharityGroups();
  }, []);

  return {
    charityGroups,
    loading,
    error,
    refetch: fetchCharityGroups,
  };
};
