import React from "react";
import { cn } from "@/lib/utils";
import { RiskLevel } from "@/lib/types";
import { ShieldAlert, Thermometer, CheckCircle, Activity, Pill, Heart } from "lucide-react";

interface HealthMeterProps {
  value: number; // 0-1 scale
  label: string;
  risk: RiskLevel;
  showLabels?: boolean;
  labelLeft?: string;
  labelMiddle?: string;
  labelRight?: string;
  className?: string;
}

export function HealthMeter({
  value,
  label,
  risk,
  showLabels = true,
  labelLeft = "Low",
  labelMiddle = "Moderate",
  labelRight = "High",
  className,
}: HealthMeterProps) {
  // Map risk level to color classes
  const getRiskColorClass = (risk: RiskLevel) => {
    switch (risk) {
      case "low":
        return "bg-[#4CAF50]";
      case "moderate":
        return "bg-[#FFC107]";
      case "high":
        return "bg-[#F44336]";
      default:
        return "bg-[#4CAF50]";
    }
  };

  const getRiskBadgeClass = (risk: RiskLevel) => {
    switch (risk) {
      case "low":
        return "bg-green-50 text-green-700 border border-green-300 font-semibold shadow-sm";
      case "moderate":
        return "bg-amber-50 text-amber-700 border border-amber-300 font-semibold shadow-sm";
      case "high":
        return "bg-red-50 text-red-700 border border-red-300 font-semibold shadow-sm";
      default:
        return "bg-green-50 text-green-700 border border-green-300 font-semibold shadow-sm";
    }
  };

  // Get the appropriate icon for risk level
  const getRiskIcon = (risk: RiskLevel) => {
    switch (risk) {
      case "low":
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case "moderate":
        return <Thermometer className="h-3 w-3 mr-1" />;
      case "high":
        return <ShieldAlert className="h-3 w-3 mr-1" />;
      default:
        return <CheckCircle className="h-3 w-3 mr-1" />;
    }
  };

  // Map risk level to readable text
  const getRiskText = (risk: RiskLevel) => {
    switch (risk) {
      case "low":
        return "Low Risk";
      case "moderate":
        return "Moderate Risk";
      case "high":
        return "High Risk";
      default:
        return "Unknown";
    }
  };

  // Calculate width percentage from value
  const widthPercentage = `${Math.max(0, Math.min(100, value * 100))}%`;

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", getRiskBadgeClass(risk))}>
          {getRiskIcon(risk)}
          {getRiskText(risk)}
        </span>
      </div>
      <div className="h-2 bg-neutral-light rounded-full">
        <div
          className={cn("h-2 rounded-full", getRiskColorClass(risk))}
          style={{ width: widthPercentage }}
        ></div>
      </div>
      {showLabels && (
        <div className="mt-1 flex justify-between text-xs text-neutral-600">
          <span>{labelLeft}</span>
          <span>{labelMiddle}</span>
          <span>{labelRight}</span>
        </div>
      )}
    </div>
  );
}
