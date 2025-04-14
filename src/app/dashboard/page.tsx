'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

type StepStatus = 'approved' | 'not_approved' | 'needs_revision' | 'in_progress';

interface Step {
  id: string;
  name: string;
  description: string;
  status: StepStatus;
}

interface Stage {
  id: string;
  name: string;
  description: string;
  steps: Step[];
  completion: number;
}

interface Project {
  id: string;
  name: string;
  client: string;
  createdAt: string;
  status: 'active' | 'completed';
  stages: Stage[];
}

// Example data - replace with actual data storage
const initialProjects: Project[] = [
  {
    id: '1',
    name: 'Corporate Video Campaign',
    client: 'Adventure',
    createdAt: '2024-03-15',
    status: 'active',
    stages: [
      {
        id: 's1',
        name: 'Original Video Campaign',
        description: 'Upload and process the original video',
        steps: [
          {
            id: 's1-1',
            name: 'Video Upload',
            description: 'Upload the original video file',
            status: 'in_progress'
          },
          {
            id: 's1-2',
            name: 'Auditioning Brief',
            description: 'Define voice requirements',
            status: 'in_progress'
          },
          {
            id: 's1-3',
            name: 'Voice Selection',
            description: 'Select voice options',
            status: 'in_progress'
          }
        ],
        completion: 0
      },
      {
        id: 's2',
        name: 'Auditioning Brief',
        description: 'Define voice requirements and checkpoints',
        steps: [
          {
            id: 's2-1',
            name: 'Script Review',
            description: 'Review and approve script',
            status: 'in_progress'
          },
          {
            id: 's2-2',
            name: 'Feedback',
            description: 'Provide feedback',
            status: 'in_progress'
          },
          {
            id: 's2-3',
            name: 'Final Approval',
            description: 'Approve final script',
            status: 'in_progress'
          }
        ],
        completion: 0
      },
      {
        id: 's3',
        name: 'Auditioning Voices',
        description: 'Review and select voice options',
        steps: [
          {
            id: 's3-1',
            name: 'Voice Recording',
            description: 'Record voice samples',
            status: 'in_progress'
          },
          {
            id: 's3-2',
            name: 'Quality Check',
            description: 'Review recording quality',
            status: 'in_progress'
          },
          {
            id: 's3-3',
            name: 'Final Selection',
            description: 'Select final voice',
            status: 'in_progress'
          }
        ],
        completion: 0
      }
    ]
  }
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (projects.length > 0) {
      setSelectedProject(projects[0]);
    }
  }, [user, router, projects]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getStatusColor = (status: StepStatus) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'not_approved':
        return 'bg-red-100 text-red-800';
      case 'needs_revision':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: StepStatus) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const calculateStageProgress = (steps: Step[]) => {
    const approvedSteps = steps.filter(step => step.status === 'approved').length;
    return Math.round((approvedSteps / steps.length) * 100);
  };

  const handleStepStatusChange = (stageId: string, stepId: string, newStatus: StepStatus) => {
    setProjects(prevProjects =>
      prevProjects.map(project => ({
        ...project,
        stages: project.stages.map(stage => {
          if (stage.id === stageId) {
            const updatedSteps = stage.steps.map(step =>
              step.id === stepId ? { ...step, status: newStatus } : step
            );
            return {
              ...stage,
              steps: updatedSteps,
              completion: calculateStageProgress(updatedSteps)
            };
          }
          return stage;
        })
      }))
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Project Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Track your project progress and approve completed stages
        </p>
      </div>

      {/* Project Selection */}
      {projects.length > 1 && (
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Project
          </label>
          <select
            value={selectedProject?.id}
            onChange={(e) => {
              const project = projects.find(p => p.id === e.target.value);
              if (project) setSelectedProject(project);
            }}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Stages Progress */}
      {selectedProject && (
        <div className="space-y-8">
          {selectedProject.stages.map((stage) => (
            <div
              key={stage.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {stage.name}
                  </h3>
                  <p className="mt-1 text-gray-600">{stage.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ width: `${stage.completion}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{stage.completion}%</span>
                </div>
              </div>

              <div className="space-y-4">
                {stage.steps.map((step) => (
                  <div key={step.id} className="flex items-center justify-between py-2 border-t border-gray-100">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{step.name}</h4>
                      <p className="text-sm text-gray-500">{step.description}</p>
                    </div>
                    <select
                      value={step.status}
                      onChange={(e) => handleStepStatusChange(stage.id, step.id, e.target.value as StepStatus)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${getStatusColor(step.status)}`}
                    >
                      {['approved', 'not_approved', 'needs_revision', 'in_progress'].map((status) => (
                        <option key={status} value={status}>
                          {formatStatus(status as StepStatus)}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => router.push(`/stage${stage.id.split('s')[1]}`)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View Stage Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 