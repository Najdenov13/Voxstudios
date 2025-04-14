'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useVoices } from '@/contexts/VoiceContext';
import { useProject } from '@/contexts/ProjectContext';
import { 
  CloudArrowUpIcon,
} from '@heroicons/react/24/outline';

interface VoiceDetails {
  title: string;
  description: string;
  tags: string;
  type: 'base' | 'custom';
  projectId?: string;
  stageId?: string;
  isAIVoice?: boolean;
  audioData: string;
}

interface VideoDetails {
  title: string;
  projectId: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();
  const { addVoice } = useVoices();
  const { projects, currentProject } = useProject();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [voiceDetails, setVoiceDetails] = useState<VoiceDetails>({
    title: '',
    description: '',
    tags: '',
    type: 'base',
    projectId: '',
    stageId: '',
    isAIVoice: false,
    audioData: ''
  });
  const [videoDetails, setVideoDetails] = useState<VideoDetails>({
    title: '',
    projectId: currentProject?.id || '',
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      try {
        const base64Data = await convertFileToBase64(file);
        setVoiceDetails(prev => ({
          ...prev,
          audioData: base64Data
        }));
      } catch (error) {
        console.error('Error converting file:', error);
        alert('Failed to process audio file. Please try again.');
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      try {
        const base64Data = await convertFileToBase64(file);
        setVoiceDetails(prev => ({
          ...prev,
          audioData: base64Data
        }));
      } catch (error) {
        console.error('Error converting file:', error);
        alert('Failed to process audio file. Please try again.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !voiceDetails.audioData) {
      alert('Please select an audio file');
      return;
    }

    // Validate project selection for all voices
    if (!voiceDetails.projectId) {
      alert('Please select a project');
      return;
    }

    setIsUploading(true);
    try {
      // Add the voice to the context with the base64 audio data
      await addVoice({
        title: voiceDetails.title,
        description: voiceDetails.description,
        tags: voiceDetails.tags.split(',').map(tag => tag.trim()),
        type: voiceDetails.type,
        audioData: voiceDetails.audioData,
        projectId: voiceDetails.projectId, // Always include projectId
        stageId: voiceDetails.stageId,
        isAIVoice: voiceDetails.isAIVoice
      });

      // Reset form
      setSelectedFile(null);
      setVoiceDetails({
        title: '',
        description: '',
        tags: '',
        type: 'base',
        projectId: '',
        stageId: '',
        isAIVoice: false,
        audioData: ''
      });

      alert('Voice uploaded successfully!');
    } catch (error) {
      console.error('Error uploading voice:', error);
      alert('Failed to upload voice. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentProject) {
      setUploadError('Please select a file and project first');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', currentProject.id);
      formData.append('title', videoDetails.title || file.name);

      const response = await fetch('/api/upload-final-video', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload video');
      }

      setUploadSuccess(true);
      setVideoDetails(prev => ({ ...prev, title: '' }));
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

        {/* Voice Upload Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Voice</h2>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Upload New Voice</h2>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Stage:</label>
              <button
                onClick={() => setVoiceDetails(prev => ({ 
                  ...prev, 
                  isAIVoice: false,
                  stageId: 'stage1'
                }))}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  voiceDetails.stageId === 'stage1'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Stage 1
              </button>
              <button
                onClick={() => setVoiceDetails(prev => ({ 
                  ...prev, 
                  isAIVoice: true,
                  stageId: 'stage2'
                }))}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  voiceDetails.stageId === 'stage2'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Stage 2
              </button>
              <button
                onClick={() => setVoiceDetails(prev => ({ 
                  ...prev, 
                  isAIVoice: true,
                  stageId: 'stage3'
                }))}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  voiceDetails.stageId === 'stage3'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Stage 3
              </button>
            </div>
          </div>
          
          {/* Drag and Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors duration-200 ease-in-out
              ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}
            `}
          >
            <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop your audio file here, or
              <label className="ml-1 text-indigo-600 hover:text-indigo-500 cursor-pointer">
                <span> browse</span>
                <input
                  type="file"
                  className="hidden"
                  accept="audio/*"
                  onChange={handleFileChange}
                />
              </label>
            </p>
            {selectedFile && (
              <p className="mt-2 text-sm text-indigo-600">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          {/* Voice Details Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Project Selection - Always show */}
            <div>
              <label htmlFor="project" className="block text-sm font-medium text-gray-700">
                Project
              </label>
              <select
                id="project"
                value={voiceDetails.projectId}
                onChange={(e) => setVoiceDetails({ ...voiceDetails, projectId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Voice Type Selection */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Voice Type
              </label>
              <div className="mt-1 grid grid-cols-2 gap-3">
                <div
                  className={`
                    border rounded-lg p-4 cursor-pointer text-center transition-all
                    ${voiceDetails.type === 'base'
                      ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500'
                      : 'border-gray-300 hover:border-indigo-400'
                    }
                  `}
                  onClick={() => setVoiceDetails({ ...voiceDetails, type: 'base' })}
                >
                  <span className={`text-sm font-medium ${voiceDetails.type === 'base' ? 'text-indigo-700' : 'text-gray-900'}`}>
                    Base Voice
                  </span>
                </div>
                <div
                  className={`
                    border rounded-lg p-4 cursor-pointer text-center transition-all
                    ${voiceDetails.type === 'custom'
                      ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500'
                      : 'border-gray-300 hover:border-indigo-400'
                    }
                  `}
                  onClick={() => setVoiceDetails({ ...voiceDetails, type: 'custom' })}
                >
                  <span className={`text-sm font-medium ${voiceDetails.type === 'custom' ? 'text-indigo-700' : 'text-gray-900'}`}>
                    Custom Voice
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={voiceDetails.title}
                onChange={(e) => setVoiceDetails({ ...voiceDetails, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={voiceDetails.description}
                onChange={(e) => setVoiceDetails({ ...voiceDetails, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                value={voiceDetails.tags}
                onChange={(e) => setVoiceDetails({ ...voiceDetails, tags: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g., male, professional, corporate"
              />
            </div>
            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${(!selectedFile || isUploading) 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }`}
            >
              {isUploading ? 'Uploading...' : 'Upload Voice'}
            </button>
          </form>
        </div>

        {/* Final Video Upload Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Final Video</h2>
          
          {currentProject ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Uploading to project: <span className="font-medium">{currentProject.name}</span>
              </p>

              <div>
                <label htmlFor="videoTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Video Title
                </label>
                <input
                  type="text"
                  id="videoTitle"
                  value={videoDetails.title}
                  onChange={(e) => setVideoDetails(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter video title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Video File
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="video-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload a video</span>
                        <input
                          id="video-upload"
                          name="video-upload"
                          type="file"
                          accept="video/*"
                          className="sr-only"
                          onChange={handleVideoUpload}
                          disabled={isUploading}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">MP4, WebM, or other video formats</p>
                  </div>
                </div>
              </div>

              {isUploading && (
                <div className="text-sm text-gray-600">
                  Uploading video...
                </div>
              )}

              {uploadSuccess && (
                <div className="text-sm text-green-600">
                  Video uploaded successfully!
                </div>
              )}

              {uploadError && (
                <div className="text-sm text-red-600">
                  {uploadError}
                </div>
              )}
            </div>
          ) : (
            <p className="text-red-600">Please select a project first to upload videos.</p>
          )}
        </div>
      </div>
    </div>
  );
} 