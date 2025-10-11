// src/hooks/useAddresses.ts
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserAddresses } from "@/services/api/addresses";
import { AddressesListRequest } from "@/dtos/address.dto";
import {
  setAddresses,
  setAddressesError,
  setAddressesLoading,
} from "@/stores/userStores/addresses/addresses.slice";
import { RootState } from "@/stores/userStores/userMerge.store";

export const useAddresses = () => {
  const dispatch = useDispatch();
  const { items, count, isLoading, error } = useSelector(
    (state: RootState) => state.addresses
  );

  const fetchAddresses = useCallback(
    async (params: AddressesListRequest = { limit: 10, offset: 0 }) => {
      try {
        dispatch(setAddressesLoading(true));
        dispatch(setAddressesError(null));
        const response = await getUserAddresses(params);
        dispatch(setAddresses({ items: response.items, count: response.count }));
        return response;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "خطا در دریافت آدرس‌ها";
        dispatch(setAddressesError(message));
        throw err;
      } finally {
        dispatch(setAddressesLoading(false));
      }
    },
    [dispatch]
  );

  return {
    items,
    count,
    isLoading,
    error,
    fetchAddresses,
  };
};




