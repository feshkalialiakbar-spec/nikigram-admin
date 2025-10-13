# Pagination Implementation Summary

## Overview
Implemented server-side pagination across all dashboard components with a configurable limit of 15 items per page.

## Changes Made

### 1. Task Services (`src/services/taskServices.ts`)
- **Added new types:**
  - `PaginatedResponse<T>`: Contains tasks array, total count, limit, and offset
  - `PaginationParams`: Contains limit and offset parameters
  - `DEFAULT_LIMIT`: Set to 15 items per page

- **Updated all fetch functions to support pagination:**
  - `fetchMyTasks(params?: PaginationParams)`
  - `fetchUnassignedTasks(params?: PaginationParams)`
  - `fetchTasksByStatus(statusId: number, params?: PaginationParams)`
  - `fetchInProgressTasks(params?: PaginationParams)`
  - `fetchStoppedTasks(params?: PaginationParams)`
  - `fetchCompletedTasks(params?: PaginationParams)`
  - `fetchApprovedTasks(params?: PaginationParams)`
  - `fetchNeedsCorrectionTasks(params?: PaginationParams)`
  - `fetchRejectedTasks(params?: PaginationParams)`
  - `fetchCancelledTasks(params?: PaginationParams)`
  - `fetchWaitingForMeTasks(params?: PaginationParams)`
  - `fetchToDoListTasks(params?: PaginationParams)`

- **All functions now:**
  - Accept optional pagination parameters (limit and offset)
  - Return a `PaginatedResponse` with total count for proper pagination
  - Use DEFAULT_LIMIT (15) when no limit is specified
  - Include limit and offset in API calls

### 2. Hooks (`src/hooks/useTaskServices.ts`)
- **Updated `useApiList` hook:**
  - Accepts `paginationParams` option
  - Returns pagination metadata: `total`, `limit`, `offset`
  - Passes pagination parameters to fetcher functions

- **Updated `useMyTasks` and `useUnassignedTasks` hooks:**
  - Accept pagination parameters as first argument
  - Include pagination params in query keys for proper caching
  - Return `PaginatedResponse` type

- **Fixed type imports:**
  - Changed from `Task` to `TaskInterface` to match exported types

### 3. Task Dashboard Hooks (`src/components/tasks/hooks/index.ts`)
- **Updated `useTasksQuery`:**
  - Accepts pagination parameters
  - Returns total count from API response

- **Added `useServerPagination` hook:**
  - Manages current page state
  - Calculates offset based on current page and items per page
  - Returns pagination parameters for API calls
  - Provides page navigation functions (goToPage, nextPage, previousPage)

### 4. Task Dashboard Component (`src/components/tasks/TaskDashboard.tsx`)
- **Enhanced to support both server-side and client-side pagination:**
  - Detects pagination mode based on props
  - Server-side: Uses external pagination state and callbacks
  - Client-side: Falls back to filtering in-memory data
  - Maintains backward compatibility with existing usage

- **New props:**
  - `currentPage`: Current page number
  - `totalItems`: Total number of items from server
  - `itemsPerPage`: Number of items per page (default: 15)
  - `onPageChange`: Callback when page changes

### 5. Task Dashboard Types (`src/components/tasks/types/index.ts`)
- **Updated `TaskDashboardProps` interface:**
  - Added optional pagination props for server-side pagination

### 6. Dashboard Components
All dashboard components updated with pagination:

#### Updated Components:
- `MyTasks` (`src/components/Dashboard/MyTasks/index.tsx`)
- `ToDoList` (`src/components/Dashboard/ToDoList/index.tsx`)
- `TasksWaitingForMe` (`src/components/Dashboard/TasksWaitingForMe/index.tsx`)
- `TasksInProgress` (`src/components/Dashboard/TasksInProgress/index.tsx`)
- `TasksCompleted` (`src/components/Dashboard/TasksCompleted/index.tsx`)
- `TasksStopped` (`src/components/Dashboard/TasksStopped/index.tsx`)
- `TasksUnassigned` (`src/components/Dashboard/TasksUnassigned/index.tsx`)

#### Each component now:
- Manages pagination state locally (currentPage)
- Sets itemsPerPage to 15
- Calculates offset: `(currentPage - 1) * itemsPerPage`
- Passes pagination params to `useApiList` hook
- Receives `total` count from API
- Passes pagination props to `TaskDashboard` component
- Handles page changes through `handlePageChange` callback

## API Requirements

The backend API endpoints must return responses in this format:

```json
{
  "tasks": [...],
  "total": 150,  // Total number of items across all pages
  "limit": 15,   // Items per page
  "offset": 0    // Current offset
}
```

## Usage Example

```tsx
// In a dashboard component
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 15;

const paginationParams = {
  limit: itemsPerPage,
  offset: (currentPage - 1) * itemsPerPage,
};

const { data: tasks, total, isLoading, error, refetch } = useApiList({
  fetcher: fetchMyTasks,
  queryKey: ['tasks', 'my-tasks', paginationParams],
  paginationParams,
});

const handlePageChange = (page: number) => {
  setCurrentPage(page);
};

// Pass to TaskDashboard
<TaskDashboard
  tasks={tasks}
  currentPage={currentPage}
  totalItems={total}
  itemsPerPage={itemsPerPage}
  onPageChange={handlePageChange}
/>
```

## Benefits

1. **Performance**: Only loads 15 items at a time instead of all data
2. **Scalability**: Can handle large datasets efficiently
3. **Consistency**: All dashboard pages use the same pagination pattern
4. **User Experience**: Faster initial load times
5. **Flexibility**: Easy to change items per page by updating DEFAULT_LIMIT

## Configuration

To change the default number of items per page, update:
- `DEFAULT_LIMIT` in `src/services/taskServices.ts`
- `itemsPerPage` in each dashboard component (currently set to 15)

## Notes

- The implementation maintains backward compatibility
- Client-side filtering still works on the current page's data
- React Query handles caching per page automatically
- Page state resets to 1 when filters change

