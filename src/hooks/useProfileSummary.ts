import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProfileSummary } from '@/stores/userStores/user/user.slice';
import { getProfileSummary } from '@/services/api/auth';
import type { RootState } from '@/stores/userStores/userMerge.store';
import Cookies from 'js-cookie';

/**
 * Hook برای مدیریت اطلاعات خلاصه پروفایل کاربر
 * این hook اطلاعات را از localStorage بازیابی می‌کند یا در صورت نیاز از API دریافت می‌کند
 */
export const useProfileSummary = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const loadProfileSummary = async () => {
      // اگر کاربر لاگین نیست، کاری نکن
      if (!auth.isLoggedIn || !auth.token) return;

      // اگر اطلاعات در Redux موجود است، کاری نکن
      if (user.partyId && user.nikiBalance !== undefined) return;

      try {
        // ابتدا از localStorage بخوان
        const savedProfileSummary = localStorage.getItem('profileSummary');
        if (savedProfileSummary) {
          const profileSummary = JSON.parse(savedProfileSummary);
          dispatch(setProfileSummary(profileSummary));
          return;
        }

        // اگر در localStorage نبود، از API بگیر
        const token = auth.token || Cookies.get(process.env.ACCESS_TOKEN_COOKIE_NAME!);
        if (token) {
          const profileSummary = await getProfileSummary(token);
          dispatch(setProfileSummary(profileSummary));
          localStorage.setItem('profileSummary', JSON.stringify(profileSummary));
        }
      } catch (error) {
        console.error('خطا در بارگذاری اطلاعات پروفایل:', error);
      }
    };

    loadProfileSummary();
  }, [auth.isLoggedIn, auth.token, user.partyId, user.nikiBalance, dispatch]);

  return {
    nikiBalance: user.nikiBalance,
    nikiWithdrawableBalance: user.nikiWithdrawableBalance,
    taskCount: user.taskCount,
    tenderProposalCount: user.tenderProposalCount,
    projectDonationCount: user.projectDonationCount,
    charityDonationCount: user.charityDonationCount,
    clubLevelId: user.clubLevelId,
    clubLevelLogoUid: user.clubLevelLogoUid,
    clubLevelTitle: user.clubLevelTitle,
  };
};
