'use client';

import React from 'react';

interface DashboardContentProps {
  children: React.ReactNode;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ children }) => {
  return (
    <main className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </main>
  );
};

export default DashboardContent; 