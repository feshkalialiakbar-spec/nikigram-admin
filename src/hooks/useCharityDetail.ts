import { useState, useEffect } from "react";
import { charityApi } from "@/services/api/charity";
import { CharityDetail } from "@/dtos/charity.dto";

export const useCharityDetail = (charityId: number | string | string[] | undefined) => {
  const [charity, setCharity] = useState<CharityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!charityId) {
      setLoading(false);
      return;
    }

    const id = Array.isArray(charityId) ? charityId[0] : charityId;
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchCharityDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await charityApi.getCharityDetail(Number(id));
        setCharity(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطایی در دریافت اطلاعات خیریه رخ داد");
      } finally {
        setLoading(false);
      }
    };

    fetchCharityDetail();
  }, [charityId]);

  return {
    charity,
    loading,
    error,
    refetch: () => {
      if (!charityId) return;
      
      const id = Array.isArray(charityId) ? charityId[0] : charityId;
      if (!id) return;
      
      setLoading(true);
      setError(null);
      charityApi.getCharityDetail(Number(id))
        .then(response => {
          setCharity(response);
        })
        .catch(err => {
          setError(err instanceof Error ? err.message : "خطایی در دریافت اطلاعات خیریه رخ داد");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
};
