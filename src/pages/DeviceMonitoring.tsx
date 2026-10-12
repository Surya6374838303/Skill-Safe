import React, { useState } from 'react';
import {
  Radio,
  Battery,
  Wifi,
  Activity,
  Gauge,
  Thermometer,
  Droplets,
  Cpu,
  Compass,
  Ruler,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Wrench,
  Layers,
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { demoHistoryChartData } from '../data/demoData';

export const DeviceMonitoring: React.FC = () => {
  const { devices, workers, sections } = useSafety();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('dev-esp32-02'); // Handheld #2 (used by Ananya)

  const selectedDevice = devices.find(d => d.id === selectedDeviceId) || devices[0];
  const assignedWorker = workers.find(w => w.id === selectedDevice.workerId);
  const activeSection = sections.find(s => s.id === 'P4') || sections[0];

  return (
    <div className="space-y-6">
      {/* Title & Concept Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Handheld Diagnostic Device Telemetry
            </h1>
            <span className="demo-badge">ESP32-S3 CORE</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Multi-sensor diagnostic probe: Gas concentration, contact acoustic vibration, environmental compensation & distance encoder.
          </p>
        </div>

        {/* Device selector pill buttons */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
          {devices.map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedDeviceId(d.id)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all flex items-center gap-1.5 ${
                selectedDeviceId === d.id
                  ? 'bg-cyan-400 text-navy-950 font-bold border-cyan-400 shadow-md shadow-cyan-400/20'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              <Radio className="w-3 h-3" />
              {d.deviceCode.split('-').slice(-2).join('-')}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Device Telemetry Card */}
      <div className="glass-card p-6 border-cyan-400/20">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></span>
              <h2 className="font-extrabold text-lg text-white font-mono">{selectedDevice.deviceCode}</h2>
              <span className={`status-badge text-[11px] ${
                selectedDevice.connectionStatus === 'online'
                  ? 'status-green'
                  : selectedDevice.connectionStatus === 'intermittent'
                  ? 'status-amber'
                  : 'status-red'
              }`}>
                {selectedDevice.connectionStatus.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Field Operator:{' '}
              <strong className="text-slate-200">
                {assignedWorker ? `${assignedWorker.name} (${assignedWorker.role})` : 'Unassigned Standby'}
              </strong>
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Battery className={`w-4 h-4 ${selectedDevice.batteryPercent < 25 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`} />
              <span className="font-mono font-bold">{selectedDevice.batteryPercent}% Battery</span>
            </div>
            <div className="text-slate-400">
              Last Telemetry Burst: <span className="text-cyan-300 font-mono">{selectedDevice.lastSeen}</span>
            </div>
          </div>
        </div>

        {/* 6 Sensor Telemetry Dials & Health Status */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 my-6">
          {/* Gas Concentration */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="flex items-center gap-1"><Gauge className="w-3.5 h-3.5 text-cyan-400" /> Gas Level</span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase">{selectedDevice.sensorHealth.gas}</span>
            </div>
            <div className="text-2xl font-black text-cyan-300 font-mono">138.9</div>
            <div className="text-[10px] text-slate-400 mt-0.5">ppm CH4 eq.</div>
          </div>

          {/* Contact Vibration / Acoustic */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-amber-400" /> Vibration</span>
              <span className="text-[10px] text-amber-400 font-bold uppercase">{selectedDevice.sensorHealth.vibration}</span>
            </div>
            <div className="text-2xl font-black text-amber-300 font-mono">1.28</div>
            <div className="text-[10px] text-slate-400 mt-0.5">mm/s RMS</div>
          </div>

          {/* Probe Temperature */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-rose-400" /> Ambient T</span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase">{selectedDevice.sensorHealth.temperature}</span>
            </div>
            <div className="text-2xl font-black text-white font-mono">32.8</div>
            <div className="text-[10px] text-slate-400 mt-0.5">°Celsius (DHT22)</div>
          </div>

          {/* Relative Humidity */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-blue-400" /> Humidity</span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase">{selectedDevice.sensorHealth.humidity}</span>
            </div>
            <div className="text-2xl font-black text-white font-mono">43.1</div>
            <div className="text-[10px] text-slate-400 mt-0.5">% RH Drift Comp</div>
          </div>

          {/* Measured Pipe Section */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5 text-cyan-400" /> Pipe Zone</span>
              <span className="text-[10px] text-red-400 font-bold uppercase">HAZARD</span>
            </div>
            <div className="text-2xl font-black text-red-400 font-mono">P4</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Stress Weld Flange</div>
          </div>

          {/* Wheel Encoder Distance */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="flex items-center gap-1"><Ruler className="w-3.5 h-3.5 text-indigo-400" /> Traverse</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Encoder</span>
            </div>
            <div className="text-2xl font-black text-white font-mono">245</div>
            <div className="text-[10px] text-slate-400 mt-0.5">cm from Header P1</div>
          </div>
        </div>

        {/* Real-time Hardware Stream Chart */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" />
              Real-Time Continuous Waveform Stream (1 Hz Burst Telemetry)
            </span>
            <span className="text-slate-400">Payload field: <code>gas_reading</code> + <code>vibration_reading</code></span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={demoHistoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a1628',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Line type="monotone" dataKey="gas" stroke="#00d4ff" strokeWidth={2.5} dot={{ r: 2 }} name="Gas Reading (ppm)" />
                <Line type="monotone" dataKey="vibration" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2 }} name="Vibration (mm/s)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Hardware Architecture Spec & Payload Format */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Onboard Hardware Architecture */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10 mb-3">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">Handheld Physical Subsystem Specification</h3>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0"></span>
              <div>
                <strong className="text-white">Microcontroller:</strong> ESP32-S3 dual-core Xtensa LX7 @ 240MHz with hardware floating point, FreeRTOS multi-tasking.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0"></span>
              <div>
                <strong className="text-white">Gas Diagnostic:</strong> Metal Oxide (MOS / MQ series) calibrated against target gas (Methane CH4 / LPG), with 12-bit ADC pre-filtering.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0"></span>
              <div>
                <strong className="text-white">Contact Vibration Sensor:</strong> Piezo-electric film / MEMS acoustic accelerometer sensing high-frequency pipe surface turbulence.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0"></span>
              <div>
                <strong className="text-white">Local Haptics:</strong> 85dB resonant buzzer, high-intensity red hazard strobe, and 0.96" OLED diagnostic readout.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0"></span>
              <div>
                <strong className="text-white">Dual Radios:</strong> BLE 5.0 for low-latency wrist alert broadcast (&lt;50ms) + 2.4GHz Wi-Fi for control room HTTP/WebSocket streaming.
              </div>
            </li>
          </ul>
        </div>

        {/* JSON Ingestion Payload */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-sm text-white">Live ESP32 Ingestion Schema (POST /api/readings)</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">REST JSON</span>
          </div>

          <pre className="p-3 rounded-lg bg-navy-950 font-mono text-[11px] text-cyan-300 overflow-x-auto leading-relaxed border border-white/5">
{`{
  "device_id": "SS-HANDHELD-ESP32-02",
  "worker_id": "w-102",
  "timestamp": "2026-10-12T11:47:30.142Z",
  "gas_reading": 138.9,
  "gas_unit": "ppm CH4 eq.",
  "vibration_reading": 1.28,
  "temperature": 32.8,
  "humidity": 43.1,
  "section_id": "P4",
  "distance_cm": 245.0,
  "battery_percent": 42,
  "connectivity_status": "online",
  "alert_level": "critical"
}`}
          </pre>

          <p className="text-[11px] text-slate-400 mt-2">
            Field note: Not all sensors deliver every field; backend handles partial telemetry safely without dropping packets.
          </p>
        </div>
      </div>
    </div>
  );
};
