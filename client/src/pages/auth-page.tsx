import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InsertUser } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HeartPulse, Phone } from "lucide-react";

// Login schema with validation
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["doctor", "family"])
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Registration schema with validation for doctors
const doctorRegistrationSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name is required"),
  role: z.string().default("doctor"),
  hospital: z.string().optional(),
});

// Registration schema with validation for family members
const familyRegistrationSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name is required"),
  role: z.string().default("family"),
  relatedPatientId: z.number().min(1, "Please select a patient"),
  contactPhone: z.string().min(10, "Valid phone number is required"),
  contactEmail: z.string().email("Valid email is required"),
  relationship: z.string().min(1, "Relationship is required"),
});

type DoctorRegistrationFormValues = z.infer<typeof doctorRegistrationSchema>;
type FamilyRegistrationFormValues = z.infer<typeof familyRegistrationSchema>;

export default function AuthPage() {
  const [portalType, setPortalType] = useState<"physician" | "family">("physician");
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [registrationType, setRegistrationType] = useState<"doctor" | "family">("doctor");
  const { user, loginMutation, registerMutation } = useAuth();
  const [_, navigate] = useLocation();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate(user.role === "family" ? "/family-portal" : "/");
    }
  }, [user, navigate]);

  // Login form setup
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      role: portalType === "physician" ? "doctor" : "family"
    },
  });

  // Watch for portal type changes to update login form role
  useEffect(() => {
    loginForm.setValue("role", portalType === "physician" ? "doctor" : "family");
  }, [portalType, loginForm]);

  // Doctor registration form setup
  const doctorRegisterForm = useForm<DoctorRegistrationFormValues>({
    resolver: zodResolver(doctorRegistrationSchema),
    defaultValues: {
      username: "",
      password: "",
      fullName: "",
      role: "doctor",
      hospital: "",
    },
  });

  // Family registration form setup
  const familyRegisterForm = useForm<FamilyRegistrationFormValues>({
    resolver: zodResolver(familyRegistrationSchema),
    defaultValues: {
      username: "",
      password: "",
      fullName: "",
      role: "family",
      relatedPatientId: undefined,
      contactPhone: "",
      contactEmail: "",
      relationship: "",
    },
  });

  // Handle login submit
  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate({
      username: values.username,
      password: values.password,
      role: values.role
    });
  };

  // Handle doctor registration submit
  const onDoctorRegisterSubmit = (values: DoctorRegistrationFormValues) => {
    registerMutation.mutate(values as InsertUser);
  };

  // Handle family registration submit
  const onFamilyRegisterSubmit = (values: FamilyRegistrationFormValues) => {
    registerMutation.mutate(values as InsertUser);
  };

  // Sample patients for the demo
  const patients = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Margaret Smith" },
    { id: 3, name: "Robert Johnson" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-cream">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src="/assets/new/brigid-logo-large.png" alt="Brigid Logo" className="h-48" />
            </div>
            <p className="text-primary text-lg">
              {portalType === "physician" 
                ? "Sign in to access your physician portal" 
                : "Sign in to access your family portal"}
            </p>
          </div>

          {/* Portal Type Selection */}
          <div className="mb-6">
            <RadioGroup 
              value={portalType} 
              onValueChange={(value) => setPortalType(value as "physician" | "family")}
              className="flex justify-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="physician" id="physician" />
                <label htmlFor="physician" className="cursor-pointer text-sm font-medium">Physician Portal</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="family" id="family" />
                <label htmlFor="family" className="cursor-pointer text-sm font-medium">Family Portal</label>
              </div>
            </RadioGroup>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-light-sage border border-sage-green">
              <TabsTrigger value="login" className="data-[state=active]:bg-cream data-[state=active]:text-[#0A2814] data-[state=active]:font-medium">Login</TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-cream data-[state=active]:text-[#0A2814] data-[state=active]:font-medium">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="bg-light-sage border-sage-green">
                <CardHeader>
                  <CardTitle>Login to {portalType === "physician" ? "Physician" : "Family"} Portal</CardTitle>
                  <CardDescription>
                    {portalType === "physician" 
                      ? "Sign in to view and manage patient health data" 
                      : "Sign in to view your family member's health information"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="********" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Signing in..." : "Sign in"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                {portalType === "family" && (
                  <CardFooter className="text-sm text-gray-500 flex flex-col">
                    <p>Family demo account:</p>
                    <p>Username: marydoe / Password: familypass</p>
                  </CardFooter>
                )}
                {portalType === "physician" && (
                  <CardFooter className="text-sm text-gray-500 flex flex-col">
                    <p>Physician demo account:</p>
                    <p>Username: drchen / Password: password123</p>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card className="bg-light-sage border-sage-green">
                <CardHeader>
                  <CardTitle>Create an Account</CardTitle>
                  <CardDescription>
                    Register for {portalType === "physician" ? "physician" : "family"} access
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {portalType === "physician" && (
                    <Form {...doctorRegisterForm}>
                      <form onSubmit={doctorRegisterForm.handleSubmit(onDoctorRegisterSubmit)} className="space-y-4">
                        <FormField
                          control={doctorRegisterForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Dr. John Smith" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={doctorRegisterForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={doctorRegisterForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="********" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={doctorRegisterForm.control}
                          name="hospital"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hospital (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Memorial Hospital" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? "Creating account..." : "Create account"}
                        </Button>
                      </form>
                    </Form>
                  )}

                  {portalType === "family" && (
                    <Form {...familyRegisterForm}>
                      <form onSubmit={familyRegisterForm.handleSubmit(onFamilyRegisterSubmit)} className="space-y-4">
                        <FormField
                          control={familyRegisterForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Jane Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={familyRegisterForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={familyRegisterForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="********" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={familyRegisterForm.control}
                          name="relatedPatientId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Related Patient</FormLabel>
                              <Select
                                onValueChange={(value) => field.onChange(parseInt(value))}
                                defaultValue={field.value?.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select patient" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {patients.map((patient) => (
                                    <SelectItem key={patient.id} value={patient.id.toString()}>
                                      {patient.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={familyRegisterForm.control}
                          name="relationship"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Relationship to Patient</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select relationship" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="son">Son</SelectItem>
                                  <SelectItem value="daughter">Daughter</SelectItem>
                                  <SelectItem value="spouse">Spouse</SelectItem>
                                  <SelectItem value="relative">Other Relative</SelectItem>
                                  <SelectItem value="caregiver">Caregiver</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={familyRegisterForm.control}
                          name="contactPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="(555) 123-4567" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={familyRegisterForm.control}
                          name="contactEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="you@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? "Creating account..." : "Create account"}
                        </Button>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Side - Hero Section */}
      <div className="hidden lg:flex flex-1 bg-[#0A2814] items-center justify-center p-8">
        <div className="max-w-lg text-cream">
          <h1 className="text-4xl font-bold mb-4">
            AI-Powered Early Detection for Senior Health
          </h1>
          <p className="text-xl mb-6">
            Brigid uses AI-powered phone calls to detect early warning signs of health emergencies in senior patients.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg className="h-6 w-6 text-cream mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Risk-based alerts for early intervention</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-cream mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Comprehensive health assessments aligned with clinical frameworks</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-cream mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Family portal access for monitoring loved ones</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}