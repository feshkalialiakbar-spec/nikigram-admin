export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  uploadDate: string;
  fileUid?: string;
}

export interface DocumentPayload {
  document_name: string;
  document_type: string;
  file_uid: string;
  version: string;
  status_id: number;
}

export interface FileUploadField {
  id: string;
  documentName: string;
  documentType: string;
  fileUid: string;
  version: string;
  statusId: number;
  uploadedFile: UploadedFile | null;
}

export interface DocumentSubmissionForm {
  description: string;
  documents: DocumentPayload[];
}

export type ValidationErrors = Record<string, boolean>;

export type ApprovalPhaseStatus = 'pending' | 'inProgress' | 'completed' | 'blocked';

export type ApprovalWorkflowStage = 'review' | 'documents' | 'template' | 'completed';

export interface ApprovalPhaseState {
  phaseId: number;
  status: ApprovalPhaseStatus;
}

export interface ApprovalWorkflowState {
  currentStage: ApprovalWorkflowStage;
  phases: ApprovalPhaseState[];
}

