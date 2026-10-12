import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Shield,
  Activity,
  Layers,
  Users,
  Radio,
  Watch,
  BrainCircuit,
  ClipboardList,
  BarChart3,
  FileText,
  Award,
  Settings,
  Home,
  AlertTriangle,
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { summary, alerts } = useSafety();
  const pendingAlerts = alerts.filter(a => a.acknowledgementStatus === 'pending').length;

  const navItems = [
    { to: '/', label: 'Landing Overview', icon: Home, badge: null },
    { to: '/dashboard', label: 'Control-Room Live', icon: Activity, badge: pendingAlerts > 0 ? `${pendingAlerts} Alert${pendingAlerts > 1 ? 's' : ''}` : null },
    { to: '/digital-twin', label: 'Digital Twin (P1–P5)', icon: Layers, badge: 'Live Pipe' },
    { to: '/workers', label: 'Worker Tracking', icon: Users, badge: `${summary.workersInspecting} Active` },
    { to: '/device-monitoring', label: 'Handheld Diagnostics', icon: Radio, badge: 'ESP32' },
    { to: '/smart-watch', label: 'Smart Watch & BLE', icon: Watch, badge: 'Escalation' },
    { to: '/ai-analysis', label: 'AI/ML Hazard Engine', icon: BrainCircuit, badge: 'v1.4' },
    { to: '/inspections', label: 'Inspection Records', icon: ClipboardList, badge: null },
    { to: '/history', label: 'Historical Trends', icon: BarChart3, badge: null },
    { to: '/reports', label: 'Inspection Reports (PDF)', icon: FileText, badge: 'Printable' },
    { to: '/assessment', label: 'Trainer & NSQF Review', icon: Award, badge: 'Evaluation' },
    { to: '/admin', label: 'Admin & Device Setup', icon: Settings, badge: null },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-navy-950/95 backdrop-blur-2xl border-r border-white/10 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-400/20 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 text-navy-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wider text-white">SKILLSAFE</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                  SIH 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">See the Risk. Protect the Worker.</p>
            </div>
          </NavLink>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Monitoring & Operations
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  isActive
                    ? 'nav-link-active'
                    : 'nav-link'
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.badge.includes('Alert')
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                        : item.badge === 'Live Pipe'
                        ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/30'
                        : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Safety Disclaimer Footer in Sidebar */}
        <div className="p-4 border-t border-white/10 bg-navy-900/60">
          <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300/90 leading-tight">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-200">Industrial Safety Protocol</p>
              <p className="text-[10px] text-amber-400/80 mt-0.5">
                Always verify gas readings using certified calibration gas & follow emergency standard operating procedures.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
