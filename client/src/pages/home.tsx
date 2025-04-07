import React, { useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Patient } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { data: patients, isLoading } = useQuery<Patient[]>({
    queryKey: ['/api/patients'],
  });
  
  useEffect(() => {
    // If user is a family member, redirect to family portal
    if (user && user.role === "family") {
      setLocation("/family-portal");
    }
  }, [user, setLocation]);

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
                  <h1 className="text-2xl font-bold text-gray-900">CareCall Dashboard</h1>
                  <p className="mt-2 text-sm text-gray-500">
                    AI-powered early detection system for senior health monitoring through phone calls.
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-[#1565C0]"
                  >
                    <span className="material-icons text-sm mr-2">add</span>
                    New Patient
                  </button>
                </div>
              </div>
              
              {/* Latest Alerts Section */}
              <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Latest Alerts</h2>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Red Alert Card */}
                  <div className="border-l-4 border-[#F44336] bg-white shadow rounded-md p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-[#F44336] bg-opacity-10 text-[#F44336]">
                          <span className="material-icons">warning</span>
                        </span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">High Risk Alerts</h3>
                        <p className="text-lg font-bold text-gray-900">3</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Yellow Alert Card */}
                  <div className="border-l-4 border-[#FFC107] bg-white shadow rounded-md p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-[#FFC107] bg-opacity-10 text-[#FFC107]">
                          <span className="material-icons">priority_high</span>
                        </span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">Moderate Risk Alerts</h3>
                        <p className="text-lg font-bold text-gray-900">7</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Calls Card */}
                  <div className="border-l-4 border-[#1976D2] bg-white shadow rounded-md p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-[#1976D2] bg-opacity-10 text-[#1976D2]">
                          <span className="material-icons">phone</span>
                        </span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">Today's Calls</h3>
                        <p className="text-lg font-bold text-gray-900">12</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Patient List */}
              <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Patient Overview</h2>
                
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {isLoading ? (
                      <div className="p-6 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : patients?.length === 0 ? (
                      <li className="px-6 py-4 text-center text-gray-500">
                        No patients available
                      </li>
                    ) : (
                      patients?.map((patient) => (
                        <li key={patient.id}>
                          <Link 
                            href={`/dashboard/${patient.id}`}
                            className="block hover:bg-gray-50">
                            <div className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="relative mr-4">
                                    <div className="h-10 w-10 rounded-full bg-[#42A5F5] flex items-center justify-center text-white text-lg">
                                      {patient.initials}
                                    </div>
                                    {patient.hasRedAlert && (
                                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#F44336] border-2 border-white"></span>
                                    )}
                                    {!patient.hasRedAlert && patient.hasYellowAlert && (
                                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#FFC107] border-2 border-white"></span>
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-primary truncate">{patient.name}</p>
                                    <p className="text-sm text-gray-500">MRN: {patient.mrn}</p>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Last Call: {patient.lastCallDate}
                                  </p>
                                  <div className="ml-5 flex-shrink-0">
                                    <span className="material-icons text-gray-400">chevron_right</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
