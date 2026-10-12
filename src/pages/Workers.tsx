import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Radio,
  Watch,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  X,
  HardHat,
  Info,
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { Worker, WorkerStatus } from '../types';

export const Workers: React.FC = () => {
  const { workers, updateWorkerStatus, addWorker, inspections } = useSafety();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New worker form state
  const [newWorkerName, setNewWorkerName] = useState<string>('');
  const [newWorkerCode, setNewWorkerCode] = useState<string>('SK-VOC-99');
  const [newWorkerDept, setNewWorkerDept] = useState<string>('Vocational Training Wing');
  const [newWorkerRole, setNewWorkerRole] = useState<string>('Gas Fitter Trainee (NSQF L4)');

  const departments = Array.from(new Set(workers.map(w => w.department)));

  const filteredWorkers = workers.filter(w => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.workerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = filterDepartment === 'all' || w.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || w.currentStatus === filterStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleCreateWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkerName) return;

    addWorker({
      workerCode: newWorkerCode,
      name: newWorkerName,
      department: newWorkerDept,
      role: newWorkerRole,
      activeStatus: true,
      assignedDeviceId: 'dev-esp32-01',
      assignedWatchId: 'wat-ble-01',
      currentStatus: 'available',
      lastInspectionTime: null,
      avatarColor: 'from-blue-600 to-cyan-500',
    });

    setShowAddModal(false);
    setNewWorkerName('');
  };

  const workerInspections = selectedWorker
    ? inspections.filter(i => i.workerId === selectedWorker.id || i.workerName.includes(selectedWorker.name))
    : [];

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Worker & Trainee Tracking
            </h1>
            <span className="demo-badge">PERSONNEL</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Assigned diagnostic devices, smart watch BLE bindings, trade roles, and inspection progression.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary text-xs flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Register Trainee / Worker
        </button>
      </div>

      {/* Safety Notice regarding indoor location */}
      <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Location Transparency:</strong> SkillSafe tracks worker inspection start and return timestamps, along with current inspected pipe sections reported by the handheld probe. Precise indoor GPS/IPS coordinates are not claimed without an active anchor beacon network.
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by worker name, code, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9 w-full text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="input-field text-xs cursor-pointer"
          >
            <option value="all">All Departments / Wings</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field text-xs cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="inspection_in_progress">Inspecting</option>
            <option value="inspection_completed">Completed</option>
            <option value="alert_received">Alert Received</option>
            <option value="requires_review">Requires Review</option>
          </select>
        </div>
      </div>

      {/* Workers Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 bg-white/5">
                <th className="py-3 px-4 font-semibold">Worker Details</th>
                <th className="py-3 px-4 font-semibold">Department & Trade</th>
                <th className="py-3 px-4 font-semibold">Hardware Assigned</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Last Inspection</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredWorkers.map(w => (
                <tr
                  key={w.id}
                  className="hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => setSelectedWorker(w)}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${w.avatarColor} flex items-center justify-center font-bold text-xs text-white`}>
                        {w.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">{w.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{w.workerCode}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-slate-300 font-medium">{w.role}</div>
                    <div className="text-[10px] text-slate-500">{w.department}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1">
                      {w.assignedDeviceId ? (
                        <span className="flex items-center gap-1 text-[11px] text-cyan-300">
                          <Radio className="w-3 h-3 text-cyan-400" />
                          {w.assignedDeviceId}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">No Handheld</span>
                      )}
                      {w.assignedWatchId ? (
                        <span className="flex items-center gap-1 text-[11px] text-blue-300">
                          <Watch className="w-3 h-3 text-blue-400" />
                          {w.assignedWatchId}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">No Watch</span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`status-badge text-[10px] ${
                      w.currentStatus === 'inspection_in_progress'
                        ? 'status-cyan'
                        : w.currentStatus === 'alert_received'
                        ? 'status-red'
                        : w.currentStatus === 'requires_review'
                        ? 'status-amber'
                        : w.currentStatus === 'inspection_completed'
                        ? 'status-green'
                        : 'status-blue'
                    }`}>
                      {w.currentStatus.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {w.lastInspectionTime || 'Never'}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedWorker(w);
                      }}
                      className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Worker Detail Modal / Panel */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-white/15 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 animate-slide-up">
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${selectedWorker.avatarColor} flex items-center justify-center font-bold text-base text-white`}>
                  {selectedWorker.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-white">{selectedWorker.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedWorker.workerCode} • {selectedWorker.role}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedWorker(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-white/5">
                <span className="text-slate-400 block mb-1">Department:</span>
                <span className="font-semibold text-white">{selectedWorker.department}</span>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <span className="text-slate-400 block mb-1">Handheld Device:</span>
                <span className="font-mono text-cyan-300 font-semibold">{selectedWorker.assignedDeviceId || 'Unassigned'}</span>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <span className="text-slate-400 block mb-1">BLE Smart Watch:</span>
                <span className="font-mono text-blue-300 font-semibold">{selectedWorker.assignedWatchId || 'Unassigned'}</span>
              </div>
            </div>

            {/* Quick Status Override for Demo */}
            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-2">Simulate Status Change:</span>
              <div className="flex flex-wrap gap-2 text-xs">
                {(['available', 'inspection_in_progress', 'alert_received', 'requires_review', 'inspection_completed'] as WorkerStatus[]).map(st => (
                  <button
                    key={st}
                    onClick={() => updateWorkerStatus(selectedWorker.id, st)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      selectedWorker.currentStatus === st
                        ? 'bg-cyan-400 text-navy-950 font-bold border-cyan-400'
                        : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {st.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Past Inspections */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Recent Pipeline Inspection History
              </h4>
              {workerInspections.length === 0 ? (
                <div className="p-4 rounded-xl bg-white/5 text-center text-xs text-slate-400">
                  No inspection logs recorded for this worker today.
                </div>
              ) : (
                <div className="space-y-2">
                  {workerInspections.map(insp => (
                    <div key={insp.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{insp.id}</div>
                        <div className="text-[10px] text-slate-400">Sections: {insp.inspectedSections.join(', ')}</div>
                      </div>
                      <div className="text-right">
                        <span className="status-badge status-cyan text-[10px]">{insp.status}</span>
                        <div className="text-[10px] text-slate-400 mt-0.5">{insp.startTime}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 text-right">
              <button
                onClick={() => setSelectedWorker(null)}
                className="btn-secondary text-xs"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateWorker}
            className="bg-navy-900 border border-white/15 rounded-2xl max-w-md w-full p-6 space-y-4 animate-slide-up"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-base text-white">Register Worker or Trainee</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={newWorkerName}
                onChange={(e) => setNewWorkerName(e.target.value)}
                className="input-field w-full text-xs"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Worker / Trainee Code</label>
              <input
                type="text"
                required
                value={newWorkerCode}
                onChange={(e) => setNewWorkerCode(e.target.value)}
                className="input-field w-full text-xs font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Department / Trade Wing</label>
              <select
                value={newWorkerDept}
                onChange={(e) => setNewWorkerDept(e.target.value)}
                className="input-field w-full text-xs cursor-pointer"
              >
                <option value="Vocational Training Wing">Vocational Training Wing</option>
                <option value="City Gas Distribution (CGD)">City Gas Distribution (CGD)</option>
                <option value="Industrial Gas Transmission">Industrial Gas Transmission</option>
                <option value="Pipeline Integrity & Maintenance">Pipeline Integrity & Maintenance</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Role / NSQF Level</label>
              <input
                type="text"
                required
                value={newWorkerRole}
                onChange={(e) => setNewWorkerRole(e.target.value)}
                className="input-field w-full text-xs"
              />
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary text-xs"
              >
                Save & Assign Hardware
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
