'use client';

import React from 'react';
import Image from 'next/image';
import { HelpRequestApprovalProps } from '@/components/tasks/types';
import styles from './index.module.scss';

const HelpRequestApproval: React.FC<HelpRequestApprovalProps> = ({
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
          {/* Main Card */}
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
                    <h1 className={styles.title}>درخواست کمک</h1>
                  </div>
                </div>

                {/* Content Area */}
                <div className={styles.contentArea}>
                  {/* Left Side - Values */}
                  <div className={styles.valuesColumn}>
                    <div className={styles.valueItem}>
                      <div className={styles.userInfo}>
                        {request.user.avatar && (
                          <Image
                            src={request.user.avatar}
                            alt={request.user.name}
                            className={styles.userAvatar}
                            width={48}
                            height={48}
                          />
                        )}
                        <span className={styles.userName}>{request.user.name}</span>
                      </div>
                    </div>
                    <div className={styles.valueItem}>{request.user.level}</div>
                    <div className={styles.valueItem}>{request.requestType}</div>
                    <div className={styles.valueItem}>{request.requestTitle}</div>
                    <div className={styles.valueItem}>{request.category}</div>
                    <div className={styles.valueItem}>{request.subcategory}</div>
                    <div className={styles.valueItem}>{request.timeframe}</div>
                    <div className={styles.valueItem}>{request.requiredAmount}</div>
                    <div className={styles.valueItem}>{request.contactInfo}</div>
                    <div className={styles.valueItem}>
                      <div className={styles.shebaInfo}>
                        <span className={styles.shebaNumber}>{request.shebaNumber}</span>
                        {request.isShebaVerified && (
                          <span className={styles.verifiedBadge}>تایید شده</span>
                        )}
                      </div>
                    </div>
                    <div className={styles.valueItem}>
                      <div className={styles.description}>{request.description}</div>
                    </div>
                    {request.attachedFile && (
                      <div className={styles.valueItem}>
                        <div className={styles.attachmentCard}>
                          <div className={styles.attachmentInfo}>
                            <div className={styles.fileIcon}>
                              <div className={styles.fileTypeIcon}>
                                <span className={styles.fileTypeText}>JPG</span>
                              </div>
                            </div>
                            <div className={styles.fileDetails}>
                              <div className={styles.fileName}>{request.attachedFile.filename}</div>
                              <div className={styles.fileMeta}>
                                <span className={styles.fileDate}>{request.attachedFile.uploadDate}</span>
                                <span className={styles.fileSeparator}>•</span>
                                <span className={styles.fileSize}>{request.attachedFile.fileSize}</span>
                              </div>
                            </div>
                          </div>
                          <div className={styles.attachmentActions}>
                            <button className={styles.actionButton} title="دانلود">
                              <svg className={styles.actionIcon} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <button className={styles.actionButton} title="مشاهده">
                              <svg className={styles.actionIcon} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Side - Labels */}
                  <div className={styles.labelsColumn}>
                    <div className={styles.labelItem}>نام کاربر</div>
                    <div className={styles.labelItem}>سطح کاربر</div>
                    <div className={styles.labelItem}>نوع درخواست</div>
                    <div className={styles.labelItem}>عنوان درخواستی</div>
                    <div className={styles.labelItem}>طبقه</div>
                    <div className={styles.labelItem}>زیرطبقه</div>
                    <div className={styles.labelItem}>بازه زمانی نیاز به کمک</div>
                    <div className={styles.labelItem}>مقدار مبلغ موردنیاز</div>
                    <div className={styles.labelItem}>اطلاعات تماس</div>
                    <div className={styles.labelItem}>شماره شبا</div>
                    <div className={styles.labelItem}>شرح درخواست</div>
                    {request.attachedFile && (
                      <div className={styles.labelItem}>فایل پیوست</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Assistant Section */}
          <div className={styles.aiSection}>
            <div className={styles.aiHeader}>
              <h3 className={styles.aiTitle}>دستیار هوشمند</h3>
              <div className={styles.aiIcon}>
                <svg className={styles.aiIconSvg} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className={styles.aiSubtitle}>تولید شده توسط هوش‌مصنوعی</div>
            <div className={styles.aiComment}>
              <div className={styles.aiCommentText}>
                {request.aiComment}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <button
              onClick={() => onApprove(request.id)}
              className={styles.approveButton}
            >
              تایید
            </button>
            <button
              onClick={() => onReject(request.id)}
              className={styles.rejectButton}
            >
              رد
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpRequestApproval;
