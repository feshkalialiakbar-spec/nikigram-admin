import { getoken } from '@/actions/cookieToken';
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

export interface TaskServiceResult<T> {
  success: boolean;
  data?: T;
  message?: string;
  status?: number;
  error?: unknown;
}

export const TASK_DEFAULT_LIMIT = 15;

const createFallbackPagination = (
  params?: PaginationParams
): PaginatedResponse<TaskInterface> => ({
  tasks: [],
  total: 0,
  limit: params?.limit ?? TASK_DEFAULT_LIMIT,
  offset: params?.offset ?? 0,
});

const parseErrorMessage = (payload: unknown, fallback: string) => {
  if (payload && typeof payload === 'object') {
    const detail = (payload as { detail?: string }).detail;
    const message = (payload as { message?: string }).message;
    return detail || message || fallback;
  }
  return fallback;
};

const getAuthorizationHeaders = async () => {
  const accessToken = await getoken('TASK_SERVICE_AUTH_HEADERS');

  if (!accessToken) {
    throw new Error('توکن دسترسی یافت نشد.');
  }

  return {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  } as HeadersInit;
};

const fetchJsonSafely = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export const fetchMyTasks = async (
  params?: PaginationParams
): Promise<TaskServiceResult<PaginatedResponse<TaskInterface>>> => {
  const limit = params?.limit ?? TASK_DEFAULT_LIMIT;
  const offset = params?.offset ?? 0;
  const fallbackData = createFallbackPagination({ limit, offset });
   try {
    const headers = await getAuthorizationHeaders();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/my_list/?limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers,
      }
    );

    const payload = await fetchJsonSafely(response);

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        message: parseErrorMessage(payload, 'خطا در دریافت لیست تسک‌ها'),
        data: fallbackData,
      };
    }

    return {
      success: true,
      data: {
        tasks: payload?.tasks ?? [],
        total: (payload?.total_count ?? payload?.total) ?? 0,
        limit,
        offset,
      },
    };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return {
      success: false,
      message: 'خطا در ارتباط با سرور',
      error,
      data: fallbackData,
    };
  }
};

export const fetchUnassignedTasks = async (
  params?: PaginationParams
): Promise<TaskServiceResult<PaginatedResponse<TaskInterface>>> => {
  const limit = params?.limit ?? TASK_DEFAULT_LIMIT;
  const offset = params?.offset ?? 0;
  const fallbackData = createFallbackPagination({ limit, offset });

  try {
    const headers = await getAuthorizationHeaders();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/all_tasks/?has_assignment=false&limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers,
      }
    );
    const payload = await fetchJsonSafely(response);

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        message: parseErrorMessage(payload, 'خطا در دریافت تسک‌های بدون مسئول'),
        data: fallbackData,
      };
    }

    return {
      success: true,
      data: {
        tasks: payload?.tasks ?? [],
        total: (payload?.total_count ?? payload?.total) ?? 0,
        limit,
        offset,
      },
    };
  } catch (error) {
    console.error('Error fetching unassigned tasks:', error);
    return {
      success: false,
      message: 'خطا در ارتباط با سرور',
      error,
      data: fallbackData,
    };
  }
};
export const fetchTickets = async (
  params?: PaginationParams
): Promise<TaskServiceResult<PaginatedResponse<TaskInterface>>> => {
  const limit = params?.limit ?? TASK_DEFAULT_LIMIT;
  const offset = params?.offset ?? 0;
  const fallbackData = createFallbackPagination({ limit, offset });

  try {
    const headers = await getAuthorizationHeaders();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/all_tasks/?ref_type=6&limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers,
      }
    );
    const payload = await fetchJsonSafely(response);

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        message: parseErrorMessage(payload, 'خطا در دریافت تسک‌های بدون مسئول'),
        data: fallbackData,
      };
    }

    return {
      success: true,
      data: {
        tasks: payload?.tasks ?? [],
        total: (payload?.total_count ?? payload?.total) ?? 0,
        limit,
        offset,
      },
    };
  } catch (error) {
    console.error('Error fetching unassigned tasks:', error);
    return {
      success: false,
      message: 'خطا در ارتباط با سرور',
      error,
      data: fallbackData,
    };
  }
};
export const fetchTasksByStatus = async (
  statusId: number,
  params?: PaginationParams
): Promise<TaskServiceResult<PaginatedResponse<TaskInterface>>> => {
  const limit = params?.limit ?? TASK_DEFAULT_LIMIT;
  const offset = params?.offset ?? 0;
  const fallbackData = createFallbackPagination({ limit, offset });

  try {
    console.log('statusId', statusId);
    console.log('limit', limit);
    console.log('offset', offset);
    console.log('process.env.NEXT_PUBLIC_API_URL', process.env.NEXT_PUBLIC_API_URL);
    console.log('headers', 'as;kklgdihlsdkeirghbiwerghi uds fvnskdfghb7ertghnee lrty295t wne vbgnw56trq83 bfxqmsdvf v6 SZRDFGB 9AHXCVUXBVZ Isf HBLSZY');
    const headers = await getAuthorizationHeaders();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/my_list/?status_id=${statusId}&limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers,
      }
    );
    const payload = await fetchJsonSafely(response);

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        message: parseErrorMessage(payload, 'خطا در دریافت لیست تسک‌ها بر اساس وضعیت'),
        data: fallbackData,
      };
    }

    return {
      success: true,
      data: {
        tasks: payload?.tasks ?? [],
        total: (payload?.total_count ?? payload?.total) ?? 0,
        limit,
        offset,
      },
    };
  } catch (error) {
    console.error(`Error fetching tasks with status ${statusId}:`, error);
    return {
      success: false,
      message: 'خطا در ارتباط با سرور',
      error,
      data: fallbackData,
    };
  }
};

