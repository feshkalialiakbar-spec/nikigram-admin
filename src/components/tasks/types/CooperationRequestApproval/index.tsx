'use client';

import React from 'react';
import Image from 'next/image';
import { CooperationRequestApprovalProps } from '@/components/tasks/types';
import RatingSlider from '@/components/ui/ratingSlider/RatingSlider';
import styles from './index.module.scss';
import Button from '@/components/ui/actions/button/Button';

const CooperationRequestApproval: React.FC<CooperationRequestApprovalProps> = ({
  request,
  onApprove,
  onReject,
  className,
}) => {
  const { id, requestDate, userAvatar, userName, notes, specializations } = request;
  const specialization = specializations?.[0] || {};

  return (
    <div className={`${styles.dashboard} ${className || ''}`}>
      <div className={styles.card}>
        {/* --- Header --- */}
        <div className={styles.detailsCard}>
          <div className={styles.headerRow}>
            <div className={styles.requestDateWrap}>
              <span className={styles.requestDateLabel}>تاریخ درخواست :</span>
              <span className={styles.requestDate}>{requestDate}</span>
            </div>
            <h1 className={styles.pageTitle}>درخواست همکاری دست نیکی</h1>
          </div>

          {/* --- Details --- */}
          <div className={styles.detailsContent}>
            <div className={styles.valuesCol}>
              <div className={styles.userRow}>
                {userAvatar && (
                  <Image
                    src={userAvatar}
                    alt={userName}
                    width={40}
                    height={40}
                    className={styles.userAvatar}
                  />
                )}
                <span className={styles.userNameText}>{userName}</span>
              </div>

              <span className={styles.valueText}>{specialization.category_name || '-'}</span>
              <span className={styles.valueText}>{specialization.specialization_name || '-'}</span>
              <div className={styles.descriptionBox}>{notes || '-'}</div>
            </div>

            <div className={styles.labelsCol}>
              <span className={styles.labelText}>نام کاربر</span>
              <span className={styles.labelText}>طبقه</span>
              <span className={styles.labelText}>زیرطبقه</span>
              <span className={styles.labelText}>توضیحات</span>
            </div>
          </div>
        </div>

        {/* --- AI Section --- */}
        <div className={styles.aiBlock}>
          <div className={styles.aiHeader}>
            <div className={styles.aiBubble}>
              <svg viewBox="0 0 16 16" className={styles.aiIconSvg}>
                <circle cx="8" cy="8" r="3" fill="#0E315D" />
                <circle cx="5" cy="11" r="1.5" fill="#0E315D" opacity=".4" />
                <circle cx="11" cy="12" r="1.5" fill="#0E315D" opacity=".4" />
              </svg>
            </div>
            <div className={styles.aiTitles}>
              <div className={styles.aiTitle}>دستیار هوشمند</div>
              <div className={styles.aiSubtitle}>تولید شده توسط هوش‌مصنوعی</div>
            </div>
          </div>
          <p className={styles.aiCommentRow}>
            این بخش شامل نظر AI است که در مورد درخواست ارسال شده توضیحات لازم را در راستای کمک به ادمین می‌دهد.
          </p>
        </div>

        {/* --- Evaluation Section --- */}
        <div className={styles.evaluationSection}>
          <div className={styles.evaluateHeader}>
            <svg viewBox="0 0 20 20" width={20} height={20} aria-hidden>
              <path
                d="M10 2a5 5 0 00-5 5v2H3v9h14v-9h-2V7a5 5 0 00-5-5z"
                fill="#131D28"
                fillOpacity="0.4"
              />
            </svg>
            <span className={styles.evaluateTitle}>تایید درخواست همکاری داوطلبانه - دست نیکی</span>
          </div>
          <p className={styles.evaluateHint}>
            کاربر درخواست دهنده را با توجه به اطلاعات پر شده ارزیابی کنید و امتیاز دهید
          </p>
          <RatingSlider min={-5} max={5} defaultValue={2} />
        </div>

        {/* --- Action Buttons --- */}
        <div className={styles.actionsRow}>
          <Button onClick={() => onApprove(id)} buttonClassName={styles.primaryBtn}>
            تایید
          </Button>
          <Button onClick={() => onReject(id)} buttonClassName={styles.outlineDangerBtn}>
            رد
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CooperationRequestApproval;
