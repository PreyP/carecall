import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarIcon, 
  ClockIcon, 
  HeartPulse, 
  Phone, 
  User, 
  Pill, 
  Clipboard, 
  AlertTriangle, 
  Stethoscope, 
  Calendar,
  Bell,
  ArrowRight,
  Home,
  BarChart,
  AlertCircle,
  CheckCircle,
  Activity,
  Thermometer,
  ShieldAlert
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function FamilyPortal() {
  const { user, logoutMutation } = useAuth();
  const [_, navigate] = useLocation();

  // Redirect if user is not logged in or not a family member
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    } else if (user.role !== "family") {
      navigate("/");
    }
  }, [user, navigate]);

  // Get patient details
  const { data: patient, isLoading: isLoadingPatient } = useQuery({
    queryKey: ["/api/patients", user?.relatedPatientId],
    queryFn: ({ queryKey }) => {
      if (!user?.relatedPatientId) return null;
      return fetch(`/api/patients/${user.relatedPatientId}`).then(res => {
        if (!res.ok) throw new Error("Failed to fetch patient data");
        return res.json();
      });
    },
    enabled: !!user?.relatedPatientId
  });

  // Get latest health assessment
  const { data: assessment, isLoading: isLoadingAssessment } = useQuery({
    queryKey: ["/api/patients", user?.relatedPatientId, "latest-assessment"],
    queryFn: ({ queryKey }) => {
      if (!user?.relatedPatientId) return null;
      return fetch(`/api/patients/${user.relatedPatientId}/latest-assessment`).then(res => {
        if (!res.ok) {
          if (res.status === 404) return null;
          throw new Error("Failed to fetch assessment data");
        }
        return res.json();
      });
    },
    enabled: !!user?.relatedPatientId
  });

  // Get recommended actions
  const { data: recommendedActions = [], isLoading: isLoadingActions } = useQuery({
    queryKey: ["/api/patients", user?.relatedPatientId, "recommended-actions"],
    queryFn: ({ queryKey }) => {
      if (!user?.relatedPatientId) return [];
      return fetch(`/api/patients/${user.relatedPatientId}/recommended-actions`).then(res => {
        if (!res.ok) throw new Error("Failed to fetch recommended actions");
        return res.json();
      });
    },
    enabled: !!user?.relatedPatientId
  });

  // Get health trends
  const { data: healthTrends = [], isLoading: isLoadingTrends } = useQuery({
    queryKey: ["/api/patients", user?.relatedPatientId, "health-trends"],
    queryFn: ({ queryKey }) => {
      if (!user?.relatedPatientId) return [];
      return fetch(`/api/patients/${user.relatedPatientId}/health-trends`).then(res => {
        if (!res.ok) throw new Error("Failed to fetch health trends");
        return res.json();
      });
    },
    enabled: !!user?.relatedPatientId
  });

  // Get patient's doctor
  const { data: doctor, isLoading: isLoadingDoctor } = useQuery({
    queryKey: ["/api/users", patient?.primaryDoctorId],
    queryFn: ({ queryKey }) => {
      if (!patient?.primaryDoctorId) return null;
      return fetch(`/api/users/${patient.primaryDoctorId}`).then(res => {
        if (!res.ok) {
          if (res.status === 404) return null;
          throw new Error("Failed to fetch doctor data");
        }
        return res.json();
      });
    },
    enabled: !!patient?.primaryDoctorId
  });

  // Loading state
  const isLoading = isLoadingPatient || isLoadingAssessment || isLoadingActions || isLoadingTrends || isLoadingDoctor;

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Helper function to get a simplified risk description
  const getRiskDescription = (risk: string) => {
    switch (risk) {
      case "high":
        return "may need attention";
      case "moderate":
        return "showing some signs of concern";
      case "low":
        return "generally doing well";
      default:
        return "status unknown";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">CareCall Family Portal</h1>
            <p className="text-sm opacity-80">Monitoring your loved one's health</p>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-right">
                <p className="font-medium">{user.fullName}</p>
                <p className="text-xs opacity-80">{user.relationship} of {patient?.name}</p>
              </div>
            )}
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : !patient ? (
          <Alert>
            <AlertTitle>No data available</AlertTitle>
            <AlertDescription>
              We couldn't find any information for your family member. Please contact support.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Patient Overview */}
            <section className="mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl flex items-center">
                    <User className="h-6 w-6 mr-2 text-primary" />
                    {patient.name}
                  </CardTitle>
                  <CardDescription className="text-base">
                    Last check-in: {patient.lastCallDate || "No recent calls"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-2 text-gray-500" />
                      <span>{patient.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
                      <span>{patient.age} years old</span>
                    </div>
                    {patient.hasRedAlert && (
                      <Badge variant="outline" className="flex items-center justify-center border-red-500 text-red-600 bg-red-50">
                        <ShieldAlert className="h-4 w-4 mr-1" />
                        Needs attention
                      </Badge>
                    )}
                    {patient.hasYellowAlert && !patient.hasRedAlert && (
                      <Badge variant="outline" className="flex items-center justify-center border-amber-500 text-amber-600 bg-amber-50">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Some concerns
                      </Badge>
                    )}
                    {!patient.hasYellowAlert && !patient.hasRedAlert && (
                      <Badge variant="outline" className="flex items-center justify-center border-green-500 text-green-600 bg-green-50">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Doing well
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Simplified Health Status */}
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <HeartPulse className="h-6 w-6 mr-2 text-primary" />
              Health Overview
            </h2>
            <section className="mb-8">
              <Tabs defaultValue="status" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="status">Health Status</TabsTrigger>
                  <TabsTrigger value="trends">Recent Changes</TabsTrigger>
                </TabsList>
                <TabsContent value="status">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <HeartPulse className="h-5 w-5 mr-2 text-primary" />
                        Overall Health Status
                      </CardTitle>
                      <CardDescription>
                        Based on CareCall's last conversation with {patient.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {assessment ? (
                        <div className="space-y-6">
                          <div>
                            <div className="flex justify-between mb-2">
                              <h3 className="font-medium">Daily Activities</h3>
                              <Badge 
                                variant="outline"
                                className={`flex items-center gap-1 ${
                                  assessment.adlRisk === "high" 
                                    ? "border-red-500 text-red-600 bg-red-50" 
                                    : assessment.adlRisk === "moderate" 
                                      ? "border-amber-500 text-amber-600 bg-amber-50" 
                                      : "border-green-500 text-green-600 bg-green-50"
                                }`}
                              >
                                {assessment.adlRisk === "high" 
                                  ? <><AlertTriangle className="h-3 w-3" /> Needs attention</> 
                                  : assessment.adlRisk === "moderate" 
                                    ? <><AlertCircle className="h-3 w-3" /> Some concerns</> 
                                    : <><CheckCircle className="h-3 w-3" /> Doing well</>}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-2">
                              Your loved one is {getRiskDescription(assessment.adlRisk)} with daily activities like dressing, bathing, and eating.
                            </p>
                            <Progress 
                              value={assessment.adlRisk === "high" ? 85 : assessment.adlRisk === "moderate" ? 50 : 20} 
                              className={`h-2 ${assessment.adlRisk === "high" ? "bg-red-100" : assessment.adlRisk === "moderate" ? "bg-amber-100" : "bg-green-100"}`}
                            />
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <h3 className="font-medium">Household Tasks</h3>
                              <Badge 
                                variant="outline"
                                className={`flex items-center gap-1 ${
                                  assessment.iadlRisk === "high" 
                                    ? "border-red-500 text-red-600 bg-red-50" 
                                    : assessment.iadlRisk === "moderate" 
                                      ? "border-amber-500 text-amber-600 bg-amber-50" 
                                      : "border-green-500 text-green-600 bg-green-50"
                                }`}
                              >
                                {assessment.iadlRisk === "high" 
                                  ? <><Activity className="h-3 w-3" /> Needs attention</> 
                                  : assessment.iadlRisk === "moderate" 
                                    ? <><AlertCircle className="h-3 w-3" /> Some concerns</> 
                                    : <><CheckCircle className="h-3 w-3" /> Doing well</>}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-2">
                              Your loved one is {getRiskDescription(assessment.iadlRisk)} with tasks like cooking, cleaning, and managing finances.
                            </p>
                            <Progress 
                              value={assessment.iadlRisk === "high" ? 85 : assessment.iadlRisk === "moderate" ? 50 : 20} 
                              className={`h-2 ${assessment.iadlRisk === "high" ? "bg-red-100" : assessment.iadlRisk === "moderate" ? "bg-amber-100" : "bg-green-100"}`}
                            />
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <h3 className="font-medium">Medication Management</h3>
                              <Badge 
                                variant="outline"
                                className={`flex items-center gap-1 ${
                                  assessment.medicationAdherenceRisk === "high" 
                                    ? "border-red-500 text-red-600 bg-red-50" 
                                    : assessment.medicationAdherenceRisk === "moderate" 
                                      ? "border-amber-500 text-amber-600 bg-amber-50" 
                                      : "border-green-500 text-green-600 bg-green-50"
                                }`}
                              >
                                {assessment.medicationAdherenceRisk === "high" 
                                  ? <><Pill className="h-3 w-3" /> Needs attention</> 
                                  : assessment.medicationAdherenceRisk === "moderate" 
                                    ? <><AlertCircle className="h-3 w-3" /> Some concerns</> 
                                    : <><CheckCircle className="h-3 w-3" /> Doing well</>}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-2">
                              Your loved one is {getRiskDescription(assessment.medicationAdherenceRisk)} with taking medications as prescribed.
                            </p>
                            <Progress 
                              value={assessment.medicationAdherenceRisk === "high" ? 85 : assessment.medicationAdherenceRisk === "moderate" ? 50 : 20} 
                              className={`h-2 ${assessment.medicationAdherenceRisk === "high" ? "bg-red-100" : assessment.medicationAdherenceRisk === "moderate" ? "bg-amber-100" : "bg-green-100"}`}
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No recent health assessment available</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="trends">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <BarChart className="h-5 w-5 mr-2 text-primary" />
                        Recent Health Changes
                      </CardTitle>
                      <CardDescription>
                        Changes observed in recent calls with {patient.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {healthTrends.length > 0 ? (
                        <div className="space-y-4">
                          {healthTrends.slice(0, 3).map((trend, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex justify-between mb-1">
                                <h3 className="font-medium">{trend.date}</h3>
                                <Badge 
                                  variant="outline"
                                  className={`flex items-center gap-1 ${
                                    trend.risk === "high" 
                                      ? "border-red-500 text-red-600 bg-red-50" 
                                      : trend.risk === "moderate" 
                                        ? "border-amber-500 text-amber-600 bg-amber-50" 
                                        : "border-green-500 text-green-600 bg-green-50"
                                  }`}
                                >
                                  {trend.risk === "high" 
                                    ? <><ShieldAlert className="h-3 w-3" /> Needs attention</> 
                                    : trend.risk === "moderate" 
                                      ? <><Thermometer className="h-3 w-3" /> Some concerns</> 
                                      : <><Activity className="h-3 w-3" /> Doing well</>}
                                </Badge>
                              </div>
                              <p className="text-gray-600">{trend.summary}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Clipboard className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 italic">No health trend data available</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-center border-t pt-4">
                      <Button variant="outline" size="sm">
                        View All Health Reports
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </section>
            
            {/* Upcoming Appointments */}
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-primary" />
              Upcoming Care Activities
            </h2>
            <section className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    Scheduled Appointments & Check-ins
                  </CardTitle>
                  <CardDescription>
                    Keep track of important healthcare events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-blue-800">Next Brigid Check-in</h3>
                          <p className="text-blue-600 mt-1">Automated health assessment call</p>
                        </div>
                        <Badge variant="outline" className="border-blue-500 text-blue-700">
                          Scheduled
                        </Badge>
                      </div>
                      <div className="mt-3 flex items-center text-blue-700">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <span>Thursday, April 10, 2025</span>
                        <ClockIcon className="h-4 w-4 mx-2" />
                        <span>10:00 AM</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Dr. Sarah Chen - Primary Care Visit</h3>
                          <p className="text-gray-600 mt-1">Annual wellness check-up</p>
                        </div>
                        <Badge variant="outline" className="border-purple-500 text-purple-700">
                          In 2 weeks
                        </Badge>
                      </div>
                      <div className="mt-3 flex items-center text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <span>Tuesday, April 22, 2025</span>
                        <ClockIcon className="h-4 w-4 mx-2" />
                        <span>9:30 AM</span>
                      </div>
                      <div className="mt-3 flex items-center text-gray-600">
                        <Home className="h-4 w-4 mr-2" />
                        <span>Memorial Hospital, 123 Main St</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Medication Refill Reminder</h3>
                          <p className="text-gray-600 mt-1">Blood pressure medication</p>
                        </div>
                        <Badge variant="outline" className="border-amber-500 text-amber-700">
                          In 5 days
                        </Badge>
                      </div>
                      <div className="mt-3 flex items-center text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <span>Monday, April 15, 2025</span>
                      </div>
                      <Button variant="secondary" size="sm" className="mt-3">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Pharmacy
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule a Family Visit
                  </Button>
                </CardFooter>
              </Card>
            </section>

            {/* Recommended Actions */}
            <h2 className="text-2xl font-bold mb-4">How You Can Help</h2>
            <section className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Pill className="h-5 w-5 mr-2 text-primary" />
                    Recommended Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recommendedActions.length > 0 ? (
                    <div className="space-y-6">
                      {recommendedActions.map((action, index) => (
                        <div key={index}>
                          <h3 className="font-medium text-lg mb-2">{action.category}</h3>
                          <ul className="list-disc list-inside space-y-2">
                            {action.actions.map((item, i) => (
                              <li key={i} className="text-gray-600">
                                {item}
                              </li>
                            ))}
                          </ul>
                          {/* Add family-specific guidance */}
                          <div className="mt-4 bg-blue-50 p-4 rounded-md">
                            <h4 className="font-medium text-blue-700 mb-2">Ways to support your loved one:</h4>
                            <ul className="list-disc list-inside space-y-2 text-blue-600">
                              <li>Check in with a phone call to see how they're feeling</li>
                              <li>Help organize their medications or remind them to take them</li>
                              <li>Coordinate transportation to medical appointments if needed</li>
                              <li>Consider visiting to help with household tasks or meal preparation</li>
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-500 italic mb-4">No specific actions recommended at this time</p>
                      <div className="bg-blue-50 p-4 rounded-md">
                        <h4 className="font-medium text-blue-700 mb-2">General ways to support your loved one:</h4>
                        <ul className="list-disc list-inside space-y-2 text-blue-600">
                          <li>Regular check-in calls to monitor their well-being</li>
                          <li>Help organize their medications and medical appointments</li>
                          <li>Assist with grocery shopping or meal preparation</li>
                          <li>Encourage social activities and physical exercise</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Healthcare Provider Information */}
            <h2 className="text-2xl font-bold mb-4">Healthcare Provider Information</h2>
            <section className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Stethoscope className="h-5 w-5 mr-2 text-primary" />
                    Primary Physician
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {doctor ? (
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <User className="h-5 w-5 mr-2 text-gray-500" />
                        <span className="font-medium">{doctor.fullName}</span>
                      </div>
                      {doctor.hospital && (
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>{doctor.hospital}</span>
                        </div>
                      )}
                      <div className="bg-gray-50 p-4 rounded-md mt-4">
                        <h4 className="font-medium mb-2">When to contact the physician:</h4>
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                          <li>If you notice sudden changes in your loved one's physical condition</li>
                          <li>If they experience increased difficulty with daily activities</li>
                          <li>If they show signs of confusion or disorientation</li>
                          <li>If they're having trouble taking medications as prescribed</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No primary physician information available</p>
                  )}
                </CardContent>
              </Card>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 border-t">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600">
            <p>Brigid Family Portal &copy; {new Date().getFullYear()}</p>
            <p className="text-sm mt-1">Helping families stay connected with their loved ones' health</p>
          </div>
        </div>
      </footer>
    </div>
  );
}