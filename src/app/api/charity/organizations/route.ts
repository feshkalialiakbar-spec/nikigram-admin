import { getoken } from '@/actions/cookieToken';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = await getoken('CHARITY_SERVICE_AUTH_HEADERS');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL as string;
    
    if (!baseUrl) {
      throw new Error('NEXT_PUBLIC_API_URL is not defined');
    }

    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sort_by') || 'created_at';
    const sortOrder = searchParams.get('sort_order') || 'desc';
    const limit = searchParams.get('limit') || '10';
    const offset = searchParams.get('offset') || '0';

    const queryParams = new URLSearchParams({
      sort_by: sortBy,
      sort_order: sortOrder,
      limit,
      offset,
    });

    const response = await fetch(
      `${baseUrl}/api/charity/organizations?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json(
        { 
          success: false,
          error: errorData?.detail || errorData?.message || 'خطا در دریافت لیست خیریه‌ها',
          status: response.status 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      data: {
        total_count: data?.total_count ?? 0,
        data: data?.data ?? [],
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        success: false,
        error: `Failed to fetch charity data: ${errorMessage}` 
      },
      { status: 500 }
    );
  }
}

