import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Zod schema for request validation
const TaskIdSchema = z.object({
  task_id: z.string().regex(/^\d+$/, 'Task ID must be a number'),
});

// Mock data for profile change request
const mockProfileChangeRequest = {
  id: 263,
  requestDate: '۱۴۰۴/۷/۲۲',
  userName: 'عسل طلا',
  userAvatar: '/path/to/avatar.jpg',
  realProfile: {
    firstName: 'عسل',
    lastName: 'طلا',
    nationalId: '1234567890',
    birthDate: '۱۳۷۰/۰۱/۰۱',
    phoneNumber: '09123456789',
    email: 'asal@example.com',
    address: 'تهران، خیابان ولیعصر',
  },
  legalProfile: {
    companyName: 'شرکت نمونه',
    registrationNumber: '123456789',
    economicCode: '1234567890123456',
    nationalId: '9876543210',
    address: 'تهران، خیابان آزادی',
  },
  primaryIndividuals: [
    {
      id: 1,
      name: 'احمد محمدی',
      role: 'مدیر عامل',
      avatar: '/path/to/avatar1.jpg',
      isSelected: false,
    },
    {
      id: 2,
      name: 'فاطمه احمدی',
      role: 'مدیر مالی',
      avatar: '/path/to/avatar2.jpg',
      isSelected: true,
    },
  ],
  aiComment: 'توصیه می‌شود تغییرات پروفایل مورد بررسی قرار گیرد.',
};

export async function GET(
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

    const { task_id } = validationResult.data;
    const taskIdNumber = parseInt(task_id);

    // In a real application, you would fetch this data from your database
    // For now, we'll return mock data
    const profileChangeRequest = {
      ...mockProfileChangeRequest,
      id: taskIdNumber,
    };

    return NextResponse.json(profileChangeRequest, { status: 200 });

  } catch (error) {
    console.error('Error fetching profile change request:', error);
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
    
    // In a real application, you would update the profile change request in your database
    // For now, we'll just return a success response
    return NextResponse.json(
      { 
        message: 'Profile change request updated successfully',
        task_id: validationResult.data.task_id 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating profile change request:', error);
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

    // In a real application, you would delete the profile change request from your database
    // For now, we'll just return a success response
    return NextResponse.json(
      { 
        message: 'Profile change request deleted successfully',
        task_id: validationResult.data.task_id 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting profile change request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

