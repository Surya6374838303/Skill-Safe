import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Activity,
  Layers,
  Radio,
  Watch,
  BrainCircuit,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Award,
  Zap,
  Cpu,
  Globe2,
  HardHat,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const Landing: React.FC = () => {
  const [activeSectionDemo, setActiveSectionDemo] = useState<'P1' | 'P2' | 'P3' | 'P4' | 'P5'>('P4');

  const demoSections = [
    { id: 'P1', name: 'Header Intake', gas: '12.4 ppm', status: 'Normal', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-400' },
    { id: 'P2', name: 'Coupling A', gas: '18.2 ppm', status: 'Normal', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-400' },
    { id: 'P3', name: 'Bypass Tee', gas: '48.6 ppm', status: 'Warning', color: 'border-amber-500 bg-amber-500/10 text-amber-400' },
    { id: 'P4', name: 'Weld Joint #4', gas: '138.9 ppm', status: 'Probable Hazard', color: 'border-red-500 bg-red-500/15 text-red-400' },
    { id: 'P5', name: 'Terminal Orifice', gas: '22.0 ppm', status: 'Normal', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-400' },
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-400 selection:text-navy-950 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-cyan-400/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-navy-950/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-400/20">
              <Shield className="w-6 h-6 text-navy-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-wider text-white">SKILLSAFE</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                  SIH 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">See the Risk. Protect the Worker.</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#problem" className="hover:text-cyan-400 transition-colors">The Problem</a>
            <a href="#solution" className="hover:text-cyan-400 transition-colors">Architecture</a>
            <a href="#digital-twin" className="hover:text-cyan-400 transition-colors">Digital Twin</a>
            <a href="#technology" className="hover:text-cyan-400 transition-colors">Technology</a>
            <a href="#sdg" className="hover:text-cyan-400 transition-colors">SDG Impact</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-navy-950 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-400/20 transition-all hover:scale-105"
            >
              Control Room
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-20 lg:pt-24 lg:pb-32 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-6 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          Smart India Hackathon 2026 • AI-Powered Gas Safety & Digital Twin Platform
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-tight sm:leading-none mb-6">
          See the Risk.{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
            Protect the Worker.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mb-4 font-normal leading-relaxed">
          AI-Powered Gas Safety, Probable Hazard Localization & Digital Twin Monitoring for Vocational Trainees and Industrial Pipeline Operators.
        </p>

        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mb-10">
          Bridging multi-sensor physical inspections, instant wristband BLE alerts, supervisor control rooms, and proposed NSQF-aligned practical skill evaluations.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link
            to="/dashboard"
            className="px-6 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-navy-950 font-bold text-sm sm:text-base flex items-center gap-2 shadow-xl shadow-cyan-400/25 transition-all hover:scale-105"
          >
            <Activity className="w-5 h-5" />
            View Live Dashboard
          </Link>

          <Link
            to="/digital-twin"
            className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-sm sm:text-base flex items-center gap-2 backdrop-blur-xl transition-all hover:scale-105"
          >
            <Layers className="w-5 h-5 text-cyan-400" />
            Explore Digital Twin
          </Link>
        </div>

        {/* Live Interactive Concept Widget */}
        <div className="w-full max-w-4xl bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-2 text-left">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
              <div>
                <h3 className="font-bold text-sm sm:text-base text-white">Live Pipeline Model: P1 → P5 Inspection Rig</h3>
                <p className="text-xs text-slate-400">Click any pipe section to inspect simulated multi-sensor telemetry</p>
              </div>
            </div>
            <span className="demo-badge">Interactive Concept Demo</span>
          </div>

          {/* Interactive Pipe Graphic */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 my-6">
            {demoSections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSectionDemo(sec.id as any)}
                className={`p-3.5 rounded-xl border text-left transition-all ${sec.color} ${
                  activeSectionDemo === sec.id
                    ? 'ring-2 ring-cyan-400 scale-105 shadow-lg shadow-cyan-400/20'
                    : 'opacity-80 hover:opacity-100 hover:scale-102'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">{sec.id}</span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-black/40">
                    {sec.status}
                  </span>
                </div>
                <div className="text-xs font-semibold text-white truncate">{sec.name}</div>
                <div className="text-xs mt-1 font-mono">{sec.gas}</div>
              </button>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-navy-950/70 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div>
              <span className="text-xs text-slate-400">Selected Telemetry & Rule Analysis:</span>
              <p className="text-sm font-semibold text-slate-200 mt-0.5">
                {activeSectionDemo === 'P4' ? (
                  <span className="text-red-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Probable Hazard Zone: P4 (Elevated Gas Slope + Vibration Spike flagged for secondary review)
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Section {activeSectionDemo}: Sensor parameters nominal within operating baseline
                  </span>
                )}
              </p>
            </div>
            <Link
              to="/digital-twin"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 whitespace-nowrap"
            >
              Open Full Twin Model →
            </Link>
          </div>
        </div>
      </section>

      {/* Section 01: The Problem Bento */}
      <section id="problem" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="mb-12 text-left">
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">01 — The Industrial Challenge</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Traditional Gas Inspections Face Critical Blindspots
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-3xl mt-2">
            In chemical plants, city gas utilities, and vocational training facilities, single-point smell tests and unrecorded analog sweeps risk fatal accidents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 border-white/10 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Unlocalized Hazards</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Single handheld sensors alert that gas is present, but fail to localize which flange, valve, or micro-crack joint is emitting the plume.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-red-400/80 font-medium">
              Result: Delayed containment & prolonged explosive exposure
            </div>
          </div>

          <div className="glass-card p-6 border-white/10 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <Watch className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Worker Distraction & Delayed Alert</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                In noisy plant environments or confined spaces, audible buzzers on distant instruments are missed. Workers need direct, tactile wrist haptics.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-amber-400/80 font-medium">
              Result: Trainees stay in hazardous perimeter without noticing
            </div>
          </div>

          <div className="glass-card p-6 border-white/10 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Subjective Trainee Assessment</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Vocational assessors lack objective quantitative telemetry regarding trainee probe sweep angle, dwell time, and systematic pipe traversal.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-blue-400/80 font-medium">
              Result: Unverified certification & workforce skill variance
            </div>
          </div>
        </div>
      </section>

      {/* Section 02: Architecture & Solution */}
      <section id="solution" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="mb-12 text-left">
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">02 — The 5-Pillar Architecture</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            End-to-End Protection: From Physical Sensor to Control Room
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-3xl mt-2">
            SkillSafe connects edge diagnostic sensors, BLE wearable haptics, rule-based AI reasoning, and high-fidelity Digital Twins into a unified safety ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="glass-card p-5 border-white/10 flex flex-col justify-between hover:border-cyan-400/30 transition-all">
            <div>
              <div className="w-8 h-8 rounded-lg bg-cyan-400/10 text-cyan-400 flex items-center justify-center font-bold text-sm mb-3">
                01
              </div>
              <Radio className="w-5 h-5 text-cyan-400 mb-2" />
              <h4 className="font-bold text-sm text-white mb-1">Handheld Device</h4>
              <p className="text-xs text-slate-400">
                ESP32-S3 equipped with gas sensor, contact vibration/acoustic probe, temp/humidity, and local alert buzzer.
              </p>
            </div>
            <span className="text-[10px] text-cyan-300 font-semibold mt-4">Edge Sensing</span>
          </div>

          <div className="glass-card p-5 border-white/10 flex flex-col justify-between hover:border-cyan-400/30 transition-all">
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm mb-3">
                02
              </div>
              <Watch className="w-5 h-5 text-blue-400 mb-2" />
              <h4 className="font-bold text-sm text-white mb-1">Smart Alert Watch</h4>
              <p className="text-xs text-slate-400">
                Direct BLE pairing from handheld to worker wrist. Immediate vibration haptic, hazard display, and SOS button.
              </p>
            </div>
            <span className="text-[10px] text-blue-300 font-semibold mt-4">Worker Wearable</span>
          </div>

          <div className="glass-card p-5 border-white/10 flex flex-col justify-between hover:border-cyan-400/30 transition-all">
            <div>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm mb-3">
                03
              </div>
              <BrainCircuit className="w-5 h-5 text-indigo-400 mb-2" />
              <h4 className="font-bold text-sm text-white mb-1">AI/ML Engine</h4>
              <p className="text-xs text-slate-400">
                Evaluates multi-sensor gradient slope, acoustic turbulence, and section deltas to isolate "Probable Hazard Zones".
              </p>
            </div>
            <span className="text-[10px] text-indigo-300 font-semibold mt-4">Modular Intelligence</span>
          </div>

          <div className="glass-card p-5 border-white/10 flex flex-col justify-between hover:border-cyan-400/30 transition-all">
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm mb-3">
                04
              </div>
              <Layers className="w-5 h-5 text-emerald-400 mb-2" />
              <h4 className="font-bold text-sm text-white mb-1">Digital Twin</h4>
              <p className="text-xs text-slate-400">
                Virtual pipeline representation (P1–P5) mapping real-time sensor heatmaps, worker traversal, and integrity status.
              </p>
            </div>
            <span className="text-[10px] text-emerald-300 font-semibold mt-4">3D/2D Spatial Twin</span>
          </div>

          <div className="glass-card p-5 border-white/10 flex flex-col justify-between hover:border-cyan-400/30 transition-all">
            <div>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm mb-3">
                05
              </div>
              <Activity className="w-5 h-5 text-amber-400 mb-2" />
              <h4 className="font-bold text-sm text-white mb-1">Control Room & NSQF</h4>
              <p className="text-xs text-slate-400">
                Live supervision, alert escalation, automated PDF inspection reports, and trainer practical rubrics.
              </p>
            </div>
            <span className="text-[10px] text-amber-300 font-semibold mt-4">Supervisor Oversight</span>
          </div>
        </div>
      </section>

      {/* Section 03: Technology Stack */}
      <section id="technology" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="mb-12 text-left">
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">03 — Robust Engineering Stack</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Built for Industrial Reliability and SIH Evaluation
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-card p-5">
            <Cpu className="w-6 h-6 text-cyan-400 mb-2" />
            <div className="font-bold text-sm text-white">ESP32-S3 Dual-Core</div>
            <div className="text-xs text-slate-400 mt-1">FreeRTOS, Wi-Fi 2.4GHz & BLE 5.0 Long Range</div>
          </div>
          <div className="glass-card p-5">
            <Radio className="w-6 h-6 text-blue-400 mb-2" />
            <div className="font-bold text-sm text-white">Multi-Sensor Array</div>
            <div className="text-xs text-slate-400 mt-1">Calibrated Gas, Piezo Contact Vibration, DHT22 Temp/RH</div>
          </div>
          <div className="glass-card p-5">
            <BrainCircuit className="w-6 h-6 text-indigo-400 mb-2" />
            <div className="font-bold text-sm text-white">Modular AI Engine</div>
            <div className="text-xs text-slate-400 mt-1">Python FastAPI, Scikit-learn ready, Anomaly slope grading</div>
          </div>
          <div className="glass-card p-5">
            <Layers className="w-6 h-6 text-emerald-400 mb-2" />
            <div className="font-bold text-sm text-white">React 18 + SVG Twin</div>
            <div className="text-xs text-slate-400 mt-1">TypeScript, Tailwind CSS, Recharts data streaming</div>
          </div>
        </div>
      </section>

      {/* Section 04: SDG Impact */}
      <section id="sdg" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="mb-12 text-left">
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">04 — UN Sustainable Development Goals</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Measurable Societal & Safety Impact
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 border-emerald-500/20 bg-emerald-500/5">
            <div className="text-2xl font-black text-emerald-400 mb-2">SDG 3</div>
            <div className="font-bold text-sm text-white mb-1">Good Health & Well-being</div>
            <p className="text-xs text-slate-400">
              Mitigates toxic fume inhalation and prevents catastrophic explosion burn casualties among front-line workers.
            </p>
          </div>
          <div className="glass-card p-6 border-blue-500/20 bg-blue-500/5">
            <div className="text-2xl font-black text-blue-400 mb-2">SDG 8</div>
            <div className="font-bold text-sm text-white mb-1">Decent Work & Growth</div>
            <p className="text-xs text-slate-400">
              Elevates gas-fitter safety dignity with modern IoT wearable gear and verified skill credentialing.
            </p>
          </div>
          <div className="glass-card p-6 border-cyan-500/20 bg-cyan-500/5">
            <div className="text-2xl font-black text-cyan-400 mb-2">SDG 9</div>
            <div className="font-bold text-sm text-white mb-1">Industry & Innovation</div>
            <p className="text-xs text-slate-400">
              Deploys Digital Twins and edge AI into vocational pipeline training infrastructure across India.
            </p>
          </div>
          <div className="glass-card p-6 border-amber-500/20 bg-amber-500/5">
            <div className="text-2xl font-black text-amber-400 mb-2">SDG 11</div>
            <div className="font-bold text-sm text-white mb-1">Sustainable Cities</div>
            <p className="text-xs text-slate-400">
              Reduces fugitive methane emissions in City Gas Distribution (CGD) networks for cleaner urban habitats.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-white/10 text-center">
        <div className="glass-card p-10 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border-cyan-400/20 relative">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Experience the Complete SkillSafe Live Platform
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto mb-6">
            Jump into the control room, inspect the interactive pipeline twin, simulate sensor hazards, and generate NSQF evaluation reports.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-navy-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-400/20"
            >
              Open Live Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/reports"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20"
            >
              View Sample PDF Report
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 px-6 bg-navy-950 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-300">SkillSafe</span>
            <span>— Smart India Hackathon 2026 Initiative</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Concept demonstration. All telemetry is simulated in demo mode. Physical gas safety requires certified instrumentation.
          </div>
        </div>
      </footer>
    </div>
  );
};
