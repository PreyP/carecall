import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Not authenticated" });
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
    const patients = await storage.getPatients();
    return res.json(patients);
  });
  
  app.get(`${apiBase}/patients/recent`, async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const patients = await storage.getRecentPatients(limit);
    return res.json(patients);
  });
  
  app.get(`${apiBase}/patients/:id`, async (req, res) => {
    const id = parseInt(req.params.id);
    const patient = await storage.getPatient(id);
    
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    
    return res.json(patient);
  });
  
  // Call routes
  app.get(`${apiBase}/patients/:patientId/calls`, async (req, res) => {
    const patientId = parseInt(req.params.patientId);
    const calls = await storage.getCalls(patientId);
    return res.json(calls);
  });
  
  app.get(`${apiBase}/patients/:patientId/latest-call`, async (req, res) => {
    const patientId = parseInt(req.params.patientId);
    const call = await storage.getLatestCall(patientId);
    
    if (!call) {
      return res.status(404).json({ message: "No calls found for this patient" });
    }
    
    return res.json(call);
  });
  
  app.get(`${apiBase}/calls/:id`, async (req, res) => {
    const id = parseInt(req.params.id);
    const call = await storage.getCall(id);
    
    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }
    
    return res.json(call);
  });
  
  // Assessment routes
  app.get(`${apiBase}/patients/:patientId/assessments`, async (req, res) => {
    const patientId = parseInt(req.params.patientId);
    const assessments = await storage.getAssessments(patientId);
    return res.json(assessments);
  });
  
  app.get(`${apiBase}/patients/:patientId/latest-assessment`, async (req, res) => {
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
    const callId = parseInt(req.params.callId);
    const assessment = await storage.getAssessmentByCall(callId);
    
    if (!assessment) {
      return res.status(404).json({ message: "No assessment found for this call" });
    }
    
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
  });
  
  // Findings routes
  app.get(`${apiBase}/calls/:callId/findings`, async (req, res) => {
    const callId = parseInt(req.params.callId);
    const findings = await storage.getFindings(callId);
    return res.json(findings);
  });
  
  app.get(`${apiBase}/patients/:patientId/latest-findings`, async (req, res) => {
    const patientId = parseInt(req.params.patientId);
    const findings = await storage.getLatestFindings(patientId);
    return res.json(findings);
  });
  
  // Health trends routes
  app.get(`${apiBase}/patients/:patientId/health-trends`, async (req, res) => {
    const patientId = parseInt(req.params.patientId);
    const trends = await storage.getHealthTrends(patientId);
    return res.json(trends);
  });
  
  // Recommended actions routes
  app.get(`${apiBase}/patients/:patientId/recommended-actions`, async (req, res) => {
    const patientId = parseInt(req.params.patientId);
    const actions = await storage.getRecommendedActions(patientId);
    return res.json(actions);
  });
  
  // Alert routes
  app.get(`${apiBase}/patients/:patientId/alerts`, async (req, res) => {
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
