'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft2 } from 'iconsax-react';
import { TemplateRequestApprovalProps } from '@/components/tasks/types';
import styles from './index.module.scss';

const TemplateRequestApproval: React.FC<TemplateRequestApprovalProps> = ({
  request,
  onApprove,
  onReject,
  className
}) => {
  const router = useRouter();

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.requestContainer}>
            <div className={styles.requestCard}>
              <div className={styles.requestContent}>
                {/* Header */}
                <div className={styles.requestHeader}>
                  <button
                    className={styles.backButton}
                    onClick={() => router.back()}
                  >
                    <ArrowLeft2 size={20} />
                    بازگشت
                  </button>

                  <div className={styles.headerContent}>
                    <h1 className={styles.title}>ایجاد تمپلیت جدید</h1>

                    <div className={styles.requestInfo}>
                      <div className={styles.userInfo}>
                        {request.userAvatar && (
                          <Image
                            src={request.userAvatar}
                            alt={request.userName}
                            className={styles.userAvatar}
                            width={24}
                            height={24}
                          />
                        )}
                        <span className={styles.userName}>{request.userName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Request Details */}
                <div className={styles.detailsSection}>
                  <div className={styles.detailsList}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>تاریخ درخواست :</span>
                      <span className={styles.detailValue}>{request.requestDate}</span>
                    </div>

                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>عنوان درخواستی :</span>
                      <span className={styles.detailValue}>{request.title}</span>
                    </div>

                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>موقعیت :</span>
                      <span className={styles.detailValue}>{request.category}</span>
                    </div>

                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>نوع درخواست :</span>
                      <span className={styles.detailValue}>{request.requestType}</span>
                    </div>

                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>بازه زمانی نیاز به کمک :</span>
                      <span className={styles.detailValue}>{request.timePeriod}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Assistant Section */}
          <div className={styles.aiSection}>
            <h3 className={styles.aiTitle}>دستیار هوشمند</h3>
            <div className={styles.aiComment}>
              این بخش شامل نظر AI هست که در مورد درخواست ارسال شده توضیحات لازم را در راستای کمک به ادمین می دهد.
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <button
              onClick={() => onReject(request.id)}
              className={styles.rejectButton}
            >
              رد
            </button>
            <button
              onClick={() => onApprove(request.id)}
              className={styles.approveButton}
            >
              ایجاد تمپلیت
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateRequestApproval;
