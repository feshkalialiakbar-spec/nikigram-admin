'use client'
import { useCallback, useMemo, useState } from 'react'
import { Notification, ProfileCircle } from 'iconsax-react'
import { useRouter } from 'next/navigation'
import styles from './TopNavigation.module.scss'

const TopNavigation: React.FC = () => {
  const router = useRouter()
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const ICON_SIZE = 20

  const notifications = useMemo(
    () => [
      {
        id: '1',
        title: 'پیام جدید',
        desc: 'کار جدید برای شما ثبت شد',
        time: '۲ دقیقه پیش',
      },
      {
        id: '2',
        title: 'یادآوری',
        desc: 'موعد انجام یک تسک نزدیک است',
        time: '۱ ساعت پیش',
      },
      { id: '3', title: 'سیستم', desc: 'وضعیت سرور پایدار است', time: 'امروز' },
    ],
    []
  )

  const handleGoToProfile = useCallback(() => {
    router.push('/profile')
  }, [router])

  return (
    <div className={styles.topNav}>
      <div className={styles.topNavContent}>
        <div className={styles.rightSection}>
          <div
            className={styles.profileWrapper}
            onMouseEnter={() => setIsProfileOpen(true)}
            onMouseLeave={() => setIsProfileOpen(false)}
          >
            <button
              className={styles.profileButton}
              onClick={handleGoToProfile}
              aria-label="profile"
              title="پروفایل"
            >
              <ProfileCircle size={ICON_SIZE} color="currentColor" />
            </button>
            {isProfileOpen && (
              <div className={styles.profileDropdown}>
                <div className={styles.profileHeader}>پروفایل</div>
                <div className={styles.profileSummary}>
                  <div className={styles.profileRow}>
                    <span>نام:</span>
                    <strong>نسترن علی پور</strong>
                  </div>
                  <div className={styles.profileRow}>
                    <span>نقش:</span>
                    <strong>مدیر سیستم</strong>
                  </div>
                  <div className={styles.profileRow}>
                    <span>آخرین ورود:</span>
                    <strong>۵ دقیقه پیش</strong>
                  </div>
                </div>
                <div className={styles.profileActions}>
                  <button
                    className={styles.profileAction}
                    onClick={handleGoToProfile}
                  >
                    مشاهده پروفایل
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={styles.centerection}>صفحه اصلی</div>
        <div className={styles.leftSection}>
          <div
            className={styles.notificationWrapper}
            onMouseEnter={() => setIsNotifOpen(true)}
            onMouseLeave={() => setIsNotifOpen(false)}
          >
            <button
              className={styles.notificationButton}
              aria-label="notifications"
            >
              <Notification size={ICON_SIZE} color="currentColor" />
              <span className={styles.notificationBadge}>
                {notifications.length}
              </span>
            </button>
            {isNotifOpen && (
              <div className={styles.notificationDropdown}>
                <div className={styles.notificationHeader}>اطلاعیه‌ها</div>
                <ul className={styles.notificationList}>
                  {notifications.map((n) => (
                    <li key={n.id} className={styles.notificationItem}>
                      <div className={styles.notificationTitle}>{n.title}</div>
                      <div className={styles.notificationDesc}>{n.desc}</div>
                      <div className={styles.notificationTime}>{n.time}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopNavigation
