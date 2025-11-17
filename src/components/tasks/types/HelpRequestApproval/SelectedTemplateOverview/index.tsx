import { useMemo, useEffect, useState, useCallback, type FC } from 'react';
import type {
  ProjectTemplateDetailResponse,
} from '@/services/projectTemplate';
import { fetchProjectTemplateDetail, verifyProjectRequest } from '@/services/projectTemplate';
import { safeText } from '@/hooks/texedit';
import { useToast } from '@/components/ui';
import type {
  ApprovalWorkflowStage,
  ApprovalWorkflowState,
  ApprovalPhaseStatus,
} from '../lib/types';
import styles from './styles/SelectedTemplateOverview.module.scss';
import SelectedTemplateSkeleton from './SelectedTemplateSkeleton';
import PhaseCard, { type PhaseActionPayload } from './PhaseCard';
import TaskAssignmentDrawer, {
  type TaskAssignmentSubmitPayload,
} from './TaskAssignmentDrawer';
import headerStyles from './styles/Header.module.scss';
import statsStyles from './styles/Stats.module.scss';
import {
  getTaskAssignmentsFromCookie,
  saveTaskAssignmentToCookie,
  clearTaskAssignmentsCookie,
  type TaskAssignmentCookieData,
} from '@/utils/taskAssignmentCookies';
import Image from 'next/image';
import { buildDocDownloadUrl } from '@/utils/docUrl';

interface SelectedTemplateOverviewProps {
  template: ProjectTemplateDetailResponse;
  workflow: ApprovalWorkflowState;
  onChangeTemplate: () => void;
  onPhaseStatusChange: (phaseId: number, status: ApprovalPhaseStatus) => void;
  isLoading?: boolean;
  onOpenActionSidebar?: (payload: PhaseActionPayload) => void;
  requestId?: number;
  onVerificationComplete?: () => void;
}

 

const stageLabelMap: Partial<Record<ApprovalWorkflowStage, string>> = {
  review: 'مرحله بررسی درخواست',
  documents: 'مرحله ثبت مدارک',
  template: 'مرحله انتخاب تمپلیت',
  completed: 'تایید نهایی',
};

 

const getSafeText = (value?: string | null, fallback = '—') =>
  value ? safeText(value) : fallback;
 

