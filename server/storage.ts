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
    
    // Add family member users
    const familyUser1: User = {
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
    
    const familyUser2: User = {
      id: this.currentId.users++,
      username: "tsmith",
      password: "familypass", // Plain text password for demo purposes
      fullName: "Thomas Smith",
      role: "family",
      hospital: null,
      relatedPatientId: 2, // Related to Margaret Smith
      contactPhone: "(555) 876-5432",
      contactEmail: "thomas.smith@example.com",
      relationship: "son"
    };
    
    const familyUser3: User = {
      id: this.currentId.users++,
      username: "ljohnson",
      password: "familypass", // Plain text password for demo purposes
      fullName: "Lisa Johnson",
      role: "family",
      hospital: null,
      relatedPatientId: 3, // Related to Robert Johnson
      contactPhone: "(555) 765-4321",
      contactEmail: "lisa.johnson@example.com",
      relationship: "daughter"
    };
    
    this.users.set(doctorUser.id, doctorUser);
    this.users.set(familyUser1.id, familyUser1);
    this.users.set(familyUser2.id, familyUser2);
    this.users.set(familyUser3.id, familyUser3);

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

    // Add calls for patients
    // Call for patient 1 (John Doe)
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
          speakerName: "Brigid AI",
          text: "Good morning, John. This is Brigid checking in. How are you feeling today?"
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
          speakerName: "Brigid AI",
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
          speakerName: "Brigid AI",
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
          speakerName: "Brigid AI",
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
          speakerName: "Brigid AI",
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
          "Increase Brigid frequency to daily for next 7 days",
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
    
    // Call for patient 2 (Margaret Smith)
    const call2: Call = {
      id: this.currentId.calls++,
      patientId: patient2.id,
      date: "April 17, 2023",
      time: "11:45 AM",
      durationSeconds: 580, // 9:40
      audioUrl: "",
      transcript: [
        {
          id: 1,
          speaker: "AI",
          speakerName: "Brigid AI",
          text: "Good morning, Margaret. This is Brigid checking in. How are you feeling today?"
        },
        {
          id: 2,
          speaker: "Patient",
          speakerName: "Margaret Smith",
          text: "Oh, hello there. I'm feeling alright today, just a bit tired after not sleeping well last night."
        },
        {
          id: 3,
          speaker: "AI",
          speakerName: "Brigid AI",
          text: "I'm sorry to hear you didn't sleep well. Can you tell me more about your sleep issues?"
        },
        {
          id: 4,
          speaker: "Patient",
          speakerName: "Margaret Smith",
          text: "I kept waking up with pain in my hip. It's been bothering me for about a week now. And then I had to get up several times to use the bathroom.",
          highlightType: "yellow"
        },
        {
          id: 5,
          speaker: "AI",
          speakerName: "Brigid AI",
          text: "Thank you for sharing that. Have you been able to prepare your meals and take your medications today?"
        },
        {
          id: 6,
          speaker: "Patient",
          speakerName: "Margaret Smith",
          text: "I had a piece of toast for breakfast. My son Thomas brought me some groceries yesterday, so I have food in the house. And yes, I took my morning pills.",
          highlightType: null
        },
        {
          id: 7,
          speaker: "AI",
          speakerName: "Brigid AI",
          text: "That's good to hear. Have you been able to move around your home today?"
        },
        {
          id: 8,
          speaker: "Patient",
          speakerName: "Margaret Smith",
          text: "Well, I'm using my walker because of my hip pain. I'm afraid I might fall if I don't use it. I had to cancel my weekly bridge game with friends because I didn't feel up to going out.",
          highlightType: "yellow"
        }
      ],
      createdAt: new Date()
    };
    this.calls.set(call2.id, call2);

    // Add assessment for Margaret Smith's call
    const assessment2: Assessment = {
      id: this.currentId.assessments++,
      callId: call2.id,
      patientId: patient2.id,
      date: "April 17, 2023",
      frailtyScore: 65,
      frailtyRisk: "moderate",
      adlScore: 70,
      adlRisk: "moderate",
      iadlScore: 65,
      iadlRisk: "moderate",
      medicationAdherenceScore: 85,
      medicationAdherenceRisk: "low",
      cardiacRiskFactorsScore: 50,
      cardiacRiskFactorsRisk: "moderate",
      createdAt: new Date()
    };
    this.assessments.set(assessment2.id, assessment2);

    // Add findings for Margaret Smith's call
    const findings2: Finding[] = [
      {
        id: this.currentId.findings++,
        callId: call2.id,
        patientId: patient2.id,
        text: "Patient reports persistent hip pain affecting mobility and sleep",
        risk: "moderate",
        createdAt: new Date()
      },
      {
        id: this.currentId.findings++,
        callId: call2.id,
        patientId: patient2.id,
        text: "Increased dependency on mobility aids (walker) due to fear of falling",
        risk: "moderate",
        createdAt: new Date()
      },
      {
        id: this.currentId.findings++,
        callId: call2.id,
        patientId: patient2.id,
        text: "Social isolation risk due to canceled activities",
        risk: "moderate",
        createdAt: new Date()
      },
      {
        id: this.currentId.findings++,
        callId: call2.id,
        patientId: patient2.id,
        text: "Good family support system with son providing assistance",
        risk: "low",
        createdAt: new Date()
      },
      {
        id: this.currentId.findings++,
        callId: call2.id,
        patientId: patient2.id,
        text: "Adequate medication adherence and nutrition",
        risk: "low",
        createdAt: new Date()
      }
    ];
    
    findings2.forEach(finding => {
      this.findings.set(finding.id, finding);
    });

    // Add health trends for Margaret Smith
    const healthTrends2: HealthTrend[] = [
      {
        id: this.currentId.healthTrends++,
        patientId: patient2.id,
        date: "Today - Apr 17, 2023",
        summary: "Reports hip pain affecting mobility and sleep quality. Using walker consistently. Canceled social activities.",
        risk: "moderate",
        createdAt: new Date()
      },
      {
        id: this.currentId.healthTrends++,
        patientId: patient2.id,
        date: "Apr 10, 2023",
        summary: "Mentioned occasional hip discomfort but able to attend social activities. Good medication adherence.",
        risk: "low",
        createdAt: new Date(new Date().setDate(new Date().getDate() - 7))
      },
      {
        id: this.currentId.healthTrends++,
        patientId: patient2.id,
        date: "Apr 3, 2023",
        summary: "No significant health concerns. Participating in regular activities. Eating well and taking medications as prescribed.",
        risk: "low",
        createdAt: new Date(new Date().setDate(new Date().getDate() - 14))
      }
    ];
    
    healthTrends2.forEach(trend => {
      this.healthTrends.set(trend.id, trend);
    });

    // Add recommended actions for Margaret Smith
    const recommendedActions2: RecommendedAction[] = [
      {
        id: this.currentId.recommendedActions++,
        patientId: patient2.id,
        category: "Follow-up Recommendations",
        actions: [
          "Schedule primary care appointment to evaluate hip pain",
          "Consider physical therapy assessment for mobility and fall prevention",
          "Encourage maintaining social connections via phone or virtual means"
        ],
        createdAt: new Date()
      },
      {
        id: this.currentId.recommendedActions++,
        patientId: patient2.id,
        category: "Monitoring Suggestions",
        actions: [
          "Monitor sleep quality and pain levels",
          "Assess need for additional home safety modifications",
          "Continue Brigid check-ins twice weekly"
        ],
        createdAt: new Date()
      }
    ];
    
    recommendedActions2.forEach(action => {
      this.recommendedActions.set(action.id, action);
    });

    // Add alerts for Margaret Smith
    const alerts2: Alert[] = [
      {
        id: this.currentId.alerts++,
        patientId: patient2.id,
        type: "yellow",
        category: "Mobility: Moderate Risk",
        description: "Increased dependency on walker and hip pain affecting daily activities",
        createdAt: new Date()
      },
      {
        id: this.currentId.alerts++,
        patientId: patient2.id,
        type: "yellow",
        category: "Social Isolation: Moderate Risk",
        description: "Cancellation of regular social activities due to mobility concerns",
        createdAt: new Date()
      }
    ];
    
    alerts2.forEach(alert => {
      this.alerts.set(alert.id, alert);
    });
    
    // Call for patient 3 (Robert Johnson)
    const call3: Call = {
      id: this.currentId.calls++,
      patientId: patient3.id,
      date: "April 12, 2023",
      time: "9:30 AM",
      durationSeconds: 525, // 8:45
      audioUrl: "",
      transcript: [
        {
          id: 1,
          speaker: "AI",
          speakerName: "Brigid AI",
          text: "Good morning, Robert. This is Brigid checking in. How are you feeling today?"
        },
        {
          id: 2,
          speaker: "Patient",
          speakerName: "Robert Johnson",
          text: "I'm doing well, thank you. Just finished my morning walk around the neighborhood."
        },
        {
          id: 3,
          speaker: "AI",
          speakerName: "Brigid AI",
          text: "That's excellent to hear. How long was your walk today?"
        },
        {
          id: 4,
          speaker: "Patient",
          speakerName: "Robert Johnson",
          text: "About 20 minutes. It was a beautiful morning, so I took the longer route. I try to walk every day, weather permitting."
        },
        {
          id: 5,
          speaker: "AI",
          speakerName: "Brigid AI",
          text: "That's wonderful. Regular exercise is important. Have you been taking your medications as prescribed?"
        },
        {
          id: 6,
          speaker: "Patient",
          speakerName: "Robert Johnson",
          text: "Yes, I take them every morning after breakfast. I use one of those pill organizers my daughter got me. It helps me keep track."
        },
        {
          id: 7,
          speaker: "AI",
          speakerName: "Brigid AI",
          text: "That's a great system. How about your meals? Have you been eating regularly?"
        },
        {
          id: 8,
          speaker: "Patient",
          speakerName: "Robert Johnson",
          text: "Yes, I've been cooking for myself. I made a big pot of vegetable soup on Sunday that I've been having for lunch. And I have cereal or toast for breakfast."
        }
      ],
      createdAt: new Date()
    };
    this.calls.set(call3.id, call3);

    // Add assessment for Robert Johnson's call
    const assessment3: Assessment = {
      id: this.currentId.assessments++,
      callId: call3.id,
      patientId: patient3.id,
      date: "April 12, 2023",
      frailtyScore: 25,
      frailtyRisk: "low",
      adlScore: 90,
      adlRisk: "low",
      iadlScore: 85,
      iadlRisk: "low",
      medicationAdherenceScore: 95,
      medicationAdherenceRisk: "low",
      cardiacRiskFactorsScore: 35,
      cardiacRiskFactorsRisk: "low",
      createdAt: new Date()
    };
    this.assessments.set(assessment3.id, assessment3);

    // Add findings for Robert Johnson's call
    const findings3: Finding[] = [
      {
        id: this.currentId.findings++,
        callId: call3.id,
        patientId: patient3.id,
        text: "Patient maintains regular exercise routine with daily walks",
        risk: "low",
        createdAt: new Date()
      },
      {
        id: this.currentId.findings++,
        callId: call3.id,
        patientId: patient3.id,
        text: "Excellent medication adherence with use of pill organizer",
        risk: "low",
        createdAt: new Date()
      },
      {
        id: this.currentId.findings++,
        callId: call3.id,
        patientId: patient3.id,
        text: "Good nutritional habits with regular meal preparation",
        risk: "low",
        createdAt: new Date()
      },
      {
        id: this.currentId.findings++,
        callId: call3.id,
        patientId: patient3.id,
        text: "Strong family support with daughter involved in care",
        risk: "low",
        createdAt: new Date()
      }
    ];
    
    findings3.forEach(finding => {
      this.findings.set(finding.id, finding);
    });

    // Add health trends for Robert Johnson
    const healthTrends3: HealthTrend[] = [
      {
        id: this.currentId.healthTrends++,
        patientId: patient3.id,
        date: "Today - Apr 12, 2023",
        summary: "Maintaining regular exercise with daily walks. Good medication adherence and nutrition. No concerns noted.",
        risk: "low",
        createdAt: new Date()
      },
      {
        id: this.currentId.healthTrends++,
        patientId: patient3.id,
        date: "Apr 5, 2023",
        summary: "Reports good health status. Maintaining independent activities of daily living. Good social engagement.",
        risk: "low",
        createdAt: new Date(new Date().setDate(new Date().getDate() - 7))
      },
      {
        id: this.currentId.healthTrends++,
        patientId: patient3.id,
        date: "Mar 29, 2023",
        summary: "Mentioned minor seasonal allergies but otherwise healthy. Continuing regular exercise and medication routine.",
        risk: "low",
        createdAt: new Date(new Date().setDate(new Date().getDate() - 14))
      }
    ];
    
    healthTrends3.forEach(trend => {
      this.healthTrends.set(trend.id, trend);
    });

    // Add recommended actions for Robert Johnson
    const recommendedActions3: RecommendedAction[] = [
      {
        id: this.currentId.recommendedActions++,
        patientId: patient3.id,
        category: "Preventive Care",
        actions: [
          "Schedule annual wellness visit within the next month",
          "Consider pneumococcal vaccination if not up to date",
          "Review fall prevention strategies despite current good mobility"
        ],
        createdAt: new Date()
      },
      {
        id: this.currentId.recommendedActions++,
        patientId: patient3.id,
        category: "Monitoring Suggestions",
        actions: [
          "Continue Brigid check-ins on bi-weekly schedule",
          "Maintain current medication management system",
          "Encourage continued physical activity and social engagement"
        ],
        createdAt: new Date()
      }
    ];
    
    recommendedActions3.forEach(action => {
      this.recommendedActions.set(action.id, action);
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
