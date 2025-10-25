# Dashboard Implementation

## Overview
This implementation provides a comprehensive task management dashboard with real-time updates, client-side caching, and a modern UI that matches the provided design specifications.

## Features Implemented

### 1. Task Status System
- **37 = در انتظار** (Pending) - Yellow status badge
- **38 = در حال انجام** (In Progress) - Blue status badge  
- **39 = تکمیل شده** (Completed) - Green status badge
- **40 = تایید شده** (Approved) - Light blue status badge
- **41 = نیاز به اصلاح** (Needs Correction) - Red status badge
- **42 = رد شده** (Rejected) - Red status badge
- **43 = لغو شده** (Cancelled) - Gray status badge

### 2. Dashboard Components
- **Main Dashboard** (`/dashboard`) - Shows all tasks
- **My Tasks** (`/dashboard/my-tasks`) - User's assigned tasks
- **Tasks In Progress** (`/dashboard/tasks-in-progress`) - Active tasks
- **Tasks Completed** (`/dashboard/tasks-completed`) - Finished tasks
- **Tasks Stopped** (`/dashboard/tasks-stopped`) - Cancelled tasks
- **Tasks Unassigned** (`/dashboard/tasks-unassigned`) - Unassigned tasks

### 3. Real-time Updates
- **Polling-based updates** every 30 seconds
- **Server-Sent Events (SSE) support** ready for implementation
- **Optimistic updates** for better UX
- **Automatic cache invalidation** when data changes

### 4. Client-side Caching
- **React Query integration** for intelligent caching
- **5-minute stale time** to reduce API calls
- **10-minute garbage collection** for memory management
- **Background refetching** on window focus/reconnect

### 5. UI Components
- **Task Table** with status badges, operation buttons, and personnel avatars
- **Filter Bar** with search, dropdowns, and date picker
- **Pagination** with navigation controls
- **Responsive design** for mobile and desktop
- **Loading states** and error handling

## File Structure

```
src/
├── components/
│   ├── Dashboard/
│   │   ├── index.tsx                    # Main dashboard component
│   │   ├── MyTasks/
│   │   ├── TasksInProgress/
│   │   ├── TasksCompleted/
│   │   ├── TasksStopped/
│   │   └── TasksUnassigned/
│   ├── tasks/
│   │   ├── TaskDashboard.tsx           # Main task dashboard
│   │   ├── TaskTable.tsx               # Task table component
│   │   ├── FilterBar.tsx               # Filter controls
│   │   ├── Pagination.tsx              # Pagination component
│   │   ├── hooks/                      # Task management hooks
│   │   ├── types/                      # TypeScript definitions
│   │   └── utils/                      # Utility functions
│   └── providers/
│       └── QueryProvider.tsx           # React Query provider
├── hooks/
│   ├── useTasks.ts                     # Task data hooks
│   └── useRealTimeTasks.ts             # Real-time update hooks
├── services/
│   └── task.ts                         # Task API service
└── app/
    └── dashboard/                      # Dashboard pages
```

## API Integration

### Current Implementation
- Uses existing `getTasks()` service
- Maps backend status IDs to UI statuses
- Handles API errors gracefully
- Provides fallback data

### Backend Communication
The system is designed to work with your FastAPI backend:

1. **Current API Endpoint**: `/api/admin/task/my_list/`
2. **Status Mapping**: Backend status IDs (37-43) mapped to UI statuses
3. **Real-time Updates**: Ready for SSE or WebSocket integration

### Recommended Backend Integration
For optimal real-time updates, implement one of these:

1. **Server-Sent Events (SSE)**
   ```python
   @app.get("/api/tasks/events")
   async def task_events():
       # Stream task updates to frontend
   ```

2. **WebSocket Connection**
   ```python
   @app.websocket("/ws/tasks")
   async def websocket_endpoint(websocket: WebSocket):
       # Handle real-time task updates
   ```

3. **Simple Polling Endpoint**
   ```python
   @app.get("/api/tasks/updates")
   async def get_task_updates(last_update: datetime):
       # Return only changed tasks since last_update
   ```

## Usage

### Basic Dashboard
```tsx
import Dashboard from '@/components/Dashboard';

<Dashboard title="میز کار من" />
```

### Individual Task Pages
```tsx
import MyTasks from '@/components/Dashboard/MyTasks';

<MyTasks />
```

### Real-time Updates
```tsx
import { useRealTimeTasks } from '@/hooks/useRealTimeTasks';

// Enable real-time updates
useRealTimeTasks({
  enabled: true,
  interval: 30000, // 30 seconds
});
```

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### React Query Configuration
```typescript
// src/lib/queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,    // 5 minutes
      gcTime: 10 * 60 * 1000,      // 10 minutes
      retry: 3,
      refetchOnWindowFocus: true,
    },
  },
});
```

## Performance Optimizations

1. **Smart Caching**: Only refetch when data is stale
2. **Optimistic Updates**: Immediate UI updates for better UX
3. **Debounced Filtering**: Prevents excessive API calls
4. **Virtual Scrolling**: Ready for large datasets
5. **Lazy Loading**: Components load only when needed

## Future Enhancements

1. **WebSocket Integration**: Real-time bidirectional communication
2. **Offline Support**: Service worker for offline functionality
3. **Advanced Filtering**: Date ranges, multiple selections
4. **Export Features**: PDF/Excel export capabilities
5. **Bulk Operations**: Multi-select task actions

## Testing

The implementation includes:
- TypeScript for type safety
- Error boundaries for graceful failures
- Loading states for better UX
- Responsive design testing
- Accessibility compliance

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

- React 19.1.0
- Next.js 15.5.4
- React Query 5.90.2
- TypeScript 5
- Sass 1.93.2
