# Task Services Documentation

This directory contains the API services for the Nikigram Admin application.

## Structure

- `taskServices.ts` - Main task API service file with all task-related API calls
- `task.ts` - **DEPRECATED** - Kept for backward compatibility, re-exports from `taskServices.ts`
- `index.ts` - Central export file for all services

## Task Services

### Available Functions

#### `fetchMyTasks(params?)`
Fetches all tasks assigned to the current user. Returns a `TaskServiceResult` object.
```typescript
const response = await fetchMyTasks({ limit: 20, offset: 0 });

if (response.success && response.data) {
  console.log(response.data.tasks);
} else {
  console.error(response.message);
}
```

#### `fetchUnassignedTasks(params?)`
Fetches all unassigned tasks. Returns a `TaskServiceResult`.
```typescript
const response = await fetchUnassignedTasks();
```

#### `fetchStoppedTasks(params?)`
Fetches all stopped tasks. Returns a `TaskServiceResult`.
```typescript
const response = await fetchStoppedTasks();
```

#### `fetchTaskById(id)`
Fetches a single task by its ID. Returns a `TaskServiceResult`.
```typescript
const task = await fetchTaskById('123');
```

#### `createTask(taskData)`
Creates a new task. Returns a `TaskServiceResult`.
```typescript
const newTask = await createTask({ taskName: 'New Task', ... });
```

#### `updateTask(id, taskData)`
Updates an existing task. Returns a `TaskServiceResult`.
```typescript
const updatedTask = await updateTask('123', { taskName: 'Updated Task' });
```

#### `deleteTask(id)`
Deletes a task by its ID. Returns a `TaskServiceResult`.
```typescript
await deleteTask('123');
```

## Using Services With Client Components

Use the `usePaginatedTaskService` hook from `@/components/tasks/hooks` to keep pagination logic inside components:

```typescript
import { fetchMyTasks } from '@/services/task/taskServices';
import { usePaginatedTaskService } from '@/components/tasks/hooks';

const { tasks, total, loading, error, refetch } = usePaginatedTaskService(fetchMyTasks, {
  limit: 15,
  offset: 0,
});
```

## Migration Guide

If you're using the old `task.ts` service:

**Old way:**
```typescript
import { getTasks } from '@/services/task';
```

**New way:**
```typescript
import { fetchMyTasks } from '@/services/taskServices';
// or
import { fetchMyTasks } from '@/services'; // using index.ts
```

The old imports will still work but are deprecated and will be removed in a future version.

