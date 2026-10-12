import React, { createContext, useContext, useState } from 'react';
import {
  Worker,
  Device,
  Inspection,
  PipeSection,
  Alert,
  AnalysisResult,
  AssessmentRecord,
  DashboardSummary,
  WatchAlert,
  AuditLogEntry,
  AlertRule,
} from '../types';
import {
  demoSummary,
  demoWorkers,
  demoDevices,
  demoPipeSections,
  demoAlerts,
  demoWatchAlerts,
  demoInspections,
  demoAnalysisResult,
  demoAssessmentRecords,
  demoAuditLogs,
  demoAlertRules,
} from '../data/demoData';

interface SafetyContextType {
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  summary: DashboardSummary;
  workers: Worker[];
  devices: Device[];
  sections: PipeSection[];
  alerts: Alert[];
  watchAlerts: WatchAlert[];
  inspections: Inspection[];
  currentAnalysis: AnalysisResult;
  assessments: AssessmentRecord[];
  auditLogs: AuditLogEntry[];
  alertRules: AlertRule[];
  selectedSectionId: string;
  setSelectedSectionId: (id: string) => void;
  selectedWorkerId: string;
  setSelectedWorkerId: (id: string) => void;
  selectedInspectionId: string;
  setSelectedInspectionId: (id: string) => void;
  
  // Actions
  updateSectionReading: (sectionId: string, gas: number, vibration: number) => void;
  acknowledgeAlert: (alertId: string) => void;
  runAnalysis: (inspectionId?: string) => AnalysisResult;
  addWorker: (worker: Omit<Worker, 'id'>) => void;
  updateWorkerStatus: (workerId: string, status: Worker['currentStatus']) => void;
  addInspectionAnnotation: (inspectionId: string, note: string) => void;
  addAssessment: (assessment: Omit<AssessmentRecord, 'id' | 'createdAt'>) => void;
  triggerSimulatedAlert: (sectionId: string, severity: Alert['severity']) => void;
  resetDemoData: () => void;
}

const SafetyContext = createContext<SafetyContextType | undefined>(undefined);

