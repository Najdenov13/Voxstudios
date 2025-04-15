'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectDataManager from '@/components/ProjectDataManager';

export default function ProjectDataPage() {
  const router = useRouter();
  const [projectId, setProjectId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the selected project from cookies
    const getSelectedProject = () => {
      const cookies = document.cookie.split(';');
      const projectCookie = cookies.find(cookie => cookie.trim().startsWith('selectedProject='));
      
      if (projectCookie) {
        try {
          const projectData = JSON.parse(decodeURIComponent(projectCookie.split('=')[1]));
          setProjectId(projectData.id);
        } catch (error) {
          console.error('Error parsing project data:', error);
        }
      }
      
      setLoading(false);
    };
    
    getSelectedProject();
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!projectId) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Project Data</h1>
        <p className="mb-4">No project selected. Please select a project first.</p>
        <button
          onClick={() => router.push('/projects')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Go to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Project Data</h1>
      <p className="mb-6">Manage data for your selected project.</p>
      
      <ProjectDataManager projectId={projectId} />
    </div>
  );
} 