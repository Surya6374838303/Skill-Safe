import React, { useState } from 'react';
import {
  Layers,
  Activity,
  HardHat,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Info,
  Zap,
  RotateCcw,
  Gauge,
  Thermometer,
  Droplets,
  Radio,
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';

export const DigitalTwin: React.FC = () => {
  const {
    sections,
    selectedSectionId,
    setSelectedSectionId,
    updateSectionReading,
    currentAnalysis,
    runAnalysis,
  } = useSafety();

  const selectedSection = sections.find(s => s.id === selectedSectionId) || sections[3]; // default P4

  const [sliderGas, setSliderGas] = useState<number>(selectedSection.gasReading);
  const [sliderVib, setSliderVib] = useState<number>(selectedSection.vibrationReading);

  // Sync sliders when selected section changes
  const handleSelectSection = (id: string) => {
    setSelectedSectionId(id);
    const sec = sections.find(s => s.id === id);
    if (sec) {
      setSliderGas(sec.gasReading);
      setSliderVib(sec.vibrationReading);
    }
  };

  const handleApplySimulation = () => {
    updateSectionReading(selectedSection.id, sliderGas, sliderVib);
    runAnalysis();
  };

  const handleResetSection = () => {
    const defaultGas = selectedSection.id === 'P4' ? 138.9 : selectedSection.id === 'P3' ? 48.6 : 15.0;
    const defaultVib = selectedSection.id === 'P4' ? 1.28 : selectedSection.id === 'P3' ? 0.45 : 0.20;
    setSliderGas(defaultGas);
    setSliderVib(defaultVib);
    updateSectionReading(selectedSection.id, defaultGas, defaultVib);
    runAnalysis();
  };

  return (
    <div className="space-y-6">
      {/* Title & Concept Disclaimer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Interactive Digital Twin (Pipeline Sections P1 → P5)
            </h1>
            <span className="demo-badge">VIRTUAL RIG</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Spatial representation of physical inspection pipeline, multi-sensor heatmaps, and probe traversal.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300">
            Active Probe: <strong className="text-cyan-400">Ananya Sharma (Section P4)</strong>
          </div>
        </div>
      </div>

      {/* Mandatory Safety Notice */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-xs text-amber-300">
        <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Engineering Disclaimer:</strong> The Digital Twin visualizes sensor data ingested from the handheld ESP32 diagnostic unit. It does not independently detect or certify gas leaks. All probable hazard zone highlights are rule-assisted indicators requiring manual confirmation via secondary soap bubble or ultrasonic test.
        </div>
      </div>

      {/* Interactive 2D/3D SVG Digital Twin Pipeline Model */}
      <div className="glass-card p-6 border-cyan-400/20 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="font-bold text-base text-white">Pipeline Rig Model: Sections P1 → P5</h2>
              <p className="text-xs text-slate-400">Click any pipe segment or flange to inspect local telemetry</p>
            </div>
          </div>

          {/* Color legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-400"></span>
              <span className="text-slate-300">Nominal (&lt;40 ppm)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-400"></span>
              <span className="text-slate-300">Warning (&gt;40 ppm)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500 border border-red-400 animate-pulse"></span>
              <span className="text-slate-300">Probable Hazard (&gt;100 ppm)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-cyan-400 border border-cyan-300"></span>
              <span className="text-slate-300">Worker Probe Location</span>
            </span>
          </div>
        </div>

        {/* SVG Pipeline Diagram */}
        <div className="my-8 relative flex items-center justify-center">
          <svg
            viewBox="0 0 950 260"
            className="w-full h-auto max-h-72 select-none filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
          >
            <defs>
              {/* Gradients for pipe sections */}
              <linearGradient id="gradP1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="gradP2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="gradP3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <linearGradient id="gradP4" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>
              <linearGradient id="gradP5" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>

              {/* Red Hazard Glow Filter */}
              <filter id="hazardGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Industrial Mounting Rails & Background Support */}
            <rect x="40" y="190" width="870" height="12" rx="4" fill="#1e293b" />
            <rect x="90" y="160" width="16" height="35" fill="#334155" />
            <rect x="270" y="160" width="16" height="35" fill="#334155" />
            <rect x="450" y="160" width="16" height="35" fill="#334155" />
            <rect x="630" y="160" width="16" height="35" fill="#334155" />
            <rect x="810" y="160" width="16" height="35" fill="#334155" />

            {/* Main Pipeline Pipe Sections */}
            {/* P1: Intake Header */}
            <g
              onClick={() => handleSelectSection('P1')}
              className="cursor-pointer transition-all hover:opacity-90"
            >
              <rect
                x="50"
                y="90"
                width="150"
                height="70"
                rx="6"
                fill="url(#gradP1)"
                stroke={selectedSectionId === 'P1' ? '#00d4ff' : 'rgba(255,255,255,0.2)'}
                strokeWidth={selectedSectionId === 'P1' ? '4' : '1.5'}
              />
              <text x="125" y="125" fill="#ffffff" fontWeight="bold" fontSize="16" textAnchor="middle">
                P1 (Intake)
              </text>
              <text x="125" y="145" fill="#d1fae5" fontSize="12" textAnchor="middle">
                {sections[0].gasReading} ppm
              </text>
            </g>

            {/* Flange 1 */}
            <rect x="200" y="80" width="12" height="90" rx="3" fill="#475569" stroke="#94a3b8" />

            {/* P2: Segment A */}
            <g
              onClick={() => handleSelectSection('P2')}
              className="cursor-pointer transition-all hover:opacity-90"
            >
              <rect
                x="212"
                y="90"
                width="160"
                height="70"
                rx="6"
                fill="url(#gradP2)"
                stroke={selectedSectionId === 'P2' ? '#00d4ff' : 'rgba(255,255,255,0.2)'}
                strokeWidth={selectedSectionId === 'P2' ? '4' : '1.5'}
              />
              <text x="292" y="125" fill="#ffffff" fontWeight="bold" fontSize="16" textAnchor="middle">
                P2 (Coupling)
              </text>
              <text x="292" y="145" fill="#d1fae5" fontSize="12" textAnchor="middle">
                {sections[1].gasReading} ppm
              </text>
            </g>

            {/* Flange 2 */}
            <rect x="372" y="80" width="12" height="90" rx="3" fill="#475569" stroke="#94a3b8" />

            {/* P3: Bypass Tee */}
            <g
              onClick={() => handleSelectSection('P3')}
              className="cursor-pointer transition-all hover:opacity-90"
            >
              <rect
                x="384"
                y="90"
                width="160"
                height="70"
                rx="6"
                fill={sections[2].status === 'warning' ? 'url(#gradP3)' : sections[2].status === 'critical' ? 'url(#gradP4)' : 'url(#gradP1)'}
                stroke={selectedSectionId === 'P3' ? '#00d4ff' : 'rgba(255,255,255,0.2)'}
                strokeWidth={selectedSectionId === 'P3' ? '4' : '1.5'}
              />
              {/* Branch indicator */}
              <rect x="450" y="45" width="28" height="45" fill="#d97706" rx="3" />
              <text x="464" y="125" fill="#ffffff" fontWeight="bold" fontSize="16" textAnchor="middle">
                P3 (Tee / Valve)
              </text>
              <text x="464" y="145" fill="#fef3c7" fontSize="12" textAnchor="middle">
                {sections[2].gasReading} ppm
              </text>
            </g>

            {/* Flange 3 */}
            <rect x="544" y="80" width="12" height="90" rx="3" fill="#475569" stroke="#94a3b8" />

            {/* P4: High-Stress Joint (Hazard Zone) */}
            <g
              onClick={() => handleSelectSection('P4')}
              className="cursor-pointer transition-all hover:opacity-90"
              filter={sections[3].status === 'critical' ? 'url(#hazardGlow)' : undefined}
            >
              <rect
                x="556"
                y="90"
                width="170"
                height="70"
                rx="6"
                fill={sections[3].status === 'critical' ? 'url(#gradP4)' : sections[3].status === 'warning' ? 'url(#gradP3)' : 'url(#gradP1)'}
                stroke={selectedSectionId === 'P4' ? '#00d4ff' : '#f87171'}
                strokeWidth={selectedSectionId === 'P4' ? '4' : '2'}
              />
              <text x="641" y="125" fill="#ffffff" fontWeight="bold" fontSize="16" textAnchor="middle">
                P4 (Stress Weld)
              </text>
              <text x="641" y="145" fill="#fee2e2" fontSize="12" fontWeight="bold" textAnchor="middle">
                {sections[3].gasReading} ppm ⚠️
              </text>
            </g>

            {/* Flange 4 */}
            <rect x="726" y="80" width="12" height="90" rx="3" fill="#475569" stroke="#94a3b8" />

            {/* P5: Terminal Orifice */}
            <g
              onClick={() => handleSelectSection('P5')}
              className="cursor-pointer transition-all hover:opacity-90"
            >
              <rect
                x="738"
                y="90"
                width="150"
                height="70"
                rx="6"
                fill="url(#gradP5)"
                stroke={selectedSectionId === 'P5' ? '#00d4ff' : 'rgba(255,255,255,0.2)'}
                strokeWidth={selectedSectionId === 'P5' ? '4' : '1.5'}
              />
              <text x="813" y="125" fill="#ffffff" fontWeight="bold" fontSize="16" textAnchor="middle">
                P5 (Terminal)
              </text>
              <text x="813" y="145" fill="#d1fae5" fontSize="12" textAnchor="middle">
                {sections[4].gasReading} ppm
              </text>
            </g>

            {/* Simulated Worker/Probe Position (Over P4) */}
            <g transform="translate(641, 60)">
              <circle cx="0" cy="0" r="16" fill="#00d4ff" className="animate-ping opacity-40" />
              <circle cx="0" cy="0" r="12" fill="#00d4ff" stroke="#ffffff" strokeWidth="2" />
              {/* Probe needle */}
              <line x1="0" y1="12" x2="0" y2="28" stroke="#00d4ff" strokeWidth="3" />
            </g>
          </svg>
        </div>

        {/* Status Callout below Twin */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-slate-300">
              Live Probe Tracking: <strong>Ananya Sharma</strong> at section <strong>P4 (Stress Weld Joint)</strong>
            </span>
          </div>
          <div className="text-slate-400">
            Last Sweep Telemetry: <span className="font-mono text-cyan-300">11:48:15 AM IST</span>
          </div>
        </div>
      </div>

      {/* Detail Panel: Selected Section Telemetry & Interactive Simulator Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section Readings Card */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">{selectedSection.name}</h3>
                <span className={`status-badge text-[11px] ${
                  selectedSection.status === 'critical'
                    ? 'status-red'
                    : selectedSection.status === 'warning'
                    ? 'status-amber'
                    : 'status-green'
                }`}>
                  {selectedSection.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Physical Segment Telemetry & Baseline Attributes</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">ID: {selectedSection.id}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Gauge className="w-4 h-4 text-cyan-400" />
                Gas Concentration
              </div>
              <div className="text-xl font-bold text-white font-mono">{selectedSection.gasReading}</div>
              <div className="text-[10px] text-slate-400">{selectedSection.gasUnit}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Activity className="w-4 h-4 text-amber-400" />
                Contact Vibration
              </div>
              <div className="text-xl font-bold text-white font-mono">{selectedSection.vibrationReading}</div>
              <div className="text-[10px] text-slate-400">mm/s RMS</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Thermometer className="w-4 h-4 text-rose-400" />
                Temperature
              </div>
              <div className="text-xl font-bold text-white font-mono">{selectedSection.temperature}°C</div>
              <div className="text-[10px] text-slate-400">Probe ambient</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Droplets className="w-4 h-4 text-blue-400" />
                Relative Humidity
              </div>
              <div className="text-xl font-bold text-white font-mono">{selectedSection.humidity}%</div>
              <div className="text-[10px] text-slate-400">Atmospheric RH</div>
            </div>
          </div>

          {/* AI Explanation for Selected Section */}
          <div className="p-4 rounded-xl bg-navy-950/80 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-cyan-400">AI Risk Assessment:</span>
              <span className="text-[10px] text-slate-400">Engine: v1.4-dev</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedSection.id === 'P4' ? (
                <>
                  <strong className="text-red-400">Flagged as Probable Hazard Zone.</strong> Gas slope (+14.2 ppm/s) and coincident 1.28 mm/s vibration RMS indicate high probability of flange seal or weld boundary micro-leakage. Required: Standard soap bubble verification.
                </>
              ) : selectedSection.id === 'P3' ? (
                <>
                  <strong className="text-amber-400">Approaching Warning Threshold.</strong> Valve bypass exhibits slight thermal drift. Re-check joint alignment during trainee second pass.
                </>
              ) : (
                <>
                  <strong className="text-emerald-400">Nominal Operating Baseline.</strong> Sensor delta within allowable tolerances (&lt;25 ppm). No safety escalation required.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Live Simulation Controls for Evaluators */}
        <div className="glass-card p-6 flex flex-col justify-between border-cyan-400/20">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">Demo Simulation Controls</h3>
              </div>
              <span className="demo-badge">INTERACTIVE</span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Manually alter gas and vibration on <strong>{selectedSection.id}</strong> to test dynamic twin heatmap reactions and alert generation.
            </p>

            {/* Gas Slider */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Gas Reading:</span>
                <span className="font-mono font-bold text-cyan-400">{sliderGas} ppm</span>
              </div>
              <input
                type="range"
                min="0"
                max="250"
                step="1"
                value={sliderGas}
                onChange={(e) => setSliderGas(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 (Safe)</span>
                <span>40 (Warning)</span>
                <span>100+ (Critical)</span>
              </div>
            </div>

            {/* Vibration Slider */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Contact Vibration:</span>
                <span className="font-mono font-bold text-amber-400">{sliderVib} mm/s</span>
              </div>
              <input
                type="range"
                min="0"
                max="2.5"
                step="0.05"
                value={sliderVib}
                onChange={(e) => setSliderVib(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0.0 (Calm)</span>
                <span>0.4 (Turbulent)</span>
                <span>1.0+ (Jet Anomaly)</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-white/10">
            <button
              onClick={handleApplySimulation}
              className="btn-primary w-full text-xs py-2 flex items-center justify-center gap-2"
            >
              <Zap className="w-3.5 h-3.5" />
              Apply Telemetry & Re-run AI
            </button>
            <button
              onClick={handleResetSection}
              className="btn-secondary w-full text-xs py-2 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Section Default
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
