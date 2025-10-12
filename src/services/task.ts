/**
 * @deprecated This file is deprecated. Please use taskServices.ts instead.
 * This file is kept for backward compatibility.
 */

// Re-export from the new taskServices file
export {
  fetchMyTasks as getTasks,
  fetchTaskById as getTask,
  createTask,
  updateTask,
  deleteTask,
  fetchUnassignedTasks,
  fetchStoppedTasks,
} from './taskServices';
