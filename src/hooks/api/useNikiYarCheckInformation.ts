import { useQuery } from "@tanstack/react-query";
import { nikiYarProfileService } from "@/services/api/nikiYarProfile.service";
import { CheckInformationResponse } from "@/types/nikiYarProfile.dto";

export const useNikiYarCheckInformation = () => {
  return useQuery<CheckInformationResponse>({
    queryKey: ["niki-yar", "check-information"],
    queryFn: nikiYarProfileService.checkInformation,
    staleTime: 10 * 60 * 1000, // 10 دقیقه - داده‌ها این مدت تازه محسوب می‌شوند
    gcTime: 30 * 60 * 1000, // 30 دقیقه - مدت نگهداری در کش
    refetchOnWindowFocus: false, // از refetch خودکار جلوگیری می‌کند
    refetchOnMount: false, // در صورت وجود داده کش شده، دوباره fetch نمی‌کند
    retry: 3, // در صورت خطا، 3 بار تلاش مجدد
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // تأخیر تصاعدی
  });
};
