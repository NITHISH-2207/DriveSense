import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MotionLine } from './MotionLine';
import { MotionNode } from './MotionNode';

/**
 * DriveField: The Signature Visual System for DriveSense.
 * A large abstract environmental field composed of curved motion trajectories,
 * fine sensor paths, and living nodes.
 *
 * Variants:
 * - 'splash': "The First Signal" sequenced emergence.
 * - 'login': Calm, settled trajectory field breathing gently in the open canvas.
 * - 'signup': Converging connection field representing initial onboarding.
 */
export const DriveField = ({
  variant = 'login',
  activeField = null,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Subtle response when an input field is active
  const fieldOpacity = activeField ? 0.85 : 0.65;

  if (variant === 'splash') {
    return (
      <div className={`relative w-full h-full flex items-center justify-center select-none pointer-events-none ${className}`}>
        <svg
          className="w-full max-w-[680px] h-[360px] sm:h-[420px] overflow-visible"
          viewBox="0 0 680 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ambient Living Center Aura */}
          <motion.circle
            cx="340"
            cy="200"
            r="120"
            fill="#E8F5F1"
            fillOpacity="0.45"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0.8, 1.1, 0.95], opacity: [0, 0.7, 0.5] }}
            transition={{ duration: 2.8, ease: 'easeOut' }}
          />

          {/* 1. Primary Motion Trajectory (Draws first) */}
          <MotionLine
            d="M 60 260 C 180 260, 240 140, 340 140 C 440 140, 500 240, 620 240"
            stroke="#176B5B"
            strokeWidth={2}
            opacity={0.7}
            duration={1.6}
            delay={0.2}
          />

          {/* 2. Secondary Harmonious Counter-Trajectory */}
          <MotionLine
            d="M 100 180 C 220 180, 290 260, 390 260 C 490 260, 540 160, 600 160"
            stroke="#176B5B"
            strokeWidth={1.2}
            strokeDasharray="4 4"
            opacity={0.4}
            duration={1.8}
            delay={0.6}
          />

          {/* 3. Steering & Sensor Arcs */}
          <MotionLine
            d="M 240 140 C 280 90, 380 90, 440 140"
            stroke="#176B5B"
            strokeWidth={1.5}
            opacity={0.6}
            duration={1.2}
            delay={1.0}
          />

          <MotionLine
            d="M 340 140 L 340 260"
            stroke="#DCE7E3"
            strokeWidth={1}
            strokeDasharray="2 3"
            duration={0.8}
            delay={1.2}
          />

          {/* 4. Sequential Emergence of Nodes */}
          {/* Node 1: Initial Point */}
          <MotionNode cx={60} cy={260} r={4.5} delay={0.1} />
          
          {/* Node 2: Steering Ingress */}
          <MotionNode cx={240} cy={140} r={3.5} delay={0.8} />

          {/* Node 3: Apex Core with Warm Amber Accent */}
          <MotionNode cx={340} cy={140} r={5} accent={true} delay={1.1} />

          {/* Node 4: Lower Nexus */}
          <MotionNode cx={390} cy={260} r={4} delay={1.3} />

          {/* Node 5: Destination Point */}
          <MotionNode cx={620} cy={240} r={4.5} delay={1.6} />

          {/* Flowing Signal Pulse along Primary Trajectory */}
          {!shouldReduceMotion && (
            <motion.circle
              r="2.5"
              fill="#176B5B"
              animate={{
                cx: [60, 240, 340, 500, 620],
                cy: [260, 140, 140, 240, 240],
                opacity: [0, 1, 1, 1, 0],
              }}
              transition={{
                duration: 2.4,
                delay: 1.8,
                repeat: Infinity,
                repeatDelay: 1,
                ease: 'easeInOut',
              }}
            />
          )}
        </svg>
      </div>
    );
  }

  if (variant === 'signup') {
    return (
      <div className={`relative w-full h-full flex items-center justify-center select-none pointer-events-none ${className}`}>
        <svg
          className="w-full h-full max-w-[700px] overflow-visible"
          viewBox="0 0 700 450"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Ambient Aura */}
          <motion.circle
            cx="350"
            cy="225"
            r="140"
            fill="#E8F5F1"
            fillOpacity={activeField ? 0.5 : 0.35}
            animate={!shouldReduceMotion ? {
              scale: [0.96, 1.04, 0.96],
              opacity: [0.35, 0.55, 0.35],
            } : undefined}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Converging Journey Trajectories */}
          <MotionLine
            d="M 50 320 C 180 320, 240 130, 380 130 C 500 130, 560 280, 650 280"
            stroke="#176B5B"
            strokeWidth={1.8}
            opacity={fieldOpacity}
            duration={1.2}
          />

          <MotionLine
            d="M 80 200 C 200 200, 280 300, 420 300 C 520 300, 580 180, 640 180"
            stroke="#176B5B"
            strokeWidth={1}
            strokeDasharray="4 4"
            opacity={fieldOpacity * 0.6}
            duration={1.4}
            delay={0.2}
          />

          {/* Transverse Sensor Coordinates */}
          <MotionLine
            d="M 200 320 C 260 220, 320 180, 380 130"
            stroke="#DCE7E3"
            strokeWidth={1}
            strokeDasharray="2 3"
            duration={0.9}
            delay={0.4}
          />

          <MotionLine
            d="M 380 130 C 440 180, 480 240, 540 300"
            stroke="#DCE7E3"
            strokeWidth={1}
            strokeDasharray="2 3"
            duration={0.9}
            delay={0.5}
          />

          {/* Living Nodes */}
          <MotionNode cx={50} cy={320} r={4} delay={0.2} />
          <MotionNode cx={240} cy={130} r={3.5} delay={0.4} />
          <MotionNode cx={380} cy={130} r={5} accent={true} delay={0.6} />
          <MotionNode cx={420} cy={300} r={3.5} delay={0.7} />
          <MotionNode cx={650} cy={280} r={4} delay={0.8} />
        </svg>
      </div>
    );
  }

  // Default 'login' variant: Calm, settled digital landscape
  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none pointer-events-none ${className}`}>
      <svg
        className="w-full h-full max-w-[760px] overflow-visible"
        viewBox="0 0 760 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Living Ambient Breathing Pulse */}
        <motion.circle
          cx="400"
          cy="240"
          r="160"
          fill="#E8F5F1"
          fillOpacity={activeField ? 0.6 : 0.4}
          animate={!shouldReduceMotion ? {
            scale: [0.94, 1.06, 0.94],
            opacity: [0.35, 0.6, 0.35],
          } : undefined}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Ambient Grid Reference Lines */}
        <line x1="80" y1="240" x2="680" y2="240" stroke="#DCE7E3" strokeWidth="0.75" strokeDasharray="3 6" opacity="0.6" />
        <line x1="400" y1="80" x2="400" y2="400" stroke="#DCE7E3" strokeWidth="0.75" strokeDasharray="3 6" opacity="0.6" />

        {/* Primary Trajectory Arc */}
        <MotionLine
          d="M 80 340 C 220 340, 280 150, 420 150 C 560 150, 620 300, 700 300"
          stroke="#176B5B"
          strokeWidth={2}
          opacity={fieldOpacity}
          duration={1.2}
        />

        {/* Steering Curve Accent */}
        <MotionLine
          d="M 140 220 C 280 220, 340 330, 480 330 C 580 330, 640 200, 680 200"
          stroke="#176B5B"
          strokeWidth={1.2}
          strokeDasharray="4 4"
          opacity={fieldOpacity * 0.5}
          duration={1.4}
          delay={0.2}
        />

        {/* Precision Sensor Nodes */}
        <MotionNode cx={80} cy={340} r={4} delay={0.2} />
        <MotionNode cx={280} cy={150} r={3.5} delay={0.4} />
        <MotionNode cx={420} cy={150} r={5} accent={true} delay={0.5} />
        <MotionNode cx={480} cy={330} r={3.5} delay={0.6} />
        <MotionNode cx={700} cy={300} r={4} delay={0.7} />

        {/* Orbiting Telemetry Beacon */}
        {!shouldReduceMotion && (
          <motion.circle
            r="2.5"
            fill="#176B5B"
            animate={{
              cx: [80, 280, 420, 620, 700],
              cy: [340, 150, 150, 300, 300],
              opacity: [0, 0.8, 1, 0.8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatDelay: 0.8,
              ease: 'easeInOut',
            }}
          />
        )}
      </svg>
    </div>
  );
};

export default DriveField;