export const fetchInProgressTasks = async (
  params?: PaginationParams
) => fetchTasksByStatus(38, params);

export const fetchStoppedTasks = async (
  params?: PaginationParams
) => fetchTasksByStatus(45, params);

export const fetchCompletedTasks = async (
  params?: PaginationParams
) => fetchTasksByStatus(39, params);

export const fetchApprovedTasks = async (
  params?: PaginationParams
) => fetchTasksByStatus(40, params);

export const fetchNeedsCorrectionTasks = async (
  params?: PaginationParams
) => fetchTasksByStatus(41, params);

export const fetchRejectedTasks = async (
  params?: PaginationParams
) => fetchTasksByStatus(44, params);

export const fetchCancelledTasks = async (
  params?: PaginationParams
) => fetchTasksByStatus(43, params);

export const fetchWaitingForMeTasks = async (
  params?: PaginationParams
) => fetchTasksByStatus(37, params);

export const fetchSharedPoolTasks = async (
  params?: PaginationParams
): Promise<TaskServiceResult<PaginatedResponse<TaskInterface>>> => {
  const limit = params?.limit ?? TASK_DEFAULT_LIMIT;
  const offset = params?.offset ?? 0;
  const fallbackData = createFallbackPagination({ limit, offset });

  try {
    const headers = await getAuthorizationHeaders();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/shared-pool/tasks/?has_assignment=false&limit=${limit}&offset=${offset}&task_status_id=37`,
      {
        method: 'GET',
        headers,
      }
    );
    const payload = await fetchJsonSafely(response);

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        message: parseErrorMessage(payload, 'خطا در دریافت تسک‌های استخر مشترک'),
        data: fallbackData,
      };
    }

    return {
      success: true,
      data: {
        tasks: payload?.tasks ?? [],
        total: (payload?.total_count ?? payload?.total) ?? 0,
        limit,
        offset,
      },
    };
  } catch (error) {
    console.error('Error fetching shared pool tasks:', error);
    return {
      success: false,
      message: 'خطا در ارتباط با سرور',
      error,
      data: fallbackData,
    };
  }
};

export interface AssignSharedPoolTaskPayload {
  task_id: number;
  is_exclusive: boolean;
  exclusive_until?: string | null;
}

export const assignSharedPoolTasks = async (
  payload: AssignSharedPoolTaskPayload[]
): Promise<TaskServiceResult<unknown>> => {
  try {
    const headers = await getAuthorizationHeaders();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/shared-pool/tasks/assign`,
      {
        method: 'POST',
        headers: {
          ...headers,
          accept: 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const payloadResponse = await fetchJsonSafely(response);

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        message: parseErrorMessage(payloadResponse, 'خطا در اختصاص تسک'),
        error: payloadResponse,
      };
    }

    return {
      success: true,
      data: payloadResponse,
    };
  } catch (error) {
    console.error('Error assigning shared pool task:', error);
    return {
      success: false,
      message: 'خطا در ارتباط با سرور',
      error,
    };
  }
};

