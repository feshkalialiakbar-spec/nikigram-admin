import { Task } from '@/components/tasks/types';

interface ApiTask {
  task_id?: number;
  task_title?: string;
  status_name?: string;
  status_id?: number;
  ref_type?: number;
  created_at?: string;
}

const mapApiTaskToTask = (apiTask: ApiTask): Task => {
  const statusName: string = apiTask?.status_name || '';
  const statusId: number | undefined = apiTask?.status_id;

  // Map various backend statuses to UI statuses
  const statusMapByName: Record<string, Task['status']> = {
    'در انتظار': 'pending',
    'درحال انجام': 'in_progress',
    'متوقف شده': 'cancelled',
    'رد شده': 'rejected',
    'تکمیل شده': 'completed',
    'تایید شده': 'approved',
    'نیاز به اصلاح': 'needs_correction',
    'لغو شده': 'cancelled',
  };

  const statusMapById: Record<number, Task['status']> = {
    37: 'pending',
    38: 'in_progress',
    39: 'completed',
    40: 'approved',
    41: 'needs_correction',
    42: 'rejected',
    43: 'cancelled',
  };

  const normalizedStatus: Task['status'] =
    (statusId !== undefined && statusMapById[statusId]) ||
    statusMapByName[statusName] ||
    'pending';

  // Map ref_type to a human-readable process label (Persian, as used in UI mock)
  const processLabelByRefType: Record<number, string> = {
    1: 'پروفایل',
    2: 'درخواست کمک',
  };

  const createdAt: string = apiTask?.created_at || '';
  // Display date as-is (ISO) or trim; UI expects a string
  const date = createdAt ? createdAt.substring(0, 10) : '';

  return {
    id: String(apiTask?.task_id ?? ''),
    taskName: apiTask?.task_title || '',
    process:
      (apiTask?.ref_type != null && processLabelByRefType[apiTask.ref_type]) ||
      'درخواست همکاری',
    date,
    status: normalizedStatus,
    operation: { type: 'perform', label: 'انجام عملیات' },
    performerPersonnel: [
      { id: '1', name: 'احمد محمدی' },
      { id: '2', name: 'علی رضایی' },
      { id: '3', name: 'حسن کریمی' },
      { id: '4', name: 'محمد احمدی' },
    ],
  };
};

/**
 * Fetch all tasks for the current user
 */
export const fetchMyTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/my_list/?limit=10&offset=0`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (!response.ok) {
      return []
    }

    const result = await response.json();
    const apiTasks: ApiTask[] = result?.tasks || [];
    return apiTasks.map(mapApiTaskToTask);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch tasks');
  }
};

/**
 * Fetch unassigned tasks
 */
export const fetchUnassignedTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/unassigned/?limit=10&offset=0`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return []
    }

    const result = await response.json();
    const apiTasks: ApiTask[] = result?.tasks || [];
    return apiTasks.map(mapApiTaskToTask);
  } catch (error) {
    console.error('Error fetching unassigned tasks:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch unassigned tasks');
  }
};

/**
 * Fetch stopped tasks
 */
export const fetchStoppedTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/stopped/?limit=10&offset=0`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return []
    }

    const result = await response.json();
    const apiTasks: ApiTask[] = result?.tasks || [];
    return apiTasks.map(mapApiTaskToTask);
  } catch (error) {
    console.error('Error fetching stopped tasks:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch stopped tasks');
  }
};

/**
 * Fetch tasks by status ID
 */
export const fetchTasksByStatus = async (statusId: number): Promise<Task[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/list/?status=${statusId}&limit=100&offset=0`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const result = await response.json();
    const apiTasks: ApiTask[] = result?.tasks || [];
    return apiTasks.map(mapApiTaskToTask);
  } catch (error) {
    console.error(`Error fetching tasks with status ${statusId}:`, error);
    throw error instanceof Error ? error : new Error(`Failed to fetch tasks with status ${statusId}`);
  }
};

/**
 * Fetch in-progress tasks (status 38)
 */
export const fetchInProgressTasks = async (): Promise<Task[]> => {
  return fetchTasksByStatus(38);
};

/**
 * Fetch completed tasks (status 39)
 */
export const fetchCompletedTasks = async (): Promise<Task[]> => {
  return fetchTasksByStatus(39);
};

/**
 * Fetch approved tasks (status 40)
 */
export const fetchApprovedTasks = async (): Promise<Task[]> => {
  return fetchTasksByStatus(40);
};

/**
 * Fetch needs correction tasks (status 41)
 */
export const fetchNeedsCorrectionTasks = async (): Promise<Task[]> => {
  return fetchTasksByStatus(41);
};

/**
 * Fetch rejected tasks (status 42)
 */
export const fetchRejectedTasks = async (): Promise<Task[]> => {
  return fetchTasksByStatus(42);
};

/**
 * Fetch cancelled tasks (status 43)
 */
export const fetchCancelledTasks = async (): Promise<Task[]> => {
  return fetchTasksByStatus(43);
};

/**
 * Fetch tasks waiting for me (pending tasks assigned to current user - status 37)
 */
export const fetchWaitingForMeTasks = async (): Promise<Task[]> => {
  return fetchTasksByStatus(37);
};

/**
 * Fetch shared to-do tasks (pending tasks for collaboration)
 */
export const fetchToDoListTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/shared_pending/?limit=10&offset=0`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return []
    }

    const result = await response.json();
    const apiTasks: ApiTask[] = result?.tasks || [];
    return apiTasks.map(mapApiTaskToTask);
  } catch (error) {
    console.error('Error fetching to-do list tasks:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch to-do list tasks');
  }
};

/**
 * Fetch a single task by ID
 */
export const fetchTaskById = async (id: string | number): Promise<Task> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return {} as Task
    }

    const apiTask = await response.json();
    return mapApiTaskToTask(apiTask);
  } catch (error) {
    console.error('Error fetching task:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch task');
  }
};

/**
 * Create a new task
 */
export const createTask = async (taskData: Partial<Task>): Promise<Task> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      }
    );

    if (!response.ok) {
      return {} as Task
    }

    const apiTask = await response.json();
    return mapApiTaskToTask(apiTask);
  } catch (error) {
    console.error('Error creating task:', error);
    throw error instanceof Error ? error : new Error('Failed to create task');
  }
};

/**
 * Update an existing task
 */
export const updateTask = async (id: string | number, taskData: Partial<Task>): Promise<Task> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      }
    );

    if (!response.ok) {
      return {} as Task
    }

    const apiTask = await response.json();
    return mapApiTaskToTask(apiTask);
  } catch (error) {
    console.error('Error updating task:', error);
    throw error instanceof Error ? error : new Error('Failed to update task');
  }
};

/**
 * Delete a task
 */
export const deleteTask = async (id: string | number): Promise<void> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error instanceof Error ? error : new Error('Failed to delete task');
  }
};

