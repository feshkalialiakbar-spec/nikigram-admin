import React, { useState } from 'react';
import { ArrowUp2, Edit2 } from 'iconsax-react';
import type { ProjectTemplatePhase, ProjectTemplatePhaseTask } from '@/services/projectTemplate';
import { safeText } from '@/hooks/texedit';
import phaseStyles from './styles/Phase.module.scss';
import taskStyles from './styles/Task.module.scss';
import badgeStyles from './styles/Badge.module.scss';

export type TemplatePhaseTaskStatus = 'done' | 'blocked';

export interface TemplatePhaseTaskBadge {
  text: string;
  variant: 'blue' | 'yellow';
}

export type PhaseAction = 'viewDetails' | 'assignToUser' | 'assignToSupervisor';

export interface PhaseActionPayload {
  phaseId: number;
  taskId?: number;
  action: PhaseAction;
  phaseName?: string;
  taskTitle?: string;
  phasePosition?: number;
}

interface PhaseCardProps {
  phase: ProjectTemplatePhase;
  position: number;
  onOpenActionSidebar?: (payload: PhaseActionPayload) => void;
}

const StatusIcon: React.FC<{ status: TemplatePhaseTaskStatus }> = ({ status }) => {
  const isDone = status === 'done';

  return (
    <div className={taskStyles.statusIcon}>
      <div className={taskStyles.icon}>
        {isDone ? (
          <svg fill="none" viewBox="0 0 24 24">
            <g id="tick-square">
              <path
                d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2Z"
                fill="#28A745"
                opacity="0.4"
              />
              <path
                d="M10.58 15.58C10.38 15.58 10.19 15.5 10.05 15.36L7.22 12.53C6.93 12.24 6.93 11.76 7.22 11.47C7.51 11.18 7.99 11.18 8.28 11.47L10.58 13.77L15.72 8.63C16.01 8.34 16.49 8.34 16.78 8.63C17.07 8.92 17.07 9.4 16.78 9.69L11.11 15.36C10.97 15.5 10.78 15.58 10.58 15.58Z"
                fill="#28A745"
              />
            </g>
          </svg>
        ) : (
          <svg fill="none" viewBox="0 0 24 24">
            <g id="close-square">
              <path
                d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2Z"
                fill="#E70218"
                opacity="0.4"
              />
              <path
                d="M13.06 12L15.36 9.7C15.65 9.41 15.65 8.93 15.36 8.64C15.07 8.35 14.59 8.35 14.3 8.64L12 10.94L9.7 8.64C9.41 8.35 8.93 8.35 8.64 8.64C8.35 8.93 8.35 9.41 8.64 9.7L10.94 12L8.64 14.3C8.35 14.59 8.35 15.07 8.64 15.36C8.79 15.51 8.98 15.58 9.17 15.58C9.36 15.58 9.55 15.51 9.7 15.36L12 13.06L14.3 15.36C14.45 15.51 14.64 15.58 14.83 15.58C15.02 15.58 15.21 15.51 15.36 15.36C15.65 15.07 15.65 14.59 15.36 14.3L13.06 12Z"
                fill="#E70218"
              />
            </g>
          </svg>
        )}
      </div>
    </div>
  );
};

const Badge: React.FC<TemplatePhaseTaskBadge> = ({ text, variant }) => (
  <div className={`${badgeStyles.badge} ${variant === 'blue' ? badgeStyles.blue : badgeStyles.yellow}`}>
    <div className={badgeStyles.content}>
      <div className={badgeStyles.text}>
        <p dir="auto">{text}</p>
      </div>
    </div>
  </div>
);

