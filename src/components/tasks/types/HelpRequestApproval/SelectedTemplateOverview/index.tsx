import { useMemo, useEffect, useState, type FC, type ReactNode } from 'react';
import classNames from 'classnames';
import {
  CloseCircle,
  DocumentText,
  Eye,
  Profile2User,
  TickCircle,
  Warning2,
} from 'iconsax-react';
import type {
  ProjectTemplateDetailResponse,
  ProjectTemplatePhase,
  ProjectTemplatePhaseTask,
} from '@/services/projectTemplate';
import { fetchProjectTemplateDetail } from '@/services/projectTemplate';
import { safeText } from '@/hooks/texedit';
import { useToast } from '@/components/ui';
import type {
  ApprovalWorkflowStage,
  ApprovalWorkflowState,
  ApprovalPhaseStatus,
} from '../lib/types';
import styles from './SelectedTemplateOverview.module.scss';
import SelectedTemplateSkeleton from './SelectedTemplateSkeleton';
import headerStyles from '../../../../../app/test/styles/Header.module.css';
import statsStyles from '../../../../../app/test/styles/Stats.module.css';

type PhaseAction = 'viewDetails' | 'assignToUser' | 'assignToSupervisor';

interface PhaseActionPayload {
  phaseId: number;
  taskId?: number;
  action: PhaseAction;
}

interface SelectedTemplateOverviewProps {
  template: ProjectTemplateDetailResponse;
  workflow: ApprovalWorkflowState;
  onChangeTemplate: () => void;
  onPhaseStatusChange: (phaseId: number, status: ApprovalPhaseStatus) => void;
  isLoading?: boolean;
  onOpenActionSidebar?: (payload: PhaseActionPayload) => void;
}

const phaseStatusMeta: Record<
  ApprovalPhaseStatus,
  { label: string; badgeClass: string; taskClass: string; icon: ReactNode }
> = {
  pending: {
    label: 'در انتظار',
    badgeClass: styles.statusPending,
    taskClass: styles.taskStatusPending,
    icon: <DocumentText size={16} variant="Bold" />,
  },
  inProgress: {
    label: 'در حال انجام',
    badgeClass: styles.statusInProgress,
    taskClass: styles.taskStatusInProgress,
    icon: <Warning2 size={16} variant="Bold" />,
  },
  completed: {
    label: 'تکمیل شده',
    badgeClass: styles.statusCompleted,
    taskClass: styles.taskStatusCompleted,
    icon: <TickCircle size={16} variant="Bold" />,
  },
  blocked: {
    label: 'متوقف شده',
    badgeClass: styles.statusBlocked,
    taskClass: styles.taskStatusBlocked,
    icon: <CloseCircle size={16} variant="Bold" />,
  },
};

const stageLabelMap: Partial<Record<ApprovalWorkflowStage, string>> = {
  review: 'مرحله بررسی درخواست',
  documents: 'مرحله ثبت مدارک',
  template: 'مرحله انتخاب تمپلیت',
  completed: 'تایید نهایی',
};

const stageClassNameMap: Partial<Record<ApprovalWorkflowStage, string>> = {
  review: styles.stageChipReview,
  documents: styles.stageChipDocuments,
  template: styles.stageChipTemplate,
  completed: styles.stageChipCompleted,
};

const getSafeText = (value?: string | null, fallback = '—') =>
  value ? safeText(value) : fallback;

