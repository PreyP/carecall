import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Patient } from "@/lib/types";
import { ScheduleCallDialog } from "@/components/schedule-call-dialog";

// Scheduled call type
interface ScheduledCall {
  id: number;
  patientId: number;
  patientName: string;
  patientInitials: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'missed';
  priority: 'normal' | 'high';
  notes?: string;
}

export default function ScheduledCalls() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [dateView, setDateView] = useState<'day' | 'week' | 'month'>('week');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [calls, setCalls] = useState<ScheduledCall[]>([]);
  const [nextCallId, setNextCallId] = useState(1);
  
  const { data: patients, isLoading: patientsLoading } = useQuery<Patient[]>({
    queryKey: ['/api/patients'],
  });
  
  // Create mock calls - in a real app, these would come from API
  const generateMockScheduledCalls = (): ScheduledCall[] => {
    if (!patients) return [];
    
    const mockCalls: ScheduledCall[] = [];
    
    // Current date for reference
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Generate calls based on real patient data
    patients.forEach(patient => {
      // First call - today
      mockCalls.push({
        id: mockCalls.length + 1,
        patientId: patient.id,
        patientName: patient.name,
        patientInitials: patient.initials,
        scheduledDate: today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        scheduledTime: '10:30 AM',
        status: Math.random() > 0.5 ? 'completed' : 'scheduled',
        priority: patient.hasRedAlert ? 'high' : 'normal',
      });
      
      // Second call - tomorrow
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      mockCalls.push({
        id: mockCalls.length + 1,
        patientId: patient.id,
        patientName: patient.name,
        patientInitials: patient.initials,
        scheduledDate: tomorrow.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        scheduledTime: '11:15 AM',
        status: 'scheduled',
        priority: patient.hasYellowAlert ? 'high' : 'normal',
      });
      
      // Third call - in three days
      const threeDays = new Date(today);
      threeDays.setDate(today.getDate() + 3);
      mockCalls.push({
        id: mockCalls.length + 1,
        patientId: patient.id,
        patientName: patient.name,
        patientInitials: patient.initials,
        scheduledDate: threeDays.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        scheduledTime: '2:00 PM',
        status: 'scheduled',
        priority: 'normal',
      });
      
      // Past call - last week
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);
      mockCalls.push({
        id: mockCalls.length + 1,
        patientId: patient.id,
        patientName: patient.name,
        patientInitials: patient.initials,
        scheduledDate: lastWeek.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        scheduledTime: '9:45 AM',
        status: Math.random() > 0.3 ? 'completed' : 'missed',
        priority: 'normal',
      });
    });
    
    return mockCalls;
  };
  
  // Generate mock data for initial state
  useEffect(() => {
    if (patients && calls.length === 0) {
      const mockCalls = generateMockScheduledCalls();
      setCalls(mockCalls);
      
      // Set next ID based on mock data
      if (mockCalls.length > 0) {
        setNextCallId(Math.max(...mockCalls.map(call => call.id)) + 1);
      }
    }
  }, [patients, calls.length]);

  // Handle adding a new call
  const handleAddCall = (callData: any) => {
    const newCall: ScheduledCall = {
      id: nextCallId,
      ...callData,
    };
    
    setCalls([...calls, newCall]);
    setNextCallId(nextCallId + 1);
    setIsDialogOpen(false);
  };
  
  // Filter calls by active tab
  const filteredCalls = calls.filter(call => {
    const callDate = new Date(call.scheduledDate);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (activeTab === 'upcoming') {
      return callDate >= today && call.status !== 'completed' && call.status !== 'missed';
    } else {
      return callDate < today || call.status === 'completed' || call.status === 'missed';
    }
  }).sort((a, b) => {
    // Sort by date
    const dateA = new Date(a.scheduledDate);
    const dateB = new Date(b.scheduledDate);
    
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }
    
    // If same date, sort by time
    return a.scheduledTime.localeCompare(b.scheduledTime);
  });
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'missed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'schedule';
      case 'in-progress':
        return 'phone_in_talk';
      case 'completed':
        return 'check_circle';
      case 'missed':
        return 'cancel';
      default:
        return 'help';
    }
  };

  if (patientsLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-darker-cream">
        <Sidebar />
        
        <div className="flex flex-col flex-1 w-0 overflow-hidden">
          <TopBar />
          
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/4 mb-8"></div>
                  <div className="h-64 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <TopBar />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Scheduled Calls</h1>
                  <p className="mt-2 text-sm text-gray-500">
                    View and manage upcoming and past AI calls with patients
                  </p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <button
                    type="button"
                    onClick={() => setIsDialogOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
                  >
                    <span className="material-icons text-sm mr-2">add</span>
                    Schedule New Call
                  </button>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                      {/* Tabs */}
                      <div className="flex space-x-4">
                        <button
                          onClick={() => setActiveTab('upcoming')}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            activeTab === 'upcoming'
                              ? 'bg-primary text-white'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          Upcoming Calls
                        </button>
                        <button
                          onClick={() => setActiveTab('past')}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            activeTab === 'past'
                              ? 'bg-primary text-white'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          Past Calls
                        </button>
                      </div>
                      
                      {/* Date view selector */}
                      <div className="flex border border-gray-200 rounded-md">
                        <button
                          onClick={() => setDateView('day')}
                          className={`px-3 py-1 text-sm ${
                            dateView === 'day'
                              ? 'bg-gray-100 text-gray-800'
                              : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          Day
                        </button>
                        <button
                          onClick={() => setDateView('week')}
                          className={`px-3 py-1 text-sm border-l border-r border-gray-200 ${
                            dateView === 'week'
                              ? 'bg-gray-100 text-gray-800'
                              : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          Week
                        </button>
                        <button
                          onClick={() => setDateView('month')}
                          className={`px-3 py-1 text-sm ${
                            dateView === 'month'
                              ? 'bg-gray-100 text-gray-800'
                              : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          Month
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Calendar/list view */}
                  <div className="px-4 py-5 sm:p-6">
                    {filteredCalls.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Patient
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date & Time
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Priority
                              </th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCalls.map((call) => (
                              <tr key={call.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-light flex items-center justify-center text-white">
                                      {call.patientInitials}
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{call.patientName}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{call.scheduledDate}</div>
                                  <div className="text-sm text-gray-500">{call.scheduledTime}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(call.status)}`}>
                                    <span className="material-icons text-xs mr-1">{getStatusIcon(call.status)}</span>
                                    {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {call.priority === 'high' ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      <span className="material-icons text-xs mr-1">priority_high</span>
                                      High Priority
                                    </span>
                                  ) : (
                                    <span className="text-sm text-gray-500">Normal</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <Link 
                                    href={`/dashboard/${call.patientId}`}
                                    className="text-primary hover:text-primary-dark mr-4">
                                    View Patient
                                  </Link>
                                  {call.status === 'scheduled' && (
                                    <button className="text-gray-600 hover:text-gray-900">
                                      Reschedule
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center h-64 flex-col">
                        <span className="material-icons text-gray-400 text-4xl mb-2">
                          event_busy
                        </span>
                        <p className="text-gray-500">No {activeTab} calls found</p>
                        {activeTab === 'upcoming' && (
                          <button 
                            onClick={() => setIsDialogOpen(true)}
                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark">
                            <span className="material-icons text-sm mr-2">add</span>
                            Schedule a Call
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Schedule Call Dialog */}
      <ScheduleCallDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSchedule={handleAddCall}
      />
    </div>
  );
}