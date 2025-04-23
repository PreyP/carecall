import React from "react";
import { HealthMeter } from "@/components/ui/health-meter";
import { HealthAssessment as HealthAssessmentType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

interface HealthAssessmentProps {
  patientId: number;
  callId?: number;
}

export function HealthAssessment({ patientId, callId }: HealthAssessmentProps) {
  const { data: assessment, isLoading } = useQuery<HealthAssessmentType>({
    queryKey: [callId 
      ? `/api/calls/${callId}/assessment` 
      : `/api/patients/${patientId}/latest-assessment`
    ],
  });

  if (isLoading) {
    return (
      <div className="bg-[#F0E8D8] shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-5 bg-[#E6DFD0] rounded w-1/3"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 bg-[#E6DFD0] rounded w-1/4"></div>
                    <div className="h-4 bg-[#E6DFD0] rounded w-1/5"></div>
                  </div>
                  <div className="h-2 bg-[#E6DFD0] rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="bg-[#F0E8D8] shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-center items-center h-48 flex-col">
            <span className="material-icons text-gray-400 text-4xl mb-2">assessment</span>
            <p className="text-gray-500">No health assessment available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F0E8D8] shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Health Assessment</h2>
        
        {/* Assessment meters */}
        <div className="space-y-4">
          {/* Frailty scale */}
          <HealthMeter
            label="Frailty Scale"
            value={assessment.frailty.score}
            risk={assessment.frailty.risk}
            labelLeft="Low"
            labelMiddle="Moderate"
            labelRight="High"
          />
          
          {/* ADL assessment */}
          <HealthMeter
            label="Activities of Daily Living"
            value={assessment.adl.score}
            risk={assessment.adl.risk}
            labelLeft="Independence"
            labelMiddle="Partial"
            labelRight="Dependent"
          />
          
          {/* IADL assessment */}
          <HealthMeter
            label="Instrumental ADL"
            value={assessment.iadl.score}
            risk={assessment.iadl.risk}
            labelLeft="Independence"
            labelMiddle="Partial"
            labelRight="Dependent"
          />
          
          {/* Medication adherence */}
          <HealthMeter
            label="Medication Adherence"
            value={assessment.medicationAdherence.score}
            risk={assessment.medicationAdherence.risk}
            labelLeft="Adherent"
            labelMiddle="Partial"
            labelRight="Non-adherent"
          />
          
          {/* Cardiac risk factors */}
          <HealthMeter
            label="Cardiac Risk Factors"
            value={assessment.cardiacRiskFactors.score}
            risk={assessment.cardiacRiskFactors.risk}
            labelLeft="Low"
            labelMiddle="Moderate"
            labelRight="High"
          />
        </div>
      </div>
    </div>
  );
}
