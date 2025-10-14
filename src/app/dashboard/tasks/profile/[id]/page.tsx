'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProfileChangeApproval from '@/components/ProfileChangeApproval';
import { mapProfileChangeRequestToComponent } from '@/utils/taskMappers';
import { ApiProfileChangeRequestResponse } from '@/components/tasks/types';

const ProfileTaskDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskData, setTaskData] = useState<ApiProfileChangeRequestResponse | null>(null);

  useEffect(() => {
    const loadTaskData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Call the profile change request API
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/profile/change_request/${taskId}/`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch task details');
        }

        const data = await response.json();
        setTaskData(data);
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
    // TODO: Implement approval API call
    // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/profile/change_request/${requestId}/approve/`, { method: 'POST' });
    router.back();
  };

  const handleReject = async (requestId: string) => {
    console.log('Rejecting request:', requestId);
    // TODO: Implement rejection API call
    // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/profile/change_request/${requestId}/reject/`, { method: 'POST' });
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
  if (error || !taskData) {
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

  // Map API response to component props
  const profileRequest = mapProfileChangeRequestToComponent(taskData);

  return (
    <ProfileChangeApproval
      request={profileRequest}
      onApprove={handleApprove}
      onReject={handleReject}
      onSelectPrimary={handleSelectPrimary}
    />
  );
};

export default ProfileTaskDetailPage;

