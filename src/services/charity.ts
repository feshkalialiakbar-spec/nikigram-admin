import { getoken } from '@/actions/cookieToken';

export interface CharityOrganization {
  charity_id: number;
  name: string;
  en_name: string | null;
  logo_file_uid: string | null;
  phone: string | null;
  created_at: string;
  donations_count: number;
  donors_count: number;
}

export interface CharityListResponse {
  total_count: number;
  data: CharityOrganization[];
}

export interface CharityServiceResult<T> {
  success: boolean;
  data?: T;
  message?: string;
  status?: number;
  error?: unknown;
}

export interface CharityListParams {
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

const getAuthorizationHeaders = async () => {
  const accessToken = await getoken('CHARITY_SERVICE_AUTH_HEADERS');

  if (!accessToken) {
    throw new Error('توکن دسترسی یافت نشد.');
  }

  return {
    Authorization: `Bearer ${accessToken}`,
    accept: 'application/json',
    'Content-Type': 'application/json',
  } as HeadersInit;
};

const fetchJsonSafely = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const parseErrorMessage = (payload: unknown, fallback: string) => {
  if (payload && typeof payload === 'object') {
    const detail = (payload as { detail?: string }).detail;
    const message = (payload as { message?: string }).message;
    return detail || message || fallback;
  }
  return fallback;
};

export const fetchCharityOrganizations = async (
  params?: CharityListParams
): Promise<CharityServiceResult<CharityListResponse>> => {
  const sortBy = params?.sort_by ?? 'created_at';
  const sortOrder = params?.sort_order ?? 'desc';
  const limit = params?.limit ?? 10;
  const offset = params?.offset ?? 0;

  const fallbackData: CharityListResponse = {
    total_count: 0,
    data: [],
  };

  try {
    const headers = await getAuthorizationHeaders();
    const queryParams = new URLSearchParams({
      sort_by: sortBy,
      sort_order: sortOrder,
      limit: limit.toString(),
      offset: offset.toString(),
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/charity/organizations?${queryParams.toString()}`,
      {
        method: 'GET',
        headers,
      }
    );

    const payload = await fetchJsonSafely(response);

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        message: parseErrorMessage(payload, 'خطا در دریافت لیست خیریه‌ها'),
        data: fallbackData,
      };
    }

    return {
      success: true,
      data: {
        total_count: payload?.total_count ?? 0,
        data: payload?.data ?? [],
      },
    };
  } catch (error) {
    console.error('Error fetching charity organizations:', error);
    return {
      success: false,
      message: 'خطا در ارتباط با سرور',
      error,
      data: fallbackData,
    };
  }
};

