// SkillSafe TypeScript Interfaces

export interface Worker {
  id: string;
  workerCode: string;
  name: string;
  department: string;
  role: string;
  activeStatus: boolean;
  assignedDeviceId: string | null;
  assignedWatchId: string | null;
  currentStatus: WorkerStatus;
  lastInspectionTime: string | null;
  avatarColor: string;
}

export type WorkerStatus = 
  | 'available'
  | 'inspection_in_progress'
  | 'inspection_completed'
  | 'alert_received'
  | 'requires_review';

export interface Device {
  id: string;
  deviceCode: string;
  deviceType: 'handheld' | 'smartwatch';
  workerId: string | null;
  batteryPercent: number;
  connectionStatus: 'online' | 'offline' | 'intermittent';
  lastSeen: string;
  sensorHealth: SensorHealth;
}

export interface SensorHealth {
  gas: 'ok' | 'warning' | 'fault';
  vibration: 'ok' | 'warning' | 'fault';
  temperature: 'ok' | 'warning' | 'fault';
  humidity: 'ok' | 'warning' | 'fault';
}

export interface Inspection {
  id: string;
  workerId: string;
  workerName: string;
  deviceId: string;
  startTime: string;
  endTime: string | null;
  status: InspectionStatus;
  inspectedSections: string[];
  trainerNotes: string | null;
  alertCount: number;
  probableHazardZone: string | null;
}

export type InspectionStatus = 
  | 'in_progress'
  | 'completed'
  | 'requires_review'
  | 'reviewed'
  | 'flagged';

export interface SensorReading {
  id: string;
  inspectionId: string;
  timestamp: string;
  gasReading: number;
  gasUnit: string;
  vibrationReading: number;
  temperature: number;
  humidity: number;
  sectionId: string;
  distanceCm: number | null;
}

export interface Alert {
  id: string;
  inspectionId: string;
  workerName: string;
  alertType: AlertType;
  severity: AlertSeverity;
  sectionId: string;
  message: string;
  createdAt: string;
  acknowledgedAt: string | null;
  acknowledgementStatus: 'pending' | 'acknowledged' | 'escalated';
}

export type AlertType = 
  | 'gas_abnormal'
  | 'vibration_abnormal'
  | 'high_priority_hazard'
  | 'sos_activated'
  | 'device_disconnected'
  | 'low_battery'
  | 'stale_data'
  | 'sensor_fault';

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface AnalysisResult {
  id: string;
  inspectionId: string;
  modelVersion: string;
  analysisType: 'rule_based' | 'ml_model';
  probableZone: string;
  confidence: number | null;
  explanation: string[];
  sectionScores: Record<string, number>;
  createdAt: string;
}

export interface AssessmentRecord {
  id: string;
  inspectionId: string;
  trainerId: string;
  trainerName: string;
  workerName: string;
  scores: AssessmentScores;
  feedback: string;
  assessmentStatus: 'draft' | 'submitted' | 'approved';
  createdAt: string;
}

export interface AssessmentScores {
  deviceHandling: number;
  inspectionProcedure: number;
  hazardIdentification: number;
  safetyResponse: number;
  alertAcknowledgement: number;
  inspectionCompletion: number;
  accurateReporting: number;
}

export interface PipeSection {
  id: string;
  name: string;
  gasReading: number;
  gasUnit: string;
  vibrationReading: number;
  temperature: number;
  humidity: number;
  status: 'normal' | 'warning' | 'critical' | 'inspecting';
  isInspected: boolean;
  lastUpdated: string;
}

export interface DashboardSummary {
  totalWorkers: number;
  workersInspecting: number;
  completedToday: number;
  activeAlerts: number;
  devicesOnline: number;
  devicesOffline: number;
  inspectionsRequiringReview: number;
}

export interface WatchAlert {
  id: string;
  workerId: string;
  workerName: string;
  bleStatus: 'connected' | 'disconnected' | 'pairing';
  latestAlert: string | null;
  alertTime: string | null;
  alertAcknowledged: boolean;
  sosActive: boolean;
  watchBattery: number;
  notificationType: WatchNotificationType | null;
}

export type WatchNotificationType = 
  | 'warning_abnormal_gas'
  | 'high_priority_hazard'
  | 'acknowledgement_received'
  | 'inspection_reminder'
  | 'low_battery'
  | 'sos_request';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  category: 'alert' | 'inspection' | 'worker' | 'device' | 'admin' | 'assessment';
}

export interface AlertRule {
  id: string;
  name: string;
  parameter: string;
  operator: 'gt' | 'lt' | 'eq' | 'between';
  threshold: number;
  thresholdMax?: number;
  severity: AlertSeverity;
  enabled: boolean;
}

export interface ChartDataPoint {
  timestamp: string;
  time: string;
  gas: number;
  vibration: number;
  temperature: number;
  humidity: number;
  section?: string;
}
