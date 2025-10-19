import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id;
    
    // Get task redirect information using proxy
    const redirectResponse = await fetch(
      `https://nikicity.com/api/admin/task/detail/${taskId}/`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!redirectResponse.ok) {
      throw new Error('Failed to fetch task redirect information');
    }

    const redirectData = await redirectResponse.json();
    
    // Use the redirect_url from the response and combine with base URL
    const apiUrl = `https://nikicity.com${redirectData.redirect_url}`;
    
    // Call the API using the redirect_url
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch task details');
    }

    const data = await response.json();
    
    return NextResponse.json({
      taskData: data,
      redirectData: redirectData
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task data' },
      { status: 500 }
    );
  }
}
