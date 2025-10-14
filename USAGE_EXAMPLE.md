# مثال استفاده از سیستم Task Navigation

## استفاده در کامپوننت‌های لیست تسک

### مثال 1: در Task Table

```typescript
// src/components/tasks/TaskTable/index.tsx
'use client';

import React from 'react';
import { useTaskNavigation } from '@/hooks/useTaskNavigation';
import { TaskInterface } from '@/interface';

interface TaskTableProps {
  tasks: TaskInterface[];
}

export const TaskTable: React.FC<TaskTableProps> = ({ tasks }) => {
  const { navigateToTask } = useTaskNavigation();

  return (
    <table>
      <thead>
        <tr>
          <th>عنوان</th>
          <th>وضعیت</th>
          <th>تاریخ</th>
          <th>عملیات</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr 
            key={task.task_id}
            onClick={() => navigateToTask(task.task_id)}
            className="cursor-pointer hover:bg-gray-100"
          >
            <td>{task.task_title}</td>
            <td>{task.status_name}</td>
            <td>{task.created_at}</td>
            <td>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToTask(task.task_id);
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                مشاهده جزئیات
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

### مثال 2: در Task Card

```typescript
// src/components/tasks/TaskCard/index.tsx
'use client';

import React from 'react';
import { useTaskNavigation } from '@/hooks/useTaskNavigation';
import { TaskInterface } from '@/interface';

interface TaskCardProps {
  task: TaskInterface;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { navigateToTask } = useTaskNavigation();

  return (
    <div 
      className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => navigateToTask(task.task_id)}
    >
      <h3 className="text-lg font-bold mb-2">{task.task_title}</h3>
      <p className="text-gray-600 mb-2">{task.task_description}</p>
      
      <div className="flex justify-between items-center mt-4">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          {task.status_name}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigateToTask(task.task_id);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          مشاهده
        </button>
      </div>
    </div>
  );
};
```

### مثال 3: در صفحه My Tasks

```typescript
// src/app/dashboard/my-tasks/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useTaskNavigation } from '@/hooks/useTaskNavigation';
import { fetchMyTasks } from '@/services/taskServices';
import { TaskInterface } from '@/interface';

export default function MyTasksPage() {
  const { navigateToTask } = useTaskNavigation();
  const [tasks, setTasks] = useState<TaskInterface[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyTasks().then(response => {
      setTasks(response.tasks);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>در حال بارگذاری...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">تسک‌های من</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map(task => (
          <div
            key={task.task_id}
            onClick={() => navigateToTask(task.task_id)}
            className="border rounded-lg p-4 cursor-pointer hover:shadow-md"
          >
            <h3 className="font-bold">{task.task_title}</h3>
            <p className="text-sm text-gray-600 mt-2">{task.status_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### مثال 4: با Loading State

```typescript
'use client';

import React, { useState } from 'react';
import { useTaskNavigation } from '@/hooks/useTaskNavigation';

export const TaskItem = ({ task }) => {
  const { navigateToTask } = useTaskNavigation();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = async () => {
    setIsNavigating(true);
    try {
      await navigateToTask(task.task_id);
    } catch (error) {
      console.error('Navigation failed:', error);
      setIsNavigating(false);
    }
  };

  return (
    <div onClick={handleClick} className="relative">
      {task.task_title}
      
      {isNavigating && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};
```

### مثال 5: با Keyboard Navigation

```typescript
export const TaskRow = ({ task, index }) => {
  const { navigateToTask } = useTaskNavigation();

  return (
    <tr
      tabIndex={0}
      onClick={() => navigateToTask(task.task_id)}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          navigateToTask(task.task_id);
        }
      }}
      className="cursor-pointer focus:bg-blue-50"
    >
      <td>{task.task_title}</td>
      <td>{task.status_name}</td>
    </tr>
  );
};
```

## نکات مهم

### 1. Event Propagation
اگه دکمه‌ای داخل یک المنت clickable داری، حتماً `stopPropagation` کن:

```typescript
<div onClick={() => navigateToTask(task.task_id)}>
  <button onClick={(e) => {
    e.stopPropagation(); // ← مهم!
    // دیگه عملیات‌ها
  }}>
    حذف
  </button>
</div>
```

### 2. Loading Handling
Hook خودش error handling داره، ولی می‌تونی خودت state اضافه کنی:

```typescript
const [navigating, setNavigating] = useState(false);

const handleNavigation = async (taskId) => {
  setNavigating(true);
  await navigateToTask(taskId);
  // Note: setNavigating(false) نیاز نیست چون صفحه تغییر می‌کنه
};
```

### 3. Accessibility
برای بهتر بودن accessibility:

```typescript
<div
  role="button"
  tabIndex={0}
  onClick={() => navigateToTask(task.task_id)}
  onKeyPress={(e) => e.key === 'Enter' && navigateToTask(task.task_id)}
  aria-label={`مشاهده جزئیات ${task.task_title}`}
>
  {task.task_title}
</div>
```

## Test کردن

برای تست کردن که درست کار می‌کنه:

1. روی یک تسک کلیک کن
2. ببین URL تغییر می‌کنه به `/dashboard/tasks/{type}/{id}`
3. ببین صفحه جزئیات load می‌شه
4. ببین داده‌ها نمایش داده می‌شن

مثلاً برای profile task:
- کلیک → `/dashboard/tasks/profile/278`
- API call → `GET /api/admin/task/profile/change_request/278/`
- نمایش → `ProfileChangeApproval` component

---

**همین!** 🎉

فقط کافیه `useTaskNavigation` رو import کنی و استفاده کنی.

