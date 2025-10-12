# Dashboard Routes Implementation Summary

## Overview
Successfully implemented all missing dashboard routes with reusable API calling patterns and proper filtering by status and other response keys.

## Routes Implemented

### 1. Tasks Waiting For Me ✅
**Route:** `/dashboard/tasks-waiting-for-me`

**Files Created:**
- `src/components/Dashboard/TasksWaitingForMe/index.tsx`
- `src/components/Dashboard/TasksWaitingForMe/index.module.scss`
- `src/app/dashboard/tasks-waiting-for-me/page.tsx`

**API Service:**
- `fetchWaitingForMeTasks()` - Fetches tasks with status 37 (pending)
- Endpoint: Uses `fetchTasksByStatus(37)` which calls `/api/admin/task/list/?status=37`

**Description:**
Displays tasks that are pending and waiting for the current user to act on them.

---

### 2. To-Do List (Shared Pending Tasks) ✅
**Route:** `/dashboard/to-do-list`

**Files Created:**
- `src/components/Dashboard/ToDoList/index.tsx`
- `src/components/Dashboard/ToDoList/index.module.scss`
- `src/app/dashboard/to-do-list\page.tsx`

**API Service:**
- `fetchToDoListTasks()` - Fetches shared pending tasks for collaboration
- Endpoint: `/api/admin/task/shared_pending/?limit=10&offset=0`

**Description:**
Displays tasks that are pending and require shared/collaborative action.

---

## Existing Routes (Already Implemented)

### 3. My Tasks ✅
**Route:** `/dashboard/my-tasks`
**API:** `fetchMyTasks()` → `/api/admin/task/my_list/`

### 4. Tasks In Progress ✅
**Route:** `/dashboard/tasks-in-progress`
**API:** `fetchInProgressTasks()` → status 38

### 5. Tasks Completed ✅
**Route:** `/dashboard/tasks-completed`
**API:** `fetchCompletedTasks()` → status 39

### 6. Tasks Stopped ✅
**Route:** `/dashboard/tasks-stopped`
**API:** `fetchStoppedTasks()` → `/api/admin/task/stopped/`

### 7. Tasks Unassigned ✅
**Route:** `/dashboard/tasks-unassigned`
**API:** `fetchUnassignedTasks()` → `/api/admin/task/unassigned/`

---

## Reusable API Pattern

All dashboard pages follow a consistent, reusable pattern:

### 1. Service Layer (`src/services/taskServices.ts`)
```typescript
export const fetchWaitingForMeTasks = async (): Promise<Task[]> => {
  return fetchTasksByStatus(37);
};
```

### 2. Component Layer
Each component uses the `useApiList` hook for data fetching:
```typescript
const { data: tasks, isLoading, error, refetch } = useApiList({
  fetcher: fetchWaitingForMeTasks,
  queryKey: ['tasks', 'waiting-for-me'],
  enabled: true,
  retry: 3,
});
```

### 3. Filtering by Status
The implementation uses a generic `fetchTasksByStatus(statusId)` function that allows filtering by:
- **Status ID**: Different status values (37, 38, 39, 40, 41, 42, 43)
- **Status Name**: Mapped from Persian labels to internal status codes
- **Other Filters**: Can be extended with additional query parameters

### Status Mapping
```typescript
37: 'pending' (در انتظار)
38: 'in_progress' (درحال انجام)
39: 'completed' (تکمیل شده)
40: 'approved' (تایید شده)
41: 'needs_correction' (نیاز به اصلاح)
42: 'rejected' (رد شده)
43: 'cancelled' (لغو شده)
```

---

## API Response Structure

All task APIs return data in this format:
```typescript
interface ApiTask {
  task_id?: number;
  task_title?: string;
  status_name?: string;
  status_id?: number;
  ref_type?: number;
  created_at?: string;
}

// Response format
{
  tasks: ApiTask[]
}
```

