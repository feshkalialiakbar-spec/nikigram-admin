import { useMemo, type FC, type ReactNode } from 'react';
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
import { safeText } from '@/hooks/texedit';
import type {
  ApprovalWorkflowStage,
  ApprovalWorkflowState,
  ApprovalPhaseStatus,
} from '../lib/types';
import styles from './SelectedTemplateOverview.module.scss';
import SelectedTemplateSkeleton from './SelectedTemplateSkeleton';

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
  template,
  workflow,
  onChangeTemplate,
  onPhaseStatusChange,
  isLoading,
  onOpenActionSidebar,
}) => {
  void onPhaseStatusChange;

  const phasesWithStatus = useMemo(() => {
    const phaseStateMap = new Map(workflow.phases.map((phase) => [phase.phaseId, phase.status]));

    return (template.phases ?? []).map((phase, index) => ({
      phase,
      status: phaseStateMap.get(phase.phase_id) ?? 'pending',
      position: index + 1,
    }));
  }, [template.phases, workflow.phases]);

  if (isLoading) return <SelectedTemplateSkeleton />;

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
          <div className={styles.phaseIcon}>
            <DocumentText size={20} variant="Bold" />
          </div>
          <div className={styles.phaseTitleBlock}>
            <span className={styles.phaseLabel}>فاز {position}</span>
            <h3 className={styles.phaseTitle}>{getSafeText(phase.phase_name)}</h3>
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
          {tasks.map((task) => (
            <div key={task.task_id} className={styles.taskRow}>
              <div className={styles.taskInfo}>
                <div className={styles.taskTitleRow}>
                  <span className={styles.taskTitle}>{getSafeText(task.task_title)}</span>
                  <span className={classNames(styles.taskStatus, taskStatusClass)}>
                    {phaseStatusIcon}
                    {phaseStatusLabel}
                  </span>
                </div>
                {task.task_description && (
                  <p className={styles.taskDescription}>{safeText(task.task_description)}</p>
                )}
              </div>

              <div className={styles.taskActions}>
                <button
                  type="button"
                  className={classNames(styles.taskActionButton, styles.taskActionPrimary)}
                  onClick={() => handleActionClick(task, 'viewDetails')}
                >
                  <Eye size={16} variant="Bold" />
                  مشاهده جزئیات
                </button>
                <button
                  type="button"
                  className={styles.taskActionButton}
                  onClick={() => handleActionClick(task, 'assignToUser')}
                >
                  <Profile2User size={16} variant="Bold" />
                  انتصاب به کاربر
                </button>
                <button
                  type="button"
                  className={styles.taskActionButton}
                  onClick={() => handleActionClick(task, 'assignToSupervisor')}
                >
                  <Warning2 size={16} variant="Bold" />
                  ثبت یادداشت
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyTaskState}>تسکی برای این فاز ثبت نشده است.</div>
      )}
    </article>
  );
};

export default SelectedTemplateOverview;
