import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * PageTransition: Smooth spatial transition for the Open Canvas.
 */
export const PageTransition = ({ children, className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: 0.32,
        ease: [0.16, 1, 0.3, 1], // gentle easeOut
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
