import { NextRequest, NextResponse } from 'next/server';
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const taskId = id;
    const token = request.cookies.get('access_token')?.value;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL as string;
    if (!baseUrl) {
      throw new Error('NEXT_PUBLIC_API_URL is not defined');
    }
    console.log(`Fetching task redirect: ${baseUrl}/api/admin/task/detail/${taskId}/`);
    // Get task redirect information using proxy
    const redirectResponse = await fetch(
      `${baseUrl}/api/admin/task/detail/${taskId}/`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'accept': 'application/json'
        },
      }
    )
    const redirectData = await redirectResponse.json();
    console.log('Redirect data:', redirectData);
    // Use the redirect_url from the response and combine with base URL
    const apiUrl = `${baseUrl}${redirectData.redirect_url}/`;
    console.log('Fetching task details from:', apiUrl);

    // Call the API using the redirect_url
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'accept': 'application/json'
      },
    })

    if (!response.ok) {
      console.error('Task details response failed:', response.status, response.statusText);
      throw new Error(`Failed to fetch task details: ${response.status}`);
    }

    const data = await response.json();
    console.log('Task data structure:', JSON.stringify(data, null, 2));
    
    return NextResponse.json({
      taskData: data,
      redirectData: redirectData
    });

  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to fetch task data: ${errorMessage}` },
      { status: 500 }
    );
  }
}
