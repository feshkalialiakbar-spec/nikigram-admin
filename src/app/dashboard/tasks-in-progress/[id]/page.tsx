'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TASK_TYPES } from '@/components/tasks/types';
import ProfileChangeApproval from '@/components/ProfileChangeApproval';
import { ProfileChangeRequest } from '@/components/tasks/types';

// Mock data - replace with actual API call
const mockProfileChangeRequest: ProfileChangeRequest = {
  id: '1',
  requestDate: '۱۴۰۴/۰۲/۲۹',
  userName: 'شهاب حسنی',
  userAvatar: '/api/placeholder/48/48',
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
        filename: 'مدرک آگهی آخرین تغییرات.pdf',
        fileType: 'pdf',
        uploadDate: 'امروز',
        fileSize: '۴ MB'
      },
      {
        id: '3',
        filename: 'مدرک آگهی تاسیس.pdf',
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
      avatar: '/api/placeholder/64/64',
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
      avatar: '/api/placeholder/64/64',
      document: {
        id: '6',
        filename: 'مدرک روزنامه رسمی.pdf',
        fileType: 'pdf',
        uploadDate: 'امروز',
        fileSize: '۴ MB'
      }
    }
  ],
  aiComment: 'این درخواست تغییر پروفایل شامل اطلاعات کامل و صحیحی است. مدارک ارائه شده معتبر و قابل قبول می‌باشد. پیشنهاد می‌شود درخواست تایید شود.'
};

const TasksInProgressDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const handleApprove = (requestId: string) => {
    console.log('Approving request:', requestId);
    // TODO: Implement approval logic
    router.back();
  };

  const handleReject = (requestId: string) => {
    console.log('Rejecting request:', requestId);
    // TODO: Implement rejection logic
    router.back();
  };

  const handleSelectPrimary = (individualId: string) => {
    console.log('Selecting primary individual:', individualId);
    // TODO: Implement primary individual selection logic
  };

  // TODO: Fetch actual task data based on taskId and ref_type
  // For now, we'll show profile change request for demo
  const refType = TASK_TYPES.REF_TYPE_PARTY_CHANGE_REQUEST;

  if (refType === TASK_TYPES.REF_TYPE_PARTY_CHANGE_REQUEST) {
    return (
      <ProfileChangeApproval
        request={mockProfileChangeRequest}
        onApprove={handleApprove}
        onReject={handleReject}
        onSelectPrimary={handleSelectPrimary}
      />
    );
  }

  // TODO: Add other task type components
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          نوع تسک پشتیبانی نشده
        </h1>
        <p className="text-gray-600 mb-8">
          این نوع تسک هنوز پیاده‌سازی نشده است.
        </p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          بازگشت
        </button>
      </div>
    </div>
  );
};

export default TasksInProgressDetailPage;
