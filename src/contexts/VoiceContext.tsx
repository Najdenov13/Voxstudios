'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Voice {
  id: string;
  title: string;
  description: string;
  tags: string[];
  audioData: string; // Base64 encoded audio data
  type: 'base' | 'custom';
  uploadDate: string;
  projectId?: string;
  stageId?: string;
  isAIVoice?: boolean;
  feedback?: Feedback[];
}

interface Feedback {
  id: string;
  timestamp: number;
  comment: string;
  resolved: boolean;
}

interface VoiceContextType {
  voices: Voice[];
  addVoice: (voice: Omit<Voice, 'id' | 'uploadDate'>) => Promise<void>;
  deleteVoice: (id: string) => void;
  getVoicesForProject: (projectId: string) => Voice[];
  getBaseVoices: () => Voice[];
  getAIVoicesForStage: (projectId: string, stageId: string) => Voice[];
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const [voices, setVoices] = useState<Voice[]>(() => {
    if (typeof window !== 'undefined') {
      const savedVoices = localStorage.getItem('voices');
      return savedVoices ? JSON.parse(savedVoices) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('voices', JSON.stringify(voices));
  }, [voices]);

  const addVoice = async (voiceData: Omit<Voice, 'id' | 'uploadDate'>) => {
    const newVoice: Voice = {
      ...voiceData,
      id: Date.now().toString(),
      uploadDate: new Date().toISOString(),
    };

    setVoices(prev => {
      const updated = [...prev, newVoice];
      if (typeof window !== 'undefined') {
        localStorage.setItem('voices', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const deleteVoice = (id: string) => {
    setVoices(prev => prev.filter(voice => voice.id !== id));
  };

  const getVoicesForProject = (projectId: string) => {
    return voices.filter(voice => 
      voice.projectId === projectId && !voice.isAIVoice
    );
  };

  const getAIVoicesForStage = (projectId: string, stageId: string) => {
    return voices.filter(voice => 
      voice.projectId === projectId && 
      voice.isAIVoice && 
      voice.stageId === stageId
    );
  };

  const getBaseVoices = () => {
    // Return base voices
    return voices.filter(voice => voice.type === 'base');
  };

  return (
    <VoiceContext.Provider value={{ voices, addVoice, deleteVoice, getVoicesForProject, getAIVoicesForStage, getBaseVoices }}>
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoices() {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error('useVoices must be used within a VoiceProvider');
  }
  return context;
} 