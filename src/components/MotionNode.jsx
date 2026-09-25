import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * MotionNode: Subtle sensor node with optional gentle orbit/pulse kinematics.
 */
export const MotionNode = ({
  cx,
  cy,
  r = 3,
  fill = '#176B5B',
  stroke = '#FFFFFF',
  strokeWidth = 1.5,
  accent = false,
  orbit = false,
  pulse = true,
  delay = 0,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const nodeFill = accent ? '#E5A84B' : fill;

  return (
    <g>
      {/* Outer ambient pulse halo */}
      {pulse && !shouldReduceMotion && (
        <motion.circle
          cx={cx}
          cy={cy}
          r={r * 2.5}
          fill={accent ? '#E5A84B' : '#176B5B'}
          fillOpacity="0.12"
          animate={{
            scale: [1, 1.35, 1],
            opacity: [0.4, 0.1, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay,
          }}
        />
      )}

      {/* Main Node */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={r}
        fill={nodeFill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      />
    </g>
  );
};

export default MotionNode;
