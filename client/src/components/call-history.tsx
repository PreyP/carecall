import React from "react";
import { useQuery } from "@tanstack/react-query";
import { CallTranscript, TranscriptEntry } from "@/lib/types";

interface CallHistoryProps {
  patientId: number;
}

export function CallHistory({ patientId }: CallHistoryProps) {
  const { data: calls, isLoading } = useQuery<CallTranscript[]>({
    queryKey: [`/api/patients/${patientId}/calls`],
  });

  if (isLoading) {
    return (
      <div className="bg-[#F0E8D8] shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-5 bg-[#E6DFD0] rounded w-1/3"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between space-y-2">
                  <div className="h-4 bg-[#E6DFD0] rounded w-1/4"></div>
                  <div className="h-4 bg-[#E6DFD0] rounded w-1/4"></div>
                  <div className="h-4 bg-[#E6DFD0] rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!calls || calls.length === 0) {
    return (
      <div className="bg-[#F0E8D8] shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-center items-center h-48 flex-col">
            <span className="material-icons text-gray-400 text-4xl mb-2">call</span>
            <p className="text-gray-500">No call history available</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDuration = (durationSeconds: number) => {
    const minutes = Math.floor(durationSeconds / 60);
    const seconds = durationSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="bg-[#F0E8D8] shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Call History</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#F0E8D8]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#F0E8D8] divide-y divide-gray-200">
              {calls.map((call) => {
                // Check for risk indicators in the transcript
                const hasRedHighlight = call.transcript.some((entry) => entry.highlightType === 'red');
                const hasYellowHighlight = !hasRedHighlight && 
                  call.transcript.some((entry) => entry.highlightType === 'yellow');
                
                return (
                  <tr key={call.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {call.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {call.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDuration(call.durationSeconds)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {hasRedHighlight && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <span className="material-icons text-xs mr-1">warning</span>
                          High Risk
                        </span>
                      )}
                      {hasYellowHighlight && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <span className="material-icons text-xs mr-1">priority_high</span>
                          Moderate Risk
                        </span>
                      )}
                      {!hasRedHighlight && !hasYellowHighlight && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <span className="material-icons text-xs mr-1">check_circle</span>
                          Low Risk
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href={`/calls/${call.id}`} className="text-primary hover:text-primary-dark">
                        View
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}