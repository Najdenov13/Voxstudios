import { sql } from '@vercel/postgres';
import { QueryResult } from '@vercel/postgres';

export interface ProjectData {
  id: number;
  project_id: number;
  key: string;
  value: any;
  created_at: Date;
  updated_at: Date;
}

export async function getProjectData(projectId: number, key: string): Promise<ProjectData | null> {
  try {
    const result: QueryResult<ProjectData> = await sql`
      SELECT * FROM project_data 
      WHERE project_id = ${projectId} AND key = ${key}
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting project data:', error);
    throw error;
  }
}

export async function setProjectData(projectId: number, key: string, value: any): Promise<ProjectData> {
  try {
    const result: QueryResult<ProjectData> = await sql`
      INSERT INTO project_data (project_id, key, value)
      VALUES (${projectId}, ${key}, ${JSON.stringify(value)})
      ON CONFLICT (project_id, key) 
      DO UPDATE SET 
        value = ${JSON.stringify(value)},
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error setting project data:', error);
    throw error;
  }
}

export async function deleteProjectData(projectId: number, key: string): Promise<void> {
  try {
    await sql`
      DELETE FROM project_data 
      WHERE project_id = ${projectId} AND key = ${key}
    `;
  } catch (error) {
    console.error('Error deleting project data:', error);
    throw error;
  }
}

export async function listProjectData(projectId: number): Promise<ProjectData[]> {
  try {
    const result: QueryResult<ProjectData> = await sql`
      SELECT * FROM project_data 
      WHERE project_id = ${projectId}
      ORDER BY created_at DESC
    `;
    return result.rows;
  } catch (error) {
    console.error('Error listing project data:', error);
    throw error;
  }
} 