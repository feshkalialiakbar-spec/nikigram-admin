'use client';

import React from 'react';
import Image from 'next/image';
import { TemplateRequestApprovalProps } from '@/components/tasks/types';
import styles from './index.module.scss';

const TemplateRequestApproval: React.FC<TemplateRequestApprovalProps> = ({
  request,
  onApprove,
  onReject,
  className
}) => {
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
                  <div className={styles.headerLeft}>
                    <span className={styles.requestDateLabel}>تاریخ درخواست :</span>
                    <span className={styles.requestDate}>{request.requestDate}</span>
                  </div>
                  <div className={styles.headerRight}>
                    <h1 className={styles.title}>درخواست ایجاد تمپلیت</h1>
                  </div>
                </div>

                {/* Request Details */}
                <div className={styles.detailsSection}>
                  <div className={styles.detailsGrid}>
                    {/* User Name */}
                    <div className={styles.detailRow}>
                      <div className={styles.detailLabel}>نام متقاضی</div>
                      <div className={styles.detailValue}>
                        <div className={styles.userInfo}>
                          {request.userAvatar && (
                            <Image
                              src={request.userAvatar}
                              alt={request.userName}
                              className={styles.userAvatar}
                              width={48}
                              height={48}
                            />
                          )}
                          <span className={styles.userName}>{request.userName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Request Type */}
                    <div className={styles.detailRow}>
                      <div className={styles.detailLabel}>نوع درخواست</div>
                      <div className={styles.detailValue}>{request.requestType}</div>
                    </div>

                    {/* Title */}
                    <div className={styles.detailRow}>
                      <div className={styles.detailLabel}>عنوان تمپلیت</div>
                      <div className={styles.detailValue}>{request.title}</div>
                    </div>

                    {/* Category */}
                    <div className={styles.detailRow}>
                      <div className={styles.detailLabel}>دسته‌بندی</div>
                      <div className={styles.detailValue}>
                        <div className={styles.categoryInfo}>
                          <span className={styles.categoryName}>{request.category}</span>
                          <span className={styles.parentCategory}>{request.parentCategory}</span>
                        </div>
                      </div>
                    </div>

                    {/* Max Amount Monthly */}
                    <div className={styles.detailRow}>
                      <div className={styles.detailLabel}>حداکثر مبلغ ماهانه</div>
                      <div className={styles.detailValue}>{request.maxAmountMonthly}</div>
                    </div>

                    {/* Time Period */}
                    <div className={styles.detailRow}>
                      <div className={styles.detailLabel}>بازه زمانی</div>
                      <div className={styles.detailValue}>{request.timePeriod}</div>
                    </div>

                    {/* Amount in Period */}
                    <div className={styles.detailRow}>
                      <div className={styles.detailLabel}>مبلغ در بازه</div>
                      <div className={styles.detailValue}>{request.amountInPeriod}</div>
                    </div>

                    {/* Status */}
                    <div className={styles.detailRow}>
                      <div className={styles.detailLabel}>وضعیت</div>
                      <div className={styles.detailValue}>
                        <span className={`${styles.statusBadge} ${styles[request.status.toLowerCase().replace(' ', '-')]}`}>
                          {request.status}
                        </span>
                      </div>
                    </div>

                    {/* Verification */}
                    <div className={styles.detailRow}>
                      <div className={styles.detailLabel}>وضعیت تایید</div>
                      <div className={styles.detailValue}>
                        <span className={`${styles.verificationBadge} ${request.isVerified ? styles.verified : styles.notVerified}`}>
                          {request.isVerified ? 'تایید شده' : 'تایید نشده'}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className={styles.detailRow}>
                      <div className={styles.detailLabel}>توضیحات تمپلیت</div>
                      <div className={styles.detailValue}>
                        <div className={styles.description}>{request.description}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Assistant Section */}
          <div className={styles.aiSection}>
            <div className={styles.aiHeader}>
              <div className={styles.aiIcon}>
                <svg className={styles.aiIconSvg} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className={styles.aiTitle}>دستیار هوشمند</h3>
            </div>
            <div className={styles.aiSubtitle}>تولید شده توسط هوش مصنوعی</div>
            <div className={styles.aiComment}>
              این درخواست ایجاد تمپلیت برای دسته‌بندی &quot;{request.category}&quot; با مبلغ {request.maxAmountMonthly} 
              در بازه زمانی {request.timePeriod} ارائه شده است. 
              لطفاً محتوای تمپلیت، مبالغ و دسته‌بندی را بررسی کنید.
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
              تایید
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateRequestApproval;
