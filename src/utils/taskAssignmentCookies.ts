/**
 * Utility functions for managing task assignments in cookies
 */

const COOKIE_KEY = 'task_assignments';

export interface TaskAssignmentCookieData {
  temp_task_id: number;
  staff_id: number;
  staff_label: string;
  deadline: number;
  assignment_notes: string;
}

/**
 * Get cookie value by name
 */
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[1]) : null;
};

/**
 * Set cookie value
 */
const setCookie = (name: string, value: string, options: { path?: string; maxAge?: number } = {}) => {
  if (typeof document === 'undefined') return;
  const opts = { path: '/', ...options };
  let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
  if (opts.maxAge && Number.isFinite(opts.maxAge)) {
    updatedCookie += '; max-age=' + String(opts.maxAge);
  }
  if (opts.path) {
    updatedCookie += '; path=' + opts.path;
  }
  document.cookie = updatedCookie;
};

/**
 * Get all task assignments from cookie
 */
export const getTaskAssignmentsFromCookie = (): TaskAssignmentCookieData[] => {
  const existing = getCookie(COOKIE_KEY);
  if (!existing) return [];
  try {
    const parsed = JSON.parse(existing);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
};

/**
 * Save a task assignment to cookie
 */
export const saveTaskAssignmentToCookie = (assignment: TaskAssignmentCookieData): void => {
  const existing = getTaskAssignmentsFromCookie();
  const existingIndex = existing.findIndex((a) => a.temp_task_id === assignment.temp_task_id);
  
  const updated = existingIndex >= 0
    ? [
        ...existing.slice(0, existingIndex),
        assignment,
        ...existing.slice(existingIndex + 1),
      ]
    : [...existing, assignment];
  
  setCookie(COOKIE_KEY, JSON.stringify(updated), { path: '/', maxAge: 60 * 60 * 24 * 30 }); // 30 days
};

/**
 * Remove a task assignment from cookie
 */
export const removeTaskAssignmentFromCookie = (tempTaskId: number): void => {
  const existing = getTaskAssignmentsFromCookie();
  const updated = existing.filter((a) => a.temp_task_id !== tempTaskId);
  setCookie(COOKIE_KEY, JSON.stringify(updated), { path: '/', maxAge: 60 * 60 * 24 * 30 });
};

/**
 * Clear all task assignments from cookie
 */
export const clearTaskAssignmentsCookie = (): void => {
  setCookie(COOKIE_KEY, '', { path: '/', maxAge: 0 });
};

