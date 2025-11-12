import { getoken } from '@/actions/cookieToken';


export interface ProjectTemplateDetail {
    project_temp_id: number;
    category_id: number;
    title: string;
    description: string;
    status_id: number;
    created_at: string;
    updated_at: string | null;
}

export interface ProjectTemplateCategoryDetail {
    id: number;
    pid: number;
    is_atg: boolean;
    title: string;
    description: string;
    parent_title: string;
    parent_description: string;
    fund_name: string;
    fund_logo: string | null;
}

export interface ProjectTemplateItem {
    template_detail: ProjectTemplateDetail;
    category_detail: ProjectTemplateCategoryDetail;
}

export interface ProjectTemplateListResponse {
    count: number;
    items: ProjectTemplateItem[];
}

export interface ProjectTemplateListParams {
    offset?: number;
    limit?: number;
    languageId?: string;
}

export interface ProjectTemplateRequestPayload {
    description: string;
    assignment_notes: string;
}

export interface VerifyProjectRequestPayload {
    template_id: number;
    title: string;
    description: string;
    task_assignments: Array<{
        temp_task_id: number;
        staff_id: number;
        deadline: number;
        assignment_notes: string;
    }>;
}

export interface ProjectTemplatePhaseTask {
    task_id: number;
    task_title: string;
    task_description: string | null;
    assignment_type: string | null;
    prerequisites: Array<{
        prerequisite_id: number;
        required_task_id: number;
        dependency_type_id: number;
        lag_days: number;
    }>;
    corequisites: Array<{
        corequisite_id: number;
        related_task_id: number;
        relationship_type_id: number;
    }>;
}

export interface ProjectTemplatePhase {
    phase_id: number;
    phase_name: string;
    phase_description: string;
    phase_type_id: number;
    prerequisites: Array<{
        prerequisite_id: number;
        required_phase_id: number;
        dependency_type_id: number;
        lag_days: number;
    }>;
    corequisites: Array<{
        corequisite_id: number;
        related_phase_id: number;
        relationship_type_id: number;
    }>;
    tasks: ProjectTemplatePhaseTask[];
}

export interface ProjectTemplateDetailResponse extends ProjectTemplateDetail {
    category_detail: ProjectTemplateCategoryDetail;
    phases: ProjectTemplatePhase[];
}

const buildProjectTemplateListUrl = (params?: ProjectTemplateListParams) => {
    const url = new URL('/api/admin/project-template/list/', `${process.env.NEXT_PUBLIC_API_URL}`);
    url.searchParams.set('LAN_ID', params?.languageId ?? 'fa');

    if (typeof params?.offset === 'number') {
        url.searchParams.set('offset', String(params.offset));
    }

    if (typeof params?.limit === 'number') {
        url.searchParams.set('limit', String(params.limit));
    }
    return url.toString();
};

const inFlightRequests = new Map<string, Promise<unknown>>();

const runSingleFlight = async <T>(key: string, fetcher: () => Promise<T>): Promise<T> => {
    if (inFlightRequests.has(key)) {
        return inFlightRequests.get(key) as Promise<T>;
    }

    const promise = fetcher().finally(() => {
        inFlightRequests.delete(key);
    });

    inFlightRequests.set(key, promise);

    return promise;
};

export const fetchProjectTemplateList = async (
    params?: ProjectTemplateListParams
): Promise<ProjectTemplateListResponse> => {
    const url = buildProjectTemplateListUrl(params);
    const cacheKey = `GET:${url}`;

    return runSingleFlight(cacheKey, async () => {
        const accessToken = await getoken('PROJECT_TEMPLATE_LIST');

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch project templates');
        }

        return response.json();
    });
};

export const createProjectTemplateRequest = async (
    requestId: number | string,
    payload: ProjectTemplateRequestPayload
) => {
    const accessToken = await getoken('PROJECT_TEMPLATE_CREATE_REQUEST');
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/project/request/${requestId}/request-template`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const detail = errorBody?.detail ?? response.statusText;
        throw new Error(detail || 'Failed to create template request');
    }

    return response.json().catch(() => ({}));
};

export const verifyProjectRequest = async (
    requestId: number | string,
    payload: VerifyProjectRequestPayload
) => {
    const accessToken = await getoken('PROJECT_TEMPLATE_VERIFY_REQUEST');
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/task/project/request/${requestId}/verify`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const detail = errorBody?.detail ?? response.statusText;
        throw new Error(detail || 'Failed to verify project request');
    }

    return response.json().catch(() => ({}));
};

export const fetchProjectTemplateDetail = async (
    templateId: number | string,
    languageId = 'fa'
): Promise<ProjectTemplateDetailResponse> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/project-template/${templateId}?LAN_ID=${languageId}`;
    const cacheKey = `GET:${url}`;

    return runSingleFlight(cacheKey, async () => {
        const accessToken = await getoken('PROJECT_TEMPLATE_DETAIL');

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch project template detail');
        }

        return response.json();
    });
};

