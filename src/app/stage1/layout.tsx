'use client';

import React from "react";
import StageLayout from "@/components/StageLayout";
import { 
  VideoCameraIcon, 
  DocumentTextIcon, 
  MicrophoneIcon 
} from '@heroicons/react/24/outline';

export default function Stage1Layout({ children }: { children: React.ReactNode }) {
  const stageItems = [
    {
      title: "Original Video Campaign",
      description: "Upload and manage your original video content",
      href: "/stage1/card1",
      icon: <VideoCameraIcon className="w-5 h-5" />
    },
    {
      title: "Auditioning Brief",
      description: "Create and review the auditioning requirements",
      href: "/stage1/card2",
      icon: <DocumentTextIcon className="w-5 h-5" />
    },
    {
      title: "Auditioning Voices",
      description: "Listen to and manage voice auditions",
      href: "/stage1/card3",
      icon: <MicrophoneIcon className="w-5 h-5" />
    },
  ];

  return (
    <StageLayout items={stageItems} defaultPath="/stage1">
      {children}
    </StageLayout>
  );
} 