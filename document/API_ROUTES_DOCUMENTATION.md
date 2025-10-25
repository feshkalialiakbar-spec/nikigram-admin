# API Routes Documentation

This document describes the new API routes implemented for the ProfileChangeApproval component.

## Overview

Two new API routes have been implemented to handle profile change requests and project template requests:

1. `/api/admin/task/profile/change_request/{task_id}/` - For profile change requests (ref_type: 2)
2. `/api/admin/task/project/template/{task_id}/` - For project template requests (ref_type: 4)

## Route 1: Profile Change Request

### Endpoint
```
GET /api/admin/task/profile/change_request/{task_id}/
PUT /api/admin/task/profile/change_request/{task_id}/
DELETE /api/admin/task/profile/change_request/{task_id}/
```

### Parameters
- `task_id` (path parameter): Numeric task ID

### GET Response
```json
{
  "id": 263,
  "requestDate": "۱۴۰۴/۷/۲۲",
  "userName": "عسل طلا",
  "userAvatar": "/path/to/avatar.jpg",
  "realProfile": {
    "firstName": "عسل",
    "lastName": "طلا",
    "nationalId": "1234567890",
    "birthDate": "۱۳۷۰/۰۱/۰۱",
    "phoneNumber": "09123456789",
    "email": "asal@example.com",
    "address": "تهران، خیابان ولیعصر"
  },
  "legalProfile": {
    "companyName": "شرکت نمونه",
    "registrationNumber": "123456789",
    "economicCode": "1234567890123456",
    "nationalId": "9876543210",
    "address": "تهران، خیابان آزادی"
  },
  "primaryIndividuals": [
    {
      "id": 1,
      "name": "احمد محمدی",
      "role": "مدیر عامل",
      "avatar": "/path/to/avatar1.jpg",
      "isSelected": false
    },
    {
      "id": 2,
      "name": "فاطمه احمدی",
      "role": "مدیر مالی",
      "avatar": "/path/to/avatar2.jpg",
      "isSelected": true
    }
  ],
  "aiComment": "توصیه می‌شود تغییرات پروفایل مورد بررسی قرار گیرد."
}
```

### PUT Request Body
```json
{
  "realProfile": {
    "firstName": "Updated Name"
  }
}
```

### PUT Response
```json
{
  "message": "Profile change request updated successfully",
  "task_id": "263"
}
```

### DELETE Response
```json
{
  "message": "Profile change request deleted successfully",
  "task_id": "263"
}
```

## Route 2: Project Template Request

### Endpoint
```
GET /api/admin/task/project/template/{task_id}/
PUT /api/admin/task/project/template/{task_id}/
DELETE /api/admin/task/project/template/{task_id}/
```

### Parameters
- `task_id` (path parameter): Numeric task ID
- `LAN_ID` (query parameter, optional): Language ID (default: 'fa')

### GET Response
```json
{
  "id": 264,
  "requestDate": "۱۴۰۴/۷/۲۲",
  "userName": "عسل طلا",
  "userAvatar": "/path/to/avatar.jpg",
  "templateName": "قالب پروژه نمونه",
  "templateDescription": "این یک قالب پروژه نمونه برای تست است",
  "projectType": "توسعه نرم‌افزار",
  "estimatedDuration": "۳ ماه",
  "budget": "۱۰۰،۰۰۰،۰۰۰ تومان",
  "priority": "متوسط",
  "status": "در انتظار تایید",
  "attachments": [
    {
      "id": 1,
      "name": "مستندات پروژه.pdf",
      "url": "/uploads/project_docs.pdf",
      "size": "2.5 MB",
      "uploadDate": "۱۴۰۴/۷/۲۰"
    }
  ],
  "stakeholders": [
    {
      "id": 1,
      "name": "احمد محمدی",
      "role": "مدیر پروژه",
      "email": "ahmad@example.com",
      "phone": "09123456789"
    }
  ],
  "requirements": [
    "پیاده‌سازی سیستم مدیریت کاربران",
    "ایجاد داشبورد مدیریتی"
  ],
  "aiComment": "این قالب پروژه دارای ساختار مناسبی است و توصیه می‌شود.",
  "language": "fa"
}
```

### PUT Request Body
```json
{
  "templateName": "Updated Template Name",
  "status": "approved"
}
```

### PUT Response
```json
{
  "message": "Project template updated successfully",
  "task_id": "264"
}
```

### DELETE Response
```json
{
  "message": "Project template deleted successfully",
  "task_id": "264"
}
```

## Error Responses

All routes return consistent error responses:

### 400 Bad Request
```json
{
  "error": "Invalid task ID",
  "details": [
    {
      "code": "invalid_string",
      "expected": "string matching /^\\d+$/",
      "received": "invalid",
      "path": ["task_id"],
      "message": "Task ID must be a number"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Usage Examples

### Fetch Profile Change Request
```typescript
import { fetchProfileChangeRequest } from '@/services/taskDetailServices';

const profileRequest = await fetchProfileChangeRequest(263);
console.log(profileRequest.userName); // "عسل طلا"
```

### Fetch Project Template
```typescript
import { fetchProjectTemplate } from '@/services/taskDetailServices';

const template = await fetchProjectTemplate(264, 'fa');
console.log(template.templateName); // "قالب پروژه نمونه"
```

### Update Profile Change Request
```typescript
import { updateProfileChangeRequest } from '@/services/taskDetailServices';

await updateProfileChangeRequest(263, {
  realProfile: {
    firstName: 'Updated Name'
  }
});
```

## Integration with Existing Code

The new API routes integrate seamlessly with the existing `fetchTaskDetailsByRefType` function in `taskServices.ts`. The function now automatically uses internal API routes for:

- `ref_type: 1` (Profile Change Request) → `/api/admin/task/profile/change_request/{task_id}/`
- `ref_type: 4` (Project Template) → `/api/admin/task/project/template/{task_id}/`

For other ref_types (2 and 3), the function continues to use external API endpoints.

## Validation

All routes use Zod for request validation:

- Task IDs must be numeric strings
- Query parameters are validated according to their schemas
- Request bodies are validated when provided

## File Structure

```
src/
├── app/
│   └── api/
│       └── admin/
│           └── task/
│               ├── profile/
│               │   └── change_request/
│               │       └── [task_id]/
│               │           └── route.ts
│               └── project/
│                   └── template/
│                       └── [task_id]/
│                           └── route.ts
├── services/
│   └── taskDetailServices.ts
└── types/
    └── api.ts
```

