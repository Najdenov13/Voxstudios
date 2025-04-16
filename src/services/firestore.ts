import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project, Stage, Task, TaskStatus } from '@/types/project';

export const createProject = async (name: string): Promise<Project> => {
  const projectRef = doc(collection(db, 'projects'));
  const now = Timestamp.now();

  const project: Project = {
    id: projectRef.id,
    name,
    status: 'active',
    stages: [],
    createdAt: now.toDate(),
    updatedAt: now.toDate(),
  };

  await setDoc(projectRef, project);
  return project;
};

export const getProject = async (projectId: string): Promise<Project | null> => {
  const projectRef = doc(db, 'projects', projectId);
  const projectSnap = await getDoc(projectRef);
  
  if (!projectSnap.exists()) return null;
  return projectSnap.data() as Project;
};

export const updateTaskStatus = async (
  projectId: string,
  stageId: string,
  taskId: string,
  status: TaskStatus
): Promise<void> => {
  const taskRef = doc(db, 'projects', projectId, 'stages', stageId, 'tasks', taskId);
  await updateDoc(taskRef, {
    status,
    updatedAt: Timestamp.now(),
  });
};

export const getProjectStages = async (projectId: string): Promise<Stage[]> => {
  const stagesRef = collection(db, 'projects', projectId, 'stages');
  const q = query(stagesRef, orderBy('order'));
  const stagesSnap = await getDocs(q);
  
  const stages: Stage[] = [];
  for (const stageDoc of stagesSnap.docs) {
    const stage = stageDoc.data() as Stage;
    
    // Get tasks for this stage
    const tasksRef = collection(db, 'projects', projectId, 'stages', stageDoc.id, 'tasks');
    const tasksQ = query(tasksRef, orderBy('order'));
    const tasksSnap = await getDocs(tasksQ);
    
    stage.tasks = tasksSnap.docs.map(taskDoc => taskDoc.data() as Task);
    stages.push(stage);
  }
  
  return stages;
};

export const canInteractWithTask = (stages: Stage[], currentStageId: string, taskOrder: number): boolean => {
  const currentStage = stages.find(stage => stage.id === currentStageId);
  if (!currentStage) return false;

  // If there's a task with a lower order number that's not approved, you can't interact
  const previousTasks = currentStage.tasks.filter(task => task.order < taskOrder);
  return !previousTasks.some(task => task.status !== 'approved');
};

export const initializeProjectStages = async (projectId: string): Promise<void> => {
  const stages: Omit<Stage, 'tasks'>[] = [
    {
      id: 'stage1',
      title: 'Stage 1: Original Video Campaign',
      description: 'Upload and process the original video',
      order: 1,
      projectId,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Add other stages...
  ];

  const tasks: Omit<Task, 'stageId'>[] = [
    {
      id: 'task1',
      title: 'Original Video Campaign',
      description: 'Upload and manage your original video content',
      status: 'pending',
      order: 1,
      projectId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'task2',
      title: 'Auditioning Brief',
      description: 'Create and review the auditioning requirements',
      status: 'pending',
      order: 2,
      projectId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'task3',
      title: 'Voice Selection',
      description: 'Listen to and manage voice auditions',
      status: 'pending',
      order: 3,
      projectId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Create stages and tasks in Firestore
  for (const stage of stages) {
    const stageRef = doc(db, 'projects', projectId, 'stages', stage.id);
    await setDoc(stageRef, stage);

    // Add tasks for this stage
    const stageTasks = tasks.map(task => ({
      ...task,
      stageId: stage.id,
    }));

    for (const task of stageTasks) {
      const taskRef = doc(db, 'projects', projectId, 'stages', stage.id, 'tasks', task.id);
      await setDoc(taskRef, task);
    }
  }
}; 