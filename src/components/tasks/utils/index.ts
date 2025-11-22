export const getStatusText = (status: number): string => {
  const statusTextMap: Record<number, string> = {
    37: 'در انتظار انجام',
    38: 'در حال انجام',
    39: 'تکمیل شده',
    40: 'تایید شده',
    41: 'نیاز به اصلاح',
    43: 'رد شده',
    44: 'لغو شده',
    45: 'متوقف شده',
  };
  return statusTextMap[status] || 'در انتظار';
};

// Get CSS class for status badge based on status_id
export const getStatusClass = (statusId: number): string => {
  const statusClassMap: Record<number, string> = {
    37: 'statusPending',        // در انتظار انجام
    38: 'statusInProgress',     // در حال انجام
    39: 'statusCompleted',      // تکمیل شده
    40: 'statusApproved',       // تایید شده
    41: 'statusNeedsCorrection', // نیاز به اصلاح
    43: 'statusRejected',       // رد شده
    44: 'statusCancelled',      // لغو شده
    45: 'statusCancelled',      // متوقف شده
  };
  return statusClassMap[statusId] || 'statusPending';
};

// Process options for filter dropdown - mapped to ref_type values
export const PROCESS_OPTIONS: { label: string; value: string }[] = [
  { value: '1', label: 'درخواست تغییر پروفایل' },
  { value: '2', label: 'درخواست کمک' },
  { value: '3', label: 'تسک‌های پروژه' },
  { value: '4', label: 'درخواست ایجاد تمپلیت' },
  { value: '5', label: 'درخواست همکاری' },
  { value: '6', label: 'تیکت پشتیبانی' },
  { value: '7', label: 'درخواست تغییر اطلاعات کسب و کار' },
];

// Personnel options for filter dropdown
export const PERSONNEL_OPTIONS = [
  { value: 'ahmad', label: 'احمد محمدی' },
  { value: 'ali', label: 'علی رضایی' },
  { value: 'hassan', label: 'حسن کریمی' },
  { value: 'mohammad', label: 'محمد احمدی' },
];

// Status options for filter dropdown - mapped to status_id values
export const STATUS_OPTIONS: { label: string; value: string }[] = [
  { value: '37', label: 'در انتظار انجام' },
  { value: '38', label: 'در حال انجام' },
  { value: '39', label: 'تکمیل شده' },
  { value: '40', label: 'تایید شده' },
  { value: '41', label: 'نیاز به اصلاح' },
  { value: '43', label: 'رد شده' },
  { value: '44', label: 'لغو شده' },
  { value: '45', label: 'متوقف شده' },
];

// Operation options for filter dropdown
export const OPERATION_OPTIONS = [
  { value: 'perform', label: 'انجام عملیات' },
  { value: 'view', label: 'مشاهده' },
  { value: 'restart', label: 'شروع مجدد' },
];

// Default filter values
export const DEFAULT_FILTERS = {
  search: '',
  process: '',
  date: '',
  performerPersonnel: '',
  status: '',
  operations: '',
} as const;

