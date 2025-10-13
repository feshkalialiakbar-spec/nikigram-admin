import { TaskInterface } from '@/interface';

export interface PaginatedResponse<T> {
  tasks: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

const DEFAULT_LIMIT = 15;

export const fetchMyTasks = async (params?: PaginationParams): Promise<PaginatedResponse<TaskInterface>> => {
  try {
    const limit = params?.limit ?? DEFAULT_LIMIT;
    const offset = params?.offset ?? 0;
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/my_list/?limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (!response.ok) {
      return {
        tasks: [],
        total: 0,
        limit,
        offset,
      };
    }

    const result = await response.json();
    return {
      tasks: result?.tasks || [],
      total: (result?.total_count ?? result?.total) || 0,
      limit,
      offset,
    };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch tasks');
  }
};

/**
 * Fetch unassigned tasks
 */
export const fetchUnassignedTasks = async (params?: PaginationParams): Promise<PaginatedResponse<TaskInterface>> => {
  try {
    const limit = params?.limit ?? DEFAULT_LIMIT;
    const offset = params?.offset ?? 0;
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/all_tasks/?has_assignment=false&limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return {
        tasks: [],
        total: 0,
        limit,
        offset,
      };
    }

    const result = await response.json();
    return {
      tasks: result?.tasks || [],
      total: (result?.total_count ?? result?.total) || 0,
      limit,
      offset,
    };
  } catch (error) {
    console.log('Error fetching unassigned tasks:', error);
    return {
      tasks: [],
      total: 0,
      limit: params?.limit ?? DEFAULT_LIMIT,
      offset: params?.offset ?? 0,
    };
  }
};



/**
 * Fetch tasks by status ID
 */
export const fetchTasksByStatus = async (statusId: number, params?: PaginationParams): Promise<PaginatedResponse<TaskInterface>> => {
  try {
    const limit = params?.limit ?? DEFAULT_LIMIT;
    const offset = params?.offset ?? 0;
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/my_list/?status_id=${statusId}&limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return {
        tasks: [],
        total: 0,
        limit,
        offset,
      };
    }

    const result = await response.json();
    return {
      tasks: result?.tasks || [],
      total: (result?.total_count ?? result?.total) || 0,
      limit,
      offset,
    };
  } catch (error) {
    console.error(`Error fetching tasks with status ${statusId}:`, error);
    throw error instanceof Error ? error : new Error(`Failed to fetch tasks with status ${statusId}`);
  }
};

/**
 * Fetch in-progress tasks (status 38)
 */
export const fetchInProgressTasks = async (params?: PaginationParams): Promise<PaginatedResponse<TaskInterface>> => {
  return fetchTasksByStatus(38, params);
};

export const fetchStoppedTasks = async (params?: PaginationParams): Promise<PaginatedResponse<TaskInterface>> => {
  return fetchTasksByStatus(45, params);
};

/**
 * Fetch completed tasks (status 39)
 */
export const fetchCompletedTasks = async (params?: PaginationParams): Promise<PaginatedResponse<TaskInterface>> => {
  return fetchTasksByStatus(39, params);
};

/**
 * Fetch approved tasks (status 40)
 */
export const fetchApprovedTasks = async (params?: PaginationParams): Promise<PaginatedResponse<TaskInterface>> => {
  return fetchTasksByStatus(40, params);
};

/**
 * Fetch needs correction tasks (status 41)
 */
export const fetchNeedsCorrectionTasks = async (params?: PaginationParams): Promise<PaginatedResponse<TaskInterface>> => {
  return fetchTasksByStatus(41, params);
};

/**
 * Fetch rejected tasks (status 42)
 */
export const fetchRejectedTasks = async (params?: PaginationParams): Promise<PaginatedResponse<TaskInterface>> => {
  return fetchTasksByStatus(44, params);
};

/**
 * Fetch cancelled tasks (status 43)
 */
export const fetchCancelledTasks = async (params?: PaginationParams): Promise<PaginatedResponse<TaskInterface>> => {
  return fetchTasksByStatus(43, params);
};

/**
 * Fetch tasks waiting for me (pending tasks assigned to current user - status 37)
 */
export const fetchWaitingForMeTasks = async (params?: PaginationParams): Promise<PaginatedResponse<TaskInterface>> => {
  return fetchTasksByStatus(37, params);
};

/**
 * Fetch shared to-do tasks (pending tasks for collaboration)
 */
export const fetchToDoListTasks = async (params?: PaginationParams): Promise<PaginatedResponse<TaskInterface>> => {
  return fetchTasksByStatus(37, params);
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

