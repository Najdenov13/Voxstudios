'use client';

import React from "react";
import StageLayout from "@/components/StageLayout";
import { ChatBubbleLeftRightIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';

const items = [
  {
    title: "Feedback Session",
    description: "Review and provide feedback on selected voices",
    href: "/stage3/card1",
    icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />
  },
  {
    title: "Iterated Voices",
    description: "Listen to and select iterated voices",
    href: "/stage3/card2",
    icon: <SpeakerWaveIcon className="w-5 h-5" />
  }
];

export default function Stage3Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StageLayout items={items} defaultPath="/stage3">
      {children}
    </StageLayout>
  );
} 