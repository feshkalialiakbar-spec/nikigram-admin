'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProfileChangeApproval from '@/components/tasks/types/profile/ProfileChangeApproval';
import IndividualProfileApproval from '@/components/tasks/types/profile/Individual';
import BusinessProfileApproval from '@/components/tasks/types/profile/BusinessProfileApproval';
import HelpRequestApproval from '@/components/tasks/types/HelpRequestApproval';
import CooperationRequestApproval from '@/components/tasks/types/CooperationRequestApproval';
import TemplateRequestApproval from '@/components/tasks/types/TemplateRequestApproval';
import TicketRequestApproval from '@/components/tasks/types/TicketRequestApproval';
import TaskLayout from '@/components/tasks/detail/TaskLayout';
import { ConfirmationModal, useToast } from '@/components/ui';
import TaskDetailSkeleton from '@/components/tasks/detail/TaskDetailSkeleton';
import Button from '@/components/ui/actions/button/Button';
import { mapProfileChangeRequestToComponent, mapCooperationRequestToComponent, mapTemplateRequestToComponent, mapHelpRequestToComponent, mapTicketRequestToComponent, mapBusinessProfileRequestToComponent } from '@/utils/taskMappers';
import {
  ApiProfileChangeRequestResponse,
  ApiHelpRequestResponse,
  ApiCooperationRequestResponse,
  ApiTemplateRequestResponse,
  ApiTicketRequestResponse,
  ApiBusinessProfileChangeRequestResponse,
} from '@/components/tasks/types';
import {
  fetchTaskDetail,
  verifyProfileChangeRequest,
  verifyHelpRequest,
  approveTemplateRequest,
  approveCooperationRequest,
  approveTicketRequest,
} from '@/services/taskDetailServices';

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
    | ApiTicketRequestResponse
    | ApiBusinessProfileChangeRequestResponse
    | null
  >(null);
  const [taskType, setTaskType] = useState<'regular-profile' | 'individual-profile' | 'business-profile' | 'help' | 'template' | 'cooperation' | 'ticket' | null>(null);

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

        const { taskData, redirectData } = await fetchTaskDetail(taskId);

        // Determine task type based on ref_type
        if (redirectData.ref_type === 1) {
          setTaskType('regular-profile');
        } else if (redirectData.ref_type === 2) {
          setTaskType('help');
        } else if (redirectData.ref_type === 4) {
          setTaskType('template');
        } else if (redirectData.ref_type === 5) {
          setTaskType('cooperation');
        } else if (redirectData.ref_type === 6) {
          setTaskType('ticket');
        } else if (redirectData.ref_type === 7) {
          setTaskType('business-profile');
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
    if (taskType === 'business-profile') {
      // BusinessProfileApproval handles its own drawer now
      return;
    }
    setShowApproveModal(true);
  };

  const handleReject = async (requestId: string) => {
    setPendingRequestId(requestId);
    if (taskType === 'business-profile') {
      // BusinessProfileApproval handles its own drawer now
      return;
    }
    setShowRejectModal(true);
  };

  const confirmApprove = async (isApprove: boolean) => {
    if (!pendingRequestId) return;

    setActionLoading(true);
    try {
      let result: Record<string, unknown> | undefined;

      if (taskType === 'regular-profile') {
        result = await verifyProfileChangeRequest(pendingRequestId, isApprove);
        const status = typeof result?.status === 'string' ? result.status : undefined;
        if (status === '1') {
          showSuccess('عملیات موفق', 'درخواست با موفقیت تایید شد');
          return;
        }
        const detail = typeof result?.detail === 'string' ? result.detail : undefined;
        if (detail) {
          showError('خطا در تایید', detail || 'خطا در تایید درخواست');
          return;
        }
      } else if (taskType === 'help') {
        result = await verifyHelpRequest(pendingRequestId, {
          template_id: 0,
          title: 'string',
          description: 'stringbibiiiiiiiiiiiiiiiiiii',
          task_assignments: [
            {
              temp_task_id: 1,
              staff_id: 1,
              deadline: 0,
              assignment_notes: 'string',
            },
          ],
        });
      } else if (taskType === 'template') {
        result = await approveTemplateRequest(pendingRequestId);
      } else if (taskType === 'cooperation') {
        result = await approveCooperationRequest(pendingRequestId);
      } else if (taskType === 'ticket') {
        result = await approveTicketRequest(pendingRequestId);
      } else if (taskType === 'business-profile') {
        // BusinessProfileApproval handles its own API calls now
        return;
      }

      const detail = typeof result?.detail === 'string' ? result.detail : undefined;
      if (detail) {
        showError('خطا در تایید', detail || 'خطا در تایید درخواست');
        return;
      }
      if (isApprove) {
        showSuccess('عملیات موفق', 'درخواست با موفقیت تایید شد');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      if (error instanceof Error) {
        if (error.message === 'ACCESS_TOKEN_MISSING') {
          showError('خطا در تایید', 'توکن دسترسی یافت نشد. لطفاً مجدداً وارد شوید.');
        } else if (error.message === 'API base URL is not configured.') {
          showError('خطا در تایید', 'آدرس سرور تنظیم نشده است.');
        } else {
          showError('خطا در تایید', error.message || 'خطا در ارتباط با سرور');
        }
      } else {
        showError('خطا در تایید', 'خطا در ارتباط با سرور');
      }
    } finally {
      setActionLoading(false);
      setShowApproveModal(false);
      setShowRejectModal(false);
      setPendingRequestId(null);
    }
  };

  const handleSelectPrimary = (_individualId: string) => {
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
          <Button
            onClick={() => router.back()}
            bgColor="primary-700"
            mode="side-rounded"
            paddingStyle="equal-8"
          >
            بازگشت
          </Button>
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
    const helpRequest = mapHelpRequestToComponent(
      taskData as ApiHelpRequestResponse,
      { fallbackTaskId: taskId },
    );

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

  if (taskType === 'ticket' && taskData) {
    const ticketRequest = mapTicketRequestToComponent(
      taskData as ApiTicketRequestResponse
    );
    return (
      <>
        <TaskLayout>
          <TicketRequestApproval
            request={ticketRequest}
            rawApiData={taskData as ApiTicketRequestResponse}
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

  if (taskType === 'business-profile' && taskData) {
    const businessRequest = mapBusinessProfileRequestToComponent(
      taskData as ApiBusinessProfileChangeRequestResponse
    );
    return (
      <>
        <TaskLayout>
          <BusinessProfileApproval
            request={businessRequest}
            rawApiData={taskData as ApiBusinessProfileChangeRequestResponse}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </TaskLayout>
      </>
    );
  }

  return null;
};

export default TaskDetailPage;