const SelectedTemplateOverview: FC<SelectedTemplateOverviewProps> = ({
  template: initialTemplate,
  workflow,
  onChangeTemplate: _onChangeTemplate,
  onPhaseStatusChange,
  isLoading: externalLoading,
  onOpenActionSidebar,
  requestId,
  onVerificationComplete,
}) => {
  void onPhaseStatusChange;
  const { showError, showSuccess } = useToast();
  const [template, setTemplate] = useState<ProjectTemplateDetailResponse>(initialTemplate);
  const [isLoading, setIsLoading] = useState(false);
  const [assignmentState, setAssignmentState] = useState<{
    isOpen: boolean;
    payload?: PhaseActionPayload;
  }>({ isOpen: false });
  const [taskAssignments, setTaskAssignments] = useState<TaskAssignmentCookieData[]>([]);

  // Load task assignments from cookie on mount
  useEffect(() => {
    const savedAssignments = getTaskAssignmentsFromCookie();
    // Ensure staff_label exists for backward compatibility
    const normalizedAssignments = savedAssignments.map((assignment) => ({
      ...assignment,
      staff_label: assignment.staff_label || `کاربر ${assignment.staff_id}`,
    }));
    setTaskAssignments(normalizedAssignments);
  }, []);

  // Fetch template detail when component is displayed
  useEffect(() => {
    const fetchTemplate = async () => {
      if (!initialTemplate?.project_temp_id) return;

      setIsLoading(true);
      try {
        const fetchedTemplate = await fetchProjectTemplateDetail(
          initialTemplate.project_temp_id,
          'fa'
        );
        setTemplate(fetchedTemplate);
      } catch (error) {
        console.error('Failed to fetch template detail:', error);
        showError('خطا در دریافت جزئیات تمپلیت');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchTemplate();
  }, [initialTemplate?.project_temp_id, showError]);

  const phasesWithStatus = useMemo(() => {
    const phaseStateMap = new Map(workflow.phases.map((phase) => [phase.phaseId, phase.status]));

    return (template.phases ?? []).map((phase, index) => ({
      phase,
      status: phaseStateMap.get(phase.phase_id) ?? 'pending',
      position: index + 1,
    }));
  }, [template.phases, workflow.phases]);

  // Create a map of task_id to staff_label for all tasks
  const allTaskAssignmentsMap = useMemo(() => {
    const map = new Map<number, string>();
    taskAssignments.forEach((assignment) => {
      map.set(assignment.temp_task_id, assignment.staff_label || `کاربر ${assignment.staff_id}`);
    });
    return map;
  }, [taskAssignments]);

  const handleOpenAssignment = useCallback(
    (payload: PhaseActionPayload) => {
      setAssignmentState({ isOpen: true, payload });
      onOpenActionSidebar?.(payload);
    },
    [onOpenActionSidebar]
  );

  const handleCloseAssignment = useCallback(() => {
    setAssignmentState({ isOpen: false });
  }, []);

  const activePhase = useMemo(() => {
    if (!assignmentState.payload?.phaseId) return undefined;

    return template.phases?.find((phase) => phase.phase_id === assignmentState.payload?.phaseId);
  }, [assignmentState.payload?.phaseId, template.phases]);

  const activeTask = useMemo(() => {
    if (!assignmentState.payload?.taskId) return undefined;
    return activePhase?.tasks?.find((task) => task.task_id === assignmentState.payload?.taskId);
  }, [activePhase?.tasks, assignmentState.payload?.taskId]);

  const handleAssignmentSubmit = useCallback(async (payload: TaskAssignmentSubmitPayload) => {
    if (!payload.taskId || !payload.staffId) {
      showError('اطلاعات ناقص است');
      return;
    }

    const newAssignment: TaskAssignmentCookieData = {
      temp_task_id: payload.taskId,
      staff_id: payload.staffId,
      staff_label: payload.staffLabel,
      deadline: payload.deadlineDays ?? 0,
      assignment_notes: payload.assignmentNotes ?? '',
    };

    // Save to cookie
    saveTaskAssignmentToCookie(newAssignment);

    // Update local state
    const existingIndex = taskAssignments.findIndex(
      (a) => a.temp_task_id === payload.taskId
    );
    const updatedAssignments =
      existingIndex >= 0
        ? [
            ...taskAssignments.slice(0, existingIndex),
            newAssignment,
            ...taskAssignments.slice(existingIndex + 1),
          ]
        : [...taskAssignments, newAssignment];

    setTaskAssignments(updatedAssignments);
    showSuccess('تسک با موفقیت اختصاص داده شد');
  }, [taskAssignments, showError, showSuccess]);

  // Validate that all tasks are assigned
  const validateAllTasksAssigned = useCallback(() => {
    const allTasks = template.phases?.flatMap((phase) => phase.tasks ?? []) ?? [];
    const assignedTaskIds = new Set(taskAssignments.map((a) => a.temp_task_id));
    const unassignedTasks = allTasks.filter((task) => !assignedTaskIds.has(task.task_id));
    
    return {
      isValid: unassignedTasks.length === 0,
      unassignedTasks,
      totalTasks: allTasks.length,
      assignedTasks: taskAssignments.length,
    };
  }, [template.phases, taskAssignments]);

  if (externalLoading || isLoading) return <SelectedTemplateSkeleton />;

  const currentStage = workflow.currentStage;
  const stageLabel = currentStage ? stageLabelMap[currentStage] : undefined;
 
  const totalPhases = template.phases?.length ?? 0;
     const fundName = getSafeText(template.category_detail?.fund_name, '—');
  const categoryTitle = getSafeText(template.category_detail?.title, fundName);
 
  return (
    <section className={styles.container}>
      <div className={styles.hero}>
     

        <div className={headerStyles.headerCard}>
          <div className={headerStyles.headerContent}>
            <div className={headerStyles.title}>
              <p dir="auto">{safeText(template.title)}</p>
            </div>

            <div className={headerStyles.details}>

              {/* Frame40 */}
              <div className={headerStyles.infoRow}>
                <div className={headerStyles.label}>
                  <p dir="auto">صندوق مربوطه</p>
                </div>
                <div className={headerStyles.value}>
                  <p dir="auto">{fundName}</p>
                </div>
              </div>

              {/* NumberStatsChartsTotalOrder (Frame39 etc.) */}
              <div className={statsStyles.statsCard} data-name="Number Stats & Charts/Total order">
                <div className={statsStyles.inner}>
                  <div className={statsStyles.content}>
                    <div className={statsStyles.statsRow}>


                      {/* Frame11 (Left + Frame10) */}
                      <div className={statsStyles.statsLeft}>
                        <div className={statsStyles.statsIcon}>
                          {template.category_detail?.fund_logo ? (
                            <Image
                              src={buildDocDownloadUrl(template.category_detail.fund_logo)}
                              alt={fundName}
                              width={100}
                              height={100}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '8px',
                              }}
                            />
                          ) : (
                            <div className={statsStyles.iconText}>
                              <p dir="auto">{stageLabel || categoryTitle}</p>
                            </div>
                          )}
                        </div>
                        <div className={statsStyles.statsInfo} data-name="Left">
                          <p className={statsStyles.statsTitle} dir="auto">
                            {categoryTitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Frame41 */}
              <div className={headerStyles.infoRow}>
                <div className={headerStyles.label}>
                  <p dir="auto">تعداد فازها</p>
                </div>
                <div className={headerStyles.value}>
                  <p dir="auto">{totalPhases} فاز</p>
                </div>
              </div>

              {/* Description */}
              <div className={headerStyles.description}>
                <p dir="auto">
                  {getSafeText(template.description || template.category_detail?.description, '')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {template.description && (
        <p className={styles.templateDescription}>{safeText(template.description)}</p>
      )}

      <div className={styles.phaseList}>
        {phasesWithStatus.map(({ phase, position }) => (
          <PhaseCard
            key={phase.phase_id}
            phase={phase}
            position={position}
            onOpenActionSidebar={handleOpenAssignment}
            taskAssignmentsMap={allTaskAssignmentsMap}
          />
        ))}
      </div>

      <div className={styles.createProjectSection}>
        {(() => {
          const validation = validateAllTasksAssigned();
          const allTasksCount = validation.totalTasks;
          const assignedCount = validation.assignedTasks;
          const unassignedCount = validation.unassignedTasks.length;
          const isComplete = validation.isValid && assignedCount > 0;
          
          return (
            <div className={styles.validationSummary}>
              <div className={styles.validationInfo}>
                <span className={styles.validationLabel}>وضعیت اختصاص تسک‌ها:</span>
                <span className={isComplete ? styles.validationSuccess : styles.validationWarning}>
                  {assignedCount} از {allTasksCount} تسک اختصاص داده شده
                  {unassignedCount > 0 && ` (${unassignedCount} تسک باقی مانده)`}
                </span>
              </div>
              {!isComplete && (
                <div className={styles.validationHint}>
                  لطفا تمام تسک‌ها را به کاربران اختصاص دهید تا بتوانید پروژه را ایجاد کنید.
                </div>
              )}
            </div>
          );
        })()}
        <button
          type="button"
          className={styles.createProjectButton}
          onClick={async () => {
            if (!requestId) {
              showError('شناسه درخواست موجود نیست');
              return;
            }

            // Validate all tasks are assigned
            const validation = validateAllTasksAssigned();
            if (!validation.isValid) {
              const unassignedCount = validation.unassignedTasks.length;
              const taskNames = validation.unassignedTasks
                .map((task) => task.task_title)
                .slice(0, 3)
                .join('، ');
              const moreText = unassignedCount > 3 ? ` و ${unassignedCount - 3} تسک دیگر` : '';
              showError(
                `لطفا تمام تسک‌ها را به کاربر اختصاص دهید. ${unassignedCount} تسک بدون اختصاص باقی مانده است: ${taskNames}${moreText}`
              );
              return;
            }

            if (taskAssignments.length === 0) {
              showError('لطفا حداقل یک تسک را به کاربر اختصاص دهید');
              return;
            }

            try {
              const verifyPayload = {
                template_id: template.project_temp_id,
                title: template.title,
                description: template.description || '',
                task_assignments: taskAssignments,
              };

              const response = await verifyProjectRequest(requestId, verifyPayload);
              showSuccess(response?.message ?? 'پروژه با موفقیت ایجاد شد');
              
              // Clear cookie after successful verification
              clearTaskAssignmentsCookie();
              setTaskAssignments([]);
              
              // Notify parent component to reset to initial state
              onVerificationComplete?.();
            } catch (error) {
              const message = error instanceof Error ? error.message : 'خطا در ایجاد پروژه';
              showError(message);
            }
          }}
        >
          ایجاد پروژه
        </button>
      </div>

      <TaskAssignmentDrawer
        isOpen={assignmentState.isOpen}
        onClose={handleCloseAssignment}
        phaseId={assignmentState.payload?.phaseId}
        phaseName={assignmentState.payload?.phaseName ?? activePhase?.phase_name}
        phasePosition={assignmentState.payload?.phasePosition}
        taskId={assignmentState.payload?.taskId}
        taskTitle={assignmentState.payload?.taskTitle ?? activeTask?.task_title}
        taskDescription={activeTask?.task_description ?? null}
        onSubmit={handleAssignmentSubmit}
        requestId={requestId}
        templateId={template.project_temp_id}
      />
    </section>
  );
};

export default SelectedTemplateOverview;
