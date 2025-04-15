/**
 * Client-side utility for interacting with project data API
 */

/**
 * Get project data by key
 * @param projectId Project ID
 * @param key Data key
 * @returns Project data or null if not found
 */
export async function getProjectData(projectId: number, key: string) {
  try {
    const response = await fetch(`/api/projects/${projectId}/data?key=${encodeURIComponent(key)}`);
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`Failed to get project data: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting project data:', error);
    throw error;
  }
}

/**
 * Set project data
 * @param projectId Project ID
 * @param key Data key
 * @param value Data value
 * @returns Created/updated project data
 */
export async function setProjectData(projectId: number, key: string, value: any) {
  try {
    const response = await fetch(`/api/projects/${projectId}/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key, value }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to set project data: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error setting project data:', error);
    throw error;
  }
}

/**
 * Delete project data
 * @param projectId Project ID
 * @param key Data key
 * @returns Success status
 */
export async function deleteProjectData(projectId: number, key: string) {
  try {
    const response = await fetch(`/api/projects/${projectId}/data?key=${encodeURIComponent(key)}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete project data: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting project data:', error);
    throw error;
  }
}

/**
 * List all project data
 * @param projectId Project ID
 * @returns Array of project data
 */
export async function listProjectData(projectId: number) {
  try {
    const response = await fetch(`/api/projects/${projectId}/data`);
    
    if (!response.ok) {
      throw new Error(`Failed to list project data: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error listing project data:', error);
    throw error;
  }
} 