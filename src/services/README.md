# Task Services Documentation

This directory contains the API services for the Nikigram Admin application.

## Structure

- `taskServices.ts` - Main task API service file with all task-related API calls
- `task.ts` - **DEPRECATED** - Kept for backward compatibility, re-exports from `taskServices.ts`
- `index.ts` - Central export file for all services

## Task Services

### Available Functions

#### `fetchMyTasks()`
Fetches all tasks assigned to the current user.
```typescript
const tasks = await fetchMyTasks();
```

#### `fetchUnassignedTasks()`
Fetches all unassigned tasks.
```typescript
const tasks = await fetchUnassignedTasks();
```

#### `fetchStoppedTasks()`
Fetches all stopped tasks.
```typescript
const tasks = await fetchStoppedTasks();
```

#### `fetchTaskById(id)`
Fetches a single task by its ID.
```typescript
const task = await fetchTaskById('123');
```

#### `createTask(taskData)`
Creates a new task.
```typescript
const newTask = await createTask({ taskName: 'New Task', ... });
```

#### `updateTask(id, taskData)`
Updates an existing task.
```typescript
const updatedTask = await updateTask('123', { taskName: 'Updated Task' });
```

#### `deleteTask(id)`
Deletes a task by its ID.
```typescript
await deleteTask('123');
```

## Usage with React Query Hooks

Instead of calling these services directly, use the React Query hooks from `@/hooks/useTaskServices`:

```typescript
import { useMyTasks, useUnassignedTasks, useStoppedTasks } from '@/hooks/useTaskServices';

// In your component
const { data: tasks, isLoading, error, refetch } = useMyTasks();
```

See the hooks documentation for more details.

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

