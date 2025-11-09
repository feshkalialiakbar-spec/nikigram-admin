import {
  DocumentPayload,
  FileUploadField,
} from './types';

const BASE_VERSION = '1.0';
const DEFAULT_STATUS_ID = 0;

export const createEmptyFileField = (id: string): FileUploadField => ({
  id,
  documentName: '',
  documentType: '',
  fileUid: '',
  version: BASE_VERSION,
  statusId: DEFAULT_STATUS_ID,
  uploadedFile: null,
});

export const generateFieldId = (): string => {
  const randomPart = Math.random().toString(16).slice(2, 8);
  return `field-${Date.now()}-${randomPart}`;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const getFileExtension = (fileName: string): string =>
  fileName.split('.').pop()?.toUpperCase() || 'FILE';

export const fieldsWithFiles = (fields: FileUploadField[]): FileUploadField[] =>
  fields.filter((field) => Boolean(field.uploadedFile));

export const buildDocumentPayloads = (
  fields: FileUploadField[],
): DocumentPayload[] =>
  fieldsWithFiles(fields)
    .filter((field) => field.fileUid)
    .map((field) => ({
      document_name: field.documentName.trim(),
      document_type:
        field.documentType || getFileExtension(field.uploadedFile!.name),
      file_uid: field.fileUid,
      version: field.version,
      status_id: field.statusId,
    }));

export const fieldHasMissingName = (field: FileUploadField): boolean =>
  Boolean(field.uploadedFile) &&
  (!field.documentName || field.documentName.trim() === '');

export const findFieldsMissingNames = (
  fields: FileUploadField[],
): string[] =>
  fieldsWithFiles(fields)
    .filter(fieldHasMissingName)
    .map((field) => field.id);

export const findFieldsMissingFileUid = (
  fields: FileUploadField[],
): string[] =>
  fieldsWithFiles(fields)
    .filter((field) => !field.fileUid || field.fileUid.trim() === '')
    .map((field) => field.id);

