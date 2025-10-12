// Re-export Task type for convenience
export type { Task } from '@/components/tasks/types';

// Re-export from the new taskServices file
export {
  fetchMyTasks as getTasks,
  fetchTaskById as getTask,
  createTask,
  updateTask,
  deleteTask,
  fetchUnassignedTasks,
  fetchStoppedTasks,
  fetchInProgressTasks,
  fetchCompletedTasks,
  fetchApprovedTasks,
  fetchNeedsCorrectionTasks,
  fetchRejectedTasks,
  fetchCancelledTasks,
  fetchTasksByStatus,
} from './taskServices';
