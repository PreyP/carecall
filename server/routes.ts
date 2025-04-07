import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { User } from "@shared/schema";

// Helper function to check if req.user is defined before using it
function assertUserIsAuthenticated(req: Request): asserts req is Request & { user: User } {
  if (!req.isAuthenticated() || !req.user) {
    throw new Error("User is not authenticated");
  }
}

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Not authenticated" });
};

// Middleware to check if user is a doctor or related to this patient
const canAccessPatientData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    assertUserIsAuthenticated(req);
    const patientId = parseInt(req.params.patientId || req.params.id);

    // Doctors can access all patients
    if (req.user.role === "doctor") {
      return next();
    }

    // Family members can only access their related patient
    if (req.user.role === "family" && req.user.relatedPatientId === patientId) {
      return next();
    }

    return res.status(403).json({ message: "Forbidden: You don't have access to this patient's data" });
  } catch (error) {
    return res.status(401).json({ message: "Not authenticated" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  // Base API route prefixes
  const apiBase = "/api";
  
  // Protect all API routes except auth routes
  app.use(`${apiBase}/*`, (req, res, next) => {
    // Skip auth middleware for auth routes
    if (req.path === '/api/login' || req.path === '/api/register' || req.path === '/api/logout' || req.path === '/api/user') {
      return next();
    }
    
    // This ensures req.user will be defined for the routes below if they pass isAuthenticated
    isAuthenticated(req, res, next);
  });
  
  // User routes
  app.get(`${apiBase}/users/:id`, async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await storage.getUser(id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    return res.json(user);
  });
  
  // Patient routes
  app.get(`${apiBase}/patients`, async (req, res) => {
    try {
      // Only doctors can get all patients
      assertUserIsAuthenticated(req);
      if (req.user.role !== "doctor") {
        return res.status(403).json({ message: "Forbidden: Only doctors can access all patients" });
      }
      
      const patients = await storage.getPatients();
      return res.json(patients);
    } catch (error) {
      return res.status(401).json({ message: "Not authenticated" });
    }
  });
  
  app.get(`${apiBase}/patients/recent`, async (req, res) => {
    try {
      // Only doctors can get recent patients list
      assertUserIsAuthenticated(req);
      if (req.user.role !== "doctor") {
        return res.status(403).json({ message: "Forbidden: Only doctors can access recent patients" });
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const patients = await storage.getRecentPatients(limit);
      return res.json(patients);
    } catch (error) {
      return res.status(401).json({ message: "Not authenticated" });
    }
  });
  
  app.get(`${apiBase}/patients/:id`, canAccessPatientData, async (req, res) => {
    const id = parseInt(req.params.id);
    const patient = await storage.getPatient(id);
    
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    
    return res.json(patient);
  });
  
  // Create new patient route
  app.post(`${apiBase}/patients`, async (req, res) => {
    try {
      // Only doctors can create patients
      assertUserIsAuthenticated(req);
      if (req.user.role !== "doctor") {
        return res.status(403).json({ message: "Forbidden: Only doctors can create patients" });
      }
      
      const newPatient = await storage.createPatient(req.body);
      return res.status(201).json(newPatient);
    } catch (error) {
      console.error("Error creating patient:", error);
      if ((error as Error).message === "User is not authenticated") {
        return res.status(401).json({ message: "Not authenticated" });
      }
      return res.status(400).json({ message: "Failed to create patient", error: String(error) });
    }
  });
  
  // Call routes
  app.get(`${apiBase}/patients/:patientId/calls`, canAccessPatientData, async (req, res) => {
    const patientId = parseInt(req.params.patientId);
    const calls = await storage.getCalls(patientId);
    return res.json(calls);
  });
  
  app.get(`${apiBase}/patients/:patientId/latest-call`, canAccessPatientData, async (req, res) => {
    const patientId = parseInt(req.params.patientId);
    const call = await storage.getLatestCall(patientId);
    
    if (!call) {
      return res.status(404).json({ message: "No calls found for this patient" });
    }
    
    return res.json(call);
  });
  
  app.get(`${apiBase}/calls/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const call = await storage.getCall(id);
      
      if (!call) {
        return res.status(404).json({ message: "Call not found" });
      }
      
      // Check if user has permission to access this call
      assertUserIsAuthenticated(req);
      if (req.user.role === "doctor" || 
          (req.user.role === "family" && req.user.relatedPatientId === call.patientId)) {
        return res.json(call);
      } else {
        return res.status(403).json({ message: "Forbidden: You don't have access to this call" });
      }
    } catch (error) {
      if ((error as Error).message === "User is not authenticated") {
        return res.status(401).json({ message: "Not authenticated" });
      }
      return res.status(500).json({ message: "Server error", error: String(error) });
    }
  });
  
  // Assessment routes
  app.get(`${apiBase}/patients/:patientId/assessments`, canAccessPatientData, async (req, res) => {
    const patientId = parseInt(req.params.patientId);
    const assessments = await storage.getAssessments(patientId);
    return res.json(assessments);
  });
  
  app.get(`${apiBase}/patients/:patientId/latest-assessment`, canAccessPatientData, async (req, res) => {
    const patientId = parseInt(req.params.patientId);
    const assessment = await storage.getLatestAssessment(patientId);
    
    if (!assessment) {
      return res.status(404).json({ message: "No assessments found for this patient" });
    }
    
    // Transform the data to match the frontend's expected format
    const transformedAssessment = {
      id: assessment.id,
      patientId: assessment.patientId,
      callId: assessment.callId,
      date: assessment.date,
      frailty: {
        score: assessment.frailtyScore / 100, // Convert to 0-1 scale for the frontend
        risk: assessment.frailtyRisk
      },
      adl: {
        score: assessment.adlScore / 100,
        risk: assessment.adlRisk
      },
      iadl: {
        score: assessment.iadlScore / 100,
        risk: assessment.iadlRisk
      },
      medicationAdherence: {
        score: assessment.medicationAdherenceScore / 100,
        risk: assessment.medicationAdherenceRisk
      },
      cardiacRiskFactors: {
        score: assessment.cardiacRiskFactorsScore / 100,
        risk: assessment.cardiacRiskFactorsRisk
      }
    };
    
    return res.json(transformedAssessment);
  });
  
  app.get(`${apiBase}/calls/:callId/assessment`, async (req, res) => {
    try {
      const callId = parseInt(req.params.callId);
      const assessment = await storage.getAssessmentByCall(callId);
      
      if (!assessment) {
        return res.status(404).json({ message: "No assessment found for this call" });
      }
      
      // Check if user has permission to access this assessment
      assertUserIsAuthenticated(req);
      if (req.user.role === "doctor" || 
          (req.user.role === "family" && req.user.relatedPatientId === assessment.patientId)) {
        
        // Transform the data to match the frontend's expected format
        const transformedAssessment = {
          id: assessment.id,
          patientId: assessment.patientId,
          callId: assessment.callId,
          date: assessment.date,
          frailty: {
            score: assessment.frailtyScore / 100,
            risk: assessment.frailtyRisk
          },
          adl: {
            score: assessment.adlScore / 100,
            risk: assessment.adlRisk
          },
          iadl: {
            score: assessment.iadlScore / 100,
            risk: assessment.iadlRisk
          },
          medicationAdherence: {
            score: assessment.medicationAdherenceScore / 100,
            risk: assessment.medicationAdherenceRisk
          },
          cardiacRiskFactors: {
            score: assessment.cardiacRiskFactorsScore / 100,
            risk: assessment.cardiacRiskFactorsRisk
          }
        };
        
        return res.json(transformedAssessment);
      } else {
        return res.status(403).json({ message: "Forbidden: You don't have access to this assessment" });
      }
    } catch (error) {
      if ((error as Error).message === "User is not authenticated") {
        return res.status(401).json({ message: "Not authenticated" });
      }
      return res.status(500).json({ message: "Server error", error: String(error) });
    }
  });
  
  // Findings routes
  app.get(`${apiBase}/calls/:callId/findings`, async (req, res) => {
    try {
      const callId = parseInt(req.params.callId);
      
      // First get the call to check permissions
      const call = await storage.getCall(callId);
      if (!call) {
        return res.status(404).json({ message: "Call not found" });
      }
      
      // Check if user has permission to access this call's findings
      assertUserIsAuthenticated(req);
      if (req.user.role === "doctor" || 
          (req.user.role === "family" && req.user.relatedPatientId === call.patientId)) {
        const findings = await storage.getFindings(callId);
        return res.json(findings);
      } else {
        return res.status(403).json({ message: "Forbidden: You don't have access to this call's findings" });
      }
    } catch (error) {
      if ((error as Error).message === "User is not authenticated") {
        return res.status(401).json({ message: "Not authenticated" });
      }
      return res.status(500).json({ message: "Server error", error: String(error) });
    }
  });
  
  app.get(`${apiBase}/patients/:patientId/latest-findings`, canAccessPatientData, async (req, res) => {
    const patientId = parseInt(req.params.patientId);
    const findings = await storage.getLatestFindings(patientId);
    return res.json(findings);
  });
  
  // Health trends routes
  app.get(`${apiBase}/patients/:patientId/health-trends`, canAccessPatientData, async (req, res) => {
    const patientId = parseInt(req.params.patientId);
    const trends = await storage.getHealthTrends(patientId);
    return res.json(trends);
  });
  
  // Recommended actions routes
  app.get(`${apiBase}/patients/:patientId/recommended-actions`, canAccessPatientData, async (req, res) => {
    const patientId = parseInt(req.params.patientId);
    const actions = await storage.getRecommendedActions(patientId);
    return res.json(actions);
  });
  
  // Alert routes
  app.get(`${apiBase}/patients/:patientId/alerts`, canAccessPatientData, async (req, res) => {
    const patientId = parseInt(req.params.patientId);
    const alerts = await storage.getAlerts(patientId);
    
    // Transform alerts to match frontend format
    const transformedAlerts = alerts.map(alert => ({
      category: alert.category,
      type: alert.type
    }));
    
    return res.json(transformedAlerts);
  });

  const httpServer = createServer(app);

  return httpServer;
}
