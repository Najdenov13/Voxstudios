export type TaskStatus = 'pending' | 'in_progress' | 'approved' | 'rejected';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  order: number;
  stageId: string;
  projectId: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface Stage {
  id: string;
  title: string;
  description: string;
  order: number;
  tasks: Task[];
  projectId: string;
  status: 'pending' | 'in_progress' | 'completed';
  updatedAt: Date;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'archived';
  stages: Stage[];
  createdAt: Date;
  updatedAt: Date;
} 