import { usePathname } from 'next/navigation';

/**
 * Get the dashboard route prefix based on current pathname
 */
export const getDashboardRoutePrefix = (pathname: string): string => {
  if (pathname.includes('/my-tasks')) {
    return '/dashboard/my-tasks';
  }
  if (pathname.includes('/tasks-completed')) {
    return '/dashboard/tasks-completed';
  }
  if (pathname.includes('/tasks-in-progress')) {
    return '/dashboard/tasks-in-progress';
  }
  if (pathname.includes('/tasks-unassigned')) {
    return '/dashboard/tasks-unassigned';
  }
  if (pathname.includes('/tasks-stopped')) {
    return '/dashboard/tasks-stopped';
  }
  if (pathname.includes('/tasks-waiting-for-me')) {
    return '/dashboard/tasks-waiting-for-me';
  }
  if (pathname.includes('/to-do-list')) {
    return '/dashboard/to-do-list';
  }
  
  // Default fallback
  return '/dashboard/tasks';
};

/**
 * Get task detail route based on current dashboard context
 */
export const getTaskDetailRoute = (pathname: string, taskId: string): string => {
  const prefix = getDashboardRoutePrefix(pathname);
  return `${prefix}/${taskId}`;
};
