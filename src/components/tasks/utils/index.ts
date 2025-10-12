// Utility functions for task components
import { TaskStatus } from '../types';

// Status utilities
export const getStatusClass = (status: TaskStatus): string => {
  const statusClassMap: Record<TaskStatus, string> = {
    pending: 'statusPending',
    in_progress: 'statusInProgress',
    completed: 'statusCompleted',
    approved: 'statusApproved',
    needs_correction: 'statusNeedsCorrection',
    rejected: 'statusRejected',
    cancelled: 'statusCancelled',
  };
  
  return statusClassMap[status] || 'statusPending';
};

export const getStatusText = (status: TaskStatus): string => {
  const statusTextMap: Record<TaskStatus, string> = {
    pending: 'در انتظار',
    in_progress: 'در حال انجام',
    completed: 'تکمیل شده',
    approved: 'تایید شده',
    needs_correction: 'نیاز به اصلاح',
    rejected: 'رد شده',
    cancelled: 'لغو شده',
  };
  
  return statusTextMap[status] || 'در انتظار';
};

// Process options for filter dropdown
export const PROCESS_OPTIONS = [
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
] as const;

// Personnel options for filter dropdown
export const PERSONNEL_OPTIONS = [
  { value: 'ahmad', label: 'احمد محمدی' },
  { value: 'ali', label: 'علی رضایی' },
  { value: 'hassan', label: 'حسن کریمی' },
  { value: 'mohammad', label: 'محمد احمدی' },
] as const;

// Status options for filter dropdown
export const STATUS_OPTIONS = [
  { value: 'pending', label: 'در انتظار' },
  { value: 'in_progress', label: 'در حال انجام' },
  { value: 'completed', label: 'تکمیل شده' },
  { value: 'approved', label: 'تایید شده' },
  { value: 'needs_correction', label: 'نیاز به اصلاح' },
  { value: 'rejected', label: 'رد شده' },
  { value: 'cancelled', label: 'لغو شده' },
] as const;

// Operation options for filter dropdown
export const OPERATION_OPTIONS = [
  { value: 'perform', label: 'انجام عملیات' },
  { value: 'view', label: 'مشاهده' },
  { value: 'restart', label: 'شروع مجدد' },
] as const;

// Default filter values
export const DEFAULT_FILTERS = {
  search: '',
  process: '',
  date: '',
  performerPersonnel: '',
  status: '',
  operations: '',
} as const;

