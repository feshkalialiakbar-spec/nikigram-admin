# خلاصه سیستم Task Routing و Detail

## ✅ چیزهایی که پیاده‌سازی شد

### 1. **سیستم Routing هوشمند**
- ✅ کلیک روی هر تسک → خودکار به صفحه مناسب redirect می‌شه
- ✅ بر اساس `ref_type` مسیر تعیین می‌شه
- ✅ Hook اختصاصی برای navigation: `useTaskNavigation`

### 2. **صفحه جزئیات پروفایل (Profile Task)**
- ✅ مسیر: `/dashboard/tasks/profile/[id]`
- ✅ API: `GET /api/admin/task/profile/change_request/{id}/`
- ✅ نمایش با component: `ProfileChangeApproval`
- ✅ داده‌های واقعی از backend

### 3. **Data Mapping**
- ✅ تبدیل خودکار API response به format component
- ✅ نمایش فیلدهای تغییر یافته در AI comment
- ✅ فرمت تاریخ به شمسی
- ✅ نمایش عکس پروفایل

### 4. **فایل‌های ایجاد شده**

```
✅ src/utils/taskRouting.ts              - تبدیل ref_type به pathname
✅ src/hooks/useTaskNavigation.ts        - Hook برای navigate کردن
✅ src/app/dashboard/tasks/profile/[id]/page.tsx  - صفحه profile task
✅ src/utils/taskMappers.ts (updated)    - mapper با داده واقعی
✅ TASK_ROUTING_GUIDE.md                 - راهنمای کامل
✅ TASK_SYSTEM_SUMMARY.md                - این فایل
```

## 🎯 نحوه استفاده

### در هر لیست تسک:

```typescript
import { useTaskNavigation } from '@/hooks/useTaskNavigation';

function MyTaskList() {
  const { navigateToTask } = useTaskNavigation();
  
  return (
    <div onClick={() => navigateToTask(task.task_id)}>
      {task.task_title}
    </div>
  );
}
```

### فلو کامل:

```
کاربر کلیک می‌کنه روی تسک #278
    ↓
fetchTaskById(278) کال می‌شه
    ↓
برمی‌گردونه: { ref_type: 1, task_id: 278, redirect_url: "..." }
    ↓
ref_type = 1 → pathname = "profile"
    ↓
redirect به: /dashboard/tasks/profile/278
    ↓
صفحه profile load می‌شه
    ↓
API profile کال می‌شه: /api/admin/task/profile/change_request/278/
    ↓
داده map می‌شه و نمایش داده می‌شه
```

## 📋 Ref Type Mapping

| ref_type | نوع | pathname | وضعیت |
|----------|-----|----------|-------|
| 1 | تغییر پروفایل | `profile` | ✅ پیاده‌سازی شده |
| 2 | درخواست پروژه | `projectRequest` | ⏳ آماده برای پیاده‌سازی |
| 3 | تسک پروژه | `projectTasks` | ⏳ آماده برای پیاده‌سازی |
| 4 | درخواست تمپلیت | `template` | ⏳ آماده برای پیاده‌سازی |

## 🔄 API Endpoints

### Profile Task (ref_type: 1)
```bash
GET https://nikicity.com/api/admin/task/profile/change_request/278/

Response:
{
  "task_details": { task_id, task_title, status_name, ... },
  "party_request_details": { first_name, last_name, mobile, ... },
  "party_docs_data": [...],
  "changed_fields": ["FirstName", "LastName", ...]
}
```

## 🎨 Components Used

### ProfileChangeApproval
- نمایش اطلاعات پروفایل حقیقی
- نمایش اطلاعات پروفایل حقوقی  
- نمایش مدارک
- دکمه‌های تایید/رد
- نظر AI

## 📦 Dependencies

```json
{
  "hooks": ["useTaskNavigation", "useParams", "useRouter"],
  "utils": ["taskRouting", "taskMappers"],
  "services": ["fetchTaskById"],
  "components": ["ProfileChangeApproval"]
}
```

## 🚀 گام‌های بعدی

برای اضافه کردن نوع تسک جدید:

1. **اضافه کردن pathname** در `taskRouting.ts`
2. **ساخت folder** در `dashboard/tasks/{pathname}/[id]/`
3. **ساخت صفحه** `page.tsx` با API مخصوص
4. **ساخت mapper** برای تبدیل data (در صورت نیاز)
5. **تست** با کلیک روی تسک در dashboard

## 💡 مثال: اضافه کردن Project Request Task

```typescript
// 1. taskRouting.ts
2: 'projectRequest',

// 2. Create: dashboard/tasks/projectRequest/[id]/page.tsx
export default function ProjectRequestDetailPage() {
  const { id } = useParams();
  
  useEffect(() => {
    fetch(`/api/admin/task/project/request/${id}/`)
      .then(res => res.json())
      .then(setData);
  }, [id]);
  
  return <ProjectRequestComponent data={data} />;
}
```

## 🐛 Debug

اگه تسک باز نشد:
1. Console رو چک کن
2. Network tab رو ببین API کال میشه؟
3. `ref_type` درست برمیگرده؟
4. pathname توی `taskRouting.ts` درسته؟
5. folder structure درسته؟

## 📊 Test Checklist

برای تست profile task:

- [ ] کلیک روی تسک در my-tasks
- [ ] کلیک روی تسک در tasks-in-progress  
- [ ] کلیک روی تسک در tasks-waiting-for-me
- [ ] بررسی redirect به `/dashboard/tasks/profile/{id}`
- [ ] بررسی load شدن داده‌ها
- [ ] بررسی نمایش صحیح UI
- [ ] تست دکمه تایید/رد

---

**🎉 سیستم آماده استفاده است!**

فقط کافیه در کامپوننت‌های لیست تسک از `useTaskNavigation` استفاده کنی.

