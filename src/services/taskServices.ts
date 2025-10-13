import { TaskInterface } from '@/interface';

// The backend returns TaskInterface directly, no need for transformation
// We'll use the data as-is from the backend

/**
 * Fetch all tasks for the current user
 */
export const fetchMyTasks = async (): Promise<TaskInterface[]> => {
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
    const tasks: TaskInterface[] = result?.tasks || [];
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch tasks');
  }
};

/**
 * Fetch unassigned tasks
 */
export const fetchUnassignedTasks = async (): Promise<TaskInterface[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/all_tasks/?has_assignment=false&limit=10&offset=0`,
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
    const tasks: TaskInterface[] = result?.tasks || [];
    return tasks;
  } catch (error) {
    console.log('Error fetching unassigned tasks:', error);
    return []
  }
};



/**
 * Fetch tasks by status ID
 */
export const fetchTasksByStatus = async (statusId: number): Promise<TaskInterface[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/my_list/?status=${statusId}&limit=100&offset=0`,
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
    const tasks: TaskInterface[] = result?.tasks || [];
    return tasks;
  } catch (error) {
    console.error(`Error fetching tasks with status ${statusId}:`, error);
    throw error instanceof Error ? error : new Error(`Failed to fetch tasks with status ${statusId}`);
  }
};

/**
 * Fetch in-progress tasks (status 38)
 */
export const fetchInProgressTasks = async (): Promise<TaskInterface[]> => {
  return fetchTasksByStatus(38);
};

export const fetchStoppedTasks = async (): Promise<TaskInterface[]> => {
  return fetchTasksByStatus(45);
};

/**
 * Fetch completed tasks (status 39)
 */
export const fetchCompletedTasks = async (): Promise<TaskInterface[]> => {
  return fetchTasksByStatus(39);
};

/**
 * Fetch approved tasks (status 40)
 */
export const fetchApprovedTasks = async (): Promise<TaskInterface[]> => {
  return fetchTasksByStatus(40);
};

/**
 * Fetch needs correction tasks (status 41)
 */
export const fetchNeedsCorrectionTasks = async (): Promise<TaskInterface[]> => {
  return fetchTasksByStatus(41);
};

/**
 * Fetch rejected tasks (status 42)
 */
export const fetchRejectedTasks = async (): Promise<TaskInterface[]> => {
  return fetchTasksByStatus(44);
};

/**
 * Fetch cancelled tasks (status 43)
 */
export const fetchCancelledTasks = async (): Promise<TaskInterface[]> => {
  return fetchTasksByStatus(43);
};

/**
 * Fetch tasks waiting for me (pending tasks assigned to current user - status 37)
 */
export const fetchWaitingForMeTasks = async (): Promise<TaskInterface[]> => {
  return fetchTasksByStatus(37);
};

/**
 * Fetch shared to-do tasks (pending tasks for collaboration)
 */
export const fetchToDoListTasks = async (): Promise<TaskInterface[]> => {
  return fetchTasksByStatus(37);
};

/**
 * Fetch a single task by ID
 */
export const fetchTaskById = async (id: string | number): Promise<TaskInterface> => {
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
      return {} as TaskInterface
    }

    const task = await response.json();
    return task;
  } catch (error) {
    console.error('Error fetching task:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch task');
  }
};

/**
 * Create a new task
 */
export const createTask = async (taskData: Partial<TaskInterface>): Promise<TaskInterface> => {
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
      return {} as TaskInterface
    }

    const task = await response.json();
    return task;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error instanceof Error ? error : new Error('Failed to create task');
  }
};

/**
 * Update an existing task
 */
export const updateTask = async (id: string | number, taskData: Partial<TaskInterface>): Promise<TaskInterface> => {
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
      return {} as TaskInterface
    }

    const task = await response.json();
    return task;
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

