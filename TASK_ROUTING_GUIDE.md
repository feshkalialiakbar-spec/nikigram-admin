# Task Routing System

## معماری سیستم Routing تسک‌ها

این سیستم به صورت خودکار کاربر را به صفحه مناسب هر نوع تسک هدایت می‌کند.

## 🎯 نحوه کار

### 1. کلیک روی تسک در لیست
وقتی کاربر روی یک تسک کلیک می‌کند:

```typescript
// در کامپوننت لیست تسک‌ها
import { useTaskNavigation } from '@/hooks/useTaskNavigation';

const { navigateToTask } = useTaskNavigation();

// در onClick handler
<div onClick={() => navigateToTask(task.task_id)}>
  {task.task_title}
</div>
```

### 2. فرآیند Redirect خودکار

```
کلیک روی تسک
    ↓
fetchTaskById(taskId) → GET /api/admin/task/detail/{id}/
    ↓
دریافت: { ref_type: 1, task_id: 278, redirect_url: "..." }
    ↓
تعیین pathname بر اساس ref_type
    ↓
Redirect به: /dashboard/tasks/{pathname}/{task_id}
```

### 3. نقشه Ref Type به Pathname

| ref_type | نوع تسک | pathname | صفحه نهایی |
|----------|---------|----------|-----------|
| 1 | درخواست تغییر پروفایل | `profile` | `/dashboard/tasks/profile/[id]` |
| 2 | درخواست پروژه | `projectRequest` | `/dashboard/tasks/projectRequest/[id]` |
| 3 | تسک‌های پروژه | `projectTasks` | `/dashboard/tasks/projectTasks/[id]` |
| 4 | درخواست تمپلیت | `template` | `/dashboard/tasks/template/[id]` |

## 📁 ساختار فایل‌ها

```
src/
├── app/dashboard/tasks/
│   ├── profile/[id]/page.tsx          ← تسک‌های پروفایل
│   ├── projectRequest/[id]/page.tsx   ← تسک‌های درخواست پروژه
│   ├── projectTasks/[id]/page.tsx     ← تسک‌های پروژه
│   └── template/[id]/page.tsx         ← تسک‌های تمپلیت
├── hooks/
│   └── useTaskNavigation.ts           ← Hook برای navigate
└── utils/
    └── taskRouting.ts                 ← تبدیل ref_type به pathname
```

## 🔧 پیاده‌سازی شده: Profile Task

### صفحه: `/dashboard/tasks/profile/[id]`

```typescript
// src/app/dashboard/tasks/profile/[id]/page.tsx

export default function ProfileTaskDetailPage() {
  const { id } = useParams();
  const [taskData, setTaskData] = useState(null);

  useEffect(() => {
    // API مخصوص profile task
    fetch(`/api/admin/task/profile/change_request/${id}/`)
      .then(res => res.json())
      .then(data => setTaskData(data));
  }, [id]);

  return <ProfileChangeApproval data={taskData} />;
}
```

### API Call
```bash
GET https://nikicity.com/api/admin/task/profile/change_request/278/
```

### Response
```json
{
  "task_details": {...},
  "party_request_details": {...},
  "party_docs_data": [...],
  "changed_fields": [...]
}
```

## 🎨 Data Mapping

داده‌های API به فرمت component تبدیل می‌شوند:

```typescript
// src/utils/taskMappers.ts
mapProfileChangeRequestToComponent(apiResponse)
```

**Input (API)**:
- `party_request_details.first_name` → **Output**: `userName`
- `party_request_details.mobile` → **Output**: `contactNumber`  
- `party_docs_data[]` → **Output**: `documents[]`
- `changed_fields[]` → **Output**: `aiComment`

## 📝 استفاده در کامپوننت‌ها

### مثال 1: Task List Component

```typescript
import { useTaskNavigation } from '@/hooks/useTaskNavigation';

const TaskList = ({ tasks }) => {
  const { navigateToTask } = useTaskNavigation();

  return (
    <div>
      {tasks.map(task => (
        <div 
          key={task.task_id}
          onClick={() => navigateToTask(task.task_id)}
          className="cursor-pointer hover:bg-gray-100"
        >
          <h3>{task.task_title}</h3>
          <p>{task.status_name}</p>
        </div>
      ))}
    </div>
  );
};
```

### مثال 2: Task Card Component

```typescript
const TaskCard = ({ taskId, title }) => {
  const { navigateToTask } = useTaskNavigation();

  return (
    <button onClick={() => navigateToTask(taskId)}>
      مشاهده جزئیات: {title}
    </button>
  );
};
```

## 🚀 افزودن نوع تسک جدید

برای اضافه کردن یک نوع تسک جدید:

### 1. اضافه کردن pathname در `taskRouting.ts`

```typescript
export const getTaskTypePathname = (refType: number): string => {
  const pathMap: Record<number, string> = {
    1: 'profile',
    2: 'projectRequest',
    3: 'projectTasks',
    4: 'template',
    5: 'newTaskType', // ← جدید
  };
  return pathMap[refType] || 'unknown';
};
```

### 2. ساخت صفحه جدید

```bash
mkdir -p src/app/dashboard/tasks/newTaskType/[id]
```

```typescript
// src/app/dashboard/tasks/newTaskType/[id]/page.tsx

export default function NewTaskDetailPage() {
  const { id } = useParams();
  // Fetch data from specific API
  // Render specific component
}
```

### 3. ساخت Mapper (در صورت نیاز)

```typescript
// src/utils/taskMappers.ts

export const mapNewTaskTypeToComponent = (apiResponse) => {
  // Transform API data to component format
};
```

## ⚡ نکات مهم

1. **تمام لیست تسک‌ها باید از `useTaskNavigation` استفاده کنند**
2. **هر نوع تسک API و صفحه مخصوص خودش را دارد**
3. **ref_type تعیین‌کننده مسیر است، نه status**
4. **taskId در URL همان task_id است که از API می‌آید**

## 🔍 Troubleshooting

### مشکل: تسک باز نمی‌شود
- بررسی کنید `fetchTaskById` درست کار می‌کند
- console.log کنید که `ref_type` دریافت می‌شود

### مشکل: صفحه 404
- مطمئن شوید folder structure درست است
- pathname در `taskRouting.ts` را چک کنید

### مشکل: داده نمایش داده نمی‌شود  
- API endpoint را بررسی کنید
- Mapper function را چک کنید

## 📊 مثال کامل Flow

```
1. User در /dashboard/my-tasks است
2. کلیک روی تسک #278
3. Call: fetchTaskById(278)
4. Response: { ref_type: 1, task_id: 278 }
5. Calculate: getTaskDetailUrl(278, 1) → "/dashboard/tasks/profile/278"
6. Navigate: router.push("/dashboard/tasks/profile/278")
7. صفحه profile/[id] load می‌شود
8. Call: fetch("/api/admin/task/profile/change_request/278/")
9. Render: <ProfileChangeApproval> با داده‌های واقعی
```

---

**نوشته شده در تاریخ**: اکتبر ۲۰۲۵  
**توسط**: سیستم هوشمند Nikigram Admin

