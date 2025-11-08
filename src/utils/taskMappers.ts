import {
  ApiProfileChangeRequestResponse,
  ProfileChangeRequest,
  ProfileDocument,
  RealProfile,
  LegalProfile,
  ApiHelpRequestResponse,
  HelpRequestDetails,
  HelpRequestDocument,
  HelpRequestUser,
  ApiCooperationRequestResponse,
  CooperationRequestDetails,
  ApiTemplateRequestResponse,
  TemplateRequestDetails,
} from '@/components/tasks/types';
import { buildDocDownloadUrl } from '@/utils/docUrl';

const DOWNLOAD_FALLBACK_BASE = 'https://nikicity.com/api/sys/files/download';

const ensureArray = <T>(value?: T[] | null): T[] => (Array.isArray(value) ? value : []);

const safeBuildDocDownloadUrl = (value?: string | null): string | undefined => {
  if (!value) return undefined;
  try {
    const resolved = buildDocDownloadUrl(value);
    if (resolved) {
      return resolved;
    }
  } catch (error) {
    console.warn('[taskMappers] buildDocDownloadUrl failed, fallback in use', {
      value,
      error,
    });
  }
  const sanitized = String(value).replace(/^\/+/, '');
  return `${DOWNLOAD_FALLBACK_BASE}/${sanitized}`;
};

/**
 * Convert education degree code to Persian label
 */
// Removed unused function

/**
 * Convert gender code to Persian label
 */
const getGenderLabel = (gender: number): string => {
  return gender === 1 ? 'مرد' : gender === 2 ? 'زن' : 'نامشخص';
};

/**
 * Format date from ISO string to Persian date
 */
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    // You can use a Persian date library here if needed
    // For now, return a simple format
    return new Intl.DateTimeFormat('fa-IR').format(date);
  } catch {
    return dateString;
  }
};

/**
 * Convert file size from bytes to human readable format
 */
const formatFileSize = (bytes: number | null | undefined): string => {
  if (!Number.isFinite(bytes)) return '—';
  if (!bytes) return '۰ بایت';
  const k = 1024;
  const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Get file extension from filename
 */
const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};

/**
 * Map party documents to ProfileDocument format
 */
const mapPartyDocsToProfileDocuments = (
  docs?: ApiProfileChangeRequestResponse['party_docs_data'] | null
): ProfileDocument[] => {
  return ensureArray(docs).map((doc, index) => ({
    document_id: doc.document_id,
    document_type: doc.document_type,
    file_uid: doc.file_uid,
    upload_date: doc.upload_date,
    is_verified: doc.is_verified,
    status_id: doc.status_id,
    version: doc.version,
    file_extension: doc.file_extension,
    file_size: doc.file_size,
    id: doc.document_id.toString(),
    filename: `مدرک ${index + 1}`,
    fileType: (doc.file_extension?.toLowerCase() === 'jpg' ? 'jpg' : 'pdf'),
    uploadDate: formatDate(doc.upload_date),
    fileSize: formatFileSize(doc.file_size),
    url: safeBuildDocDownloadUrl(doc.file_uid),
  }));
};

/**
 * Map profile change request API response to ProfileChangeRequest component props
 */
