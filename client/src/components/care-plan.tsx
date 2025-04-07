import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RecommendedAction, Alert, HealthAssessment } from "@/lib/types";
import { Search, Plus, FileText, History, Tag, MoreVertical } from "lucide-react";

interface CarePlanProps {
  patientId: number;
}

interface CarePlanItem {
  id: number;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  assignedTo: string;
  category: string;
  notes?: string;
}

export function CarePlan({ patientId }: CarePlanProps) {
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

  const { data: actions, isLoading: actionsLoading } = useQuery<RecommendedAction[]>({
    queryKey: [`/api/patients/${patientId}/recommended-actions`],
  });

  const { data: alerts, isLoading: alertsLoading } = useQuery<Alert[]>({
    queryKey: [`/api/patients/${patientId}/alerts`],
  });

  const { data: assessment, isLoading: assessmentLoading } = useQuery<HealthAssessment>({
    queryKey: [`/api/patients/${patientId}/latest-assessment`],
  });

  // Mock care plan items based on recommended actions and alerts
  const generateCarePlanItems = (): CarePlanItem[] => {
    if (!actions || !assessment) return [];
    
    const items: CarePlanItem[] = [];
    let id = 1;
    
    // Generate care plan items from recommendations
    actions.forEach(action => {
      action.actions.forEach(actionText => {
        items.push({
          id: id++,
          title: actionText,
          status: 'pending',
          dueDate: getFormattedFutureDate(7), // Due in 7 days
          assignedTo: 'Dr. Sarah Chen',
          category: action.category,
        });
      });
    });
    
    // Add special items for high-risk areas
    if (assessment.frailty.risk === 'high') {
      items.push({
        id: id++,
        title: 'Schedule frailty assessment with geriatrician',
        status: 'pending',
        dueDate: getFormattedFutureDate(3), // Due in 3 days - high priority
        assignedTo: 'Dr. James Wilson',
        category: 'Frailty Management',
        notes: 'Patient shows signs of increased frailty that requires specialist assessment'
      });
    }
    
    if (assessment.cardiacRiskFactors.risk === 'high') {
      items.push({
        id: id++,
        title: 'Schedule cardiology consultation',
        status: 'pending',
        dueDate: getFormattedFutureDate(5),
        assignedTo: 'Dr. Maria Lopez',
        category: 'Cardiac Care',
        notes: 'Review medication regimen and cardiac symptoms'
      });
    }
    
    return items;
  };
  
  // Helper function to get a date X days in the future
  const getFormattedFutureDate = (daysInFuture: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysInFuture);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const carePlanItems = generateCarePlanItems();
  const isLoading = actionsLoading || alertsLoading || assessmentLoading;

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Care Plan</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-3 py-1 text-sm rounded-md ${
                activeTab === 'current'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Current Plan
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1 text-sm rounded-md ${
                activeTab === 'history'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Plan History
            </button>
          </div>
        </div>

        {activeTab === 'current' ? (
          <>
            {carePlanItems.length > 0 ? (
              <div className="space-y-4">
                {/* Actions toolbar */}
                <div className="flex justify-between items-center">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search care plan..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex space-x-2">
                    <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm rounded-md text-white bg-primary hover:bg-primary-dark">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Task
                    </button>
                  </div>
                </div>

                {/* Care plan items */}
                <div className="overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {carePlanItems.map((item) => (
                      <li key={item.id} className="py-4">
                        <div className="flex items-start">
                          <div className="mr-4 pt-1">
                            <input
                              type="checkbox"
                              className="h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <p className="text-sm font-medium text-gray-900">{item.title}</p>
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    item.status === 'completed'
                                      ? 'bg-green-100 text-green-800'
                                      : item.status === 'in-progress'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {item.status === 'completed'
                                    ? 'Completed'
                                    : item.status === 'in-progress'
                                    ? 'In Progress'
                                    : 'Pending'}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-wrap mt-1">
                              <div className="text-xs text-gray-500 mr-4">
                                <span className="text-xs align-text-bottom mr-1">
                                  📅
                                </span>
                                Due: {item.dueDate}
                              </div>
                              <div className="text-xs text-gray-500 mr-4">
                                <span className="text-xs align-text-bottom mr-1">
                                  👤
                                </span>
                                {item.assignedTo}
                              </div>
                              <div className="text-xs text-primary">
                                <Tag className="h-3 w-3 mr-1 inline" />
                                {item.category}
                              </div>
                            </div>
                            {item.notes && (
                              <p className="mt-1 text-xs text-gray-500 bg-gray-50 p-2 rounded-md">
                                {item.notes}
                              </p>
                            )}
                          </div>
                          <div className="ml-4">
                            <button className="text-gray-400 hover:text-gray-500">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-48 flex-col">
                <FileText className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-gray-500">No care plan items available</p>
                <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Care Plan
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-center items-center h-48 flex-col">
            <History className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-gray-500">No historical care plans available</p>
          </div>
        )}
      </div>
    </div>
  );
}