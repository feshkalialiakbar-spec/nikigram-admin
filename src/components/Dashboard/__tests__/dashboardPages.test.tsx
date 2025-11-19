import React from 'react';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import type { TaskInterface } from '@/interface';
import MyTasks from '@/components/Dashboard/MyTasks';
import SharedPool from '@/components/Dashboard/SharedPool';
import TasksCompleted from '@/components/Dashboard/TasksCompleted';
import TasksInProgress from '@/components/Dashboard/TasksInProgress';
import TasksStopped from '@/components/Dashboard/TasksStopped';
import TasksUnassigned from '@/components/Dashboard/TasksUnassigned';
import TasksWaitingForMe from '@/components/Dashboard/TasksWaitingForMe';
import Tickets from '@/components/Dashboard/Tickets';
import { usePaginatedTaskService } from '@/components/tasks/hooks';

const mockTaskDashboard = jest.fn();

jest.mock('@/components/tasks/hooks', () => ({
  usePaginatedTaskService: jest.fn(),
}));

jest.mock('@/components/tasks', () => ({
  TaskDashboard: (props: Record<string, unknown>) => {
    mockTaskDashboard(props);
    return <div data-testid="task-dashboard" />;
  },
}));

jest.mock('@/components/layouts/withNavbarLayout/WithNavbarLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="with-navbar-layout">{children}</div>
  ),
}));

jest.mock('@/components/ui/TaskTableSkeleton', () => ({
  TaskTableSkeleton: ({ rows }: { rows?: number }) => (
    <div data-testid="task-table-skeleton">rows:{rows ?? 5}</div>
  ),
}));

jest.mock('@/components/ui/actions/button/Button', () => ({
  __esModule: true,
  default: ({
    children,
    onClick,
    type = 'button',
  }: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) => (
    <button type={type} onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/Dashboard/MyTasks/index.module.scss', () => ({}));
jest.mock('@/components/Dashboard/SharedPool/index.module.scss', () => ({}));
jest.mock('@/components/Dashboard/TasksCompleted/index.module.scss', () => ({}));
jest.mock('@/components/Dashboard/TasksInProgress/index.module.scss', () => ({}));
jest.mock('@/components/Dashboard/TasksStopped/index.module.scss', () => ({}));
jest.mock('@/components/Dashboard/TasksUnassigned/index.module.scss', () => ({}));
jest.mock('@/components/Dashboard/TasksWaitingForMe/index.module.scss', () => ({}));
jest.mock('@/components/Dashboard/Tickets/index.module.scss', () => ({}));

type PaginatedHookState = {
  tasks: TaskInterface[];
  total: number;
  limit: number;
  offset: number;
  loading: boolean;
  error: string | null;
  refetch: jest.Mock<Promise<void> | void, []>;
};

const createHookState = (overrides: Partial<PaginatedHookState> = {}): PaginatedHookState => ({
  tasks: [],
  total: 0,
  limit: 15,
  offset: 0,
  loading: false,
  error: null,
  refetch: jest.fn(),
  ...overrides,
});

const createTask = (overrides: Partial<TaskInterface> = {}): TaskInterface => ({
  task_id: overrides.task_id ?? 1,
  task_title: overrides.task_title ?? 'نمونه',
  task_description: overrides.task_description ?? 'توضیحات',
  status_id: overrides.status_id ?? 1,
  status_name: overrides.status_name ?? 'در حال انجام',
  created_at: overrides.created_at ?? '2024-01-01T00:00:00Z',
  ref_type: overrides.ref_type ?? 1,
  ref_uid: overrides.ref_uid ?? 100,
  ref_id: overrides.ref_id ?? 101,
  staff_position_info: overrides.staff_position_info ?? {
    staff_id: 1,
    position_id: 1,
    position_title: 'ادمین',
  },
  assignment_info: overrides.assignment_info ?? {
    assignment_id: 10,
    assignment_date: '2024-01-01',
    assignment_notes: '',
  },
});

type DashboardTestConfig = {
  name: string;
  Component: React.ComponentType<{ className?: string }>;
  title: string;
  allowAssignment?: boolean;
};

const dashboardConfigs: DashboardTestConfig[] = [
  { name: 'MyTasks', Component: MyTasks, title: 'کارهای من' },
  { name: 'SharedPool', Component: SharedPool, title: 'در انتظار انجام مشترک', allowAssignment: true },
  { name: 'TasksCompleted', Component: TasksCompleted, title: 'تکمیل شده' },
  { name: 'TasksInProgress', Component: TasksInProgress, title: 'در حال انجام' },
  { name: 'TasksStopped', Component: TasksStopped, title: 'متوقف شده' },
  { name: 'TasksUnassigned', Component: TasksUnassigned, title: 'اختصاص نیافته' },
  { name: 'TasksWaitingForMe', Component: TasksWaitingForMe, title: 'در انتظار انجام من' },
  { name: 'Tickets', Component: Tickets, title: 'کارهای من' },
];

const mockUsePaginatedTaskService =
  usePaginatedTaskService as jest.MockedFunction<typeof usePaginatedTaskService>;

describe('Dashboard pages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe.each(dashboardConfigs)('%s', ({ Component, title, allowAssignment }) => {
    it('renders a skeleton while data is loading', () => {
      mockUsePaginatedTaskService.mockReturnValue(createHookState({ loading: true }));

      render(<Component />);

      expect(screen.getByTestId('task-table-skeleton')).toBeInTheDocument();
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    it('shows an error state and retries when requested', async () => {
      const refetch = jest.fn().mockResolvedValue(undefined);
      mockUsePaginatedTaskService.mockReturnValue(
        createHookState({ error: 'اشکال در سرویس', refetch })
      );

      const user = userEvent.setup();
      render(<Component />);

      expect(screen.getByText('خطا در بارگذاری داده‌ها: اشکال در سرویس')).toBeInTheDocument();

      const retryButton = screen.getByRole('button', { name: 'تلاش مجدد' });
      await user.click(retryButton);

      expect(refetch).toHaveBeenCalledTimes(1);
    });

    it('renders the task dashboard when data is available', () => {
      const tasks = [createTask({ task_id: 1 }), createTask({ task_id: 2 })];
      mockUsePaginatedTaskService.mockReturnValue(
        createHookState({
          tasks,
          total: tasks.length,
        })
      );

      render(<Component />);

      expect(screen.getByTestId('task-dashboard')).toBeInTheDocument();

      const lastCall = mockTaskDashboard.mock.calls.at(-1);
      expect(lastCall).toBeDefined();

      const dashboardProps = lastCall?.[0] as Record<string, unknown>;
      expect(dashboardProps?.tasks).toEqual(tasks);
      expect(dashboardProps?.totalItems).toBe(tasks.length);
      expect(dashboardProps?.currentPage).toBe(1);
      expect(dashboardProps?.itemsPerPage).toBe(15);

      if (allowAssignment) {
        expect(dashboardProps?.allowAssignment).toBe(true);
      } else {
        expect(dashboardProps?.allowAssignment).toBeUndefined();
      }
    });
  });
});