The `mapApiTaskToTask()` function transforms API responses into the UI Task type, handling:
- Status mapping (by ID and name)
- Process type mapping (ref_type)
- Date formatting
- Default values for missing fields

---

## Component Structure

All dashboard components follow this consistent structure:

```
Dashboard/[ComponentName]/
  ├── index.tsx          # Component logic with API integration
  └── index.module.scss  # Component-specific styles
```

**Standard Features:**
- ✅ Loading state with skeleton UI
- ✅ Error handling with retry button
- ✅ Task list display using `TaskDashboard` component
- ✅ Responsive design (mobile & desktop)
- ✅ RTL support for Persian text
- ✅ Consistent styling across all pages

---

## Sidebar Integration

All routes are properly registered in the sidebar menu (`src/components/hub/SideBar/items/index.ts`):

```typescript
{
  icon: TaskSquare,
  label: 'میز کار من',
  href: '/dashboard',
  children: [
    { label: 'کارهای من', href: '/dashboard/my-tasks', icon: Clock },
    { label: 'در انتظار انجام من', href: '/dashboard/tasks-waiting-for-me', icon: Activity },
    { label: 'در حال انجام', href: '/dashboard/tasks-in-progress', icon: TickCircle },
    { label: 'انجام شده', href: '/dashboard/tasks-completed', icon: CloseCircle },
    { label: 'متوقف شده', href: '/dashboard/tasks-stopped', icon: Profile2User },
    { label: 'در انتظار انجام مشترک', href: '/dashboard/to-do-list', icon: Profile2User },
    { label: 'اختصاص نیافته', href: '/dashboard/tasks-unassigned', icon: ProfileRemove },
  ],
}
```

---

## Benefits of This Implementation

1. **Reusability**: Single `fetchTasksByStatus()` function for multiple routes
2. **Consistency**: All components follow the same pattern
3. **Maintainability**: Easy to add new task filters/routes
4. **Type Safety**: Full TypeScript support
5. **Error Handling**: Robust error states with retry logic
6. **Performance**: React Query integration for caching and optimization
7. **User Experience**: Loading states, error messages, and retry options

---

## How to Add New Dashboard Routes

To add a new task-based dashboard route:

1. **Add API Service** (if custom endpoint needed):
```typescript
// src/services/taskServices.ts
export const fetchYourNewTasks = async (): Promise<Task[]> => {
  return fetchTasksByStatus(YOUR_STATUS_ID);
  // OR for custom endpoint:
  // return fetch(`${API_URL}/your-endpoint`).then(...)
};
```

2. **Export Service**:
```typescript
// src/services/task.ts
export { fetchYourNewTasks } from './taskServices';
```

3. **Create Component**:
```bash
src/components/Dashboard/YourNewComponent/
  ├── index.tsx
  └── index.module.scss
```

4. **Create Page**:
```bash
src/app/dashboard/your-route/
  └── page.tsx
```

5. **Add to Sidebar** (if needed):
```typescript
// src/components/hub/SideBar/items/index.ts
{ label: 'Your Label', href: '/dashboard/your-route', icon: YourIcon }
```

---

## Testing

All routes can be tested by:
1. Navigating to the dashboard sidebar
2. Clicking on each menu item
3. Verifying data loads correctly
4. Testing error states by simulating API failures
5. Checking responsive behavior on different screen sizes

---

## Next Steps (Optional Enhancements)

- [ ] Add pagination support for large task lists
- [ ] Implement search/filter functionality within each view
- [ ] Add bulk actions (select multiple tasks)
- [ ] Implement real-time updates with WebSocket
- [ ] Add export functionality (CSV, PDF)
- [ ] Implement task sorting options
- [ ] Add custom date range filters
- [ ] Create dashboard analytics/statistics view

---

**Implementation Date:** October 12, 2025  
**Status:** ✅ Complete  
**Developer Notes:** All dashboard routes are now fully functional with reusable API patterns and consistent UI/UX.

