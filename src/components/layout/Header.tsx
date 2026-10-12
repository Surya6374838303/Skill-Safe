import React, { useState, useEffect } from 'react';
import { Menu, Bell, Wifi, Radio, Cpu, User, CheckCircle2, AlertOctagon } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { alerts, acknowledgeAlert } = useSafety();
  const [time, setTime] = useState<string>('');
  const [showAlertMenu, setShowAlertMenu] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const pendingAlerts = alerts.filter(a => a.acknowledgementStatus === 'pending');

  return (
    <header className="sticky top-0 z-30 bg-navy-950/80 backdrop-blur-xl border-b border-white/10 px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 lg:hidden border border-white/10 transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            ESP32 Wi-Fi Gateway: Online
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 font-medium">
            <Radio className="w-3 h-3 text-cyan-400" />
            BLE Wrist Alert: Synced
          </div>
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 font-medium">
            <Cpu className="w-3 h-3 text-blue-400" />
            AI Anomaly Engine: Active
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Real-time Clock */}
        <div className="hidden md:flex flex-col text-right pr-2">
          <span className="text-xs font-mono font-semibold text-slate-200">{time}</span>
          <span className="text-[10px] text-slate-400">IST · Realtime Sync</span>
        </div>

        {/* Alerts Bell & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAlertMenu(!showAlertMenu)}
            className={`p-2 rounded-lg border transition-all relative ${
              pendingAlerts.length > 0
                ? 'bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
            aria-label="Active Alerts"
          >
            <Bell className="w-5 h-5" />
            {pendingAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-red-500 text-white font-bold text-[10px] ring-2 ring-navy-950 animate-bounce">
                {pendingAlerts.length}
              </span>
            )}
          </button>

          {/* Alerts drop-down modal */}
          {showAlertMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-navy-900 border border-white/15 rounded-xl shadow-2xl p-4 z-50 animate-slide-up">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-red-400" />
                  <span className="font-semibold text-sm text-white">Active Safety Alerts</span>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {pendingAlerts.length} Pending
                </span>
              </div>

              <div className="divide-y divide-white/5 max-h-72 overflow-y-auto py-2">
                {pendingAlerts.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <span>No unacknowledged safety alerts. All sections nominal.</span>
                  </div>
                ) : (
                  pendingAlerts.map(alert => (
                    <div key={alert.id} className="py-2.5 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-red-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
                          Section {alert.sectionId} ({alert.severity.toUpperCase()})
                        </span>
                        <span className="text-[10px] text-slate-400">{alert.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-snug">{alert.message}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400">Worker: {alert.workerName}</span>
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-2 py-0.5 rounded bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-300 border border-cyan-400/30 text-[10px] font-semibold transition-colors"
                        >
                          Acknowledge
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-white/10 text-center">
                <Link
                  to="/inspections"
                  onClick={() => setShowAlertMenu(false)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium inline-block"
                >
                  View Full Audit Log & Inspection Records →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User profile chip */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-xs text-navy-950">
            HC
          </div>
          <div className="hidden lg:block text-left leading-none">
            <p className="text-xs font-medium text-white">Harish Chandra</p>
            <p className="text-[10px] text-slate-400">Senior Assessor & Lead</p>
          </div>
        </div>
      </div>
    </header>
  );
};
