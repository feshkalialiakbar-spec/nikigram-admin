'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { fetchTaskById } from '@/services/task/taskServices';
import { getTaskDetailUrl } from '@/utils/taskRouting';

/**
 * Hook for navigating to task details
 * Fetches task info and redirects to appropriate page based on ref_type
 */
export const useTaskNavigation = () => {
  const router = useRouter();

  const navigateToTask = useCallback(
    async (taskId: number | string) => {
      try {
        // Fetch task info to get ref_type
        const taskInfoResult = await fetchTaskById(taskId);
        if (!taskInfoResult.success || !taskInfoResult.data) {
          console.error('Invalid task info:', taskInfoResult.message || taskInfoResult.error);
          return;
        }

        const taskInfo = taskInfoResult.data;

        if (!taskInfo.ref_type || !taskInfo.task_id) {
          console.error('Invalid task info:', taskInfo);
          return;
        }

        // Build the URL based on ref_type
        const url = getTaskDetailUrl(taskInfo.task_id, taskInfo.ref_type);

        // Navigate to the task detail page
        router.push(url);
      } catch (error) {
        console.error('Error navigating to task:', error);
      }
    },
    [router]
  );

  return { navigateToTask };
};


