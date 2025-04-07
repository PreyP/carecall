import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { PatientHeader } from "@/components/patient-header";
import { TranscriptViewer } from "@/components/transcript-viewer";
import { HealthAssessment } from "@/components/health-assessment";
import { KeyFindings } from "@/components/key-findings";
import { HealthTrends } from "@/components/health-trends";
import { RecommendedActions } from "@/components/recommended-actions";
import { useRoute } from "wouter";

type TabName = "latest-call" | "call-history" | "health-trends" | "care-plan";

export default function Dashboard() {
  const [, params] = useRoute("/dashboard/:patientId");
  const patientId = params ? parseInt(params.patientId) : 0;
  
  const [activeTab, setActiveTab] = useState<TabName>("latest-call");

  if (!patientId) {
    return <div>Invalid patient ID</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <TopBar />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            {/* Patient header section */}
            <PatientHeader patientId={patientId} />
            
            {/* Content tabs */}
            <div className="mt-6 px-4 sm:px-6 lg:px-8 pb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab("latest-call")}
                    className={`${
                      activeTab === "latest-call"
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Latest Call
                  </button>
                  <button
                    onClick={() => setActiveTab("call-history")}
                    className={`${
                      activeTab === "call-history"
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Call History
                  </button>
                  <button
                    onClick={() => setActiveTab("health-trends")}
                    className={`${
                      activeTab === "health-trends"
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Health Trends
                  </button>
                  <button
                    onClick={() => setActiveTab("care-plan")}
                    className={`${
                      activeTab === "care-plan"
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Care Plan
                  </button>
                </nav>
              </div>
              
              {/* Conditional content based on active tab */}
              {activeTab === "latest-call" && (
                <>
                  {/* Dashboard grid layout */}
                  <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left column - Call transcript */}
                    <TranscriptViewer patientId={patientId} />
                    
                    {/* Right column - Assessment data */}
                    <div className="space-y-6">
                      {/* Health assessment card */}
                      <HealthAssessment patientId={patientId} />
                      
                      {/* Key findings card */}
                      <KeyFindings patientId={patientId} />
                    </div>
                  </div>
                  
                  {/* Health trends section */}
                  <HealthTrends patientId={patientId} />
                  
                  {/* Recommended actions section */}
                  <RecommendedActions patientId={patientId} />
                </>
              )}
              
              {activeTab === "call-history" && (
                <div className="mt-6">
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">Call History</h2>
                      {/* Call History content would go here */}
                      <p className="text-gray-500">Call history feature will be implemented in the next phase.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "health-trends" && (
                <div className="mt-6">
                  <HealthTrends patientId={patientId} />
                </div>
              )}
              
              {activeTab === "care-plan" && (
                <div className="mt-6">
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">Care Plan</h2>
                      {/* Care Plan content would go here */}
                      <p className="text-gray-500">Care plan feature will be implemented in the next phase.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
