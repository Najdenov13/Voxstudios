import { db } from './config';
import { QueryResult } from 'pg';

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
    const result: QueryResult<ProjectData> = await db.query(
      'SELECT * FROM project_data WHERE project_id = $1 AND key = $2',
      [projectId, key]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting project data:', error);
    throw error;
  }
}

export async function setProjectData(projectId: number, key: string, value: any): Promise<ProjectData> {
  try {
    const result: QueryResult<ProjectData> = await db.query(
      `
      INSERT INTO project_data (project_id, key, value)
      VALUES ($1, $2, $3)
      ON CONFLICT (project_id, key) 
      DO UPDATE SET 
        value = $3,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
      `,
      [projectId, key, value]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error setting project data:', error);
    throw error;
  }
}

export async function deleteProjectData(projectId: number, key: string): Promise<void> {
  try {
    await db.query(
      'DELETE FROM project_data WHERE project_id = $1 AND key = $2',
      [projectId, key]
    );
  } catch (error) {
    console.error('Error deleting project data:', error);
    throw error;
  }
}

export async function listProjectData(projectId: number): Promise<ProjectData[]> {
  try {
    const result: QueryResult<ProjectData> = await db.query(
      'SELECT * FROM project_data WHERE project_id = $1 ORDER BY created_at DESC',
      [projectId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error listing project data:', error);
    throw error;
  }
} 