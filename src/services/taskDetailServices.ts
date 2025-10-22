import { 
  ProfileChangeRequest, 
  ProjectTemplate, 
  RefType 
} from '@/types/api';

/**
 * Fetch profile change request details
 */
export const fetchProfileChangeRequest = async (taskId: number): Promise<ProfileChangeRequest> => {
  try {
    const response = await fetch(`/api/admin/task/profile/change_request/${taskId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch profile change request: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching profile change request:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch profile change request');
  }
};

/**
 * Update profile change request
 */
export const updateProfileChangeRequest = async (
  taskId: number, 
  updateData: Partial<ProfileChangeRequest>
): Promise<void> => {
  try {
    const response = await fetch(`/api/admin/task/profile/change_request/${taskId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update profile change request: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error updating profile change request:', error);
    throw error instanceof Error ? error : new Error('Failed to update profile change request');
  }
};

/**
 * Delete profile change request
 */
export const deleteProfileChangeRequest = async (taskId: number): Promise<void> => {
  try {
    const response = await fetch(`/api/admin/task/profile/change_request/${taskId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete profile change request: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting profile change request:', error);
    throw error instanceof Error ? error : new Error('Failed to delete profile change request');
  }
};

/**
 * Fetch project template details
 */
export const fetchProjectTemplate = async (
  taskId: number, 
  languageId: string = 'fa'
): Promise<ProjectTemplate> => {
  try {
    const response = await fetch(`/api/admin/task/project/template/${taskId}/?LAN_ID=${languageId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch project template: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching project template:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch project template');
  }
};

/**
 * Update project template
 */
export const updateProjectTemplate = async (
  taskId: number, 
  updateData: Partial<ProjectTemplate>
): Promise<void> => {
  try {
    const response = await fetch(`/api/admin/task/project/template/${taskId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update project template: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error updating project template:', error);
    throw error instanceof Error ? error : new Error('Failed to update project template');
  }
};

/**
 * Delete project template
 */
export const deleteProjectTemplate = async (taskId: number): Promise<void> => {
  try {
    const response = await fetch(`/api/admin/task/project/template/${taskId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete project template: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting project template:', error);
    throw error instanceof Error ? error : new Error('Failed to delete project template');
  }
};

/**
 * Fetch task details by ref type - Updated to use internal API routes
 */
export const fetchTaskDetailsByRefType = async (
  refType: number, 
  refId: number
): Promise<ProfileChangeRequest | ProjectTemplate> => {
  try {
    switch (refType) {
      case RefType.PARTY_CHANGE_REQUEST:
        return await fetchProfileChangeRequest(refId);
      case RefType.PROJECT_REQUEST:
        // This would still call the external API as it's not implemented yet
        throw new Error('Project request endpoint not implemented');
      case RefType.PROJECT_TASKS:
        // This would still call the external API as it's not implemented yet
        throw new Error('Project tasks endpoint not implemented');
      case RefType.REQUEST_PROJECT_TEMPLATE:
        return await fetchProjectTemplate(refId);
      default:
        throw new Error(`Unsupported ref_type: ${refType}`);
    }
  } catch (error) {
    console.error('Error fetching task details:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch task details');
  }
};

