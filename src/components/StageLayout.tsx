'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface StageItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  description?: string;
}

interface StageLayoutProps {
  items: StageItem[];
  children?: React.ReactNode;
  defaultPath: string;
}

export default function StageLayout({ items, children, defaultPath }: StageLayoutProps) {
  const pathname = usePathname();
  const isDefaultView = pathname === defaultPath;

  return (
    <div className="flex h-full">
      {/* Stage Navigation */}
      <div className="w-80 bg-gray-50 border-r border-gray-200">
        <nav className="p-4">
          {items.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={index}
                href={item.href}
                className={`
                  flex items-center px-4 py-2.5 mb-1 rounded-lg text-sm transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                {item.icon && (
                  <span className="mr-3">{item.icon}</span>
                )}
                <div>
                  <div className="font-medium">{item.title}</div>
                  {item.description && (
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {isDefaultView ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-medium text-gray-900">
                Select a task to get started
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Choose from the options on the left to begin working on your project
              </p>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
} 