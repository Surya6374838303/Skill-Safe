import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Sliders,
  Radio,
  Users,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  History,
  FileCheck,
  Plus,
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { AlertRule } from '../types';

export const Admin: React.FC = () => {
  const { alertRules, auditLogs, devices, sections } = useSafety();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(true);
  const [adminPin, setAdminPin] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'rules' | 'calibration' | 'audit' | 'roles'>('rules');

  const calibrationRecords = [
    { id: 'CAL-092', sensor: 'MQ-4 Methane MOS', device: 'dev-esp32-01', zeroVoltage: '0.42 V', calGas: '100 ppm CH4 in Air', date: '2026-10-01', nextDue: '2026-11-01', status: 'Valid' },
    { id: 'CAL-093', sensor: 'MQ-4 Methane MOS', device: 'dev-esp32-02', zeroVoltage: '0.45 V', calGas: '100 ppm CH4 in Air', date: '2026-10-01', nextDue: '2026-11-01', status: 'Valid' },
    { id: 'CAL-094', sensor: 'Piezo Acoustic Accelerometer', device: 'dev-esp32-02', zeroVoltage: '0.02 V', calGas: '1.0g @ 1kHz Shaker', date: '2026-09-15', nextDue: '2026-10-15', status: 'Due Soon' },
    { id: 'CAL-095', sensor: 'DHT22 Digital RH/T', device: 'dev-esp32-03', zeroVoltage: 'Digital Bus', calGas: 'Saturated Salt 75% RH', date: '2026-09-20', nextDue: '2026-12-20', status: 'Valid' },
  ];

  const userRoles = [
    { name: 'Harish Chandra', email: 'harish@skillsafe.gov.in', role: 'Chief Assessor & Admin', permissions: 'Full Read/Write/Certify' },
    { name: 'Vikram Singh', email: 'vikram@skillsafe.gov.in', role: 'Field Supervisor', permissions: 'Inspection Review & Annotate' },
    { name: 'Dr. Aarti Mehta', email: 'aarti@skillsafe.gov.in', role: 'Safety Compliance Auditor', permissions: 'Audit Log & PDF Export' },
    { name: 'Field Trainee Pool', email: 'trainees@skillsafe.gov.in', role: 'Vocational Candidate', permissions: 'Assigned Device Telemetry' },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Auth Gate Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Administration & System Calibration
            </h1>
            <span className="demo-badge">SUPERVISOR CONTROL</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure safety thresholds, manage hardware zero-calibration logs, user permissions, and immutable audit logs.
          </p>
        </div>

        <button
          onClick={() => setIsAdminAuthenticated(!isAdminAuthenticated)}
          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
            isAdminAuthenticated
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          {isAdminAuthenticated ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
          {isAdminAuthenticated ? 'Admin Session: Unlocked' : 'Session: Locked'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'rules'
              ? 'bg-cyan-400 text-navy-950 shadow-md shadow-cyan-400/20'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          Alert Rules & Thresholds
        </button>
        <button
          onClick={() => setActiveTab('calibration')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'calibration'
              ? 'bg-cyan-400 text-navy-950 shadow-md shadow-cyan-400/20'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          Sensor Calibration Log
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'audit'
              ? 'bg-cyan-400 text-navy-950 shadow-md shadow-cyan-400/20'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          Security Audit Trail
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'roles'
              ? 'bg-cyan-400 text-navy-950 shadow-md shadow-cyan-400/20'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          Roles & Permissions
        </button>
      </div>

      {/* Tab 1: Alert Rules */}
      {activeTab === 'rules' && (
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="font-bold text-base text-white">Configured Safety Trigger Rules</h2>
              <p className="text-xs text-slate-400">Rules applied in real-time to streaming ESP32 sensor values</p>
            </div>
            <button className="btn-secondary text-xs flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add Rule
            </button>
          </div>

          <div className="space-y-3">
            {alertRules.map(rule => (
              <div key={rule.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-white text-sm">{rule.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Condition: <code>{rule.parameter} {rule.operator === 'gt' ? '>' : '<'} {rule.threshold}</code>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`status-badge text-[10px] ${
                    rule.severity === 'critical' ? 'status-red' : rule.severity === 'high' ? 'status-amber' : 'status-cyan'
                  }`}>
                    {rule.severity.toUpperCase()}
                  </span>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    rule.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {rule.enabled ? 'Active' : 'Disabled'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Calibration Log */}
      {activeTab === 'calibration' && (
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="font-bold text-base text-white">Physical Sensor Calibration Registry</h2>
              <p className="text-xs text-slate-400">Essential for gas measurement integrity — raw sensor ADC values must never be assumed as ppm</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 bg-white/5">
                  <th className="py-2.5 px-3 font-semibold">Cal ID</th>
                  <th className="py-2.5 px-3 font-semibold">Sensor Element</th>
                  <th className="py-2.5 px-3 font-semibold">Target Hardware</th>
                  <th className="py-2.5 px-3 font-semibold">Zero Baseline</th>
                  <th className="py-2.5 px-3 font-semibold">Calibration Standard</th>
                  <th className="py-2.5 px-3 font-semibold">Validity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {calibrationRecords.map(cal => (
                  <tr key={cal.id} className="hover:bg-white/5">
                    <td className="py-2.5 px-3 font-mono font-bold text-cyan-300">{cal.id}</td>
                    <td className="py-2.5 px-3 font-medium text-white">{cal.sensor}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{cal.device}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-300">{cal.zeroVoltage}</td>
                    <td className="py-2.5 px-3 text-slate-300">{cal.calGas}</td>
                    <td className="py-2.5 px-3">
                      <span className={`status-badge text-[10px] ${cal.status === 'Valid' ? 'status-green' : 'status-amber'}`}>
                        {cal.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Security Audit Log */}
      {activeTab === 'audit' && (
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="font-bold text-base text-white">Immutable System & Safety Audit Logs</h2>
              <p className="text-xs text-slate-400">Audit trail of alert triggers, supervisor acknowledgements, and trainee authorizations</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{log.action}</span>
                    <span className="text-[10px] font-mono text-cyan-300">by {log.userName}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] mt-0.5">{log.details}</p>
                </div>
                <div className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
                  {log.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Roles & Permissions */}
      {activeTab === 'roles' && (
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="font-bold text-base text-white">Role-Based Access Control (RBAC)</h2>
              <p className="text-xs text-slate-400">Protects administrative functions and sensitive personnel records</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userRoles.map((u, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2 text-xs">
                <div className="font-bold text-white text-sm">{u.name}</div>
                <div className="text-[11px] text-slate-400">{u.email}</div>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="status-badge status-cyan text-[10px]">{u.role}</span>
                  <span className="text-[10px] text-slate-400">{u.permissions}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