export const SafetyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [summary, setSummary] = useState<DashboardSummary>(demoSummary);
  const [workers, setWorkers] = useState<Worker[]>(demoWorkers);
  const [devices, setDevices] = useState<Device[]>(demoDevices);
  const [sections, setSections] = useState<PipeSection[]>(demoPipeSections);
  const [alerts, setAlerts] = useState<Alert[]>(demoAlerts);
  const [watchAlerts, setWatchAlerts] = useState<WatchAlert[]>(demoWatchAlerts);
  const [inspections, setInspections] = useState<Inspection[]>(demoInspections);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult>(demoAnalysisResult);
  const [assessments, setAssessments] = useState<AssessmentRecord[]>(demoAssessmentRecords);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(demoAuditLogs);
  const [alertRules, setAlertRules] = useState<AlertRule[]>(demoAlertRules);

  const [selectedSectionId, setSelectedSectionId] = useState<string>('P4');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('w-102');
  const [selectedInspectionId, setSelectedInspectionId] = useState<string>('INSP-2026-089');

  const updateSectionReading = (sectionId: string, gas: number, vibration: number) => {
    setSections(prev =>
      prev.map(sec => {
        if (sec.id === sectionId) {
          let status: PipeSection['status'] = 'normal';
          if (gas > 100 || vibration > 1.0) status = 'critical';
          else if (gas > 40 || vibration > 0.4) status = 'warning';

          return {
            ...sec,
            gasReading: Number(gas.toFixed(1)),
            vibrationReading: Number(vibration.toFixed(2)),
            status,
            lastUpdated: new Date().toLocaleTimeString(),
          };
        }
        return sec;
      })
    );

    // If critical, generate alert
    if (gas > 100) {
      triggerSimulatedAlert(sectionId, 'critical');
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    const timeNow = new Date().toLocaleTimeString();
    setAlerts(prev =>
      prev.map(a =>
        a.id === alertId
          ? { ...a, acknowledgementStatus: 'acknowledged', acknowledgedAt: timeNow }
          : a
      )
    );

    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        userId: 'USR-CONTROL-ROOM',
        userName: 'Control Room Supervisor',
        action: 'Alert Acknowledged',
        details: `Supervisor marked alert ${alertId} as acknowledged via control dashboard.`,
        category: 'alert',
      },
      ...prev,
    ]);

    setSummary(prev => ({
      ...prev,
      activeAlerts: Math.max(0, prev.activeAlerts - 1),
    }));
  };

  const runAnalysis = (inspectionId: string = 'INSP-2026-089'): AnalysisResult => {
    // Stage 1 rule-based anomaly detector
    let highestGasSec = sections[0];
    const scores: Record<string, number> = {};

    sections.forEach(sec => {
      // Calculate composite hazard score: normalized gas + normalized vibration
      const gasNorm = Math.min(sec.gasReading / 150, 1);
      const vibNorm = Math.min(sec.vibrationReading / 1.5, 1);
      const composite = Number((gasNorm * 0.7 + vibNorm * 0.3).toFixed(2));
      scores[sec.id] = composite;

      if (composite > (scores[highestGasSec.id] || 0)) {
        highestGasSec = sec;
      }
    });

    const isHazard = scores[highestGasSec.id] > 0.5;
    const explanations: string[] = [
      `Section ${highestGasSec.id} scored highest composite anomaly rating (${scores[highestGasSec.id]}).`,
      `Gas reading recorded at ${highestGasSec.gasReading} ${highestGasSec.gasUnit} (Baseline session avg: 22 ppm).`,
      `Acoustic/Contact vibration sensor measured ${highestGasSec.vibrationReading} mm/s RMS.`,
      isHazard
        ? 'Protocol Note: Probable Hazard Zone flagged for supervisor secondary inspection. Follow standard PPE and verification protocol.'
        : 'Protocol Note: All sections within nominal training bounds.',
    ];

    const result: AnalysisResult = {
      id: `ana-${Date.now()}`,
      inspectionId,
      modelVersion: 'SkillSafe Rule-Based Engine v1.4-dev (Modular Interface)',
      analysisType: 'rule_based',
      probableZone: highestGasSec.id,
      confidence: Number((0.75 + scores[highestGasSec.id] * 0.2).toFixed(2)),
      explanation: explanations,
      sectionScores: scores,
      createdAt: new Date().toLocaleString(),
    };

    setCurrentAnalysis(result);

    // Update inspection record
    setInspections(prev =>
      prev.map(i =>
        i.id === inspectionId
          ? { ...i, probableHazardZone: highestGasSec.id }
          : i
      )
    );

    return result;
  };

  const addWorker = (workerData: Omit<Worker, 'id'>) => {
    const newWorker: Worker = {
      ...workerData,
      id: `w-${Date.now().toString().slice(-4)}`,
    };
    setWorkers(prev => [...prev, newWorker]);
    setSummary(prev => ({ ...prev, totalWorkers: prev.totalWorkers + 1 }));
  };

  const updateWorkerStatus = (workerId: string, status: Worker['currentStatus']) => {
    setWorkers(prev =>
      prev.map(w => (w.id === workerId ? { ...w, currentStatus: status } : w))
    );
  };

  const addInspectionAnnotation = (inspectionId: string, note: string) => {
    setInspections(prev =>
      prev.map(i =>
        i.id === inspectionId
          ? {
              ...i,
              trainerNotes: i.trainerNotes ? `${i.trainerNotes}\n\n[Supervisor Annotation]: ${note}` : note,
              status: 'reviewed',
            }
          : i
      )
    );

    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        userId: 'USR-SUPERVISOR',
        userName: 'Supervisor / Trainer Lead',
        action: 'Annotation Added',
        details: `Annotation logged on inspection ${inspectionId}: "${note.slice(0, 40)}..."`,
        category: 'inspection',
      },
      ...prev,
    ]);
  };

  const addAssessment = (assessmentData: Omit<AssessmentRecord, 'id' | 'createdAt'>) => {
    const newRecord: AssessmentRecord = {
      ...assessmentData,
      id: `asmt-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toLocaleString(),
    };
    setAssessments(prev => [newRecord, ...prev]);
  };

  const triggerSimulatedAlert = (sectionId: string, severity: Alert['severity']) => {
    const newAlert: Alert = {
      id: `alt-${Date.now().toString().slice(-4)}`,
      inspectionId: selectedInspectionId,
      workerName: 'Ananya Sharma (Trainee)',
      alertType: severity === 'critical' ? 'high_priority_hazard' : 'gas_abnormal',
      severity,
      sectionId,
      message: `SIMULATED ALERT: Probable gas hazard detected at section ${sectionId}. Verify safety barriers and PPE protocol.`,
      createdAt: new Date().toLocaleTimeString(),
      acknowledgedAt: null,
      acknowledgementStatus: 'pending',
    };

    setAlerts(prev => [newAlert, ...prev]);
    setSummary(prev => ({ ...prev, activeAlerts: prev.activeAlerts + 1 }));

    // Send BLE notice to watch
    setWatchAlerts(prev =>
      prev.map(w =>
        w.workerName.includes('Ananya')
          ? {
              ...w,
              latestAlert: `ALERT: Section ${sectionId} Hazard Detected!`,
              alertTime: new Date().toLocaleTimeString(),
              alertAcknowledged: false,
              notificationType: 'high_priority_hazard',
            }
          : w
      )
    );
  };

  const resetDemoData = () => {
    setSummary(demoSummary);
    setWorkers(demoWorkers);
    setDevices(demoDevices);
    setSections(demoPipeSections);
    setAlerts(demoAlerts);
    setWatchAlerts(demoWatchAlerts);
    setInspections(demoInspections);
    setCurrentAnalysis(demoAnalysisResult);
    setAssessments(demoAssessmentRecords);
    setAuditLogs(demoAuditLogs);
    setAlertRules(demoAlertRules);
  };

  return (
    <SafetyContext.Provider
      value={{
        isDemoMode,
        setIsDemoMode,
        summary,
        workers,
        devices,
        sections,
        alerts,
        watchAlerts,
        inspections,
        currentAnalysis,
        assessments,
        auditLogs,
        alertRules,
        selectedSectionId,
        setSelectedSectionId,
        selectedWorkerId,
        setSelectedWorkerId,
        selectedInspectionId,
        setSelectedInspectionId,
        updateSectionReading,
        acknowledgeAlert,
        runAnalysis,
        addWorker,
        updateWorkerStatus,
        addInspectionAnnotation,
        addAssessment,
        triggerSimulatedAlert,
        resetDemoData,
      }}
    >
      {children}
    </SafetyContext.Provider>
  );
};

export const useSafety = () => {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
};
