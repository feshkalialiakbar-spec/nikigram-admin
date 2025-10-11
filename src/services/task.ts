import { Task } from '@/components/tasks/types'

// Normalize backend task object to UI Task type
const mapApiTaskToTask = (apiTask: any): Task => {
  const statusName: string = apiTask?.status_name || ''
  const statusId: number | undefined = apiTask?.status_id

  // Map various backend statuses to UI statuses
  const statusMapByName: Record<string, Task['status']> = {
    'در انتظار': 'pending',
    'درحال انجام': 'pending',
    'متوقف شده': 'stopped',
    'رد شده': 'rejected',
    'تکمیل شده': 'completed',
    'تایید شده': 'completed',
  }

  const statusMapById: Record<number, Task['status']> = {
    37: 'pending',
    39: 'completed',
    40: 'completed',
    43: 'rejected',
  }

  const normalizedStatus: Task['status'] =
    (statusId !== undefined && statusMapById[statusId]) ||
    statusMapByName[statusName] ||
    'pending'

  // Map ref_type to a human-readable process label (Persian, as used in UI mock)
  const processLabelByRefType: Record<number, string> = {
    1: 'پروفایل',
    2: 'درخواست کمک',
  }

  const createdAt: string = apiTask?.created_at || ''
  // Display date as-is (ISO) or trim; UI expects a string
  const date = createdAt ? createdAt.substring(0, 10) : ''

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
  }
}

export const getTasks = async (): Promise<Task[]> => {
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
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    const apiTasks: any[] = result?.tasks || []
    return apiTasks.map(mapApiTaskToTask)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    throw error instanceof Error ? error : new Error('Failed to fetch tasks')
  }
}

export const getTask = async (id: number) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`)
  return response.json()
}

// export const createTask = async (task: TaskInterface) => {
