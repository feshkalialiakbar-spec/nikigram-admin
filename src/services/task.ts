// Re-export TaskInterface type for convenience
export type { TaskInterface } from '@/interface';

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
  fetchWaitingForMeTasks,
  fetchToDoListTasks,
  fetchTasksByStatus,
  fetchTaskDetailsByRefType,
} from './taskServices';
