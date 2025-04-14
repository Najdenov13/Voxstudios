'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useProject } from '@/contexts/ProjectContext';
import { PlusIcon, FolderIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed';
  lastUpdated: string;
}

const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'Marketing Campaign 2024',
    description: 'Voice-over production for Q1 marketing campaign',
    status: 'active',
    lastUpdated: '2024-02-20'
  },
  {
    id: '2',
    name: 'Product Launch Video',
    description: 'Voice-over for new product announcement',
    status: 'active',
    lastUpdated: '2024-02-18'
  }
];

export default function ProjectsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { projects, setProjects, setCurrentProject } = useProject();
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      router.push('/login');
      return;
    }

    // Load projects from localStorage
    try {
      const storedProjects = localStorage.getItem('projects');
      if (storedProjects) {
        const parsedProjects = JSON.parse(storedProjects);
        if (Array.isArray(parsedProjects) && parsedProjects.every(isValidProject)) {
          setProjects(parsedProjects);
        } else {
          // If stored data is invalid, use sample projects
          setProjects(sampleProjects);
          localStorage.setItem('projects', JSON.stringify(sampleProjects));
        }
      } else {
        // If no stored projects, use sample projects
        setProjects(sampleProjects);
        localStorage.setItem('projects', JSON.stringify(sampleProjects));
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects(sampleProjects);
      localStorage.setItem('projects', JSON.stringify(sampleProjects));
    }
  }, [user, router, setProjects]);

  // Validate project object structure
  const isValidProject = (project: any): project is Project => {
    return (
      typeof project === 'object' &&
      typeof project.id === 'string' &&
      typeof project.name === 'string' &&
      typeof project.description === 'string' &&
      (project.status === 'active' || project.status === 'completed') &&
      typeof project.lastUpdated === 'string'
    );
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newProjectName.trim()) {
      setError('Project name is required');
      return;
    }

    try {
      // Create a new project object
      const newProject: Project = {
        id: Date.now().toString(),
        name: newProjectName.trim(),
        description: newProjectDescription,
        status: 'active',
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      // Call the API to create a new directory for the project
      const response = await fetch('/api/projects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectName: newProject.name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create project directory');
      }

      // Add the new project to the list
      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      setNewProjectName('');
      setNewProjectDescription('');
      setShowNewProjectModal(false);

      // Set the new project as current and navigate to dashboard
      setCurrentProject(newProject);
      router.push('/');
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err instanceof Error ? err.message : 'Failed to create project. Please try again.');
    }
  };

  const handleProjectSelect = (project: Project) => {
    setCurrentProject(project);
    router.push('/');
  };

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Select a Project</h1>
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-8"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Project
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleProjectSelect(project)}
              className="relative group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer border border-gray-200"
            >
              <div className="flex items-center">
                <FolderIcon className="h-8 w-8 text-blue-500 mr-4" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-500">
                    Created {new Date(project.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <ArrowRightIcon className="h-5 w-5 text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No projects found. Create a new project to get started.
          </div>
        )}
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="mb-4">
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  id="projectName"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project name"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>
              {error && (
                <div className="mb-4 text-red-600 text-sm">{error}</div>
              )}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 