import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * AnimatedText: Minimal editorial text reveal component.
 */
export const AnimatedText = ({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
  as = 'div',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as] || motion.div;

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Component
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // gentle easeOut
      }}
      className={className}
    >
      {children}
    </Component>
  );
};

export default AnimatedText;
