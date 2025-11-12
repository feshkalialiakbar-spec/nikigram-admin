import { useMemo, useEffect, useState, useCallback, type FC } from 'react';
import type {
  ProjectTemplateDetailResponse,
} from '@/services/projectTemplate';
import { fetchProjectTemplateDetail } from '@/services/projectTemplate';
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
import headerStyles from '../../../../../app/test/styles/Header.module.css';
import statsStyles from '../../../../../app/test/styles/Stats.module.css';

interface SelectedTemplateOverviewProps {
  template: ProjectTemplateDetailResponse;
  workflow: ApprovalWorkflowState;
  onChangeTemplate: () => void;
  onPhaseStatusChange: (phaseId: number, status: ApprovalPhaseStatus) => void;
  isLoading?: boolean;
  onOpenActionSidebar?: (payload: PhaseActionPayload) => void;
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
  onChangeTemplate,
  onPhaseStatusChange,
  isLoading: externalLoading,
  onOpenActionSidebar,
}) => {
  void onPhaseStatusChange;
  const { showError } = useToast();
  const [template, setTemplate] = useState<ProjectTemplateDetailResponse>(initialTemplate);
  const [isLoading, setIsLoading] = useState(false);
  const [assignmentState, setAssignmentState] = useState<{
    isOpen: boolean;
    payload?: PhaseActionPayload;
  }>({ isOpen: false });

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

  const handleAssignmentSubmit = useCallback((payload: TaskAssignmentSubmitPayload) => {
    console.log('Final assignment submit payload', payload);
  }, []);

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
                          <div className={statsStyles.iconText}>
                            <p dir="auto">{stageLabel || categoryTitle}</p>
                          </div>
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
          />
        ))}
      </div>

      <div className={styles.createProjectSection}>
        <button
          type="button"
          className={styles.createProjectButton}
          onClick={() => {
            // Handle create project action
            console.log('Create project clicked');
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
      />
    </section>
  );
};

export default SelectedTemplateOverview;
