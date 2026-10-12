import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Star,
  FileCheck,
  User,
  Plus,
  Info,
  Sliders,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { AssessmentScores } from '../types';

export const TrainerAssessment: React.FC = () => {
  const { assessments, addAssessment, workers, inspections } = useSafety();

  const [selectedWorkerName, setSelectedWorkerName] = useState<string>('Ananya Sharma');
  const [selectedInspectionId, setSelectedInspectionId] = useState<string>('INSP-2026-089');
  const [feedback, setFeedback] = useState<string>('');

  // 7 NSQF-aligned criteria scores (1 to 5)
  const [scores, setScores] = useState<AssessmentScores>({
    deviceHandling: 4,
    inspectionProcedure: 5,
    hazardIdentification: 5,
    safetyResponse: 4,
    alertAcknowledgement: 4,
    inspectionCompletion: 3,
    accurateReporting: 4,
  });

  const criteriaList = [
    { key: 'deviceHandling', label: '1. Correct Device Handling', desc: 'Maintained 45° probe attitude, proper sensor standoff distance (2-5cm)' },
    { key: 'inspectionProcedure', label: '2. Systematic Inspection Procedure', desc: 'Followed sequential P1 → P5 pipe traversal without skipping flanges' },
    { key: 'hazardIdentification', label: '3. Hazard Identification Skill', desc: 'Identified abnormal gas rise rate & acoustic turbulence on Section P4' },
    { key: 'safetyResponse', label: '4. Appropriate Safety Response', desc: 'Stepped back to safe perimeter; did not tamper with pressurized joint' },
    { key: 'alertAcknowledgement', label: '5. Alert Acknowledgement Speed', desc: 'Acknowledged wristband haptic within 30 seconds of BLE dispatch' },
    { key: 'inspectionCompletion', label: '6. Inspection Thoroughness', desc: 'Completed full rig circuit and verified baseline zero-point' },
    { key: 'accurateReporting', label: '7. Accurate Technical Reporting', desc: 'Properly documented observed ppm deltas and physical symptoms' },
  ];

  const handleScoreChange = (key: keyof AssessmentScores, val: number) => {
    setScores(prev => ({ ...prev, [key]: val }));
  };

  const calculateTotalScore = (sc: AssessmentScores) => {
    const total = Object.values(sc).reduce((a, b) => a + b, 0);
    return ((total / 35) * 100).toFixed(0);
  };

  const handleSubmitAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    addAssessment({
      inspectionId: selectedInspectionId,
      trainerId: 'TR-HARISH-01',
      trainerName: 'Harish Chandra (Chief Assessor)',
      workerName: selectedWorkerName,
      scores,
      feedback: feedback.trim() || 'Trainee demonstrated high safety awareness and followed NSQF diagnostic guidelines.',
      assessmentStatus: 'approved',
    });

    setFeedback('');
    alert('Assessment evaluation successfully saved to vocational candidate record.');
  };

  return (
    <div className="space-y-6">
      {/* Title & Official Alignment Note */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Trainer & Vocational Skill Assessment
            </h1>
            <span className="demo-badge">PRACTICAL RUBRIC</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Standardized evaluation matrix for vocational apprentices and industrial gas-fitters.
          </p>
        </div>
      </div>

      {/* Mandatory NSQF Compliance Notice */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-start gap-3 text-xs text-blue-300">
        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-blue-200">Vocational Framework Transparency:</strong>
          <p className="text-blue-300/90 leading-relaxed">
            This module represents <strong>proposed NSQF-aligned assessment support</strong> designed for Smart India Hackathon 2026. SkillSafe does not claim official National Skill Qualification Framework (NSQF) accreditation or replace accredited Sector Skill Council (SSC) certifying authorities.
          </p>
        </div>
      </div>

      {/* Rubric Evaluation Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <form onSubmit={handleSubmitAssessment} className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-cyan-400" />
                <h2 className="font-bold text-base text-white">7-Point Practical Rubric Scoring</h2>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Composite Score:</span>
                <span className="text-lg font-black text-cyan-400 font-mono">
                  {calculateTotalScore(scores)}%
                </span>
              </div>
            </div>

            {/* Candidate & Inspection Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Select Candidate / Trainee:</label>
                <select
                  value={selectedWorkerName}
                  onChange={(e) => setSelectedWorkerName(e.target.value)}
                  className="input-field w-full text-xs cursor-pointer"
                >
                  {workers.map(w => (
                    <option key={w.id} value={w.name}>{w.name} ({w.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Target Inspection Session:</label>
                <select
                  value={selectedInspectionId}
                  onChange={(e) => setSelectedInspectionId(e.target.value)}
                  className="input-field w-full text-xs cursor-pointer"
                >
                  {inspections.map(i => (
                    <option key={i.id} value={i.id}>{i.id} — {i.inspectedSections.join(', ')}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rubric Criteria with Star/Scale buttons */}
            <div className="space-y-4 pt-2">
              {criteriaList.map(cr => {
                const currentVal = scores[cr.key as keyof AssessmentScores];
                return (
                  <div key={cr.key} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-white">{cr.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{cr.desc}</div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleScoreChange(cr.key as keyof AssessmentScores, star)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                            star <= currentVal
                              ? 'bg-cyan-400 text-navy-950 shadow-sm'
                              : 'bg-white/5 text-slate-400 hover:bg-white/10'
                          }`}
                        >
                          {star}
                        </button>
                      ))}
                      <span className="text-[11px] text-slate-400 ml-1 font-mono">/ 5</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Qualitative Feedback */}
            <div className="pt-2">
              <label className="text-xs text-slate-300 font-medium block mb-1">
                Trainer Qualitative Feedback & Remedial Observations:
              </label>
              <textarea
                rows={3}
                placeholder="Note probe sweep cadence, posture, hazard communication, or areas needing practical re-training..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="input-field w-full text-xs"
              />
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                className="btn-primary text-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Certified Evaluation
              </button>
            </div>
          </form>
        </div>

        {/* Existing Assessment Records History */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="font-bold text-sm text-white">Submitted NSQF Evaluations</h3>
              <span className="text-xs text-slate-400">{assessments.length} Records</span>
            </div>

            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {assessments.map(rec => (
                <div key={rec.id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{rec.workerName}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold font-mono text-[11px]">
                      {calculateTotalScore(rec.scores)}%
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-400">
                    Session: <span className="text-cyan-300 font-mono">{rec.inspectionId}</span> • Assessor: {rec.trainerName.split(' ')[0]}
                  </div>

                  <p className="text-slate-300 italic text-[11px] bg-black/20 p-2.5 rounded-lg border border-white/5">
                    "{rec.feedback}"
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <ShieldCheck className="w-3 h-3" /> Certified
                    </span>
                    <span>{rec.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
