# Hooks Documentation

This directory hosts small, reusable hooks that are shared across the admin panel.

## Available Hooks

- `useTaskNavigation` &mdash; builds task detail URLs and redirects the user based on `ref_type`.
- `useClickOutside` &mdash; detects clicks outside of a referenced element.
- `useWindowWidth` &mdash; reads the current window width and updates on resize.
- `texedit.safeText` &mdash; helper for rendering fallback text.

Each hook is exported through `@/hooks/index`.

## Task Data Hooks

Task list hooks now live alongside the task components. See `@/components/tasks/hooks` for:

- `usePaginatedTaskService` &mdash; fetches paginated task lists using the services in `@/services/task/taskServices`.
- `useTasksQuery`, `useTaskFilters`, `useTaskPagination` &mdash; utility hooks used inside the task dashboard.

### Example: Fetching Paginated Tasks

```typescript
'use client';
import { fetchMyTasks } from '@/services/task/taskServices';
import { usePaginatedTaskService } from '@/components/tasks/hooks';

const { tasks, total, loading, error, refetch } = usePaginatedTaskService(fetchMyTasks, {
  limit: 15,
  offset: 0,
});
```

All task services return a `TaskServiceResult<T>` object, so remember to check `response.success` when calling them directly.


