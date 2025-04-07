import React from "react";
import { RecommendedAction } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

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
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div className="ml-4 h-5 bg-gray-200 rounded w-1/3"></div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[1, 2].map((i) => (
                  <div key={i} className="border border-gray-200 rounded-md p-4">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="space-y-2">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="flex items-start">
                          <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
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
              <span className="material-icons text-primary text-4xl mb-2">lightbulb</span>
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
              <span className="material-icons text-primary">lightbulb</span>
            </span>
            <h2 className="ml-4 text-lg font-medium text-gray-900">Recommended Actions</h2>
          </div>
          
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {actions.map((action) => (
              <div key={action.id} className="border border-primary rounded-md p-4 bg-white">
                <h3 className="font-medium text-primary">{action.category}</h3>
                <ul className="mt-2 text-sm space-y-2">
                  {action.actions.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="material-icons text-primary mr-2 text-sm">check_circle</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-5 text-right">
            <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-[#1565C0] focus:outline-none">
              <span className="material-icons text-sm mr-2">assignment_turned_in</span>
              Implement Recommendations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
