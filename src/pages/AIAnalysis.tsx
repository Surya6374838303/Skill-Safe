import React from 'react';
import {
  BrainCircuit,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Info,
  GitBranch,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { demoHistoryChartData } from '../data/demoData';

export const AIAnalysis: React.FC = () => {
  const { sections, currentAnalysis, runAnalysis } = useSafety();

  const sectionScoresData = Object.entries(currentAnalysis.sectionScores).map(([sec, score]) => {
    const s = sections.find(item => item.id === sec);
    return {
      section: sec,
      compositeScore: Number((score * 100).toFixed(1)),
      gas: s ? s.gasReading : 0,
      vibration: s ? s.vibrationReading * 50 : 0, // scale for visualization
    };
  });

  return (
    <div className="space-y-6">
      {/* Title & Engine Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              AI/ML Probable Hazard Localization Engine
            </h1>
            <span className="demo-badge">RULE-BASED DEMO (STAGE 1)</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Multi-sensor slope gradient, cross-section deltas, and acoustic turbulence feature analysis.
          </p>
        </div>

        <button
          onClick={() => runAnalysis()}
          className="btn-primary text-xs flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Re-evaluate Section Risk Scores
        </button>
      </div>

      {/* Mandatory Honest AI Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-xs text-amber-300">
        <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-amber-200">Ethical & Technical Disclaimer (Smart India Hackathon Standards):</strong>
          <p className="text-amber-400/90 leading-relaxed">
            The current system operates a <strong>Stage 1 rule-based anomaly detector</strong> clearly labeled as demo analysis. It provides a modular Python/FastAPI interface for drop-in replacement with trained Scikit-learn / PyTorch time-series anomaly models in Stage 3. It identifies a <em>probable hazard zone</em> for human verification, and <strong>does not claim to confirm gas leaks or replace physical safety testing</strong>. Vibration alone is never treated as proof of a leak.
          </p>
        </div>
      </div>

      {/* Current Analysis Result Card */}
      <div className="glass-card p-6 border-cyan-400/30 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Localized Output</span>
                <span className="text-[10px] text-cyan-300 font-mono px-2 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/20">
                  {currentAnalysis.modelVersion}
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mt-0.5">
                Probable Hazard Zone:{' '}
                <span className="text-red-400 bg-red-500/20 px-2 py-0.5 rounded font-mono">
                  {currentAnalysis.probableZone}
                </span>
              </h2>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400">Model Confidence Index</div>
            <div className="text-2xl font-black text-cyan-400 font-mono">
              {(currentAnalysis.confidence! * 100).toFixed(0)}%
            </div>
            <div className="text-[10px] text-slate-500">Timestamp: {currentAnalysis.createdAt}</div>
          </div>
        </div>

        {/* Explainability Breakdown */}
        <div className="my-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            AI Analytical Rationale & Feature Attributions:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentAnalysis.explanation.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2.5 text-xs text-slate-300">
                <span className="w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparative Charts: Section Composite Risk & Rate of Change */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section Comparison Bar Chart */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <div>
              <h3 className="font-bold text-sm text-white">Cross-Section Composite Risk Rating (0–100)</h3>
              <p className="text-xs text-slate-400">Gas concentration weighted 70% + Contact vibration 30%</p>
            </div>
            <span className="text-xs font-mono text-cyan-300">P1 → P5</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectionScoresData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="section" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a1628',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="compositeScore" fill="#00d4ff" radius={[4, 4, 0, 0]} name="Composite Risk Index" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Temporal Gradient Line Chart */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <div>
              <h3 className="font-bold text-sm text-white">Time-Series Gradient Slope vs Elevation</h3>
              <p className="text-xs text-slate-400">Rate of change (ppm/sec) flags micro-leak origin plume</p>
            </div>
            <span className="text-xs text-amber-400 font-semibold">Slope Peak at P4</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={demoHistoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Line type="monotone" dataKey="gas" stroke="#ef4444" strokeWidth={2} dot={{ r: 2 }} name="Gas Reading (ppm)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4-Stage Development Roadmap Section */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10 mb-4">
          <GitBranch className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-base text-white">4-Stage AI/ML Progression Roadmap</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-cyan-400/10 border border-cyan-400/30">
            <span className="text-[10px] font-bold text-cyan-400 uppercase">Stage 1 — Complete (MVP)</span>
            <h4 className="font-bold text-white text-sm my-1">Controlled Lab Collection</h4>
            <p className="text-slate-300 leading-relaxed">
              Capture annotated telemetry with marked inspection points. Record sensor types, units, baseline ambient temperature and humidity.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-cyan-400/10 border border-cyan-400/30">
            <span className="text-[10px] font-bold text-cyan-400 uppercase">Stage 2 — Active Today</span>
            <h4 className="font-bold text-white text-sm my-1">Calibrated Rule Baseline</h4>
            <p className="text-slate-300 leading-relaxed">
              Calculate dynamic moving averages, detect gradient slope thresholds (+1.2 ppm/s), and compare multi-section deltas with explainable rules.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Stage 3 — Upcoming</span>
            <h4 className="font-bold text-white text-sm my-1">ML Model Training</h4>
            <p className="text-slate-400 leading-relaxed">
              Train Isolation Forest or 1D-CNN on labelled field datasets. Validate false positives, false negatives, and spatial localization accuracy.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Stage 4 — Production</span>
            <h4 className="font-bold text-white text-sm my-1">Twin Integration & Retraining</h4>
            <p className="text-slate-400 leading-relaxed">
              Deploy validated ONNX runtime model directly to edge gateway or server. Continuously log drift metrics for safe automated retraining.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
