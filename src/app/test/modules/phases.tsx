import React from 'react';
import svgPaths from '../imports/svg-x98sifuilj';
import phaseStyles from '../styles/Phase.module.css';
import taskStyles from '../styles/Task.module.css';
import badgeStyles from '../styles/Badge.module.css';
import buttonStyles from '../styles/AssignmentButtons.module.css';

export type TemplatePhaseTaskStatus = 'done' | 'blocked';
export type TemplatePhaseTaskLeftVariant = 'user' | 'tender' | 'assignmentButtons';

export interface TemplatePhaseTaskBadge {
  text: string;
  variant: 'blue' | 'yellow';
}

export interface TemplatePhaseTask {
  id: number | string;
  order: number;
  title: string;
  status: TemplatePhaseTaskStatus;
  leftVariant: TemplatePhaseTaskLeftVariant;
  relationBadges?: TemplatePhaseTaskBadge[];
  userInfo?: {
    name: string;
    label?: string;
  };
  tenderInfo?: {
    publishDateTime: string;
    title: string;
    label?: string;
    separator?: string;
  };
  assignmentButtons?: string[];
  categoryId?: number;
  statusId?: number;
}

export interface TemplatePhase {
  id: number;
  title: string;
  categoryId?: number;
  statusId?: number;
  tasks: TemplatePhaseTask[];
}

interface TemplatePhasesProps {
  phases: TemplatePhase[];
  expandedPhases: Record<number, boolean>;
  togglePhase: (phaseId: number) => void;
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

const EditButton: React.FC = () => (
  <div data-name="Component 4">
    <div className={taskStyles.editButton} data-name="vuesax/bulk/edit-2">
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

const TaskLeftContent: React.FC<{ task: TemplatePhaseTask }> = ({ task }) => {
  if (task.leftVariant === 'assignmentButtons') {
    return (
      <div className={buttonStyles.buttons}>
        {task.assignmentButtons?.map((label) => (
          <div key={label} className={buttonStyles.button}>
            <div className={buttonStyles.content}>
              <div className={buttonStyles.textWrapper}>
                <div className={buttonStyles.text}>
                  <p dir="auto">{label}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (task.leftVariant === 'tender' && task.tenderInfo) {
    const { publishDateTime, title, label = 'مناقصه:', separator = '_' } = task.tenderInfo;
    return (
      <>
        <EditButton />
        <div className={taskStyles.tenderInfo}>
          <div className={taskStyles.tenderDetails}>
            <p dir="auto">{publishDateTime}</p>
          </div>
          <div className={taskStyles.separator}>
            <p dir="auto">{separator}</p>
          </div>
          <div className={taskStyles.tenderTitle}>
            <p dir="auto">{title}</p>
          </div>
          <p className={taskStyles.label} dir="auto">
            {label}
          </p>
        </div>
      </>
    );
  }

  if (task.leftVariant === 'user' && task.userInfo) {
    const { name, label = 'انتصاب به کاربر:' } = task.userInfo;
    return (
      <>
        <EditButton />
        <div className={taskStyles.userInfo}>
          <div className={taskStyles.userContainer} data-name="Container">
            <div className={taskStyles.userName}>
              <p dir="auto">{name}</p>
            </div>
            <div className={taskStyles.userImage} data-name="Image">
              <div className={taskStyles.imageBg} />
            </div>
          </div>
          <p className={taskStyles.label} dir="auto">
            {label}
          </p>
        </div>
      </>
    );
  }

  return null;
};

const TemplatePhases: React.FC<TemplatePhasesProps> = ({ phases, expandedPhases, togglePhase }) => (
  <>
    {phases.map((phase, index) => (
      <div key={phase.id} className={phaseStyles.phase}>
        <div className={phaseStyles.inner}>
          <div className={phaseStyles.content}>
            <div className={phaseStyles.phaseHeader}>
              <PhaseToggleButton isExpanded={!!expandedPhases[phase.id]} onClick={() => togglePhase(phase.id)} />

              <div className={phaseStyles.phaseHeaderRight}>
                <div className={phaseStyles.headerInfo}>
                  <p className={phaseStyles.phaseName} dir="auto">
                    {phase.title}
                  </p>
                  <p className={phaseStyles.phaseNumber} dir="auto">
                    فاز {index + 1}:
                  </p>
                  <div className={phaseStyles.phaseDot}>
                    <svg fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" fill="var(--fill-0, #007BFF)" r="4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {expandedPhases[phase.id] && (
              <div className={phaseStyles.phaseBody}>
                <div className={phaseStyles.bodyInner}>
                  <div className={phaseStyles.tasks}>
                    {phase.tasks.map((task) => (
                      <div key={task.id} className={taskStyles.taskRow}>
                        <div className={taskStyles.taskLeft}>
                          <TaskLeftContent task={task} />
                        </div>

                        <div className={taskStyles.taskRight}>
                          {task.relationBadges?.map((badge) => (
                            <Badge key={`${task.id}-${badge.text}`} {...badge} />
                          ))}

                          <div className={taskStyles.taskInfo}>
                            <p className={taskStyles.taskName} dir="auto">
                              {task.title}
                            </p>
                            <p className={taskStyles.taskNumber} dir="auto">
                              تسک {task.order}:
                            </p>
                          </div>

                          <StatusIcon status={task.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    ))}
  </>
);

export default TemplatePhases;
