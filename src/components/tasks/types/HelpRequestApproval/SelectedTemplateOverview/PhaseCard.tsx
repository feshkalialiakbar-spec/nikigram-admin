import React, { useState } from 'react';
import type { ProjectTemplatePhase, ProjectTemplatePhaseTask } from '@/services/projectTemplate';
import { safeText } from '@/hooks/texedit';
import phaseStyles from '../../../../../app/test/styles/Phase.module.css';
import taskStyles from '../../../../../app/test/styles/Task.module.css';
import badgeStyles from '../../../../../app/test/styles/Badge.module.css';
import svgPaths from '../../../../../app/test/imports/svg-x98sifuilj';

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
  taskAssignmentsMap?: Map<number, string>;
}

const PhaseToggleButton: React.FC<{ isExpanded: boolean; onClick: () => void }> = ({ isExpanded, onClick }) => (
  <button
    onClick={onClick}
    className={`${phaseStyles.toggleButton} ${isExpanded ? phaseStyles.expanded : phaseStyles.collapsed}`}
    data-name="vuesax/bulk/arrow-up"
  >
    <div className="absolute contents inset-0">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="arrow-up">
          <path d={svgPaths.p9f39700} fill="var(--fill-0, #007BFF)" id="Vector" />
          <path d={svgPaths.p369d6c00} fill="var(--fill-0, #007BFF)" id="Vector_2" opacity="0.4" />
        </g>
      </svg>
    </div>
  </button>
);

const EditButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div data-name="Component 4">
    <div className={taskStyles.editButton} data-name="vuesax/bulk/edit-2" onClick={onClick}>
      <div className="absolute contents inset-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="edit-2">
            <path d={svgPaths.p3dd95700} fill="var(--fill-0, #007BFF)" id="Vector" opacity="0.4" />
            <path d={svgPaths.p33964d80} fill="var(--fill-0, #007BFF)" id="Vector_2" opacity="0.4" />
            <path d={svgPaths.p10a34900} fill="var(--fill-0, #007BFF)" id="Vector_3" />
          </g>
        </svg>
      </div>
    </div>
  </div>
);

const StatusIcon: React.FC<{ status: TemplatePhaseTaskStatus }> = ({ status }) => {
  const isDone = status === 'done';

  return (
    <div className={taskStyles.statusIcon}>
      <div
        className={taskStyles.icon}
        data-name={isDone ? 'vuesax/bulk/tick-square' : 'vuesax/bulk/close-square'}
      >
        <div className="absolute contents inset-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
            <g id={isDone ? 'tick-square' : 'close-square'}>
              <path
                d={svgPaths.pd3eef80}
                fill={isDone ? 'var(--fill-0, #28A745)' : 'var(--fill-0, #E70218)'}
                id="Vector"
                opacity="0.4"
              />
              <path
                d={isDone ? svgPaths.p1b028e00 : svgPaths.p2bbbf000}
                fill={isDone ? 'var(--fill-0, #28A745)' : 'var(--fill-0, #E70218)'}
                id="Vector_2"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

const Badge: React.FC<TemplatePhaseTaskBadge> = ({ text, variant }) => (
  <div
    className={`${badgeStyles.badge} ${variant === 'blue' ? badgeStyles.blue : badgeStyles.yellow}`}
    data-name="Badge"
  >
    <div className={badgeStyles.content}>
      <div className={badgeStyles.text}>
        <p dir="auto">{text}</p>
      </div>
    </div>
  </div>
);

const PhaseCard: React.FC<PhaseCardProps> = ({ phase, position, onOpenActionSidebar, taskAssignmentsMap }) => {
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
            <PhaseToggleButton isExpanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)} />

            <div className={phaseStyles.phaseHeaderRight}>
              <div className={phaseStyles.headerInfo}>
                <p className={phaseStyles.phaseName} dir="auto">
                  {safeText(phase.phase_name)}
                </p>
                <p className={phaseStyles.phaseNumber} dir="auto">
                  فاز {position}:
                </p>
                <div className={phaseStyles.phaseDot}>
                  <svg fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" fill="var(--fill-0, #007BFF)" r="4" />
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
                      <div key={task.task_id} className={taskStyles.taskRow}>
                        <div className={taskStyles.taskLeft}>
                          <EditButton
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
                          />
                        </div>

                        <div className={taskStyles.taskRight}>
                          {badges.map((badge) => (
                            <Badge key={`${task.task_id}-${badge.text}`} {...badge} />
                          ))}

                          <div className={taskStyles.taskInfo}>
                            <p className={taskStyles.taskName} dir="auto">
                              {safeText(task.task_title)}
                              {taskAssignmentsMap?.has(task.task_id) && (
                                <span style={{ 
                                  marginRight: '8px', 
                                  color: '#007BFF', 
                                  fontSize: '12px',
                                  fontWeight: 'normal'
                                }}>
                                  ({safeText(taskAssignmentsMap.get(task.task_id) ?? '')})
                                </span>
                              )}
                            </p>
                            <p className={taskStyles.taskNumber} dir="auto">
                              تسک {taskIndex + 1}:
                            </p>
                          </div>

                          <StatusIcon status={status} />
                        </div>
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
