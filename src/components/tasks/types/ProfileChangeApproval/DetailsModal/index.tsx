'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ApiProfileChangeRequestResponse } from '@/components/tasks/types';
import styles from './index.module.scss';

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ApiProfileChangeRequestResponse;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ isOpen, onClose, data }) => {
  const [activeTab, setActiveTab] = useState<'task' | 'party' | 'docs' | 'platforms'>('task');

  if (!isOpen) return null;

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const getGenderLabel = (gender: number): string => {
    return gender === 1 ? 'مرد' : gender === 2 ? 'زن' : 'نامشخص';
  };

  const getEducationDegreeLabel = (degree: number): string => {
    const degrees: Record<number, string> = {
      1: 'زیر دیپلم',
      2: 'دیپلم',
      3: 'کاردانی',
      4: 'کارشناسی',
      5: 'کارشناسی ارشد',
      6: 'دکتری',
    };
    return degrees[degree] || 'نامشخص';
  };

  const getImageUrl = (fileUid: string): string => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL as string;
    return `${baseUrl}/api/sys/files/download/${fileUid}`;
  };

  const getProfileImageUrl = (profileImage: string): string => {
    if (profileImage.startsWith('http')) {
      return profileImage;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL as string;
    return `${baseUrl}/api/sys/files/download/${profileImage}`;
  };

  const renderTaskDetails = () => (
    <div className={styles.tabContent}>
      <h3 className={styles.sectionTitle}>جزئیات تسک</h3>
      <div className={styles.detailsGrid}>
        <div className={styles.detailItem}>
          <span className={styles.label}>شناسه تسک:</span>
          <span className={styles.value}>{data.task_details.task_id}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>عنوان تسک:</span>
          <span className={styles.value}>{data.task_details.task_title}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>توضیحات تسک:</span>
          <span className={styles.value}>{data.task_details.task_description || 'ندارد'}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>نوع مرجع:</span>
          <span className={styles.value}>{data.task_details.ref_type}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>شناسه مرجع:</span>
          <span className={styles.value}>{data.task_details.ref_id}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>شناسه وضعیت:</span>
          <span className={styles.value}>{data.task_details.status_id}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>نام وضعیت:</span>
          <span className={styles.value}>{data.task_details.status_name}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>تاریخ ایجاد:</span>
          <span className={styles.value}>{formatDate(data.task_details.created_at)}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>شناسه تمپلیت منبع:</span>
          <span className={styles.value}>{data.task_details.source_template_id || 'ندارد'}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>شناسه تسک والد:</span>
          <span className={styles.value}>{data.task_details.parent_task_id || 'ندارد'}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>شناسه کارمند:</span>
          <span className={styles.value}>{data.staff_id}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>فیلدهای تغییر یافته:</span>
          <span className={styles.value}>{data.changed_fields.join('، ')}</span>
        </div>
      </div>
    </div>
  );

  const renderPartyDetails = () => (
    <div className={styles.tabContent}>
      <h3 className={styles.sectionTitle}>جزئیات درخواست کننده</h3>
      <div className={styles.detailsGrid}>
        <div className={styles.detailItem}>
          <span className={styles.label}>شناسه درخواست:</span>
          <span className={styles.value}>{data.party_request_details.party_request_id}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>شناسه طرف:</span>
          <span className={styles.value}>{data.party_request_details.party_id}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>شناسه یکتای طرف:</span>
          <span className={styles.value}>{data.party_request_details.party_uid}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>شناسه کاربر:</span>
          <span className={styles.value}>{data.party_request_details.user_id}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>شناسه مشتری:</span>
          <span className={styles.value}>{data.party_request_details.customer_id}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>شناسه یکتای مشتری:</span>
          <span className={styles.value}>{data.party_request_details.customer_uid}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>نام:</span>
          <span className={styles.value}>{data.party_request_details.first_name}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>نام خانوادگی:</span>
          <span className={styles.value}>{data.party_request_details.last_name}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>نام مستعار:</span>
          <span className={styles.value}>{data.party_request_details.alias || 'ندارد'}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>کد ملی:</span>
          <span className={styles.value}>{data.party_request_details.national_id}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>جنسیت:</span>
          <span className={styles.value}>{getGenderLabel(data.party_request_details.gender)}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>تاریخ تولد:</span>
          <span className={styles.value}>{formatDate(data.party_request_details.birth_date)}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>مدرک تحصیلی:</span>
          <span className={styles.value}>{getEducationDegreeLabel(data.party_request_details.education_degree)}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>بیوگرافی:</span>
          <span className={styles.value}>{data.party_request_details.biography || 'ندارد'}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>شماره موبایل:</span>
          <span className={styles.value}>{data.party_request_details.mobile}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>وضعیت تایید:</span>
          <span className={styles.value}>{data.party_request_details.is_verified ? 'تایید شده' : 'تایید نشده'}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>وضعیت لغو:</span>
          <span className={styles.value}>{data.party_request_details.is_canceled ? 'لغو شده' : 'فعال'}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>تصویر پروفایل:</span>
          <div className={styles.imageContainer}>
            {data.party_request_details.profile_image ? (
              <Image
                src={getProfileImageUrl(data.party_request_details.profile_image)}
                alt="تصویر پروفایل"
                className={styles.profileImage}
                width={64}
                height={64}
              />
            ) : (
              <div className={styles.noImagePlaceholder}>
                <span>تصویر پروفایل موجود نیست</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocumentsDetails = () => (
    <div className={styles.tabContent}>
      <h3 className={styles.sectionTitle}>مدارک</h3>
      <div className={styles.documentsList}>
        {data.party_docs_data.map((doc, index) => (
          <div key={doc.document_id} className={styles.documentItem}>
            <div className={styles.documentHeader}>
              <h4>مدرک {index + 1}</h4>
              <div className={styles.documentActions}>
                <button
                  className={styles.viewButton}
                  onClick={() => window.open(getImageUrl(doc.file_uid), '_blank')}
                >
                  مشاهده
                </button>
                <button
                  className={styles.downloadButton}
                  onClick={async () => {
                    try {
                      const response = await fetch(getImageUrl(doc.file_uid));
                      const blob = await response.blob();
                      const blobUrl = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = blobUrl;
                      a.download = `document_${doc.document_id}`;
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      window.URL.revokeObjectURL(blobUrl);
                    } catch (error) {
                      console.error('Download failed:', error);
                    }
                  }}
                >
                  دانلود
                </button>
              </div>
            </div>
            <div className={styles.documentDetails}>
              <div className={styles.detailItem}>
                <span className={styles.label}>شناسه مدرک:</span>
                <span className={styles.value}>{doc.document_id}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>نوع مدرک:</span>
                <span className={styles.value}>{doc.document_type}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>شناسه فایل:</span>
                <span className={styles.value}>{doc.file_uid}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>تاریخ آپلود:</span>
                <span className={styles.value}>{formatDate(doc.upload_date)}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>وضعیت تایید:</span>
                <span className={styles.value}>{doc.is_verified ? 'تایید شده' : 'تایید نشده'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>شناسه وضعیت:</span>
                <span className={styles.value}>{doc.status_id}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>نسخه:</span>
                <span className={styles.value}>{doc.version}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPlatformsDetails = () => (
    <div className={styles.tabContent}>
      <h3 className={styles.sectionTitle}>پلتفرم‌ها</h3>
      <div className={styles.platformsList}>
        {data.party_platforms_data.map((platform) => (
          <div key={platform.account_id} className={styles.platformItem}>
            <div className={styles.platformHeader}>
              <div className={styles.platformInfo}>
                {platform.platform_icon && platform.platform_icon.startsWith('http') && (
                  <Image
                    src={platform.platform_icon}
                    alt={platform.platform_name}
                    className={styles.platformIcon}
                    width={24}
                    height={24}
                  />
                )}
                <div>
                  <h4>{platform.account_name}</h4>
                  <p>{platform.platform_name}</p>
                </div>
              </div>
              <div className={styles.platformStatus}>
                <span className={`${styles.statusBadge} ${platform.is_active ? styles.active : styles.inactive}`}>
                  {platform.is_active ? 'فعال' : 'غیرفعال'}
                </span>
              </div>
            </div>
            <div className={styles.platformDetails}>
              <div className={styles.detailItem}>
                <span className={styles.label}>شناسه حساب:</span>
                <span className={styles.value}>{platform.account_id}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>شناسه حساب:</span>
                <span className={styles.value}>{platform.account_identifier}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>حساب پیش‌فرض:</span>
                <span className={styles.value}>{platform.is_default ? 'بله' : 'خیر'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>پلتفرم کاری:</span>
                <span className={styles.value}>{platform.is_workplatform ? 'بله' : 'خیر'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>وضعیت تایید:</span>
                <span className={styles.value}>{platform.is_verified ? 'تایید شده' : 'تایید نشده'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>آدرس پایه:</span>
                <span className={styles.value}>{platform.base_url}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>وضعیت پلتفرم:</span>
                <span className={styles.value}>{platform.platform_active ? 'فعال' : 'غیرفعال'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>شناسه وضعیت:</span>
                <span className={styles.value}>{platform.status_id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>جزئیات کامل درخواست</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className={styles.tabNavigation}>
          <button
            className={`${styles.tabButton} ${activeTab === 'task' ? styles.active : ''}`}
            onClick={() => setActiveTab('task')}
          >
            جزئیات تسک
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'party' ? styles.active : ''}`}
            onClick={() => setActiveTab('party')}
          >
            اطلاعات درخواست کننده
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'docs' ? styles.active : ''}`}
            onClick={() => setActiveTab('docs')}
          >
            مدارک
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'platforms' ? styles.active : ''}`}
            onClick={() => setActiveTab('platforms')}
          >
            پلتفرم‌ها
          </button>
        </div>

        <div className={styles.modalBody}>
          {activeTab === 'task' && renderTaskDetails()}
          {activeTab === 'party' && renderPartyDetails()}
          {activeTab === 'docs' && renderDocumentsDetails()}
          {activeTab === 'platforms' && renderPlatformsDetails()}
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
