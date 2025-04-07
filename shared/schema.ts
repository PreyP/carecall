import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("doctor"), // "doctor", "family"
  hospital: text("hospital"),
  relatedPatientId: integer("related_patient_id").references(() => patients.id),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  relationship: text("relationship"), // "son", "daughter", "spouse", etc.
});

// Patient schema
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  initials: text("initials").notNull(),
  mrn: text("mrn").notNull().unique(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  emergencyContact: text("emergency_contact"),
  primaryDoctorId: integer("primary_doctor_id").references(() => users.id),
  hasRedAlert: boolean("has_red_alert").notNull().default(false),
  hasYellowAlert: boolean("has_yellow_alert").notNull().default(false),
  lastCallDate: text("last_call_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Call transcript schema
export const calls = pgTable("calls", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  date: text("date").notNull(),
  time: text("time").notNull(),
  durationSeconds: integer("duration_seconds").notNull(),
  audioUrl: text("audio_url"),
  transcript: jsonb("transcript").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Health assessment schema
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  callId: integer("call_id").notNull().references(() => calls.id),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  date: text("date").notNull(),
  frailtyScore: integer("frailty_score").notNull(),
  frailtyRisk: text("frailty_risk").notNull(),
  adlScore: integer("adl_score").notNull(),
  adlRisk: text("adl_risk").notNull(),
  iadlScore: integer("iadl_score").notNull(),
  iadlRisk: text("iadl_risk").notNull(),
  medicationAdherenceScore: integer("medication_adherence_score").notNull(),
  medicationAdherenceRisk: text("medication_adherence_risk").notNull(),
  cardiacRiskFactorsScore: integer("cardiac_risk_factors_score").notNull(),
  cardiacRiskFactorsRisk: text("cardiac_risk_factors_risk").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Findings schema
export const findings = pgTable("findings", {
  id: serial("id").primaryKey(),
  callId: integer("call_id").notNull().references(() => calls.id),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  text: text("text").notNull(),
  risk: text("risk").notNull(), // "low", "moderate", "high"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Health trends schema
export const healthTrends = pgTable("health_trends", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  date: text("date").notNull(),
  summary: text("summary").notNull(),
  risk: text("risk").notNull(), // "low", "moderate", "high"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Recommended actions schema
export const recommendedActions = pgTable("recommended_actions", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  category: text("category").notNull(),
  actions: jsonb("actions").notNull(), // array of action strings
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Alerts schema
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  type: text("type").notNull(), // "red", "yellow", "green"
  category: text("category").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertPatientSchema = createInsertSchema(patients).omit({ id: true, createdAt: true });
export const insertCallSchema = createInsertSchema(calls).omit({ id: true, createdAt: true });
export const insertAssessmentSchema = createInsertSchema(assessments).omit({ id: true, createdAt: true });
export const insertFindingSchema = createInsertSchema(findings).omit({ id: true, createdAt: true });
export const insertHealthTrendSchema = createInsertSchema(healthTrends).omit({ id: true, createdAt: true });
export const insertRecommendedActionSchema = createInsertSchema(recommendedActions).omit({ id: true, createdAt: true });
export const insertAlertSchema = createInsertSchema(alerts).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;

export type Call = typeof calls.$inferSelect;
export type InsertCall = z.infer<typeof insertCallSchema>;

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;

export type Finding = typeof findings.$inferSelect;
export type InsertFinding = z.infer<typeof insertFindingSchema>;

export type HealthTrend = typeof healthTrends.$inferSelect;
export type InsertHealthTrend = z.infer<typeof insertHealthTrendSchema>;

export type RecommendedAction = typeof recommendedActions.$inferSelect;
export type InsertRecommendedAction = z.infer<typeof insertRecommendedActionSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
