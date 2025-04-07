import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Patient } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { AddPatientDialog } from "./add-patient-dialog";

interface PatientManagementProps {
  onPatientSelect?: (patientId: number) => void;
}

export function PatientManagement({ onPatientSelect }: PatientManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "age" | "lastCall">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterRisk, setFilterRisk] = useState<"all" | "red" | "yellow" | "none">("all");
  
  const queryClient = useQueryClient();

  const { data: patients, isLoading } = useQuery<Patient[]>({
    queryKey: ['/api/patients'],
  });

  // Sort and filter patients based on current settings
  const processedPatients = React.useMemo(() => {
    if (!patients) return [];
    
    // Filter by search query and risk level
    let filtered = patients.filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          patient.mrn.includes(searchQuery);
      
      const matchesRisk = filterRisk === "all" ||
                        (filterRisk === "red" && patient.hasRedAlert) ||
                        (filterRisk === "yellow" && !patient.hasRedAlert && patient.hasYellowAlert) ||
                        (filterRisk === "none" && !patient.hasRedAlert && !patient.hasYellowAlert);
                        
      return matchesSearch && matchesRisk;
    });
    
    // Sort
    return filtered.sort((a, b) => {
      if (sortBy === "name") {
        return sortDirection === "asc" 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === "age") {
        return sortDirection === "asc"
          ? a.age - b.age
          : b.age - a.age;
      } else {
        // lastCall
        return sortDirection === "asc"
          ? a.lastCallDate.localeCompare(b.lastCallDate)
          : b.lastCallDate.localeCompare(a.lastCallDate);
      }
    });
  }, [patients, searchQuery, sortBy, sortDirection, filterRisk]);

  // Toggle sort direction or change sort field
  const handleSort = (field: "name" | "age" | "lastCall") => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="h-64 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">Patient Management</h2>
          <button
            onClick={() => setShowAddPatient(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
          >
            <span className="material-icons text-sm mr-2">person_add</span>
            Add New Patient
          </button>
        </div>

        {/* Search and filter controls */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-icons text-gray-400 text-sm">search</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or MRN..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value as any)}
              className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            >
              <option value="all">All Patients</option>
              <option value="red">High Risk (Red)</option>
              <option value="yellow">Moderate Risk (Yellow)</option>
              <option value="none">Low Risk</option>
            </select>
          </div>
        </div>

        {/* Patient table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Patient Name
                    {sortBy === "name" && (
                      <span className="material-icons text-sm ml-1">
                        {sortDirection === "asc" ? "arrow_upward" : "arrow_downward"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("age")}
                >
                  <div className="flex items-center">
                    Age
                    {sortBy === "age" && (
                      <span className="material-icons text-sm ml-1">
                        {sortDirection === "asc" ? "arrow_upward" : "arrow_downward"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  MRN
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("lastCall")}
                >
                  <div className="flex items-center">
                    Last Call
                    {sortBy === "lastCall" && (
                      <span className="material-icons text-sm ml-1">
                        {sortDirection === "asc" ? "arrow_upward" : "arrow_downward"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {processedPatients.length > 0 ? (
                processedPatients.map((patient) => (
                  <tr 
                    key={patient.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onPatientSelect && onPatientSelect(patient.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center text-white">
                            {patient.initials}
                          </div>
                          {patient.hasRedAlert && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#F44336] border-2 border-white"></span>
                          )}
                          {!patient.hasRedAlert && patient.hasYellowAlert && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#FFC107] border-2 border-white"></span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                          <div className="text-sm text-gray-500">{patient.gender}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.age}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.mrn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {patient.hasRedAlert ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <span className="material-icons text-xs mr-1">warning</span>
                          High Risk
                        </span>
                      ) : patient.hasYellowAlert ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <span className="material-icons text-xs mr-1">priority_high</span>
                          Moderate Risk
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <span className="material-icons text-xs mr-1">check_circle</span>
                          Low Risk
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.lastCallDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/dashboard/${patient.id}`;
                        }}
                        className="text-primary hover:text-primary-dark mr-3"
                      >
                        View
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Open edit dialog (not implemented yet)
                        }}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No patients match your search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add Patient Dialog */}
      <AddPatientDialog 
        isOpen={showAddPatient} 
        onClose={() => setShowAddPatient(false)} 
      />
    </div>
  );
}