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
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '۰ بایت';
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
  docs: ApiProfileChangeRequestResponse['party_docs_data']
): ProfileDocument[] => {
  return docs.map((doc, index) => ({
    id: doc.document_id.toString(),
    filename: `مدرک ${index + 1}`,
    fileType: 'pdf' as 'jpg' | 'pdf', // Default to pdf, can be determined from file_uid if needed
    uploadDate: formatDate(doc.upload_date),
    fileSize: '۴ MB', // Size not provided in API, using default
    url: `${process.env.NEXT_PUBLIC_API_URL || 'https://nikicity.com'}/api/sys/files/download/${doc.file_uid}`,
  }));
};

/**
 * Map profile change request API response to ProfileChangeRequest component props
 */
export const mapProfileChangeRequestToComponent = (
  apiResponse: ApiProfileChangeRequestResponse
): ProfileChangeRequest => {
  const { task_details, party_request_details, party_docs_data, changed_fields } = apiResponse;

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
  const aiComment = `این درخواست شامل تغییر در فیلدهای ${changedFieldsLabels.join('، ')} می‌باشد. لطفاً اطلاعات را بررسی و تایید کنید.`;

  return {
    id: task_details.task_id.toString(),
    requestDate: formatDate(task_details.created_at),
    userName: `${party_request_details.first_name} ${party_request_details.last_name}`,
    userAvatar: party_request_details.profile_image
      ? `${process.env.NEXT_PUBLIC_API_URL || 'https://nikicity.com'}/api/sys/files/download/${party_request_details.profile_image}`
      : undefined,
    realProfile,
    legalProfile,
    primaryIndividuals: [], // Not provided in this API response
    aiComment,
  };
};

/**
 * Helper function to determine which fields have changed
 */
export const getChangedFieldsLabels = (changedFields: string[]): string[] => {
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
const formatAmount = (amount: number): string => {
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
 */
const mapProjectDocsToHelpDocuments = (
  docs?: ApiHelpRequestResponse['project_docs_data']
): HelpRequestDocument | undefined => {
  if (!docs || docs.length === 0) return undefined;
  
  const doc = docs[0]; // Take the first document
  const fileExtension = getFileExtension(doc.filename);
  
  return {
    id: doc.document_id.toString(),
    filename: doc.filename,
    fileType: fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png' 
      ? (fileExtension as 'jpg' | 'png')
      : 'pdf',
    uploadDate: 'امروز', // Using static value as in the image
    fileSize: formatFileSize(doc.file_size),
    url: `${process.env.NEXT_PUBLIC_API_URL || 'https://nikicity.com'}/api/sys/files/download/${doc.file_uid}`,
  };
};

/**
 * Map help request API response to HelpRequestDetails component props
 */
export const mapHelpRequestToComponent = (
  apiResponse: ApiHelpRequestResponse
): HelpRequestDetails => {
  const { task_details, project_request_details, project_docs_data } = apiResponse;

  const user: HelpRequestUser = {
    id: project_request_details.user_id.toString(),
    name: `${project_request_details.first_name} ${project_request_details.last_name}`,
    level: getUserLevelLabel(project_request_details.user_level),
    avatar: project_request_details.profile_image
      ? `${process.env.NEXT_PUBLIC_API_URL || 'https://nikicity.com'}/api/sys/files/download/${project_request_details.profile_image}`
      : undefined,
  };

  const request: HelpRequestDetails = {
    id: task_details.task_id.toString(),
    requestDate: formatDate(task_details.created_at),
    requestType: getRequestTypeLabel(project_request_details.request_type),
    requestTitle: project_request_details.request_title,
    category: project_request_details.category_name,
    subcategory: project_request_details.subcategory_name,
    timeframe: project_request_details.timeframe,
    requiredAmount: formatAmount(project_request_details.required_amount),
    contactInfo: project_request_details.contact_info,
    shebaNumber: project_request_details.sheba_number,
    isShebaVerified: project_request_details.is_sheba_verified,
    description: project_request_details.description,
    attachedFile: mapProjectDocsToHelpDocuments(project_docs_data),
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
  const { task_details, cooperation_request_details, specialization_details } = apiResponse;

  const request: CooperationRequestDetails = {
    id: task_details.task_id.toString(),
    requestDate: formatDate(task_details.created_at),
    notes: cooperation_request_details.notes,
    status: getStatusLabel(cooperation_request_details.status),
    userName: cooperation_request_details.full_name,
    userAvatar: cooperation_request_details.profile_image
      ? `${process.env.NEXT_PUBLIC_API_URL || 'https://nikicity.com'}/api/sys/files/download/${cooperation_request_details.profile_image}`
      : undefined,
    specializations: specialization_details,
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

