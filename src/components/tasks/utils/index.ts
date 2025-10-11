// Utility functions for task components
import { TaskStatus } from '../types';

// Status utilities
export const getStatusClass = (status: TaskStatus): string => {
  const statusClassMap: Record<TaskStatus, string> = {
    pending: 'statusPending',
    stopped: 'statusStopped',
    rejected: 'statusRejected',
    completed: 'statusCompleted',
  };
  
  return statusClassMap[status] || 'statusPending';
};

export const getStatusText = (status: TaskStatus): string => {
  const statusTextMap: Record<TaskStatus, string> = {
    pending: 'در انتظار انجام',
    stopped: 'متوقف شده',
    rejected: 'رد شده',
    completed: 'انجام شده',
  };
  
  return statusTextMap[status] || 'در انتظار انجام';
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
  { value: 'pending', label: 'در انتظار انجام' },
  { value: 'stopped', label: 'متوقف شده' },
  { value: 'rejected', label: 'رد شده' },
  { value: 'completed', label: 'انجام شده' },
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
