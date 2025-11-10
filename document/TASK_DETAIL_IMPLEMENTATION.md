# Task Detail Implementation

## Overview

This document describes the dynamic task detail system that automatically fetches and displays different types of tasks based on their `ref_type`.

## Architecture

### 1. **Type Definitions** (`src/components/tasks/types/index.ts`)

Added `ApiProfileChangeRequestResponse` interface that matches the API response structure for profile change requests.

```typescript
export interface ApiProfileChangeRequestResponse {
  task_details: { ... };
  staff_id: number;
  changed_fields: string[];
  party_request_details: { ... };
  party_docs_data: [...];
  party_platforms_data: [...];
}
```

### 2. **Services** (`src/services/taskServices.ts`)

Added `fetchTaskDetailsByRefType` function that:
- Takes `refType` and `refId` as parameters
- Determines the correct API endpoint based on `ref_type`
- Fetches detailed task data from the appropriate endpoint

```typescript
export const fetchTaskDetailsByRefType = async (refType: number, refId: number): Promise<any>
```

#### Supported Task Types:
- **Type 1**: Profile Change Request → `/api/admin/task/profile/change_request/{refId}/`
- **Type 2**: Project Request → `/api/admin/task/project/request/{refId}/`
- **Type 3**: Project Tasks → `/api/admin/task/project/tasks/{refId}/`
- **Type 4**: Project Template Request → `/api/admin/task/project/template/{refId}/`

### 3. **Mappers** (`src/utils/taskMappers.ts`)

Created mapper functions to transform API responses into component-compatible formats:

- `mapProfileChangeRequestToComponent()`: Converts API response to `ProfileChangeRequest` format
- `getChangedFieldsLabels()`: Translates field names to Persian labels
- Helper functions for formatting dates, file sizes, etc.

### 4. **Unified Task Detail Component** (`src/components/TaskDetail/TaskDetailPage.tsx`)

A single, reusable component that:
1. Fetches basic task info using `fetchTaskById(taskId)`
2. Determines task type from `ref_type`
3. Fetches detailed data using `fetchTaskDetailsByRefType(ref_type, ref_id)`
4. Renders appropriate UI based on task type
5. Handles loading, error states, and unsupported task types

### 5. **Updated All Task Pages**

All task detail pages now use the unified `TaskDetailPage` component:

- `src/app/dashboard/my-tasks/[id]/page.tsx`
- `src/app/dashboard/tasks/[id]/page.tsx`
- `src/app/dashboard/tasks-in-progress/[id]/page.tsx`
- `src/app/dashboard/tasks-completed/[id]/page.tsx`
- `src/app/dashboard/tasks-stopped/[id]/page.tsx`
- `src/app/dashboard/tasks-unassigned/[id]/page.tsx`
- `src/app/dashboard/tasks-waiting-for-me/[id]/page.tsx`
- `src/app/dashboard/shared-pool/[id]/page.tsx`

Each page is now simplified to:
```typescript
const TaskDetailPage: React.FC = () => {
  const params = useParams();
  const taskId = params.id as string;
  return <TaskDetailPage taskId={taskId} />;
};
```

## Data Flow

```
User clicks task → 
  Page loads with taskId → 
    TaskDetailPage component →
      1. Fetch basic info (ref_type, ref_id) →
      2. Fetch detailed data based on ref_type →
      3. Map API response to component props →
      4. Render appropriate component
```

## Example API Call

For a profile change request task (task_id: 278):

1. **First call**: `GET /api/admin/task/278`
   - Returns: `{ ref_type: 1, ref_id: 15, ... }`

2. **Second call**: `GET /api/admin/task/profile/change_request/15/`
   - Returns full profile change request details
   - Data is mapped to `ProfileChangeRequest` format
   - `ProfileChangeApproval` component is rendered

## Adding New Task Types

To add support for a new task type:

1. **Add API endpoint** in `fetchTaskDetailsByRefType()`:
   ```typescript
   case 5: // NEW_TYPE
     endpoint = `/api/admin/task/new/endpoint/${refId}/`;
     break;
   ```

2. **Create type interfaces** in `src/components/tasks/types/index.ts`

3. **Create mapper function** in `src/utils/taskMappers.ts`

4. **Create UI component** for the new task type

5. **Add case** in `TaskDetailPage.tsx`:
   ```typescript
   case TASK_TYPES.NEW_TYPE:
     const mappedData = mapNewTypeToComponent(taskDetails);
     return <NewTypeComponent data={mappedData} />;
   ```

## Benefits

✅ **DRY Principle**: Single source of truth for task detail logic
✅ **Scalable**: Easy to add new task types
✅ **Type-safe**: Full TypeScript support
✅ **Maintainable**: Changes to logic affect all pages
✅ **Dynamic**: UI adapts based on API response
✅ **Error Handling**: Graceful loading and error states

## Environment Variables

Make sure `NEXT_PUBLIC_API_URL` is set in your `.env` file:
```
NEXT_PUBLIC_API_URL=https://nikicity.com
```

## Notes

- All task detail pages now share the same implementation
- The system automatically determines which UI to show based on `ref_type`
- Loading states and error handling are built-in
- Profile images use the media endpoint: `${NEXT_PUBLIC_API_URL}/media/{file_uid}`

