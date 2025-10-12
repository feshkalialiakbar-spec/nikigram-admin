# Task Status Filtering Implementation

## Overview
This document describes the implementation of task filtering by status across the dashboard pages. The system now supports filtering tasks by their status codes, allowing for dedicated pages for each task status category.

## Task Status Codes
The following status codes are mapped in the system:

| Status Code | Persian Name | English Status | Component |
|-------------|--------------|----------------|-----------|
| 37 | در انتظار | pending | TasksUnassigned |
| 38 | در حال انجام | in_progress | TasksInProgress |
| 39 | تکمیل شده | completed | TasksCompleted |
| 40 | تایید شده | approved | - |
| 41 | نیاز به اصلاح | needs_correction | - |
| 42 | رد شده | rejected | - |
| 43 | لغو شده | cancelled | TasksStopped |

## Implementation Details

### 1. Service Layer Updates

**File: `src/services/taskServices.ts`**

Added new service functions to fetch tasks by specific status:

```typescript
// Generic function to fetch tasks by status ID
export const fetchTasksByStatus = async (statusId: number): Promise<Task[]>

// Specific status fetcher functions
export const fetchInProgressTasks = async (): Promise<Task[]>  // Status 38
export const fetchCompletedTasks = async (): Promise<Task[]>   // Status 39
export const fetchApprovedTasks = async (): Promise<Task[]>    // Status 40
export const fetchNeedsCorrectionTasks = async (): Promise<Task[]> // Status 41
export const fetchRejectedTasks = async (): Promise<Task[]>    // Status 42
export const fetchCancelledTasks = async (): Promise<Task[]>   // Status 43
```

These functions call the API endpoint:
```
/api/admin/task/list/?status={statusId}&limit=100&offset=0
```

**File: `src/services/task.ts`**

Updated exports to include all new service functions.

### 2. Hooks Layer Updates

**File: `src/hooks/useTaskServices.ts`**

Added React Query hooks for each status type:

```typescript
export const useInProgressTasks = (options?: Partial<UseQueryOptions<Task[], Error>>)
export const useCompletedTasks = (options?: Partial<UseQueryOptions<Task[], Error>>)
export const useApprovedTasks = (options?: Partial<UseQueryOptions<Task[], Error>>)
export const useNeedsCorrectionTasks = (options?: Partial<UseQueryOptions<Task[], Error>>)
export const useRejectedTasks = (options?: Partial<UseQueryOptions<Task[], Error>>)
export const useCancelledTasks = (options?: Partial<UseQueryOptions<Task[], Error>>)
```

Each hook uses the `useApiList` generic hook pattern with proper query keys for caching.

### 3. Component Updates

**File: `src/components/tasks/types/index.ts`**

Updated `TaskDashboardProps` interface to accept pre-filtered data:

```typescript
export interface TaskDashboardProps {
  className?: string;
  tasks?: Task[];           // Optional pre-filtered tasks
  loading?: boolean;        // Optional loading state
  error?: string | null;    // Optional error message
  onRefetch?: () => void;   // Optional refetch callback
}
```

**File: `src/components/tasks/TaskDashboard.tsx`**

Updated to accept external data while maintaining backward compatibility:

- Uses external tasks/loading/error if provided
- Falls back to internal data fetching if not provided
- Allows for both controlled and uncontrolled usage patterns

### 4. New Dashboard Components

Created four new dashboard components following the same pattern as `MyTasks`:

#### a) TasksInProgress Component
**Files:**
- `src/components/Dashboard/TasksInProgress/index.tsx`
- `src/components/Dashboard/TasksInProgress/index.module.scss`

Fetches and displays tasks with status 38 (در حال انجام).

#### b) TasksCompleted Component
**Files:**
- `src/components/Dashboard/TasksCompleted/index.tsx`
- `src/components/Dashboard/TasksCompleted/index.module.scss`

Fetches and displays tasks with status 39 (تکمیل شده).

#### c) TasksStopped Component
**Files:**
- `src/components/Dashboard/TasksStopped/index.tsx`
- `src/components/Dashboard/TasksStopped/index.module.scss`

Fetches and displays stopped/cancelled tasks.

#### d) Updated TasksUnassigned Component
**File:** `src/components/Dashboard/TasksUnassigned/index.tsx`

Updated to pass filtered data to TaskDashboard component.

#### e) Updated MyTasks Component
**File:** `src/components/Dashboard/MyTasks/index.tsx`

Updated to pass user's tasks to TaskDashboard component.

### 5. Page Routes

Created page components for each dashboard route:

- **`src/app/dashboard/tasks-unassigned/page.tsx`** - Unassigned tasks page
- **`src/app/dashboard/tasks-in-progress/page.tsx`** - In-progress tasks page
- **`src/app/dashboard/tasks-completed/page.tsx`** - Completed tasks page
- **`src/app/dashboard/tasks-stopped/page.tsx`** - Stopped tasks page
- **`src/app/dashboard/my-tasks/page.tsx`** - User's tasks page (existing)

