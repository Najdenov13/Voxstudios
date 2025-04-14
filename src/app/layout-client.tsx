'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  HomeIcon, 
  Square3Stack3DIcon,
  DocumentDuplicateIcon,
  PresentationChartLineIcon,
  ClipboardDocumentCheckIcon,
  ArrowLeftIcon,
  ArrowRightOnRectangleIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Home', href: '/', icon: <HomeIcon className="w-5 h-5" /> },
  { name: 'Stage 1', href: '/stage1', icon: <Square3Stack3DIcon className="w-5 h-5" /> },
  { name: 'Stage 2', href: '/stage2', icon: <DocumentDuplicateIcon className="w-5 h-5" /> },
  { name: 'Stage 3', href: '/stage3', icon: <PresentationChartLineIcon className="w-5 h-5" /> },
  { name: 'Stage 4', href: '/stage4', icon: <ClipboardDocumentCheckIcon className="w-5 h-5" /> },
];

const adminNavigation = [
  { name: 'Admin Dashboard', href: '/admin', icon: <HomeIcon className="w-5 h-5" /> },
  { name: 'User Management', href: '/admin/manage', icon: <UsersIcon className="w-5 h-5" /> },
];

function SidebarContent() {
  const { logout, user, isAdmin } = useAuth();
  const pathname = usePathname();
  
  // Debug log
  console.log('Current user:', user);
  console.log('Is admin:', isAdmin);

  return (
    <>
      {/* Logo Container */}
      <div className="pt-5 pb-0 px-4 flex justify-center">
        <Image
          src="/images/logo.png"
          alt="Vox Studios"
          width={200}
          height={60}
          className="logo-container"
          priority
        />
      </div>

      {/* Navigation Links */}
      <nav className="px-4 flex-1 mt-0">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center px-4 py-2.5 mb-1 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}

        {/* Admin Navigation */}
        {isAdmin && (
          <>
            <div className="px-4 py-2 mt-4 text-xs font-semibold text-white/50 uppercase tracking-wider">
              Admin
            </div>
            {adminNavigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-2.5 mb-1 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-white/10 text-white' 
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* Bottom Links */}
      <div className="px-4 pb-6 space-y-2">
        <button
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
          className="w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-all duration-200"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
          Log Out
        </button>
        <Link
          href="/projects"
          className="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-all duration-200"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-3" />
          Back to Projects
        </Link>
      </div>
    </>
  );
}

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const isProjectsPage = pathname === '/projects';
  const showSidebar = !isLoginPage && !isProjectsPage;

  return (
    <div className="flex h-screen">
      {showSidebar && (
        /* Primary Navigation */
        <div className="w-80 bg-[#1a237e] text-white flex flex-col">
          <SidebarContent />
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 bg-white overflow-hidden ${!showSidebar ? 'w-full' : ''}`}>
        <div className="h-full overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
} 