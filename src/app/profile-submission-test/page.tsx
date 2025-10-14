'use client';

import React from 'react';
import ProfileChangeApproval from '@/components/ProfileChangeApproval';
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
          id: '1',
          filename: 'کارت ملی.jpg',
          fileType: 'jpg',
          uploadDate: 'امروز',
          fileSize: '۴ MB'
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
          id: '2',
          filename: 'مدرک آگهی تاسیس.pdf',
          fileType: 'pdf',
          uploadDate: 'امروز',
          fileSize: '۴ MB'
        },
        {
          id: '3',
          filename: 'مدرک آگهی آخرین تغییرات.pdf',
          fileType: 'pdf',
          uploadDate: 'امروز',
          fileSize: '۴ MB'
        },
        {
          id: '4',
          filename: 'مدرک روزنامه رسمی.pdf',
          fileType: 'pdf',
          uploadDate: 'امروز',
          fileSize: '۴ MB'
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
          id: '5',
          filename: 'مدرک روزنامه رسمی.pdf',
          fileType: 'pdf',
          uploadDate: 'امروز',
          fileSize: '۴ MB'
        }
      },
      {
        id: '2',
        name: 'علی احمدوند',
        role: 'مدیر عامل',
        avatar: '/api/placeholder/32/32',
        document: {
          id: '6',
          filename: 'مدرک روزنامه رسمی.pdf',
          fileType: 'pdf',
          uploadDate: 'امروز',
          fileSize: '۴ MB'
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