## Component Architecture

Each dashboard component follows this pattern:

```typescript
const TasksComponent: React.FC<Props> = ({ className }) => {
  // Fetch data using the appropriate hook
  const { data: tasks, isLoading, error, refetch } = useApiList({
    fetcher: fetchSpecificTasks,
    queryKey: ['tasks', 'specific-type'],
    enabled: true,
    retry: 3,
  });

  // Loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Error state
  if (error) {
    return <div>Error with retry button</div>;
  }

  // Success state - pass filtered data to TaskDashboard
  return (
    <div>
      <header>
        <h1>Page Title</h1>
      </header>
      <TaskDashboard 
        tasks={tasks}
        loading={isLoading}
        error={error ? (error as unknown as Error)?.message || null : null}
        onRefetch={refetch}
      />
    </div>
  );
};
```

## Data Flow

```
API Endpoint
    ↓
Service Function (fetchTasksByStatus)
    ↓
React Query Hook (useApiList)
    ↓
Dashboard Component (TasksInProgress, etc.)
    ↓
TaskDashboard Component
    ↓
TaskTable Component (displays filtered data)
```

## Features

### 1. Status-Based Filtering
- Each page automatically filters tasks by their status code
- Filtering happens at the API level for better performance
- Client-side filtering still available through FilterBar component

### 2. React Query Integration
- Automatic caching with proper query keys
- Automatic refetching on mount
- Retry logic (3 retries by default)
- Error handling
- Loading states

### 3. Error Handling
- Service layer error handling with descriptive messages
- Component level error display with retry buttons
- Type-safe error handling

### 4. Loading States
- Skeleton loading screens during data fetch
- Consistent loading UI across all pages

### 5. Reusable Components
- TaskDashboard component accepts both internal and external data
- All dashboard components follow the same pattern
- Easy to add new status-based pages

## Usage Examples

### Adding a New Status Page

1. Create the service function in `taskServices.ts`:
```typescript
export const fetchNewStatusTasks = async (): Promise<Task[]> => {
  return fetchTasksByStatus(STATUS_CODE);
};
```

2. Create the hook in `useTaskServices.ts`:
```typescript
export const useNewStatusTasks = (options?: Partial<UseQueryOptions<Task[], Error>>) => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks', 'new-status'],
    queryFn: fetchNewStatusTasks,
    ...options,
  });
};
```

3. Create the component in `src/components/Dashboard/TasksNewStatus/`:
```typescript
const TasksNewStatus: React.FC<Props> = ({ className }) => {
  const { data: tasks, isLoading, error, refetch } = useApiList({
    fetcher: fetchNewStatusTasks,
    queryKey: ['tasks', 'new-status'],
    enabled: true,
    retry: 3,
  });

  return (
    <div className={styles.tasksNewStatus}>
      <div className={styles.header}>
        <h1 className={styles.title}>عنوان فارسی</h1>
      </div>
      <div className={styles.content}>
        <TaskDashboard 
          tasks={tasks}
          loading={isLoading}
          error={error ? (error as unknown as Error)?.message || null : null}
          onRefetch={refetch}
        />
      </div>
    </div>
  );
};
```

4. Create the page in `src/app/dashboard/tasks-new-status/page.tsx`:
```typescript
const TasksNewStatusPage: React.FC = () => {
  return <TasksNewStatus />;
};
```

## API Endpoints Used

- **My Tasks:** `/api/admin/task/my_list/?limit=10&offset=0`
- **Unassigned:** `/api/admin/task/unassigned/?limit=10&offset=0`
- **Stopped:** `/api/admin/task/stopped/?limit=10&offset=0`
- **By Status:** `/api/admin/task/list/?status={statusId}&limit=100&offset=0`

## Testing Recommendations

1. **Unit Tests:**
   - Test service functions with different status codes
   - Test component rendering with different data states
   - Test error handling and retry logic

2. **Integration Tests:**
   - Test data flow from API to UI
   - Test filtering and pagination
   - Test navigation between status pages

3. **E2E Tests:**
   - Test user workflow across different status pages
   - Test data refresh and caching
   - Test error recovery

## Future Enhancements

1. **Add remaining status pages:**
   - Approved tasks (status 40)
   - Needs correction tasks (status 41)
   - Rejected tasks (status 42)

2. **Pagination improvements:**
   - Server-side pagination for better performance
   - Infinite scroll option

3. **Advanced filtering:**
   - Combine status filters with other filters
   - Save filter preferences

4. **Real-time updates:**
   - WebSocket integration for real-time status changes
   - Optimistic updates

## Conclusion

The implementation provides a scalable and maintainable architecture for filtering tasks by status. The pattern can be easily extended to add new status pages or modify existing ones. All components follow React and TypeScript best practices with proper error handling and loading states.

