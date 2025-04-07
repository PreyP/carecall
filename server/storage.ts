import {
  User, InsertUser, users,
  Patient, InsertPatient, patients,
  Call, InsertCall, calls,
  Assessment, InsertAssessment, assessments,
  Finding, InsertFinding, findings,
  HealthTrend, InsertHealthTrend, healthTrends,
  RecommendedAction, InsertRecommendedAction, recommendedActions,
  Alert, InsertAlert, alerts
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

export interface IStorage {
  // Session store
  sessionStore: session.Store;
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Patient methods
  getPatients(): Promise<Patient[]>;
  getRecentPatients(limit?: number): Promise<Patient[]>;
  getPatient(id: number): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  
  // Call methods
  getCalls(patientId: number): Promise<Call[]>;
  getCall(id: number): Promise<Call | undefined>;
  getLatestCall(patientId: number): Promise<Call | undefined>;
  createCall(call: InsertCall): Promise<Call>;
  
  // Assessment methods
  getAssessments(patientId: number): Promise<Assessment[]>;
  getAssessment(id: number): Promise<Assessment | undefined>;
  getAssessmentByCall(callId: number): Promise<Assessment | undefined>;
  getLatestAssessment(patientId: number): Promise<Assessment | undefined>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  
  // Finding methods
  getFindings(callId: number): Promise<Finding[]>;
  getLatestFindings(patientId: number): Promise<Finding[]>;
  createFinding(finding: InsertFinding): Promise<Finding>;
  
  // Health trend methods
  getHealthTrends(patientId: number): Promise<HealthTrend[]>;
  createHealthTrend(trend: InsertHealthTrend): Promise<HealthTrend>;
  
  // Recommended action methods
  getRecommendedActions(patientId: number): Promise<RecommendedAction[]>;
  createRecommendedAction(action: InsertRecommendedAction): Promise<RecommendedAction>;
  
  // Alert methods
  getAlerts(patientId: number): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private patients: Map<number, Patient>;
  private calls: Map<number, Call>;
  private assessments: Map<number, Assessment>;
  private findings: Map<number, Finding>;
  private healthTrends: Map<number, HealthTrend>;
  private recommendedActions: Map<number, RecommendedAction>;
  private alerts: Map<number, Alert>;
  
  public sessionStore: session.Store;
  
  private currentId: {
    users: number;
    patients: number;
    calls: number;
    assessments: number;
    findings: number;
    healthTrends: number;
    recommendedActions: number;
    alerts: number;
  };

  constructor() {
    // Create memory store for sessions
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    this.users = new Map();
    this.patients = new Map();
    this.calls = new Map();
    this.assessments = new Map();
    this.findings = new Map();
    this.healthTrends = new Map();
    this.recommendedActions = new Map();
    this.alerts = new Map();
    
    this.currentId = {
      users: 1,
      patients: 1,
      calls: 1,
      assessments: 1,
      findings: 1,
      healthTrends: 1,
      recommendedActions: 1,
      alerts: 1
    };
    
    // Initialize with mock data for development
    this.initializeMockData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Patient methods
  async getPatients(): Promise<Patient[]> {
    return Array.from(this.patients.values());
  }

  async getRecentPatients(limit: number = 5): Promise<Patient[]> {
    return Array.from(this.patients.values()).slice(0, limit);
  }

  async getPatient(id: number): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = this.currentId.patients++;
    const patient: Patient = { 
      ...insertPatient, 
      id, 
      createdAt: new Date() 
    };
    this.patients.set(id, patient);
    return patient;
  }

  // Call methods
  async getCalls(patientId: number): Promise<Call[]> {
    return Array.from(this.calls.values())
      .filter(call => call.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getCall(id: number): Promise<Call | undefined> {
    return this.calls.get(id);
  }

  async getLatestCall(patientId: number): Promise<Call | undefined> {
    return Array.from(this.calls.values())
      .filter(call => call.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  }

  async createCall(insertCall: InsertCall): Promise<Call> {
    const id = this.currentId.calls++;
    const call: Call = { 
      ...insertCall, 
      id, 
      createdAt: new Date() 
    };
    this.calls.set(id, call);
    return call;
  }

  // Assessment methods
  async getAssessments(patientId: number): Promise<Assessment[]> {
    return Array.from(this.assessments.values())
      .filter(assessment => assessment.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getAssessment(id: number): Promise<Assessment | undefined> {
    return this.assessments.get(id);
  }

  async getAssessmentByCall(callId: number): Promise<Assessment | undefined> {
    return Array.from(this.assessments.values())
      .find(assessment => assessment.callId === callId);
  }

  async getLatestAssessment(patientId: number): Promise<Assessment | undefined> {
    return Array.from(this.assessments.values())
      .filter(assessment => assessment.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const id = this.currentId.assessments++;
    const assessment: Assessment = { 
      ...insertAssessment, 
      id, 
      createdAt: new Date() 
    };
    this.assessments.set(id, assessment);
    return assessment;
  }

  // Finding methods
  async getFindings(callId: number): Promise<Finding[]> {
    return Array.from(this.findings.values())
      .filter(finding => finding.callId === callId);
  }

  async getLatestFindings(patientId: number): Promise<Finding[]> {
    const latestCall = await this.getLatestCall(patientId);
    if (!latestCall) return [];
    
    return Array.from(this.findings.values())
      .filter(finding => finding.callId === latestCall.id);
  }

  async createFinding(insertFinding: InsertFinding): Promise<Finding> {
    const id = this.currentId.findings++;
    const finding: Finding = { 
      ...insertFinding, 
      id, 
      createdAt: new Date() 
    };
    this.findings.set(id, finding);
    return finding;
  }

  // Health trend methods
  async getHealthTrends(patientId: number): Promise<HealthTrend[]> {
    return Array.from(this.healthTrends.values())
      .filter(trend => trend.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createHealthTrend(insertTrend: InsertHealthTrend): Promise<HealthTrend> {
    const id = this.currentId.healthTrends++;
    const trend: HealthTrend = { 
      ...insertTrend, 
      id, 
      createdAt: new Date() 
    };
    this.healthTrends.set(id, trend);
    return trend;
  }

  // Recommended action methods
  async getRecommendedActions(patientId: number): Promise<RecommendedAction[]> {
    return Array.from(this.recommendedActions.values())
      .filter(action => action.patientId === patientId);
  }

  async createRecommendedAction(insertAction: InsertRecommendedAction): Promise<RecommendedAction> {
    const id = this.currentId.recommendedActions++;
    const action: RecommendedAction = { 
      ...insertAction, 
      id, 
      createdAt: new Date() 
    };
    this.recommendedActions.set(id, action);
    return action;
  }

  // Alert methods
  async getAlerts(patientId: number): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(alert => alert.patientId === patientId);
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = this.currentId.alerts++;
    const alert: Alert = { 
      ...insertAlert, 
      id, 
      createdAt: new Date() 
    };
    this.alerts.set(id, alert);
    return alert;
  }

  // Initialize mock data for development
  private initializeMockData() {
    // Add a doctor user
    const doctorUser: User = {
      id: this.currentId.users++,
      username: "drchen",
      password: "password123", // Plain text password for demo purposes
      fullName: "Dr. Sarah Chen",
      role: "doctor",
      hospital: "Memorial Hospital",
      relatedPatientId: null,
      contactPhone: null,
      contactEmail: null,
      relationship: null
    };
    
    // Add a family member user
    const familyUser: User = {
      id: this.currentId.users++,
      username: "marydoe",
      password: "familypass", // Plain text password for demo purposes
      fullName: "Mary Doe",
      role: "family",
      hospital: null,
      relatedPatientId: 1, // Related to John Doe
      contactPhone: "(555) 987-6543",
      contactEmail: "mary.doe@example.com",
      relationship: "daughter"
    };
    this.users.set(doctorUser.id, doctorUser);
    this.users.set(familyUser.id, familyUser);

    // Add a sample patient
    const patient1: Patient = {
      id: this.currentId.patients++,
      name: "John Doe",
      initials: "JD",
      mrn: "432765",
      age: 78,
      gender: "Male",
      phone: "(555) 123-4567",
      address: "123 Main St, Anytown, USA",
      emergencyContact: "Mary Doe (555) 987-6543",
      primaryDoctorId: doctorUser.id,
      hasRedAlert: true,
      hasYellowAlert: true,
      lastCallDate: "Apr 18, 2023",
      createdAt: new Date()
    };
    this.patients.set(patient1.id, patient1);

    // Add another sample patient
    const patient2: Patient = {
      id: this.currentId.patients++,
      name: "Margaret Smith",
      initials: "MS",
      mrn: "432766",
      age: 82,
      gender: "Female",
      phone: "(555) 234-5678",
      address: "456 Oak Ave, Anytown, USA",
      emergencyContact: "Thomas Smith (555) 876-5432",
      primaryDoctorId: doctorUser.id,
      hasRedAlert: false,
      hasYellowAlert: true,
      lastCallDate: "Apr 17, 2023",
      createdAt: new Date()
    };
    this.patients.set(patient2.id, patient2);

    // Add a third sample patient
    const patient3: Patient = {
      id: this.currentId.patients++,
      name: "Robert Johnson",
      initials: "RJ",
      mrn: "432767",
      age: 75,
      gender: "Male",
      phone: "(555) 345-6789",
      address: "789 Pine St, Anytown, USA",
      emergencyContact: "Linda Johnson (555) 765-4321",
      primaryDoctorId: doctorUser.id,
      hasRedAlert: false,
      hasYellowAlert: false,
      lastCallDate: "Apr 12, 2023",
      createdAt: new Date()
    };
    this.patients.set(patient3.id, patient3);

    // Add a call for patient 1
    const call1: Call = {
      id: this.currentId.calls++,
      patientId: patient1.id,
      date: "April 18, 2023",
      time: "10:23 AM",
      durationSeconds: 615, // 10:15
      audioUrl: "",
      transcript: [
        {
          id: 1,
          speaker: "AI",
          speakerName: "CareCall AI",
          text: "Good morning, John. This is CareCall checking in. How are you feeling today?"
        },
        {
          id: 2,
          speaker: "Patient",
          speakerName: "John Doe",
          text: "I'm not doing so well today. My breathing feels a bit difficult, especially when I try to walk to the kitchen."
        },
        {
          id: 3,
          speaker: "AI",
          speakerName: "CareCall AI",
          text: "I'm sorry to hear that, John. Let me ask you a few questions about your activities. Have you been able to get dressed by yourself today?"
        },
        {
          id: 4,
          speaker: "Patient",
          speakerName: "John Doe",
          text: "Yes, I managed to get dressed, but it took me longer than usual. I felt a bit dizzy when I bent down to put on my socks.",
          highlightType: "yellow"
        },
        {
          id: 5,
          speaker: "AI",
          speakerName: "CareCall AI",
          text: "Thank you for letting me know. What about preparing meals? Have you been able to make any food for yourself today?"
        },
        {
          id: 6,
          speaker: "Patient",
          speakerName: "John Doe",
          text: "I haven't eaten yet today. I don't feel like cooking and it's hard to stand for that long. I might just have some crackers later.",
          highlightType: "red"
        },
        {
          id: 7,
          speaker: "AI",
          speakerName: "CareCall AI",
          text: "I understand. Let's talk about your medications. Did you take all your prescribed medications this morning?"
        },
        {
          id: 8,
          speaker: "Patient",
          speakerName: "John Doe",
          text: "I took my heart pill, but I'm not sure about the water pill. I might have forgotten that one. There are so many to keep track of.",
          highlightType: "yellow"
        },
        {
          id: 9,
          speaker: "AI",
          speakerName: "CareCall AI",
          text: "The water pill is important for managing fluid in your body. Have you noticed any swelling in your ankles or feet?"
        },
        {
          id: 10,
          speaker: "Patient",
          speakerName: "John Doe",
          text: "Yes, my ankles are quite swollen today, more than usual. And my shoes feel tight. Is that bad?",
          highlightType: "red"
        }
      ],
      createdAt: new Date()
    };
    this.calls.set(call1.id, call1);

    // Add assessments for the call
    const assessment1: Assessment = {
      id: this.currentId.assessments++,
      callId: call1.id,
      patientId: patient1.id,
      date: "April 18, 2023",
      frailtyScore: 80,
      frailtyRisk: "high",
      adlScore: 60,
      adlRisk: "moderate",
      iadlScore: 70,
      iadlRisk: "high",
      medicationAdherenceScore: 50,
      medicationAdherenceRisk: "moderate",
      cardiacRiskFactorsScore: 75,
      cardiacRiskFactorsRisk: "high",
      createdAt: new Date()
    };
    this.assessments.set(assessment1.id, assessment1);

    // Add findings for the call
    const findings1: Finding[] = [
      {
        id: this.currentId.findings++,
        callId: call1.id,
        patientId: patient1.id,
        text: "Patient reports difficulty breathing and increased fatigue, suggesting possible cardiac decompensation",
        risk: "high",
        createdAt: new Date()
      },
      {
        id: this.currentId.findings++,
        callId: call1.id,
        patientId: patient1.id,
        text: "Significant ankle swelling noted, along with missed diuretic dose",
        risk: "high",
        createdAt: new Date()
      },
      {
        id: this.currentId.findings++,
        callId: call1.id,
        patientId: patient1.id,
        text: "Experiencing dizziness when changing positions, possible orthostatic hypotension",
        risk: "moderate",
        createdAt: new Date()
      },
      {
        id: this.currentId.findings++,
        callId: call1.id,
        patientId: patient1.id,
        text: "Decreased nutritional intake, hasn't eaten today",
        risk: "moderate",
        createdAt: new Date()
      },
      {
        id: this.currentId.findings++,
        callId: call1.id,
        patientId: patient1.id,
        text: "Medication adherence issues, specifically with diuretic",
        risk: "moderate",
        createdAt: new Date()
      }
    ];
    
    findings1.forEach(finding => {
      this.findings.set(finding.id, finding);
    });

    // Add health trends
    const healthTrends1: HealthTrend[] = [
      {
        id: this.currentId.healthTrends++,
        patientId: patient1.id,
        date: "Today - Apr 18, 2023",
        summary: "Reports breathing difficulties, ankle swelling, missed medication, and poor nutrition.",
        risk: "high",
        createdAt: new Date()
      },
      {
        id: this.currentId.healthTrends++,
        patientId: patient1.id,
        date: "Apr 11, 2023",
        summary: "Reported occasional shortness of breath when climbing stairs and some medication confusion.",
        risk: "moderate",
        createdAt: new Date(new Date().setDate(new Date().getDate() - 7))
      },
      {
        id: this.currentId.healthTrends++,
        patientId: patient1.id,
        date: "Apr 4, 2023",
        summary: "Reported feeling well, with good medication adherence and regular meals. No concerning symptoms.",
        risk: "low",
        createdAt: new Date(new Date().setDate(new Date().getDate() - 14))
      }
    ];
    
    healthTrends1.forEach(trend => {
      this.healthTrends.set(trend.id, trend);
    });

    // Add recommended actions
    const recommendedActions1: RecommendedAction[] = [
      {
        id: this.currentId.recommendedActions++,
        patientId: patient1.id,
        category: "Immediate Attention Required",
        actions: [
          "Schedule urgent telehealth or in-person visit to assess cardiac status",
          "Verify medication adherence, especially diuretic dosing",
          "Assess for fluid overload and potential heart failure exacerbation"
        ],
        createdAt: new Date()
      },
      {
        id: this.currentId.recommendedActions++,
        patientId: patient1.id,
        category: "Follow-up Recommendations",
        actions: [
          "Increase CareCall frequency to daily for next 7 days",
          "Arrange home health visit to assist with medication management",
          "Consider meal delivery service to improve nutritional intake"
        ],
        createdAt: new Date()
      }
    ];
    
    recommendedActions1.forEach(action => {
      this.recommendedActions.set(action.id, action);
    });

    // Add alerts
    const alerts1: Alert[] = [
      {
        id: this.currentId.alerts++,
        patientId: patient1.id,
        type: "red",
        category: "Frailty: High Risk",
        description: "Patient shows significant frailty indicators requiring immediate attention",
        createdAt: new Date()
      },
      {
        id: this.currentId.alerts++,
        patientId: patient1.id,
        type: "yellow",
        category: "Medication Adherence: Moderate Risk",
        description: "Patient reports inconsistent medication usage, particularly diuretics",
        createdAt: new Date()
      },
      {
        id: this.currentId.alerts++,
        patientId: patient1.id,
        type: "yellow",
        category: "ADL: Moderate Risk",
        description: "Patient shows increasing difficulty with activities of daily living",
        createdAt: new Date()
      }
    ];
    
    alerts1.forEach(alert => {
      this.alerts.set(alert.id, alert);
    });

    // Set alert flags on patients
    let updatedPatient1 = { ...patient1 };
    updatedPatient1.hasRedAlert = true;
    updatedPatient1.hasYellowAlert = true;
    updatedPatient1.lastCallDate = "Apr 18, 2023";
    this.patients.set(updatedPatient1.id, updatedPatient1);

    let updatedPatient2 = { ...patient2 };
    updatedPatient2.hasRedAlert = false;
    updatedPatient2.hasYellowAlert = true;
    updatedPatient2.lastCallDate = "Apr 17, 2023";
    this.patients.set(updatedPatient2.id, updatedPatient2);

    let updatedPatient3 = { ...patient3 };
    updatedPatient3.hasRedAlert = false;
    updatedPatient3.hasYellowAlert = false;
    updatedPatient3.lastCallDate = "Apr 12, 2023";
    this.patients.set(updatedPatient3.id, updatedPatient3);
  }
}

export const storage = new MemStorage();
