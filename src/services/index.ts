/**
 * Services Index - Central export for all API services
 */

export {
  fetchMyTasks,
  fetchUnassignedTasks,
  fetchStoppedTasks,
  fetchTaskById,
  createTask,
  updateTask,
  deleteTask,
} from './task/taskServices';

// Re-export deprecated task service for backward compatibility
export * from './task';

export {
  fetchProjectTemplateList,
  createProjectTemplateRequest,
  verifyProjectRequest,
  fetchProjectTemplateDetail,
} from './projectTemplate';

export { submitHelpRequestDocuments } from './helpRequest';

export {
  fetchTaskDetail,
  verifyProfileChangeRequest,
  verifyHelpRequest,
  approveTemplateRequest,
  approveCooperationRequest,
  approveTicketRequest,
} from './taskDetailServices';

export {
  downloadFileBlob,
  proxyDownloadFile,
  uploadFile,
} from './file';

export { fetchStaffList } from './staff';

