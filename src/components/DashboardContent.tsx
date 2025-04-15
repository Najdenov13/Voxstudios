'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

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
  // ... copy all the stages from page.tsx ...
];

export default function DashboardContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams?.get('project') || null;
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [expandedStages, setExpandedStages] = useState<number[]>([]);

  // ... copy all the functions from page.tsx ...

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ... copy all the JSX from page.tsx ... */}
    </div>
  );
} 