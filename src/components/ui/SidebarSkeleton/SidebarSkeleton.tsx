import { Skeleton } from '../Skeleton';
import styles from './SidebarSkeleton.module.scss';
interface SidebarSkeletonProps {
  className?: string;
}
const SidebarSkeleton: React.FC<SidebarSkeletonProps> = ({ className }) => {
  return (
    <div className={`${styles.sidebarSkeleton} ${className || ''}`}>
      {/* Logo area */}
      <div className={styles.logoSection}>
        <Skeleton width={120} height={40} borderRadius={8} />
      </div>

      {/* Navigation items */}
      <div className={styles.navigationSection}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className={styles.navItem}>
            <Skeleton
              width={24}
              height={24}
              variant="circular"
              className={styles.iconSkeleton}
            />
            <Skeleton
              width={Math.random() * 40 + 80}
              height={16}
              className={styles.textSkeleton}
            />
          </div>
        ))}
      </div>

      {/* User profile section */}
      <div className={styles.userSection}>
        <Skeleton
          width={40}
          height={40}
          variant="circular"
          className={styles.avatarSkeleton}
        />
        <div className={styles.userInfo}>
          <Skeleton width={100} height={14} className={styles.userNameSkeleton} />
          <Skeleton width={80} height={12} className={styles.userRoleSkeleton} />
        </div>
      </div>
    </div>
  );
};

export default SidebarSkeleton;
