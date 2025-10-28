'use client';

import React from 'react';
import ProfileChangeApproval from '@/components/tasks/types/profile/ProfileChangeApproval';
import { ProfileChangeRequest } from '@/components/tasks/types';

const ProfileSubmissionTestPage: React.FC = () => {
  // Sample data matching the design
  const sampleRequest: ProfileChangeRequest = {
    id: '1',
    requestDate: '۱۴۰۴/۰۲/۲۹',
    userName: 'شهاب حسنی',
    userAvatar: '/api/placeholder/40/40',
    realProfile: {
      profileType: 'حقیقی',
      gender: 'مرد',
      contactNumber: '۰۹۱۲۰۸۷۶۵۶۵۴',
      nationalId: '۰۰۲۲۴۳۵۴۶۴',
      lastName: 'احمدی',
      firstName: 'محمد حسین',
      documents: [
        {
          document_id: 1,
          document_type: 1,
          file_uid: 'file1',
          upload_date: 'امروز',
          is_verified: 1,
          status_id: 1,
          version: 1,
          url: '/api/files/file1',
          filename: 'کارت ملی.jpg'
        }
      ]
    },
    legalProfile: {
      profileType: 'حقوقی',
      contactNumber: '۰۹۱۲۰۸۷۶۵۶۵۴',
      roleInCompany: 'مدیر عامل',
      nationalId: '۰۱۹۸۳۲۰۴',
      companyName: 'پی تکست',
      documents: [
        {
          document_id: 2,
          document_type: 2,
          file_uid: 'file2',
          upload_date: 'امروز',
          is_verified: 1,
          status_id: 1,
          version: 1,
          url: '/api/files/file2',
          filename: 'مدرک آگهی تاسیس.pdf'
        },
        {
          document_id: 3,
          document_type: 2,
          file_uid: 'file3',
          upload_date: 'امروز',
          is_verified: 1,
          status_id: 1,
          version: 1,
          url: '/api/files/file3',
          filename: 'مدرک آگهی آخرین تغییرات.pdf'
        },
        {
          document_id: 4,
          document_type: 2,
          file_uid: 'file4',
          upload_date: 'امروز',
          is_verified: 1,
          status_id: 1,
          version: 1,
          url: '/api/files/file4',
          filename: 'مدرک روزنامه رسمی.pdf'
        }
      ]
    },
    primaryIndividuals: [
      {
        id: '1',
        name: 'علی احمدوند',
        role: 'مدیر عامل',
        avatar: '/api/placeholder/32/32',
        document: {
          document_id: 5,
          document_type: 2,
          file_uid: 'file5',
          upload_date: 'امروز',
          is_verified: 1,
          status_id: 1,
          version: 1,
          url: '/api/files/file5',
          filename: 'مدرک روزنامه رسمی.pdf'
        }
      },
      {
        id: '2',
        name: 'علی احمدوند',
        role: 'مدیر عامل',
        avatar: '/api/placeholder/32/32',
        document: {
          document_id: 6,
          document_type: 2,
          file_uid: 'file6',
          upload_date: 'امروز',
          is_verified: 1,
          status_id: 1,
          version: 1,
          url: '/api/files/file6',
          filename: 'مدرک روزنامه رسمی.pdf'
        }
      }
    ],
    aiComment: 'این بخش شامل نظر AI هست که در مورد درخواست ارسال شده توضیحات لازم را در راستای کمک به ادمین می‌دهد.'
  };

  const handleApprove = (requestId: string) => {
    console.log('Approving request:', requestId);
    alert('درخواست تایید شد');
  };

  const handleReject = (requestId: string) => {
    console.log('Rejecting request:', requestId);
    alert('درخواست رد شد');
  };

  const handleSelectPrimary = (individualId: string) => {
    console.log('Selecting primary individual:', individualId);
    alert(`فرد اصلی انتخاب شد: ${individualId}`);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#F0F4FA',
      padding: '0',
      margin: '0'
    }}>
      <ProfileChangeApproval
        request={sampleRequest}
        onApprove={handleApprove}
        onReject={handleReject}
        onSelectPrimary={handleSelectPrimary}
      />
    </div>
  );
};

export default ProfileSubmissionTestPage;
