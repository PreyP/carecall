import React, { useState } from "react";
import { CallTranscript } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface TranscriptViewerProps {
  patientId: number;
  callId?: number;
}

export function TranscriptViewer({ patientId, callId }: TranscriptViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  
  const { data: transcript, isLoading } = useQuery<CallTranscript>({
    queryKey: [callId ? `/api/calls/${callId}` : `/api/patients/${patientId}/latest-call`],
  });

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control the audio playback
  };

  if (isLoading) {
    return (
      <div className="lg:col-span-2">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="animate-pulse space-y-4">
              <div className="flex justify-between">
                <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                <div className="h-5 bg-gray-200 rounded w-1/6"></div>
              </div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!transcript) {
    return (
      <div className="lg:col-span-2">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-center items-center h-48">
              <p className="text-gray-500">No call transcript available</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate progress percentage for the audio player
  const progressPercentage = Math.round((currentPlaybackTime / transcript.durationSeconds) * 100);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="lg:col-span-2">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Call Transcript</h2>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">{transcript.date}</span>
              <span className="text-sm text-gray-500">{transcript.time}</span>
            </div>
          </div>
          
          {/* Call recording player */}
          <div className="mb-4 p-3 bg-gray-100 rounded-md">
            <div className="flex items-center">
              <button 
                className="p-2 rounded-full bg-primary text-white"
                onClick={togglePlayback}
              >
                <span className="material-icons">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>
              <div className="ml-4 flex-1">
                <div className="h-2 bg-white rounded-full">
                  <div 
                    className="h-2 bg-primary rounded-full" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>{formatTime(currentPlaybackTime)}</span>
                  <span>{formatTime(transcript.durationSeconds)}</span>
                </div>
              </div>
              <div className="ml-4">
                <button className="text-gray-500">
                  <span className="material-icons">volume_up</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Transcript content */}
          <div className="border border-gray-200 rounded-md p-4 h-[500px] overflow-y-auto font-sans">
            <div className="space-y-4">
              {transcript.transcript.map((entry) => (
                <div key={entry.id} className="flex">
                  <div className="flex-shrink-0 mr-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm",
                      entry.speaker === "AI" ? "bg-primary" : "bg-[#607D8B]"
                    )}>
                      {entry.speaker === "AI" ? (
                        <span className="material-icons text-sm">support_agent</span>
                      ) : (
                        entry.speakerName.split(' ').map(n => n[0]).join('')
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{entry.speakerName}</p>
                    <p className="text-sm">
                      {entry.highlightType ? (
                        <span className={
                          entry.highlightType === "yellow" 
                            ? "bg-[rgba(255,193,7,0.2)] border-b-2 border-[#FFC107]" 
                            : "bg-[rgba(244,67,54,0.2)] border-b-2 border-[#F44336]"
                        }>
                          {entry.text}
                        </span>
                      ) : (
                        entry.text
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