export const mapProfileChangeRequestToComponent = (
  apiResponse: ApiProfileChangeRequestResponse
): ProfileChangeRequest => {
  console.log('Mapping profile change request:', apiResponse);

  const { task_details, party_request_details, party_docs_data, changed_fields } = apiResponse;

  if (!task_details || !party_request_details) {
    console.warn('[taskMappers] profile change mapper received incomplete payload', {
      hasTask: Boolean(task_details),
      hasPartyDetails: Boolean(party_request_details),
    });
    return {
      id: task_details?.task_id?.toString() || 'unknown',
      requestDate: task_details?.created_at ? formatDate(task_details.created_at) : '—',
      userName: 'نامشخص',
      userAvatar: undefined,
      realProfile: {
        profileType: 'حقیقی',
        gender: 'نامشخص',
        contactNumber: '—',
        nationalId: '—',
        lastName: '—',
        firstName: '—',
        documents: [],
      },
      legalProfile: {
        profileType: 'حقوقی',
        contactNumber: '—',
        roleInCompany: 'نامشخص',
        nationalId: '—',
        companyName: 'نامشخص',
        documents: [],
      },
      primaryIndividuals: [],
      aiComment: undefined,
    };
  }

  // Create real profile with all available data
  const realProfile: RealProfile = {
    profileType: 'حقیقی',
    gender: getGenderLabel(party_request_details.gender),
    contactNumber: party_request_details.mobile,
    nationalId: party_request_details.national_id,
    lastName: party_request_details.last_name,
    firstName: party_request_details.first_name,
    documents: mapPartyDocsToProfileDocuments(party_docs_data),
  };

  // Create legal profile (using alias as company name if available)
  const legalProfile: LegalProfile = {
    profileType: 'حقوقی',
    contactNumber: party_request_details.mobile,
    roleInCompany: 'نامشخص', // Not provided in API
    nationalId: party_request_details.national_id,
    companyName: party_request_details.alias || 'نامشخص',
    documents: mapPartyDocsToProfileDocuments(party_docs_data),
  };

  // Generate AI comment based on changed fields
  const changedFieldsLabels = getChangedFieldsLabels(changed_fields);
  const aiComment = changedFieldsLabels.length
    ? `این درخواست شامل تغییر در فیلدهای ${changedFieldsLabels.join('، ')} می‌باشد. لطفاً اطلاعات را بررسی و تایید کنید.`
    : 'هیچ فیلد تغییریافته‌ای ثبت نشده است.';

  return {
    id: task_details.task_id?.toString() || 'unknown',
    requestDate: formatDate(task_details.created_at || new Date().toISOString()),
    userName: `${party_request_details.first_name || ''} ${party_request_details.last_name || ''}`.trim() || 'نامشخص',
    userAvatar: safeBuildDocDownloadUrl(party_request_details.profile_image),
    realProfile,
    legalProfile,
    primaryIndividuals: [], // Not provided in this API response
    aiComment,
  };
};

/**
 * Helper function to determine which fields have changed
 */
export const getChangedFieldsLabels = (changedFields: string[] | null | undefined): string[] => {
  if (!Array.isArray(changedFields) || changedFields.length === 0) {
    return [];
  }
  const fieldLabels: Record<string, string> = {
    FirstName: 'نام',
    LastName: 'نام خانوادگی',
    Alias: 'نام مستعار',
    NationalID: 'کد ملی',
    EducationDegree: 'مدرک تحصیلی',
    Biography: 'بیوگرافی',
    Gender: 'جنسیت',
    BirthDate: 'تاریخ تولد',
    Mobile: 'شماره موبایل',
  };

  return changedFields.map((field) => fieldLabels[field] || field);
};

/**
 * Format amount in Tomans
 */
const formatAmount = (amount?: number): string => {
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    return '—';
  }
  return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
};

/**
 * Get request type label
 */
const getRequestTypeLabel = (type: number): string => {
  const types: Record<number, string> = {
    1: 'درخواست کمک برای خود',
    2: 'درخواست کمک برای دیگران',
  };
  return types[type] || 'نامشخص';
};

/**
 * Get user level label
 */
const getUserLevelLabel = (level: number): string => {
  return `سطح ${level}`;
};

/**
 * Map project documents to HelpRequestDocument format
 * Supports both new (project_request_documents) and old (project_docs_data) formats
 */
const mapProjectDocsToHelpDocuments = (
  apiResponse: ApiHelpRequestResponse
): HelpRequestDocument[] => {
  // Check for new format first
  const projectRequestDocs = ensureArray(apiResponse.project_request_documents);
  if (projectRequestDocs.length > 0) {
    return projectRequestDocs.map((doc, index) => {
      const fileExtension = getFileExtension(doc.document_name || '');
      const fileUrl = safeBuildDocDownloadUrl(doc.file_uid);
      return {
        id: doc.document_id.toString(),
        filename: doc.document_name || `مدرک ${index + 1}`,
        fileType: fileExtension || 'file',
        uploadDate: doc.upload_date ? formatDate(doc.upload_date) : '—',
        fileSize: '—', // Size not provided in new format
        url: fileUrl,
      };
    });
  }

  // Fall back to old format
  const docs = ensureArray(apiResponse.project_docs_data);
  if (docs.length === 0) return [];

  return docs.map((doc, index) => {
    const fileExtension = getFileExtension(doc.filename);
    const fileSize = typeof doc.file_size === 'number' ? formatFileSize(doc.file_size) : '—';
    const fileUrl = safeBuildDocDownloadUrl(doc.file_uid);
    return {
      id: doc.document_id.toString(),
      filename: doc.filename || `مدرک ${index + 1}`,
      fileType: fileExtension || 'file',
      uploadDate: doc.upload_date ? formatDate(doc.upload_date) : '—',
      fileSize,
      url: fileUrl,
    };
  });
};

/**
 * Map help request API response to HelpRequestDetails component props
 * Supports both new and old API response formats
 */
const buildFallbackHelpRequest = (
  taskDetails?: ApiHelpRequestResponse['task_details']
): HelpRequestDetails => ({
  id: taskDetails?.task_id?.toString() || 'unknown',
  requestDate: taskDetails?.created_at ? formatDate(taskDetails.created_at) : '—',
  requestType: 'نامشخص',
  requestTitle: '—',
  category: '—',
  subcategory: '—',
  timeframe: '—',
  requiredAmount: formatAmount(),
  contactInfo: '—',
  shebaNumber: '—',
  isShebaVerified: false,
  description: '—',
  attachedDocuments: [],
  user: {
    id: taskDetails?.task_id?.toString() || '0',
    name: 'نامشخص',
    level: getUserLevelLabel(1),
    avatar: undefined,
  },
  aiComment: undefined,
});

export const mapHelpRequestToComponent = (
  apiResponse: ApiHelpRequestResponse
): HelpRequestDetails => {
  const { task_details, project_request_details } = apiResponse;

  if (!task_details || !project_request_details) {
    console.warn('[taskMappers] help request mapper received incomplete payload', {
      hasTask: Boolean(task_details),
      hasProjectDetails: Boolean(project_request_details),
    });
    return buildFallbackHelpRequest(task_details);
  }

  // Handle user level - use provided level or default
  const userLevel = typeof project_request_details.user_level === 'number'
    ? project_request_details.user_level
    : 1;

  // Handle request title - use title or request_title
  const requestTitle =
    project_request_details.title?.trim() ||
    project_request_details.request_title?.trim() ||
    '—';

  // Handle subcategory - use subcategory_name or parent_category_name, or default
  const subcategory =
    project_request_details.subcategory_name ||
    project_request_details.parent_category_name ||
    '—';

  // Handle timeframe - use timeframe or time_period
  const timeframe =
    project_request_details.timeframe?.trim() ||
    (project_request_details.time_period ? `${project_request_details.time_period} ماه` : '—');

  // Handle required amount - use required_amount or amount_in_period
  const requiredAmount =
    typeof project_request_details.required_amount === 'number'
      ? project_request_details.required_amount
      : project_request_details.amount_in_period;

  // Handle contact info - use contact_info or mobile
  const contactInfo =
    project_request_details.contact_info?.trim() ||
    project_request_details.mobile?.trim() ||
    '—';

  // Handle sheba number - use sheba_number or ibn
  const shebaNumber =
    project_request_details.sheba_number?.trim() ||
    project_request_details.ibn?.trim() ||
    '—';

  // Handle sheba verification - use is_sheba_verified or check is_verified
  const isShebaVerified =
    typeof project_request_details.is_sheba_verified === 'boolean'
      ? project_request_details.is_sheba_verified
      : project_request_details.is_verified === 1;

  // Handle profile image
  const profileImage = safeBuildDocDownloadUrl(project_request_details.profile_image);

  const user: HelpRequestUser = {
    id: project_request_details.user_id?.toString() || '0',
    name: `${project_request_details.first_name || ''} ${project_request_details.last_name || ''}`.trim() || 'نامشخص',
    level: getUserLevelLabel(userLevel),
    avatar: profileImage,
  };

  const request: HelpRequestDetails = {
    id: task_details.task_id.toString(),
    requestDate: formatDate(task_details.created_at),
    requestType: getRequestTypeLabel(project_request_details.request_type),
    requestTitle,
    category: project_request_details.category_name || '—',
    subcategory,
    timeframe,
    requiredAmount: formatAmount(requiredAmount),
    contactInfo,
    shebaNumber,
    isShebaVerified,
    description: project_request_details.description || '—',
    attachedDocuments: mapProjectDocsToHelpDocuments(apiResponse),
    user,
    aiComment: 'این بخش شامل نظر AI هست که در مورد درخواست ارسال شده توضیحات لازم را در راستای کمک به ادمین میدهد.',
  };

  return request;
};

