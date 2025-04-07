import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Patient } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

export function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  
  const { data: recentPatients, isLoading } = useQuery<Patient[]>({
    queryKey: ['/api/patients/recent'],
    // Only fetch patients for physician users
    enabled: !!user && user.role === 'physician',
  });

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-white border-r border-gray-200">
        {/* Logo and app title */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200 bg-primary text-white">
          <span className="material-icons mr-2">health_and_safety</span>
          <h1 className="text-xl font-bold">CareCall</h1>
        </div>
        
        {/* Main navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {/* Show different home links based on role */}
          {user?.role === "family" ? (
            <Link href="/family-portal"
              className={cn(
                "flex items-center px-4 py-2 text-sm rounded-md",
                location === "/family-portal" 
                  ? "text-white bg-primary hover:bg-primary-dark" 
                  : "text-gray-700 hover:bg-gray-100"
              )}>
              <span className={cn(
                "material-icons mr-3",
                location === "/family-portal" ? "text-white" : "text-gray-500"
              )}>home</span>
              Family Portal
            </Link>
          ) : (
            <Link href="/"
              className={cn(
                "flex items-center px-4 py-2 text-sm rounded-md",
                location === "/" 
                  ? "text-white bg-primary hover:bg-primary-dark" 
                  : "text-gray-700 hover:bg-gray-100"
              )}>
              <span className={cn(
                "material-icons mr-3",
                location === "/" ? "text-white" : "text-gray-500"
              )}>dashboard</span>
              Dashboard
            </Link>
          )}
          
          {/* Only show these links for physicians */}
          {user?.role === "physician" && (
            <>
              <Link href="/patients"
                className={cn(
                  "flex items-center px-4 py-2 text-sm rounded-md",
                  location.startsWith("/patients") 
                    ? "text-white bg-primary hover:bg-primary-dark" 
                    : "text-gray-700 hover:bg-gray-100"
                )}>
                <span className={cn(
                  "material-icons mr-3",
                  location.startsWith("/patients") ? "text-white" : "text-gray-500"
                )}>people</span>
                Patients
              </Link>
              
              <Link href="/scheduled-calls"
                className={cn(
                  "flex items-center px-4 py-2 text-sm rounded-md", 
                  location.startsWith("/scheduled-calls") 
                    ? "text-white bg-primary hover:bg-primary-dark" 
                    : "text-gray-700 hover:bg-gray-100"
                )}>
                <span className={cn(
                  "material-icons mr-3",
                  location.startsWith("/scheduled-calls") ? "text-white" : "text-gray-500"
                )}>event_note</span>
                Scheduled Calls
              </Link>
            </>
          )}
          
          {/* Settings link for all users */}
          <Link href="/settings"
            className={cn(
              "flex items-center px-4 py-2 text-sm rounded-md",
              location.startsWith("/settings") 
                ? "text-white bg-primary hover:bg-primary-dark" 
                : "text-gray-700 hover:bg-gray-100"
            )}>
            <span className={cn(
              "material-icons mr-3",
              location.startsWith("/settings") ? "text-white" : "text-gray-500"
            )}>settings</span>
            Settings
          </Link>
        </nav>
        
        {/* Patient list - only shown for physicians */}
        {user?.role === "physician" && (
          <div className="flex flex-col px-3 py-2 border-t border-gray-200">
            <div className="flex items-center justify-between py-2">
              <h2 className="text-sm font-semibold text-gray-500">RECENT PATIENTS</h2>
              <button className="text-primary hover:text-primary-dark">
                <span className="material-icons text-sm">add</span>
              </button>
            </div>
            
            {/* Patient list items */}
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : (
              recentPatients?.map((patient) => (
                <Link 
                  key={patient.id} 
                  href={`/dashboard/${patient.id}`}
                  className="flex items-center px-2 py-2 text-sm rounded-md hover:bg-gray-100 group">
                  <div className="relative mr-3">
                    <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-white">
                      <span>{patient.initials}</span>
                    </div>
                    {patient.hasRedAlert && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#F44336] border border-white"></span>
                    )}
                    {!patient.hasRedAlert && patient.hasYellowAlert && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#FFC107] border border-white"></span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-xs text-gray-500">Last call: {patient.lastCallDate}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
        
        {/* User profile */}
        <div className="flex items-center p-4 border-t border-gray-200">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">
            <span className="material-icons text-sm">person</span>
          </div>
          <div className="ml-3">
            {user ? (
              <>
                <p className="text-sm font-medium">{user.fullName}</p>
                <p className="text-xs text-gray-500">
                  {user.role === "physician" 
                    ? (user.hospital || "Physician") 
                    : "Family Member"}
                </p>
              </>
            ) : (
              <p className="text-sm font-medium">Loading...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
