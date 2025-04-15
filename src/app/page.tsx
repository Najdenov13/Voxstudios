'use client';

import React, { useState, Suspense } from 'react';
import { ChevronDownIcon, ChevronUpIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

type StepStatus = 'pending' | 'approved' | 'disapproved' | 'in_progress';

interface Step {
  title: string;
  description: string;
  component: string;
  status: StepStatus;
}

interface Stage {
  id: number;
  title: string;
  description: string;
  href: string;
  status: StepStatus;
  steps: Step[];
}

const initialStages: Stage[] = [
  {
    id: 1,
    title: 'Stage 1: Original Video Campaign',
    description: 'Upload and process the original video',
    href: '/stage1/dashboard',
    status: 'in_progress',
    steps: [
      {
        title: 'Original Video Campaign',
        description: 'Upload and manage your original video content',
        component: 'VideoUpload',
        status: 'in_progress'
      },
      {
        title: 'Auditioning Brief',
        description: 'Create and review the auditioning requirements',
        component: 'AuditioningBrief',
        status: 'pending'
      },
      {
        title: 'Voice Selection',
        description: 'Listen to and manage voice auditions',
        component: 'VoiceSelection',
        status: 'pending'
      }
    ]
  },
  {
    id: 2,
    title: 'Stage 2: Script & Timestamps',
    description: 'Define script and set timestamps',
    href: '/stage2/dashboard',
    status: 'pending',
    steps: [
      {
        title: 'Script Upload',
        description: 'Upload and manage your script',
        component: 'ScriptUpload',
        status: 'pending'
      },
      {
        title: 'Timestamp Editor',
        description: 'Set and edit timestamps for your script',
        component: 'TimestampEditor',
        status: 'pending'
      }
    ]
  },
  {
    id: 3,
    title: 'Stage 3: Voice Selection',
    description: 'Review and select voice options',
    href: '/stage3/dashboard',
    status: 'pending',
    steps: [
      {
        title: 'Base Voice Selection',
        description: 'Choose your preferred base voice',
        component: 'BaseVoiceSelection',
        status: 'pending'
      },
      {
        title: 'Custom Voice Selection',
        description: 'Review and select custom voice options',
        component: 'CustomVoiceSelection',
        status: 'pending'
      }
    ]
  },
  {
    id: 4,
    title: 'Stage 4: Final Review',
    description: 'Choose and approve the final voice',
    href: '/stage4/dashboard',
    status: 'pending',
    steps: [
      {
        title: 'Final Voice Review',
        description: 'Review and approve the final voice output',
        component: 'FinalVoiceReview',
        status: 'pending'
      }
    ]
  }
];

const DashboardContent = dynamic(() => import('@/components/DashboardContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  ),
});

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
} 