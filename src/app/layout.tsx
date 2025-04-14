import React from 'react';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { VoiceProvider } from '@/contexts/VoiceContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Teams Dashboard',
  description: 'A dashboard for managing Teams projects',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ProjectProvider>
            <VoiceProvider>
              {children}
            </VoiceProvider>
          </ProjectProvider>
        </AuthProvider>
      </body>
    </html>
  );
}