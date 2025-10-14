import { TASK_TYPES } from '@/components/tasks/types';

/**
 * Map ref_type to pathname segment
 */
export const getTaskTypePathname = (refType: number): string => {
  const pathMap: Record<number, string> = {
    [TASK_TYPES.REF_TYPE_PARTY_CHANGE_REQUEST]: 'profile',
    [TASK_TYPES.REF_TYPE_PROJECT_REQUEST]: 'projectRequest',
    [TASK_TYPES.REF_TYPE_PROJECT_TASKS]: 'projectTasks',
    [TASK_TYPES.REF_TYPE_REQUEST_PROJECT_TEMPLATE]: 'template',
  };

  return pathMap[refType] || 'unknown';
};

/**
 * Get full task detail URL
 */
export const getTaskDetailUrl = (taskId: number | string, refType: number): string => {
  const pathname = getTaskTypePathname(refType);
  return `/dashboard/tasks/${pathname}/${taskId}`;
};

