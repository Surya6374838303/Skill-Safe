import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Award,
  Calendar,
  Clock,
  User,
  Radio,
  FileCheck,
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';

export const Reports: React.FC = () => {
  const { inspections, sections, currentAnalysis } = useSafety();
  const [selectedInspId, setSelectedInspId] = useState<string>('INSP-2026-089');

  const inspection = inspections.find(i => i.id === selectedInspId) || inspections[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Bar (Hidden during print) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Automated Inspection & Compliance Report
            </h1>
            <span className="demo-badge">OFFICIAL DOCUMENT</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Certified pipeline verification record with multi-sensor telemetry, AI probable hazard analysis & supervisor audit signature.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedInspId}
            onChange={(e) => setSelectedInspId(e.target.value)}
            className="input-field text-xs cursor-pointer"
          >
            {inspections.map(i => (
              <option key={i.id} value={i.id}>
                {i.id} — {i.workerName}
              </option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="btn-primary text-xs flex items-center gap-2 font-bold"
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Printable Report Document Container */}
      <div className="bg-white text-slate-900 rounded-2xl shadow-2xl p-8 sm:p-12 max-w-4xl mx-auto border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0">
        {/* Document Header */}
        <div className="flex flex-wrap items-start justify-between pb-6 border-b-2 border-slate-800 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center font-bold">
              <Shield className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-slate-900">SKILLSAFE</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                  SIH 2026 EDITION
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-600">
                AI-Powered Gas Safety, Probable Hazard Localization & Digital Twin Monitoring
              </p>
              <p className="text-[10px] text-slate-500 italic mt-0.5">
                "See the Risk. Protect the Worker."
              </p>
            </div>
          </div>

          <div className="text-right text-xs">
            <div className="font-mono font-bold text-sm text-slate-900">REPORT ID: {inspection.id}-CERT</div>
            <div className="text-slate-500 mt-1">Date: October 12, 2026</div>
            <div className="text-slate-500">Facility: Rig #1 — Vocational Training Pipeline</div>
          </div>
        </div>

        {/* Section 1: Inspection & Personnel Metadata */}
        <div className="my-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border border-slate-200 rounded-xl p-4 bg-slate-50/50">
          <div>
            <span className="text-slate-500 block text-[11px] font-medium">Assigned Worker:</span>
            <span className="font-bold text-slate-900 text-sm">{inspection.workerName}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px] font-medium">Diagnostic Hardware:</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{inspection.deviceId}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px] font-medium">Start & Completion:</span>
            <span className="font-semibold text-slate-800">{inspection.startTime}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px] font-medium">Inspection Status:</span>
            <span className="font-bold uppercase text-slate-800">{inspection.status.replace(/_/g, ' ')}</span>
          </div>
        </div>

        {/* Section 2: Section-by-Section Sensor Data Table */}
        <div className="my-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-cyan-600" />
            1. Pipeline Section Telemetry & Multi-Sensor Readings
          </h2>

          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-bold">Section ID</th>
                <th className="py-2.5 px-3 font-bold">Physical Component</th>
                <th className="py-2.5 px-3 font-bold text-right">Gas Reading</th>
                <th className="py-2.5 px-3 font-bold text-right">Vibration (RMS)</th>
                <th className="py-2.5 px-3 font-bold text-right">Temp / RH</th>
                <th className="py-2.5 px-3 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sections.map(sec => {
                const isHazard = sec.id === inspection.probableHazardZone;
                return (
                  <tr key={sec.id} className={isHazard ? 'bg-red-50/70 font-semibold' : ''}>
                    <td className="py-2.5 px-3 font-mono font-bold">{sec.id}</td>
                    <td className="py-2.5 px-3">{sec.name.split('—')[1]}</td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      {sec.gasReading} {sec.gasUnit}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      {sec.vibrationReading} mm/s
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                      {sec.temperature}°C / {sec.humidity}%
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        isHazard
                          ? 'bg-red-200 text-red-900 border border-red-300'
                          : sec.status === 'warning'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {isHazard ? 'PROBABLE HAZARD' : sec.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Section 3: AI/ML Analysis Results & Hazard Ranking */}
        <div className="my-6 p-4 rounded-xl border border-slate-300 bg-slate-50">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              2. AI/ML Anomaly Detection & Probable Hazard Ranking
            </h3>
            <span className="text-[10px] font-mono text-slate-500">
              Engine: {currentAnalysis.modelVersion}
            </span>
          </div>

          <div className="flex items-center gap-4 my-2 text-xs">
            <div className="font-bold text-slate-800">
              Probable Hazard Zone: <span className="text-red-600 font-mono text-sm underline">{currentAnalysis.probableZone}</span>
            </div>
            <div className="text-slate-600">
              Confidence Index: <span className="font-mono font-bold text-slate-900">{(currentAnalysis.confidence! * 100).toFixed(0)}%</span>
            </div>
          </div>

          <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 mt-2">
            {currentAnalysis.explanation.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Section 4: Trainer Observations & Supervisory Sign-Off */}
        <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              3. Trainer Observations (NSQF Audit):
            </h3>
            <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed italic">
              "{inspection.trainerNotes || 'Inspection demonstrated steady probe attitude. Section P4 flagged for secondary verification.'}"
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              4. Supervisor Verification & Seal:
            </h3>
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex flex-col justify-between h-24">
              <div className="text-[11px] text-slate-500">
                Verified by: <strong className="text-slate-800">Harish Chandra (Chief Assessor)</strong>
              </div>
              <div className="flex items-end justify-between">
                <div className="font-mono text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  DIGITALLY STAMPED & SIGNED
                </div>
                <div className="text-[10px] text-slate-400">Date: 12-OCT-2026</div>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Disclaimer Footer */}
        <div className="mt-8 pt-4 border-t border-slate-300 text-[10px] text-slate-500 leading-tight text-center">
          <strong>LEGAL & SAFETY DISCLAIMER:</strong> This report is generated by the SkillSafe AI & Digital Twin platform (Smart India Hackathon 2026). The "Probable Hazard Zone" tag is an assistive diagnostic result and does not substitute certified physical inspection protocols. Any elevated gas readings require immediate confirmation using approved workplace emergency procedures and standard soap-bubble / ultrasonic testing.
        </div>
      </div>
    </div>
  );
};
