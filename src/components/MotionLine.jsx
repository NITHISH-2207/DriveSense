import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * MotionLine: Thin organic trajectories inspired by steering curvature, road paths, and telemetry flow.
 */
export const MotionLine = ({
  d,
  stroke = '#176B5B',
  strokeWidth = 1.2,
  strokeDasharray,
  opacity = 0.4,
  drift = false,
  trace = true,
  duration = 1.4,
  delay = 0,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.path
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial={trace ? { pathLength: 0, opacity: 0 } : { opacity }}
      animate={
        shouldReduceMotion
          ? { opacity, pathLength: 1 }
          : {
              pathLength: 1,
              opacity: [opacity * 0.7, opacity, opacity * 0.7],
            }
      }
      transition={{
        pathLength: { duration, delay, ease: [0.16, 1, 0.3, 1] },
        opacity: {
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        },
      }}
    />
  );
};

export default MotionLine;
