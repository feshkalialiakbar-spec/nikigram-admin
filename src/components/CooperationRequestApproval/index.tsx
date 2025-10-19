'use client';

import React from 'react';
import { CooperationRequestApprovalProps } from '@/components/tasks/types';
import styles from './index.module.scss';

const CooperationRequestApproval: React.FC<CooperationRequestApprovalProps> = ({
  request,
  onApprove,
  onReject,
  className
}) => {
  return (
    <div className={`${styles.dashboard} ${className || ''}`}>
      <div className={styles.mainContent}>
        {/* Header Section */}
        <div className={styles.headerSection}>
          <div className={styles.headerLeft}>
            <span className={styles.requestDateLabel}>تاریخ درخواست :</span>
            <span className={styles.requestDate}>{request.requestDate}</span>
          </div>
          <div className={styles.headerRight}>
            <h1 className={styles.title}>درخواست همکاری</h1>
          </div>
        </div>

        {/* Request Details Table */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>نام متقاضی</th>
                <th>وضعیت</th>
                <th>توضیحات متقاضی</th>
                <th>تخصص‌های درخواستی</th>
              </tr>
            </thead>
            <tbody>
              <tr className={styles.clickableRow}>
                <td className={styles.userName}>
                  <div className={styles.userInfo}>
                    {request.userAvatar && (
                      <img
                        src={request.userAvatar}
                        alt={request.userName}
                        className={styles.userAvatar}
                      />
                    )}
                    <span className={styles.userNameText}>{request.userName}</span>
                  </div>
                </td>
                <td className={styles.status}>
                  <span className={`${styles.statusBadge} ${styles[request.status.toLowerCase().replace(' ', '-')]}`}>
                    {request.status}
                  </span>
                </td>
                <td className={styles.description}>
                  <div className={styles.descriptionText}>{request.notes}</div>
                </td>
                <td className={styles.specializations}>
                  <div className={styles.specializationsContainer}>
                    {request.specializations.map((spec, index) => (
                      <div key={index} className={styles.specializationCard}>
                        <div className={styles.specializationHeader}>
                          <span className={styles.specializationName}>{spec.specialization_name}</span>
                          <span className={styles.categoryName}>{spec.category_name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
            این درخواست همکاری شامل {request.specializations.length} تخصص مختلف است. 
            متقاضی در زمینه‌های {request.specializations.map(s => s.specialization_name).join('، ')} 
            اظهار تمایل به همکاری کرده است. لطفاً صلاحیت و تخصص متقاضی را بررسی کنید.
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
  );
};

export default CooperationRequestApproval;
