import React from "react";
import { RecommendedAction } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Lightbulb, ClipboardCheck } from "lucide-react";

interface RecommendedActionsProps {
  patientId: number;
}

export function RecommendedActions({ patientId }: RecommendedActionsProps) {
  const { data: actions, isLoading } = useQuery<RecommendedAction[]>({
    queryKey: [`/api/patients/${patientId}/recommended-actions`],
  });

  if (isLoading) {
    return (
      <div className="mt-8">
        <div className="bg-primary bg-opacity-5 border border-primary shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-[#E6DFD0]"></div>
                <div className="ml-4 h-5 bg-[#E6DFD0] rounded w-1/3"></div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[1, 2].map((i) => (
                  <div key={i} className="border border-gray-200 rounded-md p-4">
                    <div className="h-4 bg-[#E6DFD0] rounded w-1/2 mb-3"></div>
                    <div className="space-y-2">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="flex items-start">
                          <div className="h-4 w-4 bg-[#E6DFD0] rounded-full mr-2"></div>
                          <div className="h-4 bg-[#E6DFD0] rounded w-full"></div>
                        </div>
                      ))}
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

  if (!actions || actions.length === 0) {
    return (
      <div className="mt-8">
        <div className="bg-primary bg-opacity-5 border border-primary shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-center items-center h-48 flex-col">
              <Lightbulb className="h-10 w-10 text-primary mb-2" />
              <p className="text-gray-500">No recommended actions available</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="bg-primary bg-opacity-5 border border-primary shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <span className="flex-shrink-0 h-10 w-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
              <Lightbulb className="h-5 w-5 text-primary" />
            </span>
            <h2 className="ml-4 text-lg font-medium text-gray-900">Recommended Actions</h2>
          </div>
          
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {actions.map((action) => (
              <div key={action.id} className="border border-primary rounded-md p-4 bg-[#F0E8D8]">
                <h3 className="font-medium text-primary">{action.category}</h3>
                <ul className="mt-2 text-sm space-y-2">
                  {action.actions.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-5 text-right">
            <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-[#1565C0] focus:outline-none">
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Implement Recommendations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
