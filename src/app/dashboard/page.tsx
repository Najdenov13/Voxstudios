'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useProject } from '@/contexts/ProjectContext';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

type StepStatus = 'approved' | 'not_approved' | 'needs_revision' | 'in_progress';

interface Step {
  id: string;
  name: string;
  status: StepStatus;
  description: string;
}

interface Stage {
  id: string;
  name: string;
  description: string;
  steps: Step[];
  completion: number;
}

// Sample stages data
const sampleStages: Stage[] = [
  {
    id: 'stage1',
    name: 'Stage 1: Initial Setup',
    description: 'Set up your project and upload initial content',
    steps: [
      {
        id: 'step1',
        name: 'Project Setup',
        status: 'approved',
        description: 'Create and configure your project'
      },
      {
        id: 'step2',
        name: 'Content Upload',
        status: 'in_progress',
        description: 'Upload your initial content'
      },
      {
        id: 'step3',
        name: 'Voice Selection',
        status: 'not_approved',
        description: 'Select voices for your project'
      }
    ],
    completion: 33
  },
  {
    id: 'stage2',
    name: 'Stage 2: Voice Generation',
    description: 'Generate and customize voices for your project',
    steps: [
      {
        id: 'step1',
        name: 'Base Voice Selection',
        status: 'not_approved',
        description: 'Select base voices for your project'
      },
      {
        id: 'step2',
        name: 'AI Voice Generation',
        status: 'not_approved',
        description: 'Generate AI-powered voices'
      },
      {
        id: 'step3',
        name: 'Voice Customization',
        status: 'not_approved',
        description: 'Customize voices to match your needs'
      }
    ],
    completion: 0
  },
  {
    id: 'stage3',
    name: 'Stage 3: Review and Feedback',
    description: 'Review and provide feedback on generated voices',
    steps: [
      {
        id: 'step1',
        name: 'Voice Review',
        status: 'not_approved',
        description: 'Review generated voices'
      },
      {
        id: 'step2',
        name: 'Feedback Collection',
        status: 'not_approved',
        description: 'Collect feedback from stakeholders'
      },
      {
        id: 'step3',
        name: 'Iteration',
        status: 'not_approved',
        description: 'Iterate based on feedback'
      }
    ],
    completion: 0
  },
  {
    id: 'stage4',
    name: 'Stage 4: Finalization',
    description: 'Finalize and export your project',
    steps: [
      {
        id: 'step1',
        name: 'Final Review',
        status: 'not_approved',
        description: 'Final review of all voices'
      },
      {
        id: 'step2',
        name: 'Export',
        status: 'not_approved',
        description: 'Export your project'
      },
      {
        id: 'step3',
        name: 'Delivery',
        status: 'not_approved',
        description: 'Deliver your project'
      }
    ],
    completion: 0
  }
];

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const { currentProject } = useProject();
  const router = useRouter();
  const [stages, setStages] = useState<Stage[]>(sampleStages);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!currentProject) {
      router.push('/projects');
      return;
    }
  }, [isAuthenticated, currentProject, router]);

  const handleLogout = () => {
    // Logout is handled by the AuthContext
    router.push('/login');
  };

  const getStatusColor = (status: StepStatus) => {
    switch (status) {
      case 'approved':
        return 'text-green-500';
      case 'not_approved':
        return 'text-red-500';
      case 'needs_revision':
        return 'text-yellow-500';
      case 'in_progress':
      default:
        return 'text-gray-500';
    }
  };

  const formatStatus = (status: StepStatus) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const calculateStageProgress = (steps: Step[]) => {
    const completed = steps.filter(step => step.status === 'approved').length;
    return Math.round((completed / steps.length) * 100);
  };

  const handleStepStatusChange = (stageId: string, stepId: string, newStatus: StepStatus) => {
    setStages(prevStages => {
      return prevStages.map(stage => {
        if (stage.id === stageId) {
          const updatedSteps = stage.steps.map(step => {
            if (step.id === stepId) {
              return { ...step, status: newStatus };
            }
            return step;
          });
          
          return {
            ...stage,
            steps: updatedSteps,
            completion: calculateStageProgress(updatedSteps)
          };
        }
        return stage;
      });
    });
  };

  if (!isAuthenticated || !currentProject) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/projects" className="text-gray-500 hover:text-gray-700 mr-4">
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">{currentProject.name}</h1>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-4">Project Dashboard</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6">
            {stages.map((stage) => (
              <div key={stage.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{stage.name}</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">{stage.description}</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-16 h-16 relative">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#E5E7EB"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#3B82F6"
                          strokeWidth="3"
                          strokeDasharray={`${stage.completion}, 100`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-blue-600">
                        {stage.completion}%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {stage.steps.map((step) => (
                      <li key={step.id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`mr-3 ${getStatusColor(step.status)}`}>
                              {step.status === 'approved' && <CheckCircleIcon className="h-5 w-5" />}
                              {step.status === 'not_approved' && <XCircleIcon className="h-5 w-5" />}
                              {step.status === 'needs_revision' && <ExclamationCircleIcon className="h-5 w-5" />}
                              {step.status === 'in_progress' && <ClockIcon className="h-5 w-5" />}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{step.name}</p>
                              <p className="text-sm text-gray-500">{step.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Link
                              href={`/${stage.id}/card${step.id.replace('step', '')}`}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              View
                              <ArrowRightIcon className="ml-1 h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 