'use client';

import React from "react";
import StageLayout from "@/components/StageLayout";
import { 
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export default function Stage2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const stageItems = [
    {
      title: "Script Review",
      description: "Review and approve the script for your project",
      href: "/stage2/card1",
      icon: <DocumentTextIcon className="w-5 h-5" />
    },
    {
      title: "AI Powered Versions",
      description: "Provide feedback and request script revisions",
      href: "/stage2/card2",
      icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />
    }
  ];

  return (
    <StageLayout items={stageItems} defaultPath="/stage2">
      {children}
    </StageLayout>
  );
} 