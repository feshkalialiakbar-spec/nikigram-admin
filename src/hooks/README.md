# Hooks Documentation

This directory contains custom React hooks for the Nikigram Admin application.

## Structure

- `useTaskServices.ts` - Task-related hooks using React Query
- `index.ts` - Central export file for all hooks

## Task Hooks

### Generic API Hook

#### `useApiList<T>`
A generic hook for fetching data with React Query.

```typescript
import { useApiList } from '@/hooks/useTaskServices';
import { fetchMyTasks } from '@/services/taskServices';

const MyComponent = () => {
  const { data, isLoading, error, refetch } = useApiList({
    fetcher: fetchMyTasks,
    queryKey: ['tasks', 'my-tasks'],
    enabled: true,
    retry: 3,
  });

  // ... rest of component
};
```

**Parameters:**
- `fetcher`: Async function that fetches the data
- `queryKey`: Array of strings used as the React Query cache key
- `enabled`: Boolean to enable/disable the query (default: `true`)
- `retry`: Number of retry attempts on failure (default: `3`)
- `staleTime`: Time in ms before data is considered stale
- `gcTime`: Time in ms before unused data is garbage collected

**Returns:**
- `data`: The fetched data
- `isLoading`: Boolean indicating if the query is loading
- `error`: Error object if the query failed
- `refetch`: Function to manually refetch the data
- `isError`: Boolean indicating if there was an error
- `isFetching`: Boolean indicating if the query is fetching

### Specific Task Hooks

#### `useMyTasks()`
Fetches tasks assigned to the current user.

```typescript
import { useMyTasks } from '@/hooks/useTaskServices';

const { data: tasks, isLoading, error } = useMyTasks();
```

#### `useUnassignedTasks()`
Fetches unassigned tasks.

```typescript
import { useUnassignedTasks } from '@/hooks/useTaskServices';

const { data: tasks, isLoading, error } = useUnassignedTasks();
```

#### `useStoppedTasks()`
Fetches stopped tasks.

```typescript
import { useStoppedTasks } from '@/hooks/useTaskServices';

const { data: tasks, isLoading, error } = useStoppedTasks();
```

#### `useTask(id)`
Fetches a single task by ID.

```typescript
import { useTask } from '@/hooks/useTaskServices';

const { data: task, isLoading, error } = useTask('123');
```

### Mutation Hooks

#### `useCreateTask()`
Creates a new task.

```typescript
import { useCreateTask } from '@/hooks/useTaskServices';

const createTask = useCreateTask();

const handleCreate = async () => {
  try {
    await createTask.mutateAsync({
      taskName: 'New Task',
      process: 'Profile',
      // ... other task data
    });
  } catch (error) {
    console.error('Failed to create task:', error);
  }
};
```

#### `useUpdateTask()`
Updates an existing task.

```typescript
import { useUpdateTask } from '@/hooks/useTaskServices';

const updateTask = useUpdateTask();

const handleUpdate = async () => {
  try {
    await updateTask.mutateAsync({
      id: '123',
      data: { taskName: 'Updated Task' }
    });
  } catch (error) {
    console.error('Failed to update task:', error);
  }
};
```

#### `useDeleteTask()`
Deletes a task.

```typescript
import { useDeleteTask } from '@/hooks/useTaskServices';

const deleteTask = useDeleteTask();

const handleDelete = async () => {
  try {
    await deleteTask.mutateAsync('123');
  } catch (error) {
    console.error('Failed to delete task:', error);
  }
};
```

## Usage Examples

### Complete Component Example

```typescript
'use client';
import React from 'react';
import { useApiList } from '@/hooks/useTaskServices';
import { fetchMyTasks } from '@/services/taskServices';

const MyTasksComponent = () => {
  const { data: tasks, isLoading, error, refetch } = useApiList({
    fetcher: fetchMyTasks,
    queryKey: ['tasks', 'my-tasks'],
    enabled: true,
    retry: 3,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      {tasks?.map((task) => (
        <div key={task.id}>{task.taskName}</div>
      ))}
    </div>
  );
};
```

### Using with Specific Hook

```typescript
'use client';
import React from 'react';
import { useMyTasks } from '@/hooks/useTaskServices';

const MyTasksComponent = () => {
  const { data: tasks, isLoading, error, refetch } = useMyTasks();

  // Same component logic as above...
};
```

## React Query Configuration

The default React Query configuration is set in `@/lib/queryClient.ts`:

- **Stale Time**: 5 minutes
- **Cache Time (GC Time)**: 10 minutes
- **Retry**: 3 attempts
- **Refetch on Window Focus**: Enabled
- **Refetch on Reconnect**: Enabled

You can override these defaults by passing options to the hooks.

