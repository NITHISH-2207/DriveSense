import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Gauge,
  Zap,
  Thermometer,
  Droplet,
  Compass,
  ArrowRight,
  Shield,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { SENSOR_COPY } from '../services/vehicleStorage';

// ============================================================================
// STATUS CHIP — Minimal visual badge for Normal / Stable / Attention
// ============================================================================
export const StatusChip = ({ status = 'Normal' }) => {
  const isAttention = status === 'Attention';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold leading-none ${
        isAttention
          ? 'bg-[#FFF7ED] text-[#B45309] border border-[#F59E0B]/30'
          : 'bg-[#E8F5F1] text-[#176B5B] border border-[#176B5B]/20'
      }`}
    >
      {isAttention ? (
        <AlertTriangle className="w-2.5 h-2.5" />
      ) : (
        <CheckCircle2 className="w-2.5 h-2.5" />
      )}
      {status}
    </span>
  );
};

// ============================================================================
// SUBTLE INLINE SUGGESTION (<90 chars, consistent "Suggestion · " label)
// ============================================================================
export const SubtleSuggestion = ({ sensorKey, status = 'Normal' }) => {
  const copy = SENSOR_COPY?.[sensorKey]?.[status];
  if (!copy?.suggestion) return null;
  return (
    <p className="text-xs text-[#66736F] leading-relaxed pt-1">
      <span className="font-semibold text-[#1F2927]">Suggestion · </span>
      {copy.suggestion}
    </p>
  );
};

const tyreStatusColour = (status) =>
  status === 'Attention' ? '#F59E0B' : '#176B5B';

// ============================================================================
// ABSTRACT CHASSIS VISUAL — Overhead TPMS schematic with live node highlights
// ============================================================================
export const AbstractChassisVisual = ({ tyreData = {} }) => {
  const shouldReduceMotion = useReducedMotion();

  const flStatus = tyreData.statusFL || 'Normal';
  const frStatus = tyreData.statusFR || 'Normal';
  const rlStatus = tyreData.statusRL || 'Normal';
  const rrStatus = tyreData.statusRR || 'Normal';

  const tyreRects = [
    { x: 42, y: 40, status: flStatus },
    { x: 172, y: 40, status: frStatus },
    { x: 42, y: 115, status: rlStatus },
    { x: 172, y: 115, status: rrStatus },
  ];

  return (
    <div className="relative w-full max-w-[260px] sm:max-w-[300px] aspect-[4/3] mx-auto select-none flex items-center justify-center">
      <svg
        className="w-full h-full overflow-visible"
        viewBox="0 0 240 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Centerline & Axle Trajectories */}
        <line x1="120" y1="25" x2="120" y2="155" stroke="#DCE7E3" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="55" y1="55" x2="185" y2="55" stroke="#DCE7E3" strokeWidth="1.5" />
        <line x1="55" y1="130" x2="185" y2="130" stroke="#DCE7E3" strokeWidth="1.5" />

        {/* Vehicle Contour */}
        <path
          d="M 85 30 C 95 24, 145 24, 155 30 C 168 55, 168 125, 155 150 C 145 156, 95 156, 85 150 C 72 125, 72 55, 85 30 Z"
          stroke="#176B5B"
          strokeWidth="1.5"
          strokeOpacity="0.4"
          fill="#E8F5F1"
          fillOpacity="0.15"
        />

        {/* Central Hub Node */}
        <circle cx="120" cy="90" r="4" fill="#176B5B" />
        <circle cx="120" cy="90" r="1.5" fill="#FFFFFF" />

        {/* Pulse lines */}
        {!shouldReduceMotion && (
          <motion.path
            d="M 120 90 L 55 55 M 120 90 L 185 55 M 120 90 L 55 130 M 120 90 L 185 130"
            stroke="#176B5B"
            strokeWidth="0.75"
            strokeDasharray="2 3"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Tyre Elements */}
        {tyreRects.map((t, i) => (
          <g key={i} transform={`translate(${t.x}, ${t.y})`}>
            <rect
              width="26"
              height="30"
              rx="5"
              fill="#FFFFFF"
              stroke={tyreStatusColour(t.status)}
              strokeWidth="2"
            />
            <circle cx="13" cy="15" r="2" fill={tyreStatusColour(t.status)} />
          </g>
        ))}
      </svg>
    </div>
  );
};

// ============================================================================
// TYRE VALUE CARD
// ============================================================================
export const TyreCard = ({ label, value, status = 'Normal' }) => (
  <div
    className={`space-y-0.5 border-l-2 pl-3 py-1.5 ${
      status === 'Attention' ? 'border-[#F59E0B]' : 'border-[#176B5B]'
    }`}
  >
    <span className="text-[11px] font-semibold text-[#66736F] uppercase tracking-wider block">
      {label}
    </span>
    <div className="text-2xl sm:text-3xl font-extrabold text-[#1F2927] tracking-tight">
      {value} <span className="text-xs font-normal text-[#66736F]">PSI</span>
    </div>
    <StatusChip status={status} />
  </div>
);

// ============================================================================
// 1. OVERVIEW TAB (Compact Rectangular Sections with Click-to-Tab)
// ============================================================================
export const OverviewTab = ({ signals, onSelectTab }) => {
  const { tyrePressure, electrical, temperature, fluid, motion } = signals;

  const sections = [
    {
      id: 'tyres',
      icon: Gauge,
      name: 'Tyre Pressure',
      reading: `${tyrePressure?.frontLeft || 33} PSI avg`,
      status: tyrePressure?.overallStatus || 'Normal',
      interpretation: SENSOR_COPY?.tyrePressure?.[tyrePressure?.overallStatus || 'Normal']?.explanation,
      suggestionKey: 'tyrePressure',
    },
    {
      id: 'battery',
      icon: Zap,
      name: 'Electrical System',
      reading: electrical?.voltage || '12.9 V',
      status: electrical?.voltageStatus || 'Normal',
      interpretation: SENSOR_COPY?.voltage?.[electrical?.voltageStatus || 'Normal']?.explanation,
      suggestionKey: 'voltage',
    },
    {
      id: 'fluids',
      icon: Droplet,
      name: 'Fluid Monitoring',
      reading: fluid?.reading || '77%',
      status: fluid?.fluidStatus || 'Normal',
      interpretation: SENSOR_COPY?.fluid?.[fluid?.fluidStatus || 'Normal']?.explanation,
      suggestionKey: 'fluid',
    },
    {
      id: 'temperature',
      icon: Thermometer,
      name: 'Temperature',
      reading: temperature?.value || '37.8 °C',
      status: temperature?.tempStatus || 'Normal',
      interpretation: SENSOR_COPY?.temperature?.[temperature?.tempStatus || 'Normal']?.explanation,
      suggestionKey: 'temperature',
    },
    {
      id: 'motion',
      icon: Compass,
      name: 'Vehicle Motion',
      reading: motion?.motionState || 'Stable',
      status: motion?.motionStatus === 'Stable' ? 'Normal' : 'Attention',
      interpretation: SENSOR_COPY?.motion?.[motion?.motionStatus === 'Stable' ? 'Stable' : 'Attention']?.explanation,
      suggestionKey: 'motion',
    },
  ];

  return (
    <div className="space-y-4 text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((sec) => {
          const Icon = sec.icon;
          return (
            <div
              key={sec.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectTab && onSelectTab(sec.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectTab && onSelectTab(sec.id);
                }
              }}
              className="group bg-white hover:bg-[#FAFCFB] border border-[#DCE7E3] hover:border-[#176B5B]/50 rounded-2xl p-5 transition-all cursor-pointer shadow-xs hover:shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header: Icon + Name + Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#E8F5F1] flex items-center justify-center text-[#176B5B]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-[#1F2927] group-hover:text-[#176B5B] transition-colors">
                      {sec.name}
                    </h4>
                  </div>
                  <StatusChip status={sec.status} />
                </div>

                {/* Hero Reading */}
                <div className="text-2xl sm:text-3xl font-extrabold text-[#1F2927] tracking-tight">
                  {sec.reading}
                </div>

                {/* Short Interpretation */}
                <p className="text-xs text-[#66736F] leading-snug">
                  {sec.interpretation}
                </p>
              </div>

              {/* Footer: Subtle Suggestion + Arrow */}
              <div className="mt-4 pt-3 border-t border-[#DCE7E3]/60 flex items-end justify-between gap-2">
                <SubtleSuggestion sensorKey={sec.suggestionKey} status={sec.status} />
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[#66736F] group-hover:text-[#176B5B] group-hover:bg-[#E8F5F1] transition-all shrink-0">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// 2. TYRES TAB
// ============================================================================
export const TyresTab = ({ tyrePressure }) => {
  const overallStatus = tyrePressure?.overallStatus || 'Normal';

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left">
      <div className="flex items-baseline justify-between border-b border-[#DCE7E3] pb-3">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#66736F]">
            TPMS SENSORS
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#1F2927] tracking-tight mt-0.5">
            Tyre Pressure
          </h3>
        </div>
        <StatusChip status={overallStatus} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white border border-[#DCE7E3] rounded-2xl p-6 sm:p-8">
        <div className="md:col-span-6 flex items-center justify-center">
          <AbstractChassisVisual tyreData={tyrePressure} />
        </div>
        <div className="md:col-span-6 grid grid-cols-2 gap-4">
          <TyreCard label="Front Left" value={tyrePressure.frontLeft} status={tyrePressure.statusFL} />
          <TyreCard label="Front Right" value={tyrePressure.frontRight} status={tyrePressure.statusFR} />
          <TyreCard label="Rear Left" value={tyrePressure.rearLeft} status={tyrePressure.statusRL} />
          <TyreCard label="Rear Right" value={tyrePressure.rearRight} status={tyrePressure.statusRR} />
        </div>
      </div>

      <div className="space-y-1 pt-1">
        <p className="text-xs text-[#4A5A55] leading-relaxed">
          {SENSOR_COPY?.tyrePressure?.[overallStatus]?.explanation}
        </p>
        <SubtleSuggestion sensorKey="tyrePressure" status={overallStatus} />
      </div>
    </div>
  );
};

// ============================================================================
// 3. BATTERY / ELECTRICAL TAB
// ============================================================================
export const BatteryTab = ({ electrical }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left">
      <div className="flex items-baseline justify-between border-b border-[#DCE7E3] pb-3">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#66736F]">
            CURRENT &amp; VOLTAGE
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#1F2927] tracking-tight mt-0.5">
            Electrical System
          </h3>
        </div>
        <StatusChip status={electrical.voltageStatus} />
      </div>

      {/* Hero Values Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-[#DCE7E3] rounded-2xl p-6 space-y-2">
          <span className="text-xs font-semibold text-[#66736F] uppercase tracking-wider">
            BATTERY VOLTAGE
          </span>
          <div className="text-4xl sm:text-5xl font-extrabold text-[#1F2927] tracking-tight">
            {electrical.voltage}
          </div>
          <div className="pt-2 text-xs text-[#66736F] font-mono">
            <span className="block text-[11px] uppercase font-semibold text-[#176B5B]">Operating range</span>
            12.0 V — 14.4 V
          </div>
        </div>

        <div className="bg-white border border-[#DCE7E3] rounded-2xl p-6 space-y-2">
          <span className="text-xs font-semibold text-[#66736F] uppercase tracking-wider">
            OPERATING CURRENT
          </span>
          <div className="text-4xl sm:text-5xl font-extrabold text-[#1F2927] tracking-tight">
            {electrical.current}
          </div>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E8F5F1] text-[#176B5B]">
              Active Draw
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-1 pt-1">
        <p className="text-xs text-[#4A5A55] leading-relaxed">
          {SENSOR_COPY?.voltage?.[electrical.voltageStatus]?.explanation}
        </p>
        <SubtleSuggestion sensorKey="voltage" status={electrical.voltageStatus} />
      </div>
    </div>
  );
};

// ============================================================================
// 4. FLUIDS TAB
// ============================================================================
export const FluidsTab = ({ fluid }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left">
      <div className="flex items-baseline justify-between border-b border-[#DCE7E3] pb-3">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#66736F]">
            FLUID LEVEL SENSOR
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#1F2927] tracking-tight mt-0.5">
            Fluid Monitoring
          </h3>
        </div>
        <StatusChip status={fluid.fluidStatus} />
      </div>

      <div className="bg-white border border-[#DCE7E3] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#66736F]">
            FLUID LEVEL
          </span>
          <div className="text-4xl sm:text-5xl font-extrabold text-[#1F2927] tracking-tight">
            {fluid.reading}
          </div>
        </div>

        <div className="space-y-2">
          <div className="w-full h-2.5 bg-[#DCE7E3] rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                fluid.fluidStatus === 'Attention' ? 'bg-[#F59E0B]' : 'bg-[#176B5B]'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, fluid.numericLevel)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between text-xs text-[#66736F] font-mono">
            <span>0% Min</span>
            <span>20% Caution Threshold</span>
            <span>100% Full</span>
          </div>
        </div>
      </div>

      <div className="space-y-1 pt-1">
        <p className="text-xs text-[#4A5A55] leading-relaxed">
          {SENSOR_COPY?.fluid?.[fluid.fluidStatus]?.explanation}
        </p>
        <SubtleSuggestion sensorKey="fluid" status={fluid.fluidStatus} />
      </div>
    </div>
  );
};

// ============================================================================
// 5. TEMPERATURE TAB
// ============================================================================
export const TemperatureTab = ({ temperature }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left">
      <div className="flex items-baseline justify-between border-b border-[#DCE7E3] pb-3">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#66736F]">
            THERMAL SENSOR
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#1F2927] tracking-tight mt-0.5">
            Temperature
          </h3>
        </div>
        <StatusChip status={temperature.tempStatus} />
      </div>

      <div className="bg-white border border-[#DCE7E3] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#66736F]">
            OPERATING TEMPERATURE
          </span>
          <div className="text-4xl sm:text-5xl font-extrabold text-[#1F2927] tracking-tight">
            {temperature.value}
          </div>
        </div>

        <div className="space-y-2">
          <div className="w-full h-2.5 bg-[#DCE7E3] rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                temperature.tempStatus === 'Attention' ? 'bg-[#F59E0B]' : 'bg-[#176B5B]'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.max(10, (temperature.numericValue / 90) * 100))}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between text-xs text-[#66736F] font-mono">
            <span>20 °C</span>
            <span>45 °C Caution Threshold</span>
            <span>90 °C Max</span>
          </div>
        </div>
      </div>

      <div className="space-y-1 pt-1">
        <p className="text-xs text-[#4A5A55] leading-relaxed">
          {SENSOR_COPY?.temperature?.[temperature.tempStatus]?.explanation}
        </p>
        <SubtleSuggestion sensorKey="temperature" status={temperature.tempStatus} />
      </div>
    </div>
  );
};

// ============================================================================
// 6. MOTION TAB
// ============================================================================
export const MotionTab = ({ motion: motionData }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left">
      <div className="flex items-baseline justify-between border-b border-[#DCE7E3] pb-3">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#66736F]">
            IMU &amp; GYROSCOPE
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#1F2927] tracking-tight mt-0.5">
            Vehicle Motion
          </h3>
        </div>
        <StatusChip status={motionData.motionStatus === 'Stable' ? 'Normal' : 'Attention'} />
      </div>

      <div className="bg-white border border-[#DCE7E3] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#66736F]">
            KINEMATICS
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#1F2927]">
            {motionData.motionState}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center pt-2">
          <div className="bg-[#FAFCFB] border border-[#DCE7E3] rounded-xl p-4">
            <span className="text-xs text-[#66736F] font-mono uppercase block mb-1">X-Tilt (Pitch)</span>
            <span className="text-2xl font-bold text-[#1F2927] font-mono">{motionData.pitchX}</span>
          </div>
          <div className="bg-[#FAFCFB] border border-[#DCE7E3] rounded-xl p-4">
            <span className="text-xs text-[#66736F] font-mono uppercase block mb-1">Y-Tilt (Roll)</span>
            <span className="text-2xl font-bold text-[#1F2927] font-mono">{motionData.rollY}</span>
          </div>
          <div className="bg-[#FAFCFB] border border-[#DCE7E3] rounded-xl p-4">
            <span className="text-xs text-[#66736F] font-mono uppercase block mb-1">Z-Yaw (Heading)</span>
            <span className="text-2xl font-bold text-[#1F2927] font-mono">{motionData.yawZ}</span>
          </div>
        </div>
      </div>

      <div className="space-y-1 pt-1">
        <p className="text-xs text-[#4A5A55] leading-relaxed">
          {SENSOR_COPY?.motion?.[motionData.motionStatus === 'Stable' ? 'Stable' : 'Attention']?.explanation}
        </p>
        <SubtleSuggestion
          sensorKey="motion"
          status={motionData.motionStatus === 'Stable' ? 'Stable' : 'Attention'}
        />
      </div>
    </div>
  );
};

// ============================================================================
// MAIN TELEMETRY SECTION (Driven by activeTab from parent header)
// ============================================================================
export const VehicleTelemetrySection = ({
  signals,
  vehicleName = 'Vehicle',
  activeTab = 'overview',
  onSelectTab,
}) => {
  if (!signals) return null;

  return (
    <section id="telemetry-section" className="w-full space-y-6 text-left">
      {/* Tab Content Stage with Quiet Motion transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          {activeTab === 'overview' && (
            <OverviewTab signals={signals} onSelectTab={onSelectTab} />
          )}
          {activeTab === 'tyres' && <TyresTab tyrePressure={signals.tyrePressure} />}
          {activeTab === 'battery' && <BatteryTab electrical={signals.electrical} />}
          {activeTab === 'fluids' && <FluidsTab fluid={signals.fluid} />}
          {activeTab === 'temperature' && <TemperatureTab temperature={signals.temperature} />}
          {activeTab === 'motion' && <MotionTab motion={signals.motion} />}
        </motion.div>
      </AnimatePresence>

      {/* System Readiness Note */}
      <div className="pt-6 border-t border-[#DCE7E3]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#66736F]">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#176B5B]" />
          <span>DriveSense companion environment is active for {vehicleName}.</span>
        </div>
        <span className="font-mono text-[11px] text-[#66736F]/80">5 Subsystems Synchronized</span>
      </div>
    </section>
  );
};

export default VehicleTelemetrySection;