export const fetchTaskById = async (
  id: string | number
): Promise<TaskServiceResult<TaskInterface>> => {
  try {
    const headers = await getAuthorizationHeaders();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/detail/${id}/`,
      {
        method: 'GET',
        headers,
      }
    );

    const payload = await fetchJsonSafely(response);

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        message: parseErrorMessage(payload, 'خطا در دریافت اطلاعات تسک'),
      };
    }

    return {
      success: true,
      data: payload ?? ({} as TaskInterface),
    };
  } catch (error) {
    console.error('Error fetching task:', error);
    return {
      success: false,
      message: 'خطا در ارتباط با سرور',
      error,
    };
  }
};

export const createTask = async (
  taskData: Partial<TaskInterface>
): Promise<TaskServiceResult<TaskInterface>> => {
  try {
    const headers = await getAuthorizationHeaders();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/create`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(taskData),
      }
    );

    const payload = await fetchJsonSafely(response);

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        message: parseErrorMessage(payload, 'خطا در ایجاد تسک'),
        error: payload,
      };
    }

    return {
      success: true,
      data: payload as TaskInterface,
    };
  } catch (error) {
    console.error('Error creating task:', error);
    return {
      success: false,
      message: 'خطا در ارتباط با سرور',
      error,
    };
  }
};

export const updateTask = async (
  id: string | number,
  taskData: Partial<TaskInterface>
): Promise<TaskServiceResult<TaskInterface>> => {
  try {
    const headers = await getAuthorizationHeaders();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/${id}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(taskData),
      }
    );

    const payload = await fetchJsonSafely(response);

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        message: parseErrorMessage(payload, 'خطا در ویرایش تسک'),
        error: payload,
      };
    }

    return {
      success: true,
      data: payload as TaskInterface,
    };
  } catch (error) {
    console.error('Error updating task:', error);
    return {
      success: false,
      message: 'خطا در ارتباط با سرور',
      error,
    };
  }
};

export const deleteTask = async (
  id: string | number
): Promise<TaskServiceResult<null>> => {
  try {
    const headers = await getAuthorizationHeaders();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/${id}`,
      {
        method: 'DELETE',
        headers,
      }
    );

    if (!response.ok) {
      const payload = await fetchJsonSafely(response);
      return {
        success: false,
        status: response.status,
        message: parseErrorMessage(payload, 'خطا در حذف تسک'),
        error: payload,
      };
    }

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    console.error('Error deleting task:', error);
    return {
      success: false,
      message: 'خطا در ارتباط با سرور',
      error,
    };
  }
};

export const fetchTaskDetailsByRefType = async (
  refType: number,
  refId: number
): Promise<TaskServiceResult<unknown>> => {
  try {
    let endpoint = '';

    switch (refType) {
      case 1:
        endpoint = `/api/admin/task/profile/change_request/${refId}/`;
        break;
      case 2:
        endpoint = `/api/admin/task/project/request/${refId}/`;
        break;
      case 3:
        endpoint = `/api/admin/task/project/tasks/${refId}/`;
        break;
      case 4:
        endpoint = `/api/admin/task/project/template/${refId}/`;
        break;
      default:
        return {
          success: false,
          message: `Unsupported ref_type: ${refType}`,
        };
    }

    const baseUrl =
      refType === 1 || refType === 4 ? '' : process.env.NEXT_PUBLIC_API_URL ?? '';

    const headers = await getAuthorizationHeaders();
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'GET',
      headers,
    });

    const payload = await fetchJsonSafely(response);

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        message: parseErrorMessage(payload, 'خطا در دریافت جزییات تسک'),
        error: payload,
      };
    }

    return {
      success: true,
      data: payload,
    };
  } catch (error) {
    console.error('Error fetching task details:', error);
    return {
      success: false,
      message: 'خطا در ارتباط با سرور',
      error,
    };
  }
};
