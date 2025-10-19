import {
  ApiProfileChangeRequestResponse,
  ProfileChangeRequest,
  ProfileDocument,
  RealProfile,
  LegalProfile,
} from '@/components/tasks/types';

/**
 * Convert education degree code to Persian label
 */
const getEducationDegreeLabel = (degree: number): string => {
  const degrees: Record<number, string> = {
    1: 'زیر دیپلم',
    2: 'دیپلم',
    3: 'کاردانی',
    4: 'کارشناسی',
    5: 'کارشناسی ارشد',
    6: 'دکتری',
  };
  return degrees[degree] || 'نامشخص';
};

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
  } catch (error) {
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

