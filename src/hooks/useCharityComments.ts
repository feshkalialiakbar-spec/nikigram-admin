import { useState, useEffect } from "react";
import { charityApi } from "@/services/api/charity";
import { CharityComment } from "@/dtos/charity.dto";

export const useCharityComments = (charityId: number | string | string[] | undefined, limit: number = 20, offset: number = 0) => {
  const [comments, setComments] = useState<CharityComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

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

    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await charityApi.getCharityComments(Number(id), limit, offset);
        setComments(response.comments);
        setTotalCount(response.total_comments_count);
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطایی در دریافت کامنت‌ها رخ داد");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [charityId, limit, offset]);

  return {
    comments,
    loading,
    error,
    totalCount,
    refetch: () => {
      if (!charityId) return;
      
      const id = Array.isArray(charityId) ? charityId[0] : charityId;
      if (!id) return;
      
      setLoading(true);
      setError(null);
      charityApi.getCharityComments(Number(id), limit, offset)
        .then(response => {
          setComments(response.comments);
          setTotalCount(response.total_comments_count);
        })
        .catch(err => {
          setError(err instanceof Error ? err.message : "خطایی در دریافت کامنت‌ها رخ داد");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
};
