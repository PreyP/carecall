import React from "react";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { PatientManagement } from "@/components/patient-management";
import { useLocation } from "wouter";

export default function Patients() {
  const [, setLocation] = useLocation();

  const handlePatientSelect = (patientId: number) => {
    setLocation(`/dashboard/${patientId}`);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <TopBar />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
                  <p className="mt-2 text-sm text-gray-500">
                    View and manage all patients enrolled in the CareCall program.
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <PatientManagement onPatientSelect={handlePatientSelect} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}