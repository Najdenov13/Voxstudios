'use client';

import React from "react";
import StageLayout from "@/components/StageLayout";
import { FilmIcon } from '@heroicons/react/24/outline';

const items = [
  {
    title: "Final Deliverable",
    description: "View your final video with voice-over",
    href: "/stage4/card1",
    icon: <FilmIcon className="w-5 h-5" />
  }
];

export default function Stage4Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StageLayout items={items} defaultPath="/stage4">
      {children}
    </StageLayout>
  );
} 