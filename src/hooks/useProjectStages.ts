import { useState, useEffect } from 'react';
import { Stage, Task, TaskStatus } from '@/types/project';
import { getProjectStages, updateTaskStatus, canInteractWithTask } from '@/services/firestore';

export const useProjectStages = (projectId: string) => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStages = async () => {
      try {
        setLoading(true);
        const loadedStages = await getProjectStages(projectId);
        setStages(loadedStages);
        setError(null);
      } catch (err) {
        setError('Failed to load project stages');
        console.error('Error loading stages:', err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadStages();
    }
  }, [projectId]);

  const handleTaskStatusUpdate = async (
    stageId: string,
    taskId: string,
    status: TaskStatus
  ) => {
    try {
      const task = stages
        .find(s => s.id === stageId)
        ?.tasks.find(t => t.id === taskId);

      if (!task) {
        throw new Error('Task not found');
      }

      // Check if we can interact with this task
      if (!canInteractWithTask(stages, stageId, task.order)) {
        throw new Error('Cannot interact with this task until previous tasks are approved');
      }

      await updateTaskStatus(projectId, stageId, taskId, status);

      // Update local state
      setStages(prevStages =>
        prevStages.map(stage =>
          stage.id === stageId
            ? {
                ...stage,
                tasks: stage.tasks.map(t =>
                  t.id === taskId
                    ? { ...t, status }
                    : t
                ),
              }
            : stage
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task status');
      throw err;
    }
  };

  return {
    stages,
    loading,
    error,
    handleTaskStatusUpdate,
  };
}; 