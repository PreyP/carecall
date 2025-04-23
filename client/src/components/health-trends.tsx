import React from "react";
import { HealthTrendEntry } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

interface HealthTrendsProps {
  patientId: number;
}

export function HealthTrends({ patientId }: HealthTrendsProps) {
  const { data: trends, isLoading } = useQuery<HealthTrendEntry[]>({
    queryKey: [`/api/patients/${patientId}/health-trends`],
  });

  if (isLoading) {
    return (
      <div className="mt-8">
        <div className="bg-[#F0E8D8] shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-5 bg-[#E6DFD0] rounded w-1/3"></div>
              
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex space-x-4">
                  <div className="h-8 w-8 bg-[#E6DFD0] rounded-full"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-[#E6DFD0] rounded w-3/4"></div>
                    <div className="h-4 bg-[#E6DFD0] rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!trends || trends.length === 0) {
    return (
      <div className="mt-8">
        <div className="bg-[#F0E8D8] shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-center items-center h-48 flex-col">
              <span className="material-icons text-gray-400 text-4xl mb-2">timeline</span>
              <p className="text-gray-500">No health trend data available</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-[#F44336]";
      case "moderate":
        return "bg-[#FFC107]";
      case "low":
        return "bg-[#4CAF50]";
      default:
        return "bg-[#4CAF50]";
    }
  };

  const getRiskTextColor = (risk: string) => {
    return "text-white";
  };

  return (
    <div className="mt-8">
      <div className="bg-[#F0E8D8] shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Health Trends</h2>
          
          {trends.map((trend, index) => (
            <div key={trend.id} className={`relative ${index < trends.length - 1 ? "timeline-dot" : ""}`}>
              <div className="flex space-x-4">
                {/* Timeline indicators */}
                <div className="flex-shrink-0 w-8">
                  <div className={`relative flex items-center justify-center h-8 w-8 rounded-full ${getRiskColor(trend.risk)} border-4 border-white`}>
                    <span className="material-icons text-white text-sm">event</span>
                  </div>
                </div>
                
                {/* Timeline content */}
                <div className="min-w-0 flex-1 py-0">
                  <div className="bg-[#F0E8D8] rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium">{trend.date}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRiskColor(trend.risk)} ${getRiskTextColor(trend.risk)}`}>
                        {trend.risk === "high" ? "High Risk" : trend.risk === "moderate" ? "Moderate Risk" : "Low Risk"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">{trend.summary}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
