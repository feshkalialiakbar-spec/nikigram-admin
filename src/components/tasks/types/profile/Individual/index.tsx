'use client';

import { ProfileChangeApprovalProps } from '@/components/tasks/types';
import styles from './index.module.scss';

interface OperationRowData {
  id: string;
  label: string;
  oldValue: string;
  newValue: string;
}

const IndividualProfileApproval: React.FC<ProfileChangeApprovalProps> = ({
  request,
  rawApiData,
  onApprove,
  onReject,
  className
}) => {
  // تبدیل داده‌های پروفایل به آرایه‌ای از تغییرات
  const operationRows: OperationRowData[] = [
    {
      id: 'firstName',
      label: 'نام',
      oldValue: request.realProfile.firstName,
      newValue: request.realProfile.firstName,
    },
    {
      id: 'lastName',
      label: 'نام خانوادگی',
      oldValue: request.realProfile.lastName,
      newValue: request.realProfile.lastName,
    },
    {
      id: 'nationalId',
      label: 'کد ملی',
      oldValue: request.realProfile.nationalId,
      newValue: request.realProfile.nationalId,
    },
    {
      id: 'contactNumber',
      label: 'شماره تماس',
      oldValue: request.realProfile.contactNumber,
      newValue: request.realProfile.contactNumber,
    },
    {
      id: 'gender',
      label: 'جنسیت',
      oldValue: request.realProfile.gender,
      newValue: request.realProfile.gender,
    },
    {
      id: 'profileType',
      label: 'نوع پروفایل',
      oldValue: request.realProfile.profileType,
      newValue: request.realProfile.profileType,
    },
  ];

  const handleApproveRow = (rowId: string) => {
    console.log('Approve row:', rowId);
  };

  const handleRejectRow = (rowId: string) => {
    console.log('Reject row:', rowId);
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      {/* Main Content Wrapper */}
      <div className={styles.mainWrapper}>
        {/* Header Section */}
        <div className={styles.headerSection}>
          <div className={styles.headerContent}>
            <span className={styles.requestDate}>تاریخ درخواست : {request.requestDate}</span>
            <h1 className={styles.title}>تایید تغییرات (پروفایل)</h1>
          </div>
        </div>

        {/* Operations Table */}
        <div className={styles.operationsSection}>
          {/* Table Container */}
          <div className={styles.tableContainer}>
            {/* Operation Row Headers */}
            <div className={styles.operationRow}>
              {/* Left Column - Operation Type */}
              <div className={styles.operationColumn}>
                <div className={styles.columnHeader}>
                  <div className={styles.headerCell}>
                    <span className={styles.headerLabel}>نوع عملیات</span>
                  </div>
                </div>
                <div className={styles.separator}></div>
                {operationRows.map((row, index) => (
                  <div key={`${row.id}-left`}>
                    <div className={styles.contentRow}>
                      <div className={styles.contentCell}>
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.approveBtn}
                            onClick={() => handleApproveRow(row.id)}
                          >
                            <span className={styles.buttonText}>تایید</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2Z" fill="#007BFF" fillOpacity="0.4" />
                              <path d="M10.58 15.58L7.8 12.8C7.61 12.61 7.61 12.3 7.8 12.11C7.99 11.92 8.3 11.92 8.49 12.11L11.27 14.89L15.51 10.65C15.7 10.46 16.01 10.46 16.2 10.65C16.39 10.84 16.39 11.15 16.2 11.34L11.96 15.58C11.87 15.67 11.74 15.72 11.61 15.72C11.48 15.72 11.35 15.67 11.26 15.58C11.1 15.42 10.74 15.74 10.58 15.58Z" fill="#007BFF" />
                            </svg>
                          </button>
                          <button
                            className={styles.rejectBtn}
                            onClick={() => handleRejectRow(row.id)}
                          >
                            <span className={styles.buttonText}>رد</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2Z" fill="#E70218" fillOpacity="0.4" />
                              <path d="M13.06 12L15.36 9.7C15.65 9.41 15.65 8.93 15.36 8.64C15.07 8.35 14.59 8.35 14.3 8.64L12 10.94L9.7 8.64C9.41 8.35 8.93 8.35 8.64 8.64C8.35 8.93 8.35 9.41 8.64 9.7L10.94 12L8.64 14.3C8.35 14.59 8.35 15.07 8.64 15.36C8.79 15.51 8.98 15.58 9.17 15.58C9.36 15.58 9.55 15.51 9.7 15.36L12 13.06L14.3 15.36C14.45 15.51 14.64 15.58 14.83 15.58C15.02 15.58 15.21 15.51 15.36 15.36C15.65 15.07 15.65 14.59 15.36 14.3L13.06 12Z" fill="#E70218" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    {index < operationRows.length - 1 && <div className={styles.separator}></div>}
                  </div>
                ))}
              </div>

              {/* Middle Column - Before */}
              <div className={styles.operationColumn}>
                <div className={styles.columnHeader}>
                  <div className={styles.headerCell}>
                    <span className={styles.headerLabel}>قبل</span>
                  </div>
                </div>
                <div className={styles.separator}></div>
                {operationRows.map((row, index) => (
                  <div key={`${row.id}-middle`}>
                    <div className={styles.contentRow}>
                      <div className={styles.contentCell}>
                        <span className={styles.cellValue}>{row.oldValue}</span>
                      </div>
                    </div>
                    {index < operationRows.length - 1 && <div className={styles.separator}></div>}
                  </div>
                ))}
              </div>

              {/* Right Column - After */}
              <div className={styles.operationColumn}>
                <div className={styles.columnHeader}>
                  <div className={styles.headerCell}>
                    <span className={styles.headerLabel}>سطح طلب</span>
                  </div>
                </div>
                <div className={styles.separator}></div>
                {operationRows.map((row, index) => (
                  <div key={`${row.id}-right`}>
                    <div className={styles.contentRow}>
                      <div className={styles.contentCell}>
                        <span className={styles.cellValue}>{row.label}</span>
                      </div>
                    </div>
                    {index < operationRows.length - 1 && <div className={styles.separator}></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant Section */}
        {request.aiComment && (
          <div className={styles.aiAssistantSection}>
            <div className={styles.aiHeader}>
              <div className={styles.aiIcon}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M7.33333 12.6667C7.33333 13.0333 7.03333 13.3333 6.66667 13.3333C6.3 13.3333 6 13.0333 6 12.6667C6 12.3 6.3 12 6.66667 12C7.03333 12 7.33333 12.3 7.33333 12.6667Z" fill="#0E315D" />
                  <path opacity="0.4" d="M4.66667 6.66667C4.66667 7.03333 4.36667 7.33333 4 7.33333C3.63333 7.33333 3.33333 7.03333 3.33333 6.66667C3.33333 6.3 3.63333 6 4 6C4.36667 6 4.66667 6.3 4.66667 6.66667Z" fill="#0E315D" />
                  <path opacity="0.4" d="M11.3333 9.33333C11.3333 9.7 11.0333 10 10.6667 10C10.3 10 10 9.7 10 9.33333C10 8.96667 10.3 8.66667 10.6667 8.66667C11.0333 8.66667 11.3333 8.96667 11.3333 9.33333Z" fill="#0E315D" />
                </svg>
              </div>
              <div className={styles.aiTitleContainer}>
                <div className={styles.aiTitle}>دستیار هوشمند</div>
                <div className={styles.aiSubtitle}>تولید شده توسط هوش‌مصنوعی</div>
              </div>
            </div>
            <div className={styles.aiContentBox}>
              <div className={styles.aiTriangle}></div>
              <p className={styles.aiComment}>{request.aiComment}</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        <button className={styles.approveButton} onClick={() => onApprove(request.id)}>
          تایید نهایی
        </button>
        <button className={styles.rejectButton} onClick={() => onReject(request.id)}>
          رد
        </button>
      </div>
    </div>
  );
};

export default IndividualProfileApproval;

