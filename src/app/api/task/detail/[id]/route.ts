import { NextRequest, NextResponse } from 'next/server';
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const taskId = id;
    const token = request.cookies.get(`${process.env.NEXT_PUBLIC_TOKEN_NAME}`)?.value;
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

    // For ticket type (ref_type === 6), fetch ticket details and chat history
    if (redirectData.ref_type === 6) {
      const ticketId = redirectData.ref_id || taskId;
      console.log('Fetching ticket details for task:', taskId);
      
      // Fetch ticket details from the admin API
      const ticketDetailResponse = await fetch(
        `${baseUrl}/api/admin/task/ticket/${taskId}/?LAN_ID=fa`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!ticketDetailResponse.ok) {
        console.error('Ticket detail response failed:', ticketDetailResponse.status, ticketDetailResponse.statusText);
        throw new Error(`Failed to fetch ticket detail: ${ticketDetailResponse.status}`);
      }

      const ticketDetailData = await ticketDetailResponse.json();
      console.log('Ticket detail data structure:', JSON.stringify(ticketDetailData, null, 2));

      // Fetch chat history
      const actualTicketId = ticketDetailData.ticket_details?.ticket_id || ticketId;
      console.log('Fetching chat history for ticket:', actualTicketId);
      
      const chatHistoryResponse = await fetch(
        `${baseUrl}/api/ticket/chat/page/${actualTicketId}?limit=50&offset=0`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!chatHistoryResponse.ok) {
        console.error('Chat history response failed:', chatHistoryResponse.status, chatHistoryResponse.statusText);
        throw new Error(`Failed to fetch chat history: ${chatHistoryResponse.status}`);
      }

      const chatHistoryData = await chatHistoryResponse.json();
      console.log('Chat history data structure:', JSON.stringify(chatHistoryData, null, 2));

      // Return data in the expected structure matching ApiTicketRequestResponse
      return NextResponse.json({
        taskData: {
          task_details: ticketDetailData.task_details,
          ticket_details: ticketDetailData.ticket_details,
          chat_history: chatHistoryData,
        },
        redirectData: redirectData
      }, { status: 200 });
    }

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
