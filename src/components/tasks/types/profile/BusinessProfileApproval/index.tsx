'use client';

import { useState } from 'react';
import { BusinessProfileApprovalProps, RealProfile, ProfileDocument } from '@/components/tasks/types';
import Image from 'next/image';
import { ActionButtons } from '@/components/tasks/shared/ActionButtons';
import { RealProfileSection } from '@/components/tasks/shared/RealProfileSection';
import DrawerModal from '@/components/ui/modal/drawerModal/DrawerModal';
import Button from '@/components/ui/actions/button/Button';
import { verifyBusinessProfileChangeRequest } from '@/services/taskDetailServices';
import { useToast } from '@/components/ui';
import styles from './index.module.scss';
import drawerStyles from './drawer.module.scss';

const BusinessProfileApproval: React.FC<BusinessProfileApprovalProps> = ({
  request,
  onApprove,
  onReject,
  className,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'approve' | 'reject'>('approve');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  // تبدیل داده‌های contactPerson به فرمت RealProfile
  const convertToRealProfile = (): RealProfile => {
    // تبدیل BusinessDocument به ProfileDocument
    const documents: ProfileDocument[] = request.documents.map((doc) => ({
      document_id: parseInt(doc.id),
      file_uid: doc.url || '',
      upload_date: doc.uploadDate || '',
      filename: doc.name || '',
      file_extension: doc.fileType || 'pdf',
      file_size: 0,
      url: doc.url,
      id: doc.id,
      fileType: doc.fileType as 'jpg' | 'pdf' | 'png',
      uploadDate: doc.uploadDate,
      fileSize: doc.fileSize,
    }));

    // تقسیم نام کامل به نام و نام خانوادگی
    const nameParts = request.contactPerson.fullName?.split(' ') || [];
    const firstName = request.contactPerson.firstName || nameParts[nameParts.length - 1] || '';
    const lastName = request.contactPerson.lastName || nameParts.slice(0, -1).join(' ') || '';

    return {
      profileType: 'حقیقی',
      gender: '—', // در API بیزنس جنسیت موجود نیست
      contactNumber: request.contactPerson.mobile || '—',
      nationalId: request.contactPerson.nationalId || '—',
      lastName: lastName,
      firstName: firstName,
      documents: documents,
    };
  };

  const realProfile = convertToRealProfile();

  // استخراج نام کاربر از contactPerson
  const userName = request.contactPerson.fullName || `${realProfile.firstName} ${realProfile.lastName}`.trim();

  const handleApproveClick = () => {
    setDrawerMode('approve');
    setDrawerOpen(true);
    setDescription('');
  };

  const handleRejectClick = () => {
    setDrawerMode('reject');
    setDrawerOpen(true);
    setDescription('');
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setDescription('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const isVerified = drawerMode === 'approve';
      await verifyBusinessProfileChangeRequest(request.id, isVerified, description);
      showSuccess('عملیات موفق', `درخواست با موفقیت ${isVerified ? 'تایید' : 'رد'} شد`);
      setDrawerOpen(false);
      setDescription('');
      if (isVerified) {
        onApprove(request.id);
      } else {
        onReject(request.id);
      }
    } catch (error) {
      console.error('Error verifying request:', error);
      if (error instanceof Error) {
        if (error.message === 'ACCESS_TOKEN_MISSING') {
          showError('خطا', 'توکن دسترسی یافت نشد. لطفاً مجدداً وارد شوید.');
        } else if (error.message === 'API base URL is not configured.') {
          showError('خطا', 'آدرس سرور تنظیم نشده است.');
        } else {
          showError('خطا', error.message || 'خطا در ارتباط با سرور');
        }
      } else {
        showError('خطا', 'خطا در ارتباط با سرور');
      }
    } finally {
      setLoading(false);
    }
  };

  const drawerTitle = drawerMode === 'approve' ? 'تایید پروفایل' : 'عدم تایید پروفایل';

  return (
    <>
      <div className={`${styles.container} ${className || ''}`}>
        {/* Header Section */}
        <div className={styles.profileHeader}>
          <div className={styles.rightSideHeader}>
            <h1 className={styles.title}>تایید پروفایل (نیکی یار)</h1>
            <div className={styles.requestInfo}>
              <div className={styles.userInfo}>
                <span className={styles.userLabel}>نام کاربر</span>
                <div className={styles.userDetails}>
                  {request.contactPerson.avatar && (
                    <Image
                      src={request.contactPerson.avatar}
                      alt={userName}
                      className={styles.userAvatar}
                      width={44}
                      height={44}
                    />
                  )}
                  <span className={styles.userName}>{userName}</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.leftHeaderContent}>
            <div className={styles.requestDate}>
              <span className={styles.requestDateLabel}>تاریخ درخواست :</span>
              <span className={styles.requestDateValue}>{request.requestDate}</span>
            </div>
          </div>
        </div>
        <div className={styles.userSection}>
          <RealProfileSection
            title="پروفایل حقیقی"
            profile={realProfile}
            className={styles.profileSection}
          />
        </div>
        <div className={styles.actionButtonsContainer}>
          <ActionButtons
            onApprove={handleApproveClick}
            onReject={handleRejectClick}
            className={styles.actionButtons}
          />
        </div>
      </div>

      <DrawerModal isOpen={drawerOpen} setIsOpen={handleCloseDrawer}>
        <div className={drawerStyles.drawerContent}>
          <h2 className={drawerStyles.title}>{drawerTitle}</h2>
          
          {/* User Information Table */}
          <div className={drawerStyles.tableContainer}>
            <table className={drawerStyles.table}>
              <thead>
                <tr>
                  <th>نام</th>
                  <th>نام خانوادگی</th>
                  <th>کد ملی</th>
                  <th>شماره تماس</th>
                  <th>نوع پروفایل</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{realProfile.firstName || '—'}</td>
                  <td>{realProfile.lastName || '—'}</td>
                  <td>{realProfile.nationalId || '—'}</td>
                  <td>{realProfile.contactNumber || '—'}</td>
                  <td>{request.businessInfo.title ? 'حقوقی' : '—'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Description Section */}
          <div className={drawerStyles.descriptionSection}>
            <h3 className={drawerStyles.descriptionTitle}>
              {drawerMode === 'approve' ? 'توضیحات تایید' : 'توضیحات عدم تایید'}
            </h3>
            <textarea
              className={drawerStyles.textarea}
              placeholder={drawerMode === 'approve' ? 'علت تایید' : 'علت عدم تایید'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <div className={drawerStyles.submitButton}>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              bgColor="primary-700"
              mode="side-rounded"
              paddingStyle="equal-12"
            >
              {loading ? 'در حال پردازش...' : 'ثبت'}
            </Button>
          </div>
        </div>
      </DrawerModal>
    </>
  );
};

export default BusinessProfileApproval;

