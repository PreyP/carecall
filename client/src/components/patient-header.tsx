import React from "react";
import { Patient } from "@/lib/types";
import { CircleAlert } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface PatientHeaderProps {
  patientId: number;
}

export function PatientHeader({ patientId }: PatientHeaderProps) {
  const { data: patient, isLoading } = useQuery<Patient>({
    queryKey: [`/api/patients/${patientId}`],
  });

  const { data: alerts, isLoading: alertsLoading } = useQuery<{category: string, type: 'red' | 'yellow'}[]>({
    queryKey: [`/api/patients/${patientId}/alerts`],
  });

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-16 w-16"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-center">
              <CircleAlert className="h-5 w-5 text-red-500 mr-2" />
              <p>Patient information could not be loaded</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between flex-wrap sm:flex-nowrap">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-16 w-16 rounded-full bg-[#42A5F5] flex items-center justify-center text-white text-2xl font-bold">
                <span>{patient.initials}</span>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
                <div className="mt-1 flex flex-wrap items-center text-sm text-gray-500">
                  <span className="mr-6">{patient.age} years old</span>
                  <span className="mr-6">{patient.gender}</span>
                  <span className="mr-6">MRN: {patient.mrn}</span>
                  <span>{patient.phone}</span>
                </div>
              </div>
            </div>
            
            <div className="flex mt-4 sm:mt-0">
              <button type="button" className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                <span className="material-icons text-sm mr-2">phone</span>
                Call Patient
              </button>
              <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-[#1565C0] focus:outline-none">
                <span className="material-icons text-sm mr-2">note_add</span>
                Add Note
              </button>
            </div>
          </div>
          
          {/* CircleAlert badges */}
          {!alertsLoading && alerts && alerts.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {alerts.map((alert, index) => (
                <span 
                  key={index} 
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    alert.type === 'red' 
                      ? 'bg-[#F44336] bg-opacity-10 text-[#F44336] border border-[#F44336]' 
                      : 'bg-[#FFC107] bg-opacity-10 text-[#FFC107] border border-[#FFC107]'
                  }`}
                >
                  <span className="material-icons text-sm mr-1">
                    {alert.type === 'red' ? 'warning' : 'priority_high'}
                  </span>
                  {alert.category}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
