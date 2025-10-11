import { useQuery } from "@tanstack/react-query";
import { useMemo, useCallback } from "react";

import { getFullUserInfo, updateUserInfo } from "@/services/api/auth";
import { useDispatch, useSelector } from "react-redux";
import { setFullUserInfo, setUserLoading, setUserError, updateUserInfoSuccess } from "@/stores/userStores/user/user.slice";
import { FullUserInfoRequest, UpdateUserInfoRequest } from "@/dtos/auth.dto";
import { RootState } from "@/stores/userStores/userMerge.store";

interface UseApiListProps<TParams extends Record<string, unknown> = Record<string, unknown>, TResponse = unknown> {
  /**
   * تابع fetcher که داده را از API می‌گیرد (مثلاً getProjects)
   */
  fetcher: (params?: TParams) => Promise<TResponse>;
  /**
   * پارامترهای کوئری (اختیاری)
   */
  params?: TParams;
  /**
   * کلید یکتا برای کش (اختیاری، اگر ندادی خودش می‌سازد)
   */
  queryKey?: (string | number | undefined)[];
  /**
   * فعال بودن کوئری (اختیاری)
   */
  enabled?: boolean;
  /**
   * تنظیمات retry (اختیاری)
   */
  retry?: boolean | number | ((failureCount: number, error: Error) => boolean);
}

export function useApiList<TParams extends Record<string, unknown> = Record<string, unknown>, TResponse = unknown>({
  fetcher,
  params,
  queryKey,
  enabled = true,
  retry,
}: UseApiListProps<TParams, TResponse>) {
  // Memoize the query key to prevent unnecessary re-renders
  const key = useMemo(() => {
    return queryKey || [fetcher.name, JSON.stringify(params)];
  }, [queryKey, fetcher.name, params]);

  return useQuery<TResponse, Error>({
    queryKey: key,
    queryFn: () => fetcher(params),
    enabled,
    retry,
    // Add staleTime to prevent frequent refetches
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Add cacheTime to keep data in cache longer
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for full_user_info API
export const useFullUserInfo = () => {
  const dispatch = useDispatch();
  const { isLoading, error, platforms, documents } = useSelector((state: RootState) => state.user);

  const fetchFullUserInfo = useCallback(async (params: FullUserInfoRequest = {}) => {
    try {
      dispatch(setUserLoading(true));
      dispatch(setUserError(null));
      
      const response = await getFullUserInfo(params);
      dispatch(setFullUserInfo(response));
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "خطا در دریافت اطلاعات کاربر";
      dispatch(setUserError(errorMessage));
      throw error;
    } finally {
      dispatch(setUserLoading(false));
    }
  }, [dispatch]);

  return {
    fetchFullUserInfo,
    isLoading,
    error,
    platforms,
    documents,
  };
};

// Hook for updating user info
export const useUpdateUserInfo = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.user);

  const updateUserInfoData = async (data: UpdateUserInfoRequest) => {
    try {
      dispatch(setUserLoading(true));
      dispatch(setUserError(null));
      
      const response = await updateUserInfo(data);
      dispatch(updateUserInfoSuccess(response));
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "خطا در بروزرسانی اطلاعات کاربر";
      dispatch(setUserError(errorMessage));
      throw error;
    } finally {
      dispatch(setUserLoading(false));
    }
  };

  return {
    updateUserInfoData,
    isLoading,
    error,
  };
};
