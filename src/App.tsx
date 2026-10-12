import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SafetyProvider } from './context/SafetyContext';
import { Layout } from './components/layout/Layout';

// Pages
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { DigitalTwin } from './pages/DigitalTwin';
import { Workers } from './pages/Workers';
import { DeviceMonitoring } from './pages/DeviceMonitoring';
import { SmartWatch } from './pages/SmartWatch';
import { AIAnalysis } from './pages/AIAnalysis';
import { Inspections } from './pages/Inspections';
import { History } from './pages/History';
import { Reports } from './pages/Reports';
import { TrainerAssessment } from './pages/TrainerAssessment';
import { Admin } from './pages/Admin';

export const App: React.FC = () => {
  return (
    <SafetyProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<Landing />} />

          {/* Protected & Monitored Operations Dashboard Shell */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/digital-twin" element={<DigitalTwin />} />
            <Route path="/workers" element={<Workers />} />
            <Route path="/device-monitoring" element={<DeviceMonitoring />} />
            <Route path="/smart-watch" element={<SmartWatch />} />
            <Route path="/ai-analysis" element={<AIAnalysis />} />
            <Route path="/inspections" element={<Inspections />} />
            <Route path="/history" element={<History />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/assessment" element={<TrainerAssessment />} />
            <Route path="/admin" element={<Admin />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SafetyProvider>
  );
};

export default App;
