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

// Process options for filter dropdown
export const PROCESS_OPTIONS: { label: string; value: string }[] = [
  { value: 'cooperation', label: 'درخواست همکاری' },
  { value: 'help', label: 'درخواست کمک' },
  { value: 'template', label: 'تمپلیت پروژه' },
  { value: 'critical', label: 'بحرانی شدن پروژه' },
  { value: 'tender', label: 'مناقصه' },
  { value: 'comments', label: 'نظرات' },
  { value: 'support', label: 'پشتیبانی' },
  { value: 'sales', label: 'مدیریت فروش' },
  { value: 'profile', label: 'پروفایل' },
  { value: 'financial', label: 'مالی' },
  { value: 'niki-yar', label: 'نیکی یار' },
  { value: 'pos', label: 'درخواست پوز' },
];

// Personnel options for filter dropdown
export const PERSONNEL_OPTIONS = [
  { value: 'ahmad', label: 'احمد محمدی' },
  { value: 'ali', label: 'علی رضایی' },
  { value: 'hassan', label: 'حسن کریمی' },
  { value: 'mohammad', label: 'محمد احمدی' },
];

// Status options for filter dropdown
export const STATUS_OPTIONS: { label: string; value: string }[] = [
  { value: 'pending', label: 'در انتظار' },
  { value: 'in_progress', label: 'در حال انجام' },
  { value: 'completed', label: 'تکمیل شده' },
  { value: 'approved', label: 'تایید شده' },
  { value: 'needs_correction', label: 'نیاز به اصلاح' },
  { value: 'rejected', label: 'رد شده' },
  { value: 'cancelled', label: 'لغو شده' },
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

