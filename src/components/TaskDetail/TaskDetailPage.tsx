'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TASK_TYPES, ProfileChangeRequest } from '@/components/tasks/types';
import ProfileChangeApproval from '@/components/ProfileChangeApproval';
import { fetchTaskById, fetchTaskDetailsByRefType } from '@/services/taskServices';
import { mapProfileChangeRequestToComponent } from '@/utils/taskMappers';
import { TaskInterface } from '@/interface';

interface TaskDetailPageProps {
  taskId: string;
}

const TaskDetailPage: React.FC<TaskDetailPageProps> = ({ taskId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskBasicInfo, setTaskBasicInfo] = useState<TaskInterface | null>(null);
  const [taskDetails, setTaskDetails] = useState<any>(null);

  useEffect(() => {
    const loadTaskData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, fetch basic task info to get ref_type and ref_id
        const basicInfo = await fetchTaskById(taskId);
        setTaskBasicInfo(basicInfo);

        if (!basicInfo.ref_type || !basicInfo.ref_id) {
          throw new Error('Task reference information not found');
        }

        // Then fetch detailed task data based on ref_type
        const details = await fetchTaskDetailsByRefType(
          basicInfo.ref_type,
          basicInfo.ref_id
        );
        setTaskDetails(details);
      } catch (err) {
        console.error('Error loading task data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load task data');
      } finally {
        setLoading(false);
      }
    };

    loadTaskData();
  }, [taskId]);

  const handleApprove = async (requestId: string) => {
    console.log('Approving request:', requestId);
    // TODO: Implement approval logic with API call
    // await approveTask(requestId);
    router.back();
  };

  const handleReject = async (requestId: string) => {
    console.log('Rejecting request:', requestId);
    // TODO: Implement rejection logic with API call
    // await rejectTask(requestId);
    router.back();
  };

  const handleSelectPrimary = (individualId: string) => {
    console.log('Selecting primary individual:', individualId);
    // TODO: Implement primary individual selection logic
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !taskBasicInfo || !taskDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4 text-red-600">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">خطا در بارگذاری تسک</h1>
          <p className="text-gray-600 mb-8">{error || 'اطلاعات تسک یافت نشد'}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            بازگشت
          </button>
        </div>
      </div>
    );
  }

  // Render appropriate component based on ref_type
  const refType = taskBasicInfo.ref_type;

  switch (refType) {
    case TASK_TYPES.REF_TYPE_PARTY_CHANGE_REQUEST:
      // Profile change request
      const profileRequest = mapProfileChangeRequestToComponent(taskDetails);
      return (
        <ProfileChangeApproval
          request={profileRequest}
          onApprove={handleApprove}
          onReject={handleReject}
          onSelectPrimary={handleSelectPrimary}
        />
      );

    case TASK_TYPES.REF_TYPE_PROJECT_REQUEST:
      // TODO: Implement project request component
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              درخواست پروژه
            </h1>
            <p className="text-gray-600 mb-8">
              این نوع تسک هنوز پیاده‌سازی نشده است.
            </p>
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              بازگشت
            </button>
          </div>
        </div>
      );

    case TASK_TYPES.REF_TYPE_PROJECT_TASKS:
      // TODO: Implement project tasks component
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              تسک پروژه
            </h1>
            <p className="text-gray-600 mb-8">
              این نوع تسک هنوز پیاده‌سازی نشده است.
            </p>
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              بازگشت
            </button>
          </div>
        </div>
      );

    case TASK_TYPES.REF_TYPE_REQUEST_PROJECT_TEMPLATE:
      // TODO: Implement project template request component
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              درخواست ایجاد تمپلیت
            </h1>
            <p className="text-gray-600 mb-8">
              این نوع تسک هنوز پیاده‌سازی نشده است.
            </p>
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              بازگشت
            </button>
          </div>
        </div>
      );

    default:
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              نوع تسک پشتیبانی نشده
            </h1>
            <p className="text-gray-600 mb-8">
              این نوع تسک ({refType}) شناسایی نشده است.
            </p>
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              بازگشت
            </button>
          </div>
        </div>
      );
  }
};

export default TaskDetailPage;

