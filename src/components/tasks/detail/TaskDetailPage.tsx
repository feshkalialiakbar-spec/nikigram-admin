'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProfileChangeApproval from '@/components/tasks/types/profile/ProfileChangeApproval';
import IndividualProfileApproval from '@/components/tasks/types/profile/Individual';
import HelpRequestApproval from '@/components/tasks/types/HelpRequestApproval';
import CooperationRequestApproval from '@/components/tasks/types/CooperationRequestApproval';
import TemplateRequestApproval from '@/components/tasks/types/TemplateRequestApproval';
import TaskLayout from '@/components/tasks/detail/TaskLayout';
import { ConfirmationModal, useToast } from '@/components/ui';
import TaskDetailSkeleton from '@/components/tasks/detail/TaskDetailSkeleton';
import { mapProfileChangeRequestToComponent, mapCooperationRequestToComponent, mapTemplateRequestToComponent } from '@/utils/taskMappers';
import {
  ApiProfileChangeRequestResponse,
  ApiHelpRequestResponse,
  ApiCooperationRequestResponse,
  ApiTemplateRequestResponse,
} from '@/components/tasks/types';
import { getCookieByKey } from '@/actions/cookieToken';

const TaskDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const taskId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskData, setTaskData] = useState<
    | ApiProfileChangeRequestResponse
    | ApiHelpRequestResponse
    | ApiCooperationRequestResponse
    | ApiTemplateRequestResponse
    | null
  >(null);
  const [taskType, setTaskType] = useState<'regular-profile' | 'individual-profile' | 'help' | 'template' | 'cooperation' | 'ticket' | null>(null);

  // Modal states
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [pendingRequestId, setPendingRequestId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

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
          const errorText = await response.text();
          console.error('API Error Response:', response.status, response.statusText, errorText);
          throw new Error(`Failed to fetch task data: ${response.status} ${response.statusText}`);
        }

        const result: {
          taskData:
          | ApiProfileChangeRequestResponse
          | ApiHelpRequestResponse
          | ApiCooperationRequestResponse
          | ApiTemplateRequestResponse;
          redirectData: { ref_type: number };
        } = await response.json();
        console.log('API Response data:', result);

        const { taskData, redirectData } = result;

        // Determine task type based on ref_type
        if (redirectData.ref_type === 1) {
          setTaskType('individual-profile');
        } else if (redirectData.ref_type === 2) {
          setTaskType('help');
        } else if (redirectData.ref_type === 4) {
          setTaskType('template');
        } else if (redirectData.ref_type === 5) {
          setTaskType('cooperation');
        } else if (redirectData.ref_type === 6) {
          setTaskType('ticket');
        } else if (redirectData.ref_type === 7) {
          setTaskType('regular-profile');
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
    setPendingRequestId(requestId);
    setShowApproveModal(true);
  };

  const handleReject = async (requestId: string) => {
    setPendingRequestId(requestId);
    setShowRejectModal(true);
  };

  const confirmApprove = async (isApprove: boolean) => {
    if (!pendingRequestId) return;

    setActionLoading(true);
    try {
      let response;

      if (taskType === 'individual-profile') {
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/profile/change_request/${pendingRequestId}/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await getCookieByKey('access_token')}`
          },
          body: JSON.stringify({
            is_verified: isApprove,
            description: ''
          })
        });
        const result = await response.json();
        if (result.status == '1') {
          showSuccess('عملیات موفق', 'درخواست با موفقیت تایید شد');
          return
        }
        if (result.detail) showError('خطا در تایید', result.detail || 'خطا در تایید درخواست');

      } else if (taskType === 'help') {
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/project/request/${pendingRequestId}/approve/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
      } else if (taskType === 'template') {
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/project/template/${pendingRequestId}/approve/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
      } else if (taskType === 'cooperation') {
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/profile/cooperation_request/${pendingRequestId}/approve/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
      }
      else if (taskType === 'ticket') {
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/profile/ticket/${pendingRequestId}/approve/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
      }

    } catch (error) {
      console.error('Error approving request:', error);
      showError('خطا در تایید', 'خطا در ارتباط با سرور');
    } finally {
      setActionLoading(false);
      setShowApproveModal(false);
      setPendingRequestId(null);
    }
  };

  const handleSelectPrimary = (individualId: string) => {
    console.log('Selecting primary individual:', individualId);
    // TODO: Implement primary individual selection logic
  };

  // Loading state
  if (loading) {
    return <TaskDetailSkeleton />;
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
  if (taskType === 'individual-profile' && taskData) {
    const profileRequest = mapProfileChangeRequestToComponent(
      taskData as ApiProfileChangeRequestResponse
    );
    return (
      <>
        <TaskLayout>
          <IndividualProfileApproval
            request={profileRequest}
            rawApiData={taskData as ApiProfileChangeRequestResponse}
            onApprove={handleApprove}
            onReject={handleReject}
            onSelectPrimary={handleSelectPrimary}
          />
        </TaskLayout>

        {/* Confirmation Modals */}
        <ConfirmationModal
          isOpen={showApproveModal}
          onClose={() => setShowApproveModal(false)}
          onConfirm={() => confirmApprove(true)}
          title="تایید درخواست"
          message="آیا از تایید این درخواست اطمینان دارید؟"
          confirmText="تایید"
          type="approve"
          loading={actionLoading}
        />

        <ConfirmationModal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          onConfirm={() => confirmApprove(false)}
          title="رد درخواست"
          message="آیا از رد این درخواست اطمینان دارید؟"
          confirmText="رد"
          type="reject"
          loading={actionLoading}
        />
      </>
    );
  }

  if (taskType === 'regular-profile' && taskData) {
    const profileRequest = mapProfileChangeRequestToComponent(
      taskData as ApiProfileChangeRequestResponse
    );
    return (
      <>
        <TaskLayout>
          <ProfileChangeApproval
            request={profileRequest}
            rawApiData={taskData as ApiProfileChangeRequestResponse}
            onApprove={handleApprove}
            onReject={handleReject}
            onSelectPrimary={handleSelectPrimary}
          />
        </TaskLayout>

        {/* Confirmation Modals */}
        <ConfirmationModal
          isOpen={showApproveModal}
          onClose={() => setShowApproveModal(false)}
          onConfirm={() => confirmApprove(true)}
          title="تایید درخواست"
          message="آیا از تایید این درخواست اطمینان دارید؟"
          confirmText="تایید"
          type="approve"
          loading={actionLoading}
        />

        <ConfirmationModal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          onConfirm={() => confirmApprove(false)}
          title="رد درخواست"
          message="آیا از رد این درخواست اطمینان دارید؟"
          confirmText="رد"
          type="reject"
          loading={actionLoading}
        />
      </>
    );
  }

  if (taskType === 'help' && taskData) {
    // Create a simple help request object based on the actual API response structure
    const helpRequest = {
      id: (taskData as ApiHelpRequestResponse).task_details.task_id.toString(),
      requestDate: (taskData as ApiHelpRequestResponse).task_details.created_at,
      requestType: (taskData as ApiHelpRequestResponse).project_request_details.request_type === 1 ? 'درخواست کمک برای خود' : 'درخواست کمک برای دیگران',
      requestTitle: (taskData as ApiHelpRequestResponse).project_request_details.request_title,
      category: (taskData as ApiHelpRequestResponse).project_request_details.category_name,
      subcategory: (taskData as ApiHelpRequestResponse).project_request_details.subcategory_name,
      timeframe: (taskData as ApiHelpRequestResponse).project_request_details.timeframe,
      requiredAmount: new Intl.NumberFormat('fa-IR').format((taskData as ApiHelpRequestResponse).project_request_details.required_amount) + ' تومان',
      contactInfo: (taskData as ApiHelpRequestResponse).project_request_details.contact_info,
      shebaNumber: (taskData as ApiHelpRequestResponse).project_request_details.sheba_number,
      isShebaVerified: (taskData as ApiHelpRequestResponse).project_request_details.is_sheba_verified,
      description: (taskData as ApiHelpRequestResponse).project_request_details.description,
      user: {
        id: (taskData as ApiHelpRequestResponse).project_request_details.user_id.toString(),
        name: `${(taskData as ApiHelpRequestResponse).project_request_details.first_name} ${(taskData as ApiHelpRequestResponse).project_request_details.last_name}`,
        level: `سطح ${(taskData as ApiHelpRequestResponse).project_request_details.user_level}`,
        avatar: (taskData as ApiHelpRequestResponse).project_request_details.profile_image
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/sys/files/download/${(taskData as ApiHelpRequestResponse).project_request_details.profile_image}`
          : undefined,
      },
      aiComment: 'این بخش شامل نظر AI هست که در مورد درخواست ارسال شده توضیحات لازم را در راستای کمک به ادمین میدهد.',
    };

    return (
      <>
        <TaskLayout>
          <HelpRequestApproval
            request={helpRequest}
            rawApiData={taskData as ApiHelpRequestResponse}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </TaskLayout>

        {/* Confirmation Modals */}
        <ConfirmationModal
          isOpen={showApproveModal}
          onClose={() => setShowApproveModal(false)}
          onConfirm={() => confirmApprove(true)}
          title="تایید درخواست"
          message="آیا از تایید این درخواست اطمینان دارید؟"
          confirmText="تایید"
          type="approve"
          loading={actionLoading}
        />

        <ConfirmationModal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          onConfirm={() => confirmApprove(false)} title="رد درخواست"
          message="آیا از رد این درخواست اطمینان دارید؟"
          confirmText="رد"
          type="reject"
          loading={actionLoading}
        />
      </>
    );
  }

  if (taskType === 'cooperation' && taskData) {
    const cooperationRequest = mapCooperationRequestToComponent(
      taskData as ApiCooperationRequestResponse
    );
    return (
      <>
        <TaskLayout>
          <CooperationRequestApproval
            request={cooperationRequest}
            rawApiData={taskData as ApiCooperationRequestResponse}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </TaskLayout>

        {/* Confirmation Modals */}
        <ConfirmationModal
          isOpen={showApproveModal}
          onClose={() => setShowApproveModal(false)}
          onConfirm={() => confirmApprove(true)}
          title="تایید درخواست"
          message="آیا از تایید این درخواست اطمینان دارید؟"
          confirmText="تایید"
          type="approve"
          loading={actionLoading}
        />

        <ConfirmationModal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          onConfirm={() => confirmApprove(false)}
          title="رد درخواست"
          message="آیا از رد این درخواست اطمینان دارید؟"
          confirmText="رد"
          type="reject"
          loading={actionLoading}
        />
      </>
    );
  }

  if (taskType === 'template' && taskData) {
    const templateRequest = mapTemplateRequestToComponent(
      taskData as ApiTemplateRequestResponse
    );
    return (
      <>
        <TaskLayout>
          <TemplateRequestApproval
            request={templateRequest}
            rawApiData={taskData as ApiTemplateRequestResponse}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </TaskLayout>

        {/* Confirmation Modals */}
        <ConfirmationModal
          isOpen={showApproveModal}
          onClose={() => setShowApproveModal(false)}
          onConfirm={() => confirmApprove(true)}
          title="تایید درخواست"
          message="آیا از تایید این درخواست اطمینان دارید؟"
          confirmText="تایید"
          type="approve"
          loading={actionLoading}
        />

        <ConfirmationModal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          onConfirm={() => confirmApprove(false)}
          title="رد درخواست"
          message="آیا از رد این درخواست اطمینان دارید؟"
          confirmText="رد"
          type="reject"
          loading={actionLoading}
        />
      </>
    );
  }

  return null;
};

export default TaskDetailPage;
