import React from "react";
import { KeyFinding } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { ShieldAlert, Thermometer, CheckCircle } from "lucide-react";

interface KeyFindingsProps {
  patientId: number;
  callId?: number;
}

export function KeyFindings({ patientId, callId }: KeyFindingsProps) {
  const { data: findings, isLoading } = useQuery<KeyFinding[]>({
    queryKey: [callId 
      ? `/api/calls/${callId}/findings` 
      : `/api/patients/${patientId}/latest-findings`
    ],
  });

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start">
                  <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                  <div className="ml-3 h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!findings || findings.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-center items-center h-48 flex-col">
            <span className="material-icons text-gray-400 text-4xl mb-2">search</span>
            <p className="text-gray-500">No key findings available</p>
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

  const getIconByRisk = (risk: string) => {
    switch (risk) {
      case "high":
        return <ShieldAlert className="h-3.5 w-3.5 text-white" />;
      case "moderate":
        return <Thermometer className="h-3.5 w-3.5 text-white" />;
      case "low":
        return <CheckCircle className="h-3.5 w-3.5 text-white" />;
      default:
        return <CheckCircle className="h-3.5 w-3.5 text-white" />;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Key Findings</h2>
        
        <ul className="space-y-3">
          {findings.map((finding) => (
            <li key={finding.id} className="flex items-start">
              <span className={`flex-shrink-0 h-5 w-5 rounded-full ${getRiskColor(finding.risk)} flex items-center justify-center mt-0.5`}>
                {getIconByRisk(finding.risk)}
              </span>
              <p className="ml-3 text-sm text-gray-700">{finding.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
