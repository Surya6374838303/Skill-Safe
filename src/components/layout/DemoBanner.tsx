import React from 'react';
import { useSafety } from '../../context/SafetyContext';
import { AlertTriangle, RefreshCw, Zap, ShieldCheck } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { isDemoMode, setIsDemoMode, resetDemoData, triggerSimulatedAlert } = useSafety();

  if (!isDemoMode) return null;

  return (
    <div className="bg-gradient-to-r from-navy-900 via-amber-950/40 to-navy-900 border-b border-amber-500/30 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="demo-badge flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
            DEMO MODE ACTIVE
          </span>
          <span className="text-slate-300">
            Sensor readings & pipe sections are <strong>simulated for Smart India Hackathon 2026</strong> evaluation.
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-400">
            AI flags <em>probable hazard zones</em> requiring secondary verification.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerSimulatedAlert('P4', 'critical')}
            className="flex items-center gap-1 px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded transition-colors text-[11px] font-medium"
            title="Inject simulated spike in Section P4"
          >
            <Zap className="w-3 h-3 text-red-400" />
            Simulate P4 Hazard Spike
          </button>

          <button
            onClick={resetDemoData}
            className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10 rounded transition-colors text-[11px]"
            title="Reset to default demo data"
          >
            <RefreshCw className="w-3 h-3" />
            Reset Demo Data
          </button>
        </div>
      </div>
    </div>
  );
};