const PhaseCard: React.FC<PhaseCardProps> = ({ phase, position, onOpenActionSidebar }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const tasks = phase.tasks ?? [];

  const getTaskStatus = (task: ProjectTemplatePhaseTask): TemplatePhaseTaskStatus => {
    // You can customize this based on your business logic
    // For now, we'll use a simple check
    return 'done'; // or 'blocked'
  };

  const getTaskBadges = (task: ProjectTemplatePhaseTask, allTasks: ProjectTemplatePhaseTask[]): TemplatePhaseTaskBadge[] => {
    const badges: TemplatePhaseTaskBadge[] = [];
    const taskIndexMap = new Map(allTasks.map((t, idx) => [t.task_id, idx + 1]));

    // Add prerequisite badges
    if (task.prerequisites && task.prerequisites.length > 0) {
      const prereqTasks = task.prerequisites
        .map((prereq) => {
          const taskNum = taskIndexMap.get(prereq.required_task_id);
          return taskNum ? `تسک ${taskNum}` : null;
        })
        .filter((text): text is string => text !== null);

      if (prereqTasks.length > 0) {
        badges.push({
          text: `پیش نیاز: ${prereqTasks.join('، ')}`,
          variant: 'yellow',
        });
      }
    }

    // Add corequisite badges
    if (task.corequisites && task.corequisites.length > 0) {
      const coreqTasks = task.corequisites
        .map((coreq) => {
          const taskNum = taskIndexMap.get(coreq.related_task_id);
          return taskNum ? `تسک ${taskNum}` : null;
        })
        .filter((text): text is string => text !== null);

      if (coreqTasks.length > 0) {
        badges.push({
          text: `هم نیاز: ${coreqTasks.join('، ')}`,
          variant: 'blue',
        });
      }
    }

    return badges;
  };

  return (
    <div className={phaseStyles.phase}>
      <div className={phaseStyles.inner}>
        <div className={phaseStyles.content}>
          <div className={phaseStyles.phaseHeader}>
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`${phaseStyles.toggleButton} ${isExpanded ? phaseStyles.expanded : phaseStyles.collapsed}`}
              style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)' }}
            >
              <ArrowUp2 size={24} variant="Bold" color="#007BFF" />
            </button>

            <div className={phaseStyles.phaseHeaderRight}>
              <div className={phaseStyles.headerInfo}>
                <p className={phaseStyles.phaseName} dir="auto">
                  {safeText(phase.phase_name)}
                </p>
                <p className={phaseStyles.phaseNumber} dir="auto">
                  فاز {position}:
                </p>
                <div className={phaseStyles.phaseDot}>
                  <svg fill="none" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" fill="#007BFF" r="4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {isExpanded && (
            <div className={phaseStyles.phaseBody}>
              <div className={phaseStyles.bodyInner}>
                <div className={phaseStyles.tasks}>
                  {tasks.map((task, taskIndex) => {
                    const status = getTaskStatus(task);
                    const badges = getTaskBadges(task, tasks);

                    return (
                      <div key={task.task_id} className={taskStyles.taskCard}>
                        <div className={taskStyles.taskContent}>
                          <div className={taskStyles.taskHeader}>
                            <div className={taskStyles.taskTitleGroup}>
                              <p className={taskStyles.taskNumber} dir="auto">
                                تسک {taskIndex + 1}
                              </p>
                              <span className={taskStyles.titleSeparator}>/</span>
                              <p className={taskStyles.taskName} dir="auto">
                                {safeText(task.task_title)}
                              </p>
                            </div>
                            <StatusIcon status={status} />
                          </div>

                          {task.task_description && (
                            <p className={taskStyles.taskDescription} dir="auto">
                              {safeText(task.task_description)}
                            </p>
                          )}

                          {badges.length > 0 && (
                            <div className={taskStyles.badgeList}>
                              {badges.map((badge, idx) => (
                                <Badge key={`${task.task_id}-${idx}`} {...badge} />
                              ))}
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          className={taskStyles.editIconButton}
                          onClick={() =>
                            onOpenActionSidebar?.({
                              phaseId: phase.phase_id,
                              phaseName: phase.phase_name,
                              phasePosition: position,
                              taskId: task.task_id,
                              taskTitle: task.task_title,
                              action: 'assignToUser',
                            })
                          }
                          aria-label={`ویرایش ${safeText(task.task_title)}`}
                        >
                          <Edit2 size={24} variant="Bulk" color="#2F6AFF" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhaseCard;

