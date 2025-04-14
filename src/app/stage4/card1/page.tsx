'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import Image from 'next/image';

interface Video {
  id: string;
  title: string;
  url: string;
}

export default function FinalDeliverablePage() {
  const { currentProject } = useProject();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [videoError, setVideoError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (currentProject?.id) {
      // Fetch videos for the current project
      fetch(`/api/videos/${currentProject.id}/list`)
        .then(res => res.json())
        .then(data => {
          if (data.videos) {
            setVideos(data.videos.map((video: any) => ({
              id: video.name,
              title: video.name.split('.').slice(0, -1).join('.'), // Remove extension
              url: video.url
            })));
          }
        })
        .catch(error => console.error('Error fetching videos:', error));
    } else {
      setVideos([]);
    }
  }, [currentProject]);

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
    setIsPlaying(false);
    setVideoError(null);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(error => {
          console.error('Error playing video:', error);
          setVideoError('Error playing video. Please try again.');
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoError = () => {
    setVideoError('Error loading video. Please try again.');
    setIsPlaying(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">Final Deliverable</h1>

        {currentProject ? (
          <p className="mb-4 text-gray-700">
            Viewing final videos for: <span className="font-semibold">{currentProject.name}</span>
          </p>
        ) : (
          <p className="mb-4 text-red-600">No project selected. Please select a project first.</p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Available Videos</h2>
            <div className="space-y-2">
              {videos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => handleVideoSelect(video)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedVideo?.id === video.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <h3 className="font-medium text-gray-900">{video.title}</h3>
                </button>
              ))}
              {videos.length === 0 && (
                <p className="text-gray-500 text-center py-4">No videos available yet.</p>
              )}
            </div>
          </div>

          {/* Retro TV Player */}
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="relative w-full max-w-2xl mx-auto">
                {/* Video Screen - positioned behind the TV frame */}
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  <div className="w-[75%] h-[50%] mt-[10%] bg-black overflow-hidden">
                    {selectedVideo ? (
                      <>
                        <video
                          ref={videoRef}
                          className="w-full h-full object-contain bg-black"
                          src={selectedVideo.url}
                          onClick={handlePlayPause}
                          onError={handleVideoError}
                          playsInline
                        />
                        {videoError && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                            <p className="text-red-500 text-center px-4">{videoError}</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black">
                        <p className="text-gray-500 text-lg">Select a video to play</p>
                      </div>
                    )}

                    {/* Scanlines Effect */}
                    <div className="absolute inset-0 pointer-events-none bg-scanlines opacity-5"></div>

                    {/* TV Glare */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 via-transparent to-transparent"></div>
                  </div>
                </div>

                {/* TV Frame Image */}
                <div className="relative z-20">
                  <Image
                    src="/retro-tv.png"
                    alt="Retro TV Frame"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                    priority
                  />
                </div>

                {/* Play/Pause Button */}
                <div className="mt-8 flex justify-center relative z-30">
                  <button
                    onClick={handlePlayPause}
                    disabled={!selectedVideo || !!videoError}
                    className="px-6 py-2 bg-[#8B4513] text-white rounded-lg shadow hover:bg-[#654321] disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isPlaying ? (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        <span>Play</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scanlines Animation */}
      <style jsx>{`
        @keyframes scanlines {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 100%;
          }
        }

        .bg-scanlines {
          background: repeating-linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.1),
            rgba(255, 255, 255, 0.1) 1px,
            transparent 1px,
            transparent 2px
          );
          background-size: 100% 4px;
          animation: scanlines 10s linear infinite;
        }
      `}</style>
    </div>
  );
} 