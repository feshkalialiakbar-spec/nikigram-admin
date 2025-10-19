import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Zod schema for request validation
const TaskIdSchema = z.object({
  task_id: z.string().regex(/^\d+$/, 'Task ID must be a number'),
});

// Query parameter schema for LAN_ID
const QuerySchema = z.object({
  LAN_ID: z.string().optional().default('fa'),
});

// Mock data for project template request
const mockProjectTemplate = {
  id: 264,
  requestDate: '۱۴۰۴/۷/۲۲',
  userName: 'عسل طلا',
  userAvatar: '/path/to/avatar.jpg',
  templateName: 'قالب پروژه نمونه',
  templateDescription: 'این یک قالب پروژه نمونه برای تست است',
  projectType: 'توسعه نرم‌افزار',
  estimatedDuration: '۳ ماه',
  budget: '۱۰۰،۰۰۰،۰۰۰ تومان',
  priority: 'متوسط',
  status: 'در انتظار تایید',
  attachments: [
    {
      id: 1,
      name: 'مستندات پروژه.pdf',
      url: '/uploads/project_docs.pdf',
      size: '2.5 MB',
      uploadDate: '۱۴۰۴/۷/۲۰',
    },
    {
      id: 2,
      name: 'نمودار معماری.jpg',
      url: '/uploads/architecture_diagram.jpg',
      size: '1.2 MB',
      uploadDate: '۱۴۰۴/۷/۲۱',
    },
  ],
  stakeholders: [
    {
      id: 1,
      name: 'احمد محمدی',
      role: 'مدیر پروژه',
      email: 'ahmad@example.com',
      phone: '09123456789',
    },
    {
      id: 2,
      name: 'فاطمه احمدی',
      role: 'تحلیلگر سیستم',
      email: 'fateme@example.com',
      phone: '09123456790',
    },
  ],
  requirements: [
    'پیاده‌سازی سیستم مدیریت کاربران',
    'ایجاد داشبورد مدیریتی',
    'پیاده‌سازی سیستم گزارش‌گیری',
    'تست و تحویل نهایی',
  ],
  aiComment: 'این قالب پروژه دارای ساختار مناسبی است و توصیه می‌شود.',
};

export async function GET(
  request: NextRequest,
  { params }: { params: { task_id: string } }
): Promise<NextResponse> {
  try {
    // Validate the task_id parameter
    const taskValidation = TaskIdSchema.safeParse(params);
    
    if (!taskValidation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid task ID', 
          details: taskValidation.error.issues 
        },
        { status: 400 }
      );
    }

    // Validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const queryValidation = QuerySchema.safeParse(queryParams);
    
    if (!queryValidation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid query parameters', 
          details: queryValidation.error.issues 
        },
        { status: 400 }
      );
    }

    const { task_id } = taskValidation.data;
    const { LAN_ID } = queryValidation.data;
    const taskIdNumber = parseInt(task_id);

    // In a real application, you would fetch this data from your database
    // and potentially translate content based on LAN_ID
    const projectTemplate = {
      ...mockProjectTemplate,
      id: taskIdNumber,
      language: LAN_ID,
    };

    return NextResponse.json(projectTemplate, { status: 200 });

  } catch (error) {
    console.error('Error fetching project template:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { task_id: string } }
): Promise<NextResponse> {
  try {
    // Validate the task_id parameter
    const validationResult = TaskIdSchema.safeParse(params);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid task ID', 
          details: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // In a real application, you would update the project template in your database
    // For now, we'll just return a success response
    return NextResponse.json(
      { 
        message: 'Project template updated successfully',
        task_id: validationResult.data.task_id 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating project template:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { task_id: string } }
): Promise<NextResponse> {
  try {
    // Validate the task_id parameter
    const validationResult = TaskIdSchema.safeParse(params);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid task ID', 
          details: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    // In a real application, you would delete the project template from your database
    // For now, we'll just return a success response
    return NextResponse.json(
      { 
        message: 'Project template deleted successfully',
        task_id: validationResult.data.task_id 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting project template:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

