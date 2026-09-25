import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * BreathingVehicle: Signature DriveSense Living Interface visual.
 * An abstract geometric vehicle-inspired form using thin curves, connected points,
 * soft arcs, minimal vehicle geometry, and subtle circular nodes.
 *
 * Variants:
 * - 'splash': Orchestrated emergence sequence from a single breathing point to full connected form.
 * - 'login': Ambient calm breathing organism living in the open environment.
 * - 'signup': Dynamic journey composition where separate nodes converge and connect.
 */
export const BreathingVehicle = ({
  variant = 'login',
  size = 'md',
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Size maps for responsive layout
  const dimensionMap = {
    sm: { width: 280, height: 160 },
    md: { width: 380, height: 220 },
    lg: { width: 480, height: 280 },
    full: { width: '100%', height: '100%' },
  };

  const currentDim = dimensionMap[size] || dimensionMap.md;

  if (variant === 'splash') {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <svg
          className="w-full max-w-[340px] sm:max-w-[440px] h-auto overflow-visible"
          viewBox="0 0 380 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ambient soft glow around the organism */}
          <motion.circle
            cx="190"
            cy="110"
            r="80"
            fill="#E8F5F1"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0.8, 1.05, 0.95],
              opacity: [0, 0.7, 0.5],
            }}
            transition={{
              duration: 2.2,
              ease: 'easeOut',
            }}
          />

          {/* 1. Thin Connected Curved Flow Paths */}
          {/* Main Vehicle Streamline & Chassis Curve */}
          <motion.path
            d="M 60 145 C 80 145, 110 135, 140 95 C 170 55, 230 50, 270 85 C 295 105, 310 145, 320 145"
            stroke="#176B5B"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.3, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Lower Ground Kinematics Path */}
          <motion.path
            d="M 50 152 L 330 152"
            stroke="#DCE7E3"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="4 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          />

          {/* Internal Sensor Flow Nexus Lines */}
          <motion.path
            d="M 140 95 L 190 120 L 270 85"
            stroke="#176B5B"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 0.9, delay: 0.7, ease: 'easeOut' }}
          />
          <motion.path
            d="M 190 120 L 190 152"
            stroke="#176B5B"
            strokeWidth="1"
            strokeDasharray="2 2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          />

          {/* 2. Sensor Nodes Appearance (Choreographed from First Point) */}
          {/* Point 1: The Initial Awakening Point */}
          <motion.circle
            cx="60"
            cy="145"
            r="4"
            fill="#FFFFFF"
            stroke="#176B5B"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.4, 1], opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          />
          <motion.circle
            cx="60"
            cy="145"
            r="1.8"
            fill="#176B5B"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          />

          {/* Point 2: Front Aerodynamic Node */}
          <motion.circle
            cx="140"
            cy="95"
            r="4.5"
            fill="#FFFFFF"
            stroke="#176B5B"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />
          <motion.circle
            cx="140"
            cy="95"
            r="2"
            fill="#176B5B"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          />

          {/* Point 3: Central Core Intelligence Node */}
          <motion.circle
            cx="190"
            cy="120"
            r="6"
            fill="#176B5B"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          />
          <motion.circle
            cx="190"
            cy="120"
            r="2.5"
            fill="#FFFFFF"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          />

          {/* Point 4: Upper Apex with Warm Highlight Accent */}
          <motion.circle
            cx="270"
            cy="85"
            r="5"
            fill="#FFFFFF"
            stroke="#E5A84B"
            strokeWidth="2.2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.85 }}
          />
          <motion.circle
            cx="270"
            cy="85"
            r="2.2"
            fill="#E5A84B"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.95 }}
          />

          {/* Point 5: Rear Kinematic Node */}
          <motion.circle
            cx="320"
            cy="145"
            r="4"
            fill="#FFFFFF"
            stroke="#176B5B"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          />
          <motion.circle
            cx="320"
            cy="145"
            r="1.8"
            fill="#176B5B"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 1.1 }}
          />
        </svg>
      </div>
    );
  }

  if (variant === 'signup') {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <svg
          className="w-full max-w-[320px] sm:max-w-[420px] h-auto overflow-visible"
          viewBox="0 0 360 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle living aura */}
          {!shouldReduceMotion && (
            <motion.circle
              cx="180"
              cy="100"
              r="70"
              fill="#E8F5F1"
              fillOpacity="0.4"
              animate={{
                scale: [0.95, 1.05, 0.95],
                opacity: [0.35, 0.6, 0.35],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}

          {/* Converging Journey Arc Paths */}
          <motion.path
            d="M 40 140 C 90 140, 110 70, 180 70 C 250 70, 270 140, 320 140"
            stroke="#176B5B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />

          <motion.path
            d="M 70 110 C 130 110, 160 130, 220 130 C 260 130, 280 110, 300 110"
            stroke="#176B5B"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            strokeOpacity="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />

          {/* Sequential Journey Points */}
          <g>
            <circle cx="40" cy="140" r="4" fill="#FFFFFF" stroke="#176B5B" strokeWidth="2" />
            <circle cx="40" cy="140" r="1.5" fill="#176B5B" />
          </g>

          <g>
            <circle cx="110" cy="85" r="4" fill="#FFFFFF" stroke="#176B5B" strokeWidth="1.8" />
            <circle cx="110" cy="85" r="1.5" fill="#176B5B" />
          </g>

          <g>
            {!shouldReduceMotion ? (
              <motion.circle
                cx="180"
                cy="70"
                r="8"
                fill="#E5A84B"
                fillOpacity="0.2"
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.1, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            ) : null}
            <circle cx="180" cy="70" r="5" fill="#FFFFFF" stroke="#E5A84B" strokeWidth="2.2" />
            <circle cx="180" cy="70" r="2" fill="#E5A84B" />
          </g>

          <g>
            <circle cx="250" cy="85" r="4" fill="#FFFFFF" stroke="#176B5B" strokeWidth="1.8" />
            <circle cx="250" cy="85" r="1.5" fill="#176B5B" />
          </g>

          <g>
            <circle cx="320" cy="140" r="4" fill="#FFFFFF" stroke="#176B5B" strokeWidth="2" />
            <circle cx="320" cy="140" r="1.5" fill="#176B5B" />
          </g>
        </svg>
      </div>
    );
  }

  // Default 'login' variant: Ambient breathing organism living in the space
  return (
    <div className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}>
      <svg
        className="w-full max-w-[340px] sm:max-w-[440px] h-auto overflow-visible"
        viewBox="0 0 380 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Living Breathing Aura */}
        {!shouldReduceMotion && (
          <motion.circle
            cx="190"
            cy="110"
            r="85"
            fill="#E8F5F1"
            fillOpacity="0.5"
            animate={{
              scale: [0.94, 1.06, 0.94],
              opacity: [0.4, 0.75, 0.4],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Abstract Vehicle Chassis & Telemetry Flow */}
        <motion.path
          d="M 60 145 C 80 145, 110 135, 140 95 C 170 55, 230 50, 270 85 C 295 105, 310 145, 320 145"
          stroke="#176B5B"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0.8 }}
          animate={!shouldReduceMotion ? {
            d: [
              "M 60 145 C 80 145, 110 135, 140 95 C 170 55, 230 50, 270 85 C 295 105, 310 145, 320 145",
              "M 60 145 C 82 143, 112 133, 142 93 C 172 53, 232 48, 272 83 C 297 103, 310 145, 320 145",
              "M 60 145 C 80 145, 110 135, 140 95 C 170 55, 230 50, 270 85 C 295 105, 310 145, 320 145",
            ]
          } : undefined}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Ground Kinematics Base Line */}
        <path
          d="M 50 152 L 330 152"
          stroke="#DCE7E3"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="4 4"
        />

        {/* Internal Connected Sensor Flow lines */}
        <path
          d="M 140 95 L 190 120 L 270 85"
          stroke="#176B5B"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          strokeOpacity="0.6"
        />
        <path
          d="M 190 120 L 190 152"
          stroke="#176B5B"
          strokeWidth="1"
          strokeDasharray="2 2"
          strokeOpacity="0.5"
        />

        {/* Living Sensor Nodes */}
        <circle cx="60" cy="145" r="4" fill="#FFFFFF" stroke="#176B5B" strokeWidth="2" />
        <circle cx="60" cy="145" r="1.8" fill="#176B5B" />

        <circle cx="140" cy="95" r="4.5" fill="#FFFFFF" stroke="#176B5B" strokeWidth="2" />
        <circle cx="140" cy="95" r="2" fill="#176B5B" />

        {/* Central Core with Breathing Pulse */}
        <g>
          {!shouldReduceMotion && (
            <motion.circle
              cx="190"
              cy="120"
              r="10"
              fill="#176B5B"
              fillOpacity="0.15"
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.15, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          <circle cx="190" cy="120" r="5.5" fill="#176B5B" />
          <circle cx="190" cy="120" r="2.2" fill="#FFFFFF" />
        </g>

        {/* Amber Accent Node */}
        <circle cx="270" cy="85" r="4.5" fill="#FFFFFF" stroke="#E5A84B" strokeWidth="2.2" />
        <circle cx="270" cy="85" r="2" fill="#E5A84B" />

        <circle cx="320" cy="145" r="4" fill="#FFFFFF" stroke="#176B5B" strokeWidth="2" />
        <circle cx="320" cy="145" r="1.8" fill="#176B5B" />
      </svg>
    </div>
  );
};

export default BreathingVehicle;
