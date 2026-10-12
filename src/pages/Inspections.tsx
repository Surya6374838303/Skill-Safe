import React, { useState } from 'react';
import {
  ClipboardList,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Radio,
  FileEdit,
  X,
  Layers,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { Inspection } from '../types';

export const Inspections: React.FC = () => {
  const { inspections, addInspectionAnnotation, setSelectedInspectionId } = useSafety();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [annotationText, setAnnotationText] = useState<string>('');

  const filteredInspections = inspections.filter(insp => {
    const matchesSearch =
      insp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insp.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insp.inspectedSections.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || insp.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenDetail = (insp: Inspection) => {
    setSelectedInspection(insp);
    setSelectedInspectionId(insp.id);
    setAnnotationText('');
  };

  const handleSaveAnnotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInspection || !annotationText.trim()) return;

    addInspectionAnnotation(selectedInspection.id, annotationText);
    setSelectedInspection({
      ...selectedInspection,
      trainerNotes: selectedInspection.trainerNotes
        ? `${selectedInspection.trainerNotes}\n\n[Supervisor Annotation]: ${annotationText}`
        : annotationText,
      status: 'reviewed',
    });
    setAnnotationText('');
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Pipeline Inspection Records & Supervision
            </h1>
            <span className="demo-badge">AUDIT TRAIL</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Historical log of field inspections, probable hazard zone tags, duration metrics, and supervisory sign-offs.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by inspection ID, worker name, or section..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9 w-full text-xs"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input-field text-xs cursor-pointer"
        >
          <option value="all">All Inspection Statuses</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="requires_review">Requires Review</option>
          <option value="reviewed">Reviewed & Signed</option>
        </select>
      </div>

      {/* Inspections Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 bg-white/5">
                <th className="py-3 px-4 font-semibold">Inspection ID</th>
                <th className="py-3 px-4 font-semibold">Field Worker</th>
                <th className="py-3 px-4 font-semibold">Sections Inspected</th>
                <th className="py-3 px-4 font-semibold">Start & Duration</th>
                <th className="py-3 px-4 font-semibold">Probable Hazard</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredInspections.map(insp => (
                <tr
                  key={insp.id}
                  className="hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => handleOpenDetail(insp)}
                >
                  <td className="py-3 px-4 font-mono font-bold text-white">
                    {insp.id}
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{insp.workerName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{insp.deviceId}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {insp.inspectedSections.map(sec => (
                        <span
                          key={sec}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
                            sec === insp.probableHazardZone
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30 font-bold'
                              : 'bg-white/5 text-slate-300'
                          }`}
                        >
                          {sec}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-slate-300">{insp.startTime.split(' ')[1]} {insp.startTime.split(' ')[2]}</div>
                    <div className="text-[10px] text-slate-500">{insp.endTime ? 'Complete' : 'Ongoing sweep'}</div>
                  </td>

                  <td className="py-3 px-4">
                    {insp.probableHazardZone ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold">
                        <AlertTriangle className="w-3 h-3" />
                        Zone {insp.probableHazardZone}
                      </span>
                    ) : (
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> None
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span className={`status-badge text-[10px] ${
                      insp.status === 'in_progress'
                        ? 'status-cyan'
                        : insp.status === 'requires_review'
                        ? 'status-red'
                        : insp.status === 'reviewed'
                        ? 'status-blue'
                        : 'status-green'
                    }`}>
                      {insp.status.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetail(insp);
                      }}
                      className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium"
                    >
                      Annotate & Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspection Detail & Supervisor Annotation Modal */}
      {selectedInspection && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-white/15 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 animate-slide-up">
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-lg text-white font-mono">{selectedInspection.id}</h3>
                  <span className="status-badge status-cyan text-[10px]">
                    {selectedInspection.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Assigned Worker: <strong className="text-white">{selectedInspection.workerName}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedInspection(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-white/5">
                <span className="text-slate-400 block mb-1">Start Time:</span>
                <span className="font-semibold text-white">{selectedInspection.startTime}</span>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <span className="text-slate-400 block mb-1">Completion:</span>
                <span className="font-semibold text-white">{selectedInspection.endTime || 'In progress'}</span>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <span className="text-slate-400 block mb-1">Device:</span>
                <span className="font-mono text-cyan-300 font-semibold">{selectedInspection.deviceId}</span>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <span className="text-slate-400 block mb-1">Probable Hazard:</span>
                <span className="font-mono text-red-400 font-bold">{selectedInspection.probableHazardZone || 'Nominal'}</span>
              </div>
            </div>

            {/* Inspected Sections */}
            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-2">Sections Covered in Sweep:</span>
              <div className="flex flex-wrap gap-2 text-xs">
                {selectedInspection.inspectedSections.map(s => (
                  <span
                    key={s}
                    className={`px-3 py-1.5 rounded-lg border font-mono font-bold ${
                      s === selectedInspection.probableHazardZone
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : 'bg-white/5 text-slate-300 border-white/10'
                    }`}
                  >
                    Section {s} {s === selectedInspection.probableHazardZone && '⚠️ (Hazard Flagged)'}
                  </span>
                ))}
              </div>
            </div>

            {/* Trainer Notes */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs">
              <div className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                <FileEdit className="w-3.5 h-3.5 text-cyan-400" />
                Assessor / Field Observations:
              </div>
              <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                {selectedInspection.trainerNotes || 'No notes currently logged.'}
              </p>
            </div>

            {/* Supervisor Annotation Form */}
            <form onSubmit={handleSaveAnnotation} className="space-y-3 pt-2 border-t border-white/10">
              <label className="text-xs text-white font-bold block">
                Add Supervisory Review Annotation / Certification Note:
              </label>
              <textarea
                rows={3}
                required
                placeholder="Log secondary verification findings, trainee guidance, or clearance stamp..."
                value={annotationText}
                onChange={(e) => setAnnotationText(e.target.value)}
                className="input-field w-full text-xs"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedInspection(null)}
                  className="btn-secondary text-xs"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  Append Note & Sign Off Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
