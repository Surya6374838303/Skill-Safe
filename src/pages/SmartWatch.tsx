import React, { useState } from 'react';
import {
  Watch,
  Radio,
  Battery,
  AlertTriangle,
  CheckCircle2,
  Bell,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  Info,
  Zap,
  PhoneCall,
  Flame,
  AlertOctagon,
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { WatchAlert } from '../types';

export const SmartWatch: React.FC = () => {
  const { watchAlerts, acknowledgeAlert, alerts } = useSafety();
  const [escalationTimeoutSec, setEscalationTimeoutSec] = useState<number>(60);
  const [sosSimulated, setSosSimulated] = useState<boolean>(false);
  const [sosConfirmed, setSosConfirmed] = useState<boolean>(false);

  const handleSimulateSOS = () => {
    setSosSimulated(true);
    // Simulating true handshake confirmation after 1.5s
    setTimeout(() => {
      setSosConfirmed(true);
    }, 1500);
  };

  const handleResetSOS = () => {
    setSosSimulated(false);
    setSosConfirmed(false);
  };

  return (
    <div className="space-y-6">
      {/* Title & BLE Description */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Smart Watch & Worker Haptic Safety
            </h1>
            <span className="demo-badge">BLE 5.0 WRISTBAND</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Local Bluetooth Low Energy (BLE) link directly connecting handheld diagnostic probe to technician wristband.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            BLE Mesh Broadcast Active
          </span>
        </div>
      </div>

      {/* Safety Notice regarding SOS & BLE separation */}
      <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3 text-xs text-blue-300">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Communication Isolation:</strong> The handheld device communicates directly with the worker's smart watch over local BLE even when Wi-Fi/cellular internet is lost. Wristbands do not send data directly to the cloud; they pair locally with the ESP32 handheld. SOS triggers must receive hardware-level ACK before confirming transmission.
        </div>
      </div>

      {/* Active Watch Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {watchAlerts.map(watch => {
          const isCritical = watch.notificationType === 'high_priority_hazard';
          return (
            <div
              key={watch.id}
              className={`glass-card p-5 flex flex-col justify-between transition-all ${
                isCritical ? 'border-red-500/40 bg-red-500/10 shadow-lg shadow-red-500/10' : ''
              }`}
            >
              <div>
                {/* Watch Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                  <div className="flex items-center gap-2">
                    <Watch className={`w-5 h-5 ${isCritical ? 'text-red-400 animate-bounce' : 'text-cyan-400'}`} />
                    <div>
                      <h3 className="font-bold text-sm text-white">{watch.workerName}</h3>
                      <span className="text-[10px] text-slate-400 font-mono">{watch.id}</span>
                    </div>
                  </div>

                  <span className={`status-badge text-[10px] ${
                    watch.bleStatus === 'connected'
                      ? 'status-green'
                      : watch.bleStatus === 'pairing'
                      ? 'status-amber'
                      : 'status-red'
                  }`}>
                    {watch.bleStatus.toUpperCase()}
                  </span>
                </div>

                {/* Battery & Latest Notification */}
                <div className="flex items-center justify-between text-xs text-slate-300 mb-3">
                  <span className="flex items-center gap-1.5">
                    <Battery className={`w-3.5 h-3.5 ${watch.watchBattery < 30 ? 'text-amber-400' : 'text-emerald-400'}`} />
                    {watch.watchBattery}% Battery
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Synced: {watch.alertTime}</span>
                </div>

                {/* Notification Banner */}
                <div className={`p-3 rounded-xl border text-xs mb-3 ${
                  isCritical
                    ? 'bg-red-500/20 border-red-500/40 text-red-200'
                    : watch.notificationType === 'warning_abnormal_gas'
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-200'
                    : 'bg-white/5 border-white/10 text-slate-300'
                }`}>
                  <div className="flex items-center justify-between font-bold text-[11px] mb-1">
                    <span>Haptic Dispatch:</span>
                    <span className="uppercase text-[9px] px-1.5 py-0.2 rounded bg-black/40">
                      {watch.notificationType?.replace(/_/g, ' ') || 'STANDBY'}
                    </span>
                  </div>
                  <p className="leading-snug">{watch.latestAlert}</p>
                </div>

                {/* Acknowledgement Status */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">Wrist Acknowledged:</span>
                  {watch.alertAcknowledged ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                    </span>
                  ) : (
                    <span className="text-red-400 font-bold flex items-center gap-1 text-[11px] animate-pulse">
                      <AlertTriangle className="w-3.5 h-3.5" /> Pending ACK
                    </span>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-4">
                <span className="text-[10px] text-slate-500">Latency: 28ms BLE</span>
                {!watch.alertAcknowledged && (
                  <button
                    onClick={() => {
                      const pending = alerts.find(a => a.workerName.includes(watch.workerName));
                      if (pending) acknowledgeAlert(pending.id);
                    }}
                    className="px-2.5 py-1 rounded bg-cyan-400 hover:bg-cyan-300 text-navy-950 font-bold text-[10px] transition-colors"
                  >
                    Simulate Worker ACK
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Escalation Workflow Diagram & SOS Test Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Escalation Policy & Workflow */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              <h3 className="font-bold text-sm text-white">Alert Escalation Protocol</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Configurable Timer</span>
          </div>

          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            If an elevated hazard remains unacknowledged on the technician's watch, the system automatically escalates to the control room supervisor and flags the inspection record.
          </p>

          {/* Timeline steps */}
          <div className="space-y-3 relative pl-6 border-l-2 border-white/10 my-4 text-xs">
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-cyan-400 border-2 border-navy-950"></span>
              <div className="font-bold text-white">T + 0s: Hazard Condition Ingested</div>
              <p className="text-[11px] text-slate-400">Handheld ESP32 buzzer chirps and sends BLE alert packet to paired watch.</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-400 border-2 border-navy-950"></span>
              <div className="font-bold text-white">T + 1s: Smart Watch Haptic Buzz</div>
              <p className="text-[11px] text-slate-400">Worker feels tactile pulse and OLED displays hazard zone.</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-amber-400 border-2 border-navy-950"></span>
              <div className="font-bold text-white">T + {escalationTimeoutSec}s: Unacknowledged Timeout</div>
              <p className="text-[11px] text-slate-400">Alarm escalates to Central Control Room audio klaxon; audit log created.</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-red-400 border-2 border-navy-950"></span>
              <div className="font-bold text-white">T + 90s: Evacuation Broadcast</div>
              <p className="text-[11px] text-slate-400">Mandatory emergency stop protocol initiated for pipeline section.</p>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <label className="text-slate-300 font-medium">Escalation Threshold:</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="10"
                max="180"
                value={escalationTimeoutSec}
                onChange={(e) => setEscalationTimeoutSec(Number(e.target.value))}
                className="input-field w-20 text-center font-mono text-xs py-1"
              />
              <span className="text-slate-400">Seconds</span>
            </div>
          </div>
        </div>

        {/* SOS Emergency Testing & Physical Validation */}
        <div className="glass-card p-6 flex flex-col justify-between border-red-500/20">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-400" />
                <h3 className="font-bold text-sm text-white">Worker SOS Signal Verification</h3>
              </div>
              <span className="demo-badge">FAIL-SAFE VALIDATION</span>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              When a trainee or technician triggers the SOS long-press on their smart watch, the signal travels via BLE to the handheld, which relays it through the Wi-Fi gateway with high packet priority.
            </p>

            <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Simulated Trainee:</span>
                <span className="font-bold text-white">Ananya Sharma (Section P4)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Handshake State:</span>
                <span className={`font-bold ${
                  sosConfirmed
                    ? 'text-red-400 flex items-center gap-1'
                    : sosSimulated
                    ? 'text-amber-400 flex items-center gap-1'
                    : 'text-slate-500'
                }`}>
                  {sosConfirmed ? (
                    <>
                      <AlertOctagon className="w-3.5 h-3.5" />
                      SOS ACK CONFIRMED BY CONTROL ROOM
                    </>
                  ) : sosSimulated ? (
                    'Transmitting BLE Packet...'
                  ) : (
                    'Standby (No SOS Active)'
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-2">
            {!sosSimulated ? (
              <button
                onClick={handleSimulateSOS}
                className="btn-danger w-full text-xs py-2.5 flex items-center justify-center gap-2 font-bold"
              >
                <AlertTriangle className="w-4 h-4" />
                Simulate Worker Wrist SOS Trigger
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleResetSOS}
                  className="btn-secondary flex-1 text-xs py-2"
                >
                  Clear SOS Test Signal
                </button>
              </div>
            )}
            <p className="text-[10px] text-slate-500 text-center">
              Safety rule: Never simulate emergency sirens in live plant environments without prior clearance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