const formatDateToPersian = (dateValue?: string | null) => {
  if (!dateValue) return '—';

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return safeText(dateValue);
  }

  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

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

  if (externalLoading || isLoading) return <SelectedTemplateSkeleton />;

  const currentStage = workflow.currentStage;
  const stageLabel = currentStage ? stageLabelMap[currentStage] : undefined;
  const stageClass = currentStage ? stageClassNameMap[currentStage] : undefined;

  const totalPhases = template.phases?.length ?? 0;
  const updatedAtLabel = formatDateToPersian(template.updated_at ?? template.created_at);
  const fundName = getSafeText(template.category_detail?.fund_name, '—');
  const categoryTitle = getSafeText(template.category_detail?.title, fundName);
  const summaryDescription = getSafeText(template.category_detail?.description, '');

  return (
    <section className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroHeader}>
          <span className={styles.heroCaption}>تمپلیت انتخاب‌شده</span>
          <div className={styles.heroTitleRow}>
            <h2 className={styles.heroTitle}>{safeText(template.title)}</h2>
            <div className={styles.heroActions}>
              {stageLabel && (
                <span className={classNames(styles.stageChip, stageClass)}>
                  {stageLabel}
                </span>
              )}
              <button
                type="button"
                className={styles.changeTemplateButton}
                onClick={onChangeTemplate}
              >
                تغییر تمپلیت
              </button>
            </div>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryContent}>
            <div className={styles.summaryHeadline}>
              <span className={styles.summaryTitle}>{fundName}</span>
              <span className={styles.summarySubtitle}>
                شناسه تمپلیت: {template.project_temp_id}
              </span>
            </div>

            <div className={styles.summaryMetrics}>
              <div className={styles.metricColumn}>
                <span className={styles.metricValue}>{totalPhases}</span>
                <span className={styles.metricLabel}>تعداد فازها</span>
              </div>
              <div className={styles.metricColumn}>
                <span className={styles.metricValue}>{updatedAtLabel}</span>
                <span className={styles.metricLabel}>آخرین بروزرسانی</span>
              </div>
              <div className={styles.summaryBadge}>{categoryTitle}</div>
            </div>

            {summaryDescription && (
              <p className={styles.summaryFooter}>{safeText(summaryDescription)}</p>
            )}
          </div>
        </div>

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
                      {/* Frame12 */}
                      <div className={statsStyles.statsAmount}>
                        <p className={statsStyles.amount} dir="auto">2,005,679,680</p>
                        <p className={statsStyles.currency} dir="auto">ریال</p>
                      </div>

                      {/* Frame11 (Left + Frame10) */}
                      <div className={statsStyles.statsLeft}>
                        <div className={statsStyles.statsInfo} data-name="Left">
                          <p className={statsStyles.statsTitle} dir="auto">
                            {categoryTitle}
                          </p>
                          <div className={statsStyles.statsUpdate} data-name="Data/Type 1">
                            <div className={statsStyles.updateText}>
                              <p dir="auto">بروزرسانی {updatedAtLabel}</p>
                            </div>
                          </div>
                        </div>

                        <div className={statsStyles.statsIcon}>
                          <div className={statsStyles.iconText}>
                            <p dir="auto">{stageLabel || categoryTitle}</p>
                          </div>
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
        {phasesWithStatus.map(({ phase, status, position }) => (
          <PhaseCard
            key={phase.phase_id}
            phase={phase}
            position={position}
            status={status}
            onOpenActionSidebar={onOpenActionSidebar}
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
    </section>
  );
};

interface PhaseCardProps {
  phase: ProjectTemplatePhase;
  status: ApprovalPhaseStatus;
  position: number;
  onOpenActionSidebar?: (payload: PhaseActionPayload) => void;
}

const PhaseCard: FC<PhaseCardProps> = ({ phase, status, position, onOpenActionSidebar }) => {
  const statusInfo = phaseStatusMeta[status];

  const taskStatusClass = statusInfo?.taskClass ?? styles.taskStatusPending;
  const phaseBadgeClass = statusInfo?.badgeClass ?? styles.statusPending;
  const phaseStatusIcon = statusInfo?.icon;
  const phaseStatusLabel = statusInfo?.label ?? 'در انتظار';

  const handleActionClick = (task: ProjectTemplatePhaseTask, action: PhaseAction) => {
    onOpenActionSidebar?.({ phaseId: phase.phase_id, taskId: task.task_id, action });
  };

  const tasks = phase.tasks ?? [];

  return (
    <article className={styles.phaseCard}>
      <header className={styles.phaseHeader}>
        <div className={styles.phaseMeta}>
          <div className={styles.phaseIcon} />
          <div className={styles.phaseTitleBlock}>
            <h3 className={styles.phaseTitle}>
              فاز {position}: {getSafeText(phase.phase_name)}
            </h3>
          </div>
        </div>

        <span className={classNames(styles.phaseStatusBadge, phaseBadgeClass)}>
          {phaseStatusIcon}
          {phaseStatusLabel}
        </span>
      </header>

      {phase.phase_description && (
        <p className={styles.phaseDescription}>{safeText(phase.phase_description)}</p>
      )}

      {tasks.length > 0 ? (
        <div className={styles.tasksList}>
          {tasks.map((task, taskIndex) => {
            // Find task dependencies - get task numbers instead of titles
            const taskIndexMap = new Map(tasks.map((t, idx) => [t.task_id, idx + 1]));
            const prerequisites = task.prerequisites?.map((prereq) => {
              const taskNum = taskIndexMap.get(prereq.required_task_id);
              return taskNum ? taskNum : null;
            }).filter((num): num is number => num !== null && num !== undefined) || [];
            
            const corequisites = task.corequisites?.map((coreq) => {
              const taskNum = taskIndexMap.get(coreq.related_task_id);
              return taskNum ? taskNum : null;
            }).filter((num): num is number => num !== null && num !== undefined) || [];

            // Determine task status icon (green checkmark or red X)
            // For now, we'll show checkmark for completed status, X for others
            const isTaskCompleted = status === 'completed';
            const taskIcon = isTaskCompleted ? (
              <TickCircle size={16} variant="Bold" className={styles.taskCheckIcon} />
            ) : (
              <CloseCircle size={16} variant="Bold" className={styles.taskXIcon} />
            );

            return (
              <div key={task.task_id} className={styles.taskRow}>
                <div className={styles.taskInfo}>
                  <div className={styles.taskTitleRow}>
                    {taskIcon}
                    <span className={styles.taskTitle}>
                      تسک {taskIndex + 1}: {getSafeText(task.task_title)}
                    </span>
                  </div>
                  <div className={styles.taskDependencies}>
                    {prerequisites.length > 0 && (
                      <span className={styles.taskDependency}>
                        پیش نیاز: {prerequisites.map((num, idx) => (
                          <span key={num}>
                            تسک {num}
                            {idx < prerequisites.length - 1 && '، '}
                          </span>
                        ))}
                      </span>
                    )}
                    {corequisites.length > 0 && (
                      <span className={styles.taskDependency}>
                        هم نیاز: {corequisites.map((num, idx) => (
                          <span key={num}>
                            تسک {num}
                            {idx < corequisites.length - 1 && '، '}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>
                  {task.task_description && (
                    <p className={styles.taskDescription}>{safeText(task.task_description)}</p>
                  )}
                </div>
              </div>
            );
          })}
          
          {/* Tender/Assignment Section */}
          <div className={styles.tenderSection}>
            <div className={styles.tenderHeader}>
              <span className={styles.tenderLabel}>مناقصه</span>
            </div>
            <div className={styles.tenderContent}>
              <p className={styles.tenderText}>
                ناظر ساخت ساختمان - تاریخ و زمان انتشار: ۱۱:۰۰ - ۱۴۰۴/۰۲/۲۹
              </p>
              <div className={styles.tenderAssignments}>
                <div className={styles.tenderAssignment}>
                  <Profile2User size={16} variant="Bold" />
                  <span>انتصاب به کاربر: نسترن علی پور</span>
                </div>
                <div className={styles.tenderAssignment}>
                  <Profile2User size={16} variant="Bold" />
                  <span>انتصاب به کاربر: نسترن علی پور</span>
                </div>
              </div>
              <div className={styles.tenderActions}>
                <button
                  type="button"
                  className={styles.tenderActionButton}
                  onClick={() => onOpenActionSidebar?.({ phaseId: phase.phase_id, action: 'assignToSupervisor' })}
                >
                  انتصاب به مناقصه
                </button>
                <button
                  type="button"
                  className={styles.tenderActionButton}
                  onClick={() => onOpenActionSidebar?.({ phaseId: phase.phase_id, action: 'assignToUser' })}
                >
                  انتصاب به کاربر
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.emptyTaskState}>تسکی برای این فاز ثبت نشده است.</div>
      )}
    </article>
  );
};

export default SelectedTemplateOverview;
