import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  HardHat,
  CheckCircle2,
  AlertTriangle,
  Radio,
  FileCheck,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight,
  Zap,
  Battery,
  Wifi,
  Clock,
  ChevronRight,
  AlertOctagon,
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { demoHistoryChartData } from '../data/demoData';

export const Dashboard: React.FC = () => {
  const {
    summary,
    workers,
    devices,
    sections,
    alerts,
    inspections,
    currentAnalysis,
    acknowledgeAlert,
    setSelectedSectionId,
    triggerSimulatedAlert,
  } = useSafety();

  const activeWorkers = workers.filter(w => w.currentStatus === 'inspection_in_progress');
  const alertWorkers = workers.filter(w => w.currentStatus === 'alert_received');

  return (
    <div className="space-y-6">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Control-Room Monitoring Dashboard
            </h1>
            <span className="demo-badge">DEMO DATA</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time pipeline telemetry, probable hazard alerts, and technician safety oversight.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/digital-twin"
            className="btn-primary text-xs flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            Open Digital Twin
          </Link>
          <button
            onClick={() => triggerSimulatedAlert('P4', 'critical')}
            className="btn-danger text-xs flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            Simulate Hazard
          </button>
        </div>
      </div>

      {/* 6 Summary Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="glass-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Registered</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{summary.totalWorkers}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Assigned personnel</div>
          </div>
        </div>

        <div className="glass-card p-4 flex flex-col justify-between border-cyan-400/20 bg-cyan-400/5">
          <div className="flex items-center justify-between text-cyan-300 mb-2">
            <span className="text-xs font-medium">Inspecting Now</span>
            <HardHat className="w-4 h-4 text-cyan-400 animate-bounce" />
          </div>
          <div>
            <div className="text-2xl font-black text-cyan-300">{summary.workersInspecting}</div>
            <div className="text-[11px] text-cyan-400/70 mt-0.5">Active field probes</div>
          </div>
        </div>

        <div className="glass-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{summary.completedToday}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Today's inspections</div>
          </div>
        </div>

        <div className={`glass-card p-4 flex flex-col justify-between ${summary.activeAlerts > 0 ? 'border-red-500/30 bg-red-500/10' : ''}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-red-400">Active Alerts</span>
            <AlertOctagon className={`w-4 h-4 text-red-400 ${summary.activeAlerts > 0 ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <div className="text-2xl font-black text-red-400">{summary.activeAlerts}</div>
            <div className="text-[11px] text-red-300/70 mt-0.5">Requires supervisor ack</div>
          </div>
        </div>

        <div className="glass-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Devices Online</span>
            <Radio className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">
              {summary.devicesOnline}
              <span className="text-xs font-normal text-slate-400"> / {summary.devicesOnline + summary.devicesOffline}</span>
            </div>
            <div className="text-[11px] text-emerald-400 mt-0.5">ESP32 Telemetry active</div>
          </div>
        </div>

        <div className="glass-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Needs Review</span>
            <FileCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-amber-400">{summary.inspectionsRequiringReview}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Trainer audit pending</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Telemetry Trends + Pipeline Mini Twin */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Telemetry Trend Chart */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Live Inspection Sensor Stream — Gas (ppm) vs Acoustic Vibration (RMS)
              </h3>
              <p className="text-xs text-slate-400">
                Correlated time-series from Handheld Diagnostic Probe (ESP32-S3)
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-0.5 bg-cyan-400 rounded"></span> Gas (ppm)
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-0.5 bg-amber-400 rounded"></span> Vibration (RMS)
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={demoHistoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gasGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="vibGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a1628',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Area type="monotone" dataKey="gas" stroke="#00d4ff" strokeWidth={2} fillOpacity={1} fill="url(#gasGradient)" name="Gas (ppm CH4 eq.)" />
                <Area type="monotone" dataKey="vibration" stroke="#f59e0b" strokeWidth={1.5} fillOpacity={1} fill="url(#vibGradient)" name="Vibration (mm/s RMS)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
            <span>Sample rate: 1 Hz telemetry • BLE 5.0 local burst buffer</span>
            <span className="text-cyan-400 font-medium">Session Peak: 142.1 ppm at 11:48 AM (Section P4)</span>
          </div>
        </div>

        {/* Probable Hazard Localization Card */}
        <div className="glass-card p-5 flex flex-col justify-between border-cyan-400/20">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping"></div>
                <h3 className="font-bold text-sm text-white">AI Hazard Localization</h3>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                Rule-Based Demo
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-red-400">Probable Hazard Zone:</span>
                <span className="text-base font-black text-red-300 px-2 py-0.5 rounded bg-red-500/30">
                  {currentAnalysis.probableZone}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2">
                {currentAnalysis.explanation[0]}
              </p>
            </div>

            <div className="space-y-2 mb-4">
              <div className="text-xs font-semibold text-slate-300">Section Risk Scores:</div>
              {sections.map(s => {
                const isP4 = s.id === 'P4';
                return (
                  <div key={s.id} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-white/5">
                    <span className="font-medium text-slate-300">{s.id} — {s.name.split('—')[1]}</span>
                    <span className={`font-mono font-bold ${isP4 ? 'text-red-400' : s.status === 'warning' ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {s.gasReading} ppm
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">Confidence: {(currentAnalysis.confidence! * 100).toFixed(0)}%</span>
            <Link to="/ai-analysis" className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1">
              Deep AI Analysis →
            </Link>
          </div>
        </div>
      </div>

      {/* Second Row: Active Alerts Table & Active Workers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Alerts Table */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Active Safety Alerts & Escalations
              </h3>
              <p className="text-xs text-slate-400">
                Unacknowledged hazard thresholds escalate to supervisor review automatically.
              </p>
            </div>
            <Link to="/smart-watch" className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold">
              Watch Haptics →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="py-2.5 px-3 font-semibold">Severity</th>
                  <th className="py-2.5 px-3 font-semibold">Section</th>
                  <th className="py-2.5 px-3 font-semibold">Worker</th>
                  <th className="py-2.5 px-3 font-semibold">Description</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {alerts.map(a => (
                  <tr key={a.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3">
                      <span className={`status-badge ${
                        a.severity === 'critical' ? 'status-red' : a.severity === 'medium' ? 'status-amber' : 'status-cyan'
                      }`}>
                        {a.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-white">{a.sectionId}</td>
                    <td className="py-2.5 px-3 text-slate-300">{a.workerName}</td>
                    <td className="py-2.5 px-3 text-slate-300 max-w-xs truncate" title={a.message}>
                      {a.message}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        a.acknowledgementStatus === 'pending'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : a.acknowledgementStatus === 'acknowledged'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {a.acknowledgementStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {a.acknowledgementStatus === 'pending' ? (
                        <button
                          onClick={() => acknowledgeAlert(a.id)}
                          className="px-2.5 py-1 rounded bg-cyan-400 hover:bg-cyan-300 text-navy-950 text-[11px] font-bold transition-all shadow-sm"
                        >
                          Acknowledge
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500">Recorded</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Field Personnel Status */}
        <div className="glass-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                Active Field Personnel
              </h3>
              <Link to="/workers" className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold">
                Manage ({workers.length})
              </Link>
            </div>

            <div className="space-y-3">
              {workers.slice(0, 4).map(w => (
                <div key={w.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${w.avatarColor} flex items-center justify-center font-bold text-xs text-white`}>
                      {w.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{w.name}</div>
                      <div className="text-[10px] text-slate-400">{w.role}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`status-badge text-[10px] ${
                      w.currentStatus === 'inspection_in_progress'
                        ? 'status-cyan'
                        : w.currentStatus === 'alert_received'
                        ? 'status-red'
                        : 'status-green'
                    }`}>
                      {w.currentStatus.replace(/_/g, ' ')}
                    </span>
                    <div className="text-[10px] text-slate-500 mt-1 font-mono">
                      {w.workerCode}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 text-center">
            <Link to="/inspections" className="text-xs text-slate-300 hover:text-white font-medium flex items-center justify-center gap-1">
              View Current Active Inspections <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
