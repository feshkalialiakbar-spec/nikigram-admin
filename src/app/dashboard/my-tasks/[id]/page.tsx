'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProfileChangeApproval from '@/components/ProfileChangeApproval';
import HelpRequestApproval from '@/components/HelpRequestApproval';
import CooperationRequestApproval from '@/components/CooperationRequestApproval';
import TemplateRequestApproval from '@/components/TemplateRequestApproval';
import { mapProfileChangeRequestToComponent, mapHelpRequestToComponent, mapCooperationRequestToComponent, mapTemplateRequestToComponent } from '@/utils/taskMappers';
import { ApiProfileChangeRequestResponse, ApiHelpRequestResponse, ApiCooperationRequestResponse, ApiTemplateRequestResponse } from '@/components/tasks/types';

const TaskDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskData, setTaskData] = useState<any>(null);
  const [taskType, setTaskType] = useState<'profile' | 'help' | 'template' | 'cooperation' | null>(null);

  useEffect(() => {
    const loadTaskData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use internal API route to avoid CORS issues
        const response = await fetch(`/api/task/detail/${taskId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch task data');
        }

        const result = await response.json();
        console.log('API Response data:', result);

        const { taskData, redirectData } = result;
        
        // Determine task type based on ref_type
        if (redirectData.ref_type === 1) {
          setTaskType('profile');
        } else if (redirectData.ref_type === 2) {
          setTaskType('help');
        } else if (redirectData.ref_type === 4) {
          setTaskType('template');
        } else if (redirectData.ref_type === 5) {
          setTaskType('cooperation');
        } else {
          throw new Error(`Unknown task type: ${redirectData.ref_type}`);
        }

        setTaskData(taskData);
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
    try {
      if (taskType === 'profile') {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/profile/change_request/${requestId}/approve/`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
      } else if (taskType === 'help') {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/project/request/${requestId}/approve/`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
      } else if (taskType === 'template') {
        await fetch(`${process.env.NEXT一点UBLIC_API_URL}/api/admin/task/project/template/${requestId}/approve/`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
      } else if (taskType === 'cooperation') {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/profile/cooperation_request/${requestId}/approve/`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
      } else if (taskType === 'template') {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/project/template/${requestId}/approve/`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
      }
      router.back();
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (requestId: string) => {
    console.log('Rejecting request:', requestId);
    try {
      if (taskType === 'profile') {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/profile/change_request/${requestId}/reject/`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
      } else if (taskType === 'help') {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/project/request/${requestId}/reject/`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
      } else if (taskType === 'template') {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/project/template/${requestId}/reject/`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
      } else if (taskType === 'cooperation') {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/profile/cooperation_request/${requestId}/reject/`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
      } else if (taskType === 'template') {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/project/template/${requestId}/reject/`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
      }
      router.back();
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const handleSelectPrimary = (individualId: string) => {
    console.log('Selecting primary individual:', individualId);
    // TODO: Implement primary individual selection logic
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen scrollable">
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
      <div className="flex items-center justify-center min-h-screen scrollable">
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

  // Render appropriate component based on task type
  if (taskType === 'profile' && taskData) {
    const profileRequest = mapProfileChangeRequestToComponent(taskData);
    return (
      <ProfileChangeApproval
        request={profileRequest}
        rawApiData={taskData}
        onApprove={handleApprove}
        onReject={handleReject}
        onSelectPrimary={handleSelectPrimary}
      />
    );
  }

  if (taskType === 'help' && taskData) {
    // Create a simple help request object based on the actual API response structure
    const helpRequest = {
      id: taskData.task_details.task_id.toString(),
      requestDate: taskData.task_details.created_at,
      requestType: taskData.project_request_details.request_type === 1 ? 'درخواست کمک برای خود' : 'درخواست کمک برای دیگران',
      requestTitle: taskData.project_request_details.title,
      category: taskData.project_request_details.category_name,
      subcategory: taskData.project_request_details.parent_category_name,
      timeframe: `${taskData.project_request_details.time_period} بار`,
      requiredAmount: new Intl.NumberFormat('fa-IR').format(taskData.project_request_details.amount_in_period) + ' تومان',
      contactInfo: taskData.project_request_details.mobile,
      shebaNumber: taskData.project_request_details.ibn,
      isShebaVerified: taskData.project_request_details.is_verified === 1,
      description: taskData.project_request_details.description,
      user: {
        id: taskData.project_request_details.user_id.toString(),
        name: `${taskData.project_request_details.first_name} ${taskData.project_request_details.last_name}`,
        level: `سطح ${taskData.project_request_details.user_id}`, // You might want to get actual level
        avatar: taskData.project_request_details.profile_image 
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/sys/files/download/${taskData.project_request_details.profile_image}`
          : undefined,
      },
      aiComment: 'این بخش شامل نظر AI هست که در مورد درخواست ارسال شده توضیحات لازم را در راستای کمک به ادمین میدهد.',
    };

    return (
      <HelpRequestApproval
        request={helpRequest}
        rawApiData={taskData}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    );
  }

  if (taskType === 'cooperation' && taskData) {
    const cooperationRequest = mapCooperationRequestToComponent(taskData);
    return (
      <CooperationRequestApproval
        request={cooperationRequest}
        rawApiData={taskData}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    );
  }

  if (taskType === 'template' && taskData) {
    const templateRequest = mapTemplateRequestToComponent(taskData);
    return (
      <TemplateRequestApproval
        request={templateRequest}
        rawApiData={taskData}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    );
  }

  return null;
};

export default TaskDetailPage;