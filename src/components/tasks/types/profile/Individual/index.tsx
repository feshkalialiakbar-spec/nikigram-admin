'use client';

import Image from 'next/image';
import { ProfileChangeApprovalProps } from '@/components/tasks/types';
import styles from './index.module.scss';
import Button from '@/components/ui/actions/button/Button';

const IndividualProfileApproval: React.FC<ProfileChangeApprovalProps> = ({
  request,
  onApprove,
  onReject,
  className,
}) => {
  const rows = [
    { id: 'firstName', label: 'نام', oldValue: request.realProfile.firstName, newValue: request.realProfile.firstName },
    { id: 'lastName', label: 'نام خانوادگی', oldValue: request.realProfile.lastName, newValue: request.realProfile.lastName },
    { id: 'nationalId', label: 'کد ملی', oldValue: request.realProfile.nationalId, newValue: request.realProfile.nationalId },
    { id: 'contactNumber', label: 'شماره تماس', oldValue: request.realProfile.contactNumber, newValue: request.realProfile.contactNumber },
    { id: 'gender', label: 'جنسیت', oldValue: request.realProfile.gender, newValue: request.realProfile.gender },
    { id: 'profileType', label: 'نوع پروفایل', oldValue: request.realProfile.profileType, newValue: request.realProfile.profileType },
  ];

  const handleApproveRow = (id: string) => console.log('Approve:', id);
  const handleRejectRow = (id: string) => console.log('Reject:', id);

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <header className={styles.header}>
        <div>
          <h1>تایید پروفایل</h1>
          <div className={styles.user}>
            {request.userAvatar && (
              <Image src={request.userAvatar} alt={request.userName} width={44} height={44} className={styles.avatar} />
            )}
            <span>{request.userName}</span>
          </div>
        </div>
        <div className={styles.date}>تاریخ درخواست: {request.requestDate}</div>
      </header>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>فیلد</th>
            <th>قبل</th>
            <th>بعد</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.label}</td>
              <td>{r.oldValue}</td>
              <td>{r.newValue}</td>
              <td>
                <Button onClick={() => handleApproveRow(r.id)} buttonClassName={styles.approveBtn}>تایید</Button>
                <Button onClick={() => handleRejectRow(r.id)} buttonClassName={styles.rejectBtn}>رد</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {request.aiComment && (
        <div className={styles.aiBox}>
          <div className={styles.aiHeader}>
            <span>🤖 دستیار هوشمند</span>
            <small>تولید شده توسط هوش مصنوعی</small>
          </div>
          <p>{request.aiComment}</p>
        </div>
      )}

      <div className={styles.footer}>
        <Button buttonClassName={styles.finalApprove} onClick={() => onApprove(request.id)}>تایید نهایی</Button>
        <Button buttonClassName={styles.finalReject} onClick={() => onReject(request.id)}>رد</Button>
      </div>
    </div>
  );
};

export default IndividualProfileApproval;
