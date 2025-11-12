import { getoken } from '@/actions/cookieToken';

export interface StaffMemberTaskStats {
  pending_tasks: number;
  in_progress_tasks: number;
  completed_tasks: number;
  total_tasks: number;
}

export interface StaffMember {
  staff_id: number;
  user_id: number;
  position_id: number | null;
  cust_id: number | null;
  PartyID: number | null;
  FirstName: string | null;
  LastName: string | null;
  FullName: string | null;
  Alias: string | null;
  ProfileImage: string | null;
  Mobile: string | null;
  Email: string | null;
  task_stats: StaffMemberTaskStats;
}

export interface StaffListResponse {
  total_staff: number;
  staff_list: StaffMember[];
}

export interface FetchStaffListParams {
  limit?: number;
  offset?: number;
  search?: string;
}

export const fetchStaffList = async (
  params: FetchStaffListParams = {}
): Promise<StaffListResponse> => {
  const { limit = 10, offset = 0, search } = params;
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/staff/list/`;
  const url = new URL(baseUrl);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('offset', String(offset));

  if (search && search.trim().length > 0) {
    url.searchParams.set('search', search.trim());
  }

  const accessToken = await getoken('ADMIN_STAFF_LIST');

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${accessToken ?? ''}`,
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    const message = detail?.detail ?? response.statusText ?? 'Failed to fetch staff list';
    throw new Error(message);
  }

  return response.json();
};
