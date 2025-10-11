import { useState, useEffect } from "react";
import { charityApi } from "@/services/api/charity";
import { CharityOrganization } from "@/dtos/charity.dto";

export const useCharityOrganizations = () => {
  const [organizations, setOrganizations] = useState<CharityOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await charityApi.getOrganizations();
        setOrganizations(response.data);
        setTotalCount(response.total_count);
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطایی در دریافت اطلاعات خیریه‌ها رخ داد");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  return {
    organizations,
    loading,
    error,
    totalCount,
    refetch: () => {
      setLoading(true);
      setError(null);
      charityApi.getOrganizations()
        .then(response => {
          setOrganizations(response.data);
          setTotalCount(response.total_count);
        })
        .catch(err => {
          setError(err instanceof Error ? err.message : "خطایی در دریافت اطلاعات خیریه‌ها رخ داد");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
};
