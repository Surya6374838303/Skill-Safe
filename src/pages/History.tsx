import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Filter,
  TrendingUp,
  Activity,
  Layers,
  Clock,
  Radio,
  AlertTriangle,
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { demoHistoryChartData } from '../data/demoData';

export const History: React.FC = () => {
  const { workers } = useSafety();
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('today');

  // Multi-day inspection trend data
  const dailyCountsData = [
    { date: 'Oct 06', completed: 8, flagged: 1 },
    { date: 'Oct 07', completed: 11, flagged: 2 },
    { date: 'Oct 08', completed: 14, flagged: 0 },
    { date: 'Oct 09', completed: 9, flagged: 1 },
    { date: 'Oct 10', completed: 12, flagged: 3 },
    { date: 'Oct 11', completed: 15, flagged: 1 },
    { date: 'Oct 12', completed: 12, flagged: 2 },
  ];

  // Worker sweep duration comparison (minutes)
  const workerDurationData = [
    { name: 'Rajesh K.', avgMinutes: 32, compliance: 95 },
    { name: 'Ananya S.', avgMinutes: 44, compliance: 88 },
    { name: 'Vikram S.', avgMinutes: 28, compliance: 98 },
    { name: 'Pooja P.', avgMinutes: 35, compliance: 96 },
    { name: 'Mohammed A.', avgMinutes: 40, compliance: 84 },
  ];

  // Section historical hazard frequency (P1..P5)
  const sectionHazardData = [
    { section: 'P1 (Intake)', events: 2 },
    { section: 'P2 (Coupling)', events: 3 },
    { section: 'P3 (Valve Tee)', events: 8 },
    { section: 'P4 (Stress Weld)', events: 21 },
    { section: 'P5 (Terminal)', events: 4 },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Date Range Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Inspection History & Trend Analytics
            </h1>
            <span className="demo-badge">TIME-SERIES</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Correlated multi-day telemetry, hazard frequency distributions, and technician duration benchmarking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="today">Today (Oct 12, 2026)</option>
              <option value="week">Past 7 Days</option>
              <option value="month">Current Month (October)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedWorkerId}
              onChange={(e) => setSelectedWorkerId(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="all">All Personnel</option>
              {workers.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Row 1: Gas & Vibration Continuous Trends */}
      <div className="glass-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Full Inspection Sweep Profile — Gas (ppm) & Contact Vibration (mm/s RMS)
            </h3>
            <p className="text-xs text-slate-400">
              Synchronized 1 Hz sensor feed showing baseline vs localized elevation at Section P4.
            </p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={demoHistoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gasHistGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="vibHistGrad" x1="0" y1="0" x2="0" y2="1">
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
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="gas" stroke="#00d4ff" strokeWidth={2} fillOpacity={1} fill="url(#gasHistGrad)" name="Gas Concentration (ppm)" />
              <Area type="monotone" dataKey="vibration" stroke="#f59e0b" strokeWidth={1.5} fillOpacity={1} fill="url(#vibHistGrad)" name="Vibration (mm/s RMS)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Daily Inspection Count vs Section Hazard Frequency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Inspection Counts */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <div>
              <h3 className="font-bold text-sm text-white">Daily Inspection Volume (Past 7 Days)</h3>
              <p className="text-xs text-slate-400">Total sweeps completed vs inspections flagging hazard</p>
            </div>
            <span className="text-xs font-mono text-cyan-300">7-Day Aggregation</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyCountsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a1628',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="completed" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Completed Inspections" />
                <Bar dataKey="flagged" fill="#ef4444" radius={[4, 4, 0, 0]} name="Hazard Flagged" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section Hazard Occurrence Breakdown */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <div>
              <h3 className="font-bold text-sm text-white">Cumulative Hazard Alerts by Pipe Section</h3>
              <p className="text-xs text-slate-400">Section P4 accounts for 55% of historic anomalies</p>
            </div>
            <span className="text-xs font-bold text-red-400">Critical Zone: P4</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectionHazardData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="section" type="category" stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a1628',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="events" fill="#ef4444" radius={[0, 4, 4, 0]} name="Hazard Events Logged" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Worker Duration & Procedure Compliance */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div>
            <h3 className="font-bold text-sm text-white">Trainee & Technician Inspection Dwell Time Benchmarking</h3>
            <p className="text-xs text-slate-400">Systematic traversal requires at least 30 minutes for a 5-section pipe rig sweep</p>
          </div>
          <span className="text-xs text-slate-400">NSQF Procedure Audit</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {workerDurationData.map((w, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between">
              <div>
                <div className="font-bold text-white text-xs mb-1">{w.name}</div>
                <div className="text-xl font-bold font-mono text-cyan-300">{w.avgMinutes} mins</div>
                <div className="text-[10px] text-slate-400">Average sweep time</div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-400">Compliance:</span>
                <span className="font-bold text-emerald-400">{w.compliance}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
