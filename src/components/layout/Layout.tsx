import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DemoBanner } from './DemoBanner';

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-400 selection:text-navy-950">
      {/* Top Demo Notification Banner */}
      <DemoBanner />

      <div className="flex-1 flex">
        {/* Responsive Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>

          {/* Minimalist Industrial Control-Room Footer */}
          <footer className="border-t border-white/10 px-6 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 bg-navy-950/60">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400">SkillSafe Platform</span>
              <span>— Smart India Hackathon 2026 Edition</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Probable Hazard Localization & Digital Twin Pipeline Monitoring • NSQF Practical Training Alignment
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