/**
 * Get status label for cooperation request
 */
const getStatusLabel = (status: number): string => {
  const statuses: Record<number, string> = {
    1: 'در انتظار بررسی',
    2: 'تایید شده',
    3: 'رد شده',
  };
  return statuses[status] || 'نامشخص';
};

/**
 * Map cooperation request API response to CooperationRequestDetails component props
 */
export const mapCooperationRequestToComponent = (
  apiResponse: ApiCooperationRequestResponse
): CooperationRequestDetails => {
  console.log('Mapping cooperation request:', apiResponse);

  const { task_details, cooperation_request_details, specialization_details } = apiResponse;

  if (!task_details) {
    throw new Error('task_details is missing from API response');
  }

  if (!cooperation_request_details) {
    throw new Error('cooperation_request_details is missing from API response');
  }

  const request: CooperationRequestDetails = {
    id: task_details.task_id?.toString() || 'unknown',
    requestDate: formatDate(task_details.created_at || new Date().toISOString()),
    notes: cooperation_request_details.notes || '',
    status: getStatusLabel(cooperation_request_details.status || 1),
    userName: cooperation_request_details.full_name || 'نامشخص',
    userAvatar: cooperation_request_details.profile_image
      ? buildDocDownloadUrl(cooperation_request_details.profile_image)
      : undefined,
    specializations: specialization_details || [],
  };

  return request;
};

/**
 * Map template request API response to TemplateRequestDetails component props
 */
export const mapTemplateRequestToComponent = (
  apiResponse: ApiTemplateRequestResponse
): TemplateRequestDetails => {
  const { task_details } = apiResponse;

  const request: TemplateRequestDetails = {
    id: task_details.task_id.toString(),
    requestDate: formatDate(task_details.created_at),
    requestType: apiResponse.request_type === 1 ? 'درخواست تمپلیت جدید' : 'درخواست ویرایش تمپلیت',
    title: apiResponse.title,
    description: apiResponse.description,
    category: apiResponse.category_name,
    parentCategory: apiResponse.parent_category_name,
    maxAmountMonthly: formatAmount(apiResponse.max_amount_monthly),
    timePeriod: `${apiResponse.time_period} ماه`,
    amountInPeriod: formatAmount(apiResponse.amount_in_period),
    status: getStatusLabel(apiResponse.status),
    userName: `کاربر ${apiResponse.user_id}`, // You might want to get actual user name from another API
    userAvatar: undefined, // Not provided in this API response
    isVerified: apiResponse.is_verified === 1,
  };

  return request;
};

