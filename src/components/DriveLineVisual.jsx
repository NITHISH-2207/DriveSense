import React from 'react';
import { motion } from 'framer-motion';

/**
 * DriveLineVisual: Signature DriveSense "Drive Lines" telemetry visual.
 * Implements TRACE (line self-draw), SCAN (moving light beam), and PULSE (sensor nodes).
 */
export const DriveLineVisual = ({ className = '', interactive = false }) => {
  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none overflow-hidden ${className}`}>
      <svg
        className="w-full h-full max-w-[420px] max-h-[300px]"
        viewBox="0 0 380 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Scan gradient moving across the line */}
          <linearGradient id="scanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4B7BEC" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#4B7BEC" stopOpacity="1" />
            <stop offset="100%" stopColor="#4B7BEC" stopOpacity="0.1" />
          </linearGradient>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Grid Background Coordinate lines */}
        <path
          d="M20 180 H360 M20 130 H360 M20 80 H360"
          stroke="#DDE3EA"
          strokeWidth="0.75"
          strokeDasharray="2 4"
        />
        <path
          d="M80 20 V200 M190 20 V200 M300 20 V200"
          stroke="#DDE3EA"
          strokeWidth="0.75"
          strokeDasharray="2 4"
        />

        {/* Secondary Telemetry Curve */}
        <motion.path
          d="M 30 160 C 100 160, 140 120, 200 120 C 260 120, 300 90, 350 90"
          stroke="#26364A"
          strokeWidth="1.5"
          strokeOpacity="0.3"
          strokeDasharray="3 3"
        />

        {/* 1. TRACE: Main Drive Line Telemetry Path (self-draws) */}
        <motion.path
          d="M 30 140 C 90 140, 120 70, 190 70 C 260 70, 290 130, 350 130"
          stroke="#4B7BEC"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Minimal Vehicle Silhouette Contour overlay */}
        <motion.path
          d="M 120 150 C 135 125, 160 100, 195 100 C 230 100, 255 125, 270 150"
          stroke="#182433"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        />

        {/* Vertical sensor projection lines */}
        <line x1="90" y1="140" x2="90" y2="180" stroke="#4B7BEC" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.6" />
        <line x1="190" y1="70" x2="190" y2="180" stroke="#4B7BEC" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.6" />
        <line x1="290" y1="130" x2="290" y2="180" stroke="#4B7BEC" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.6" />

        {/* 2. PULSE: Circular Sensor Nodes */}
        {/* Node 1: Inlet Sensor */}
        <g>
          <motion.circle
            cx="90"
            cy="140"
            r="8"
            fill="#4B7BEC"
            fillOpacity="0.15"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.2, 0.6] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <circle cx="90" cy="140" r="4" fill="#FFFFFF" stroke="#4B7BEC" strokeWidth="2" />
          <circle cx="90" cy="140" r="1.5" fill="#4B7BEC" />
        </g>

        {/* Node 2: Central Processing Core (Apex) with Warm Accent */}
        <g>
          <motion.circle
            cx="190"
            cy="70"
            r="10"
            fill="#F2B66D"
            fillOpacity="0.2"
            animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0.1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
          <circle cx="190" cy="70" r="5" fill="#FFFFFF" stroke="#F2B66D" strokeWidth="2.2" />
          <circle cx="190" cy="70" r="2" fill="#F2B66D" />
        </g>

        {/* Node 3: Telemetry Egress */}
        <g>
          <motion.circle
            cx="290"
            cy="130"
            r="8"
            fill="#4B7BEC"
            fillOpacity="0.15"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.2, 0.6] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          />
          <circle cx="290" cy="130" r="4" fill="#FFFFFF" stroke="#4B7BEC" strokeWidth="2" />
          <circle cx="290" cy="130" r="1.5" fill="#4B7BEC" />
        </g>

        {/* 3. SCAN: Highlighting light pulse flowing along path */}
        <motion.circle
          r="3"
          fill="#4B7BEC"
          filter="url(#softGlow)"
          animate={{
            cx: [30, 90, 190, 290, 350],
            cy: [140, 140, 70, 130, 130],
            opacity: [0, 1, 1, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatDelay: 0.5,
          }}
        />
      </svg>
    </div>
  );
};

export default DriveLineVisual;
