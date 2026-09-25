import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { DriveField } from '../components/DriveField';

/**
 * SplashScreen: "The First Signal"
 *
 * Sequence:
 * 1. Screen starts almost empty on #FAFCFB.
 * 2. A tiny green point appears and slowly moves.
 * 3. A thin curved line follows it, forming a trajectory.
 * 4. A second point appears, the two form a relationship.
 * 5. More subtle lines appear, building a quiet network of motion.
 * 6. DriveSense wordmark emerges.
 * 7. "Understand your vehicle." appears -> brief pause -> "Drive with confidence." appears.
 * 8. Motion field gently reorganizes and transitions to /login (~3.8s total).
 */
export const SplashScreen = () => {
  const navigate = useNavigate();
  const [hasNavigated, setHasNavigated] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasNavigated) {
        setHasNavigated(true);
        navigate('/login', { replace: true });
      }
    }, shouldReduceMotion ? 1500 : 3800);

    return () => clearTimeout(timer);
  }, [navigate, hasNavigated, shouldReduceMotion]);

  const handleAdvance = () => {
    if (!hasNavigated) {
      setHasNavigated(true);
      navigate('/login', { replace: true });
    }
  };

  return (
    <div
      onClick={handleAdvance}
      className="relative min-h-screen w-full bg-[#FAFCFB] open-canvas-gradient flex flex-col items-center justify-between p-6 sm:p-12 cursor-pointer select-none overflow-hidden"
    >
      {/* Top Spacer */}
      <div className="relative z-10 pt-4 opacity-0 pointer-events-none">
        <span className="text-xs">DriveSense</span>
      </div>

      {/* Centerpiece: The First Signal & Drive Field Orchestration */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl px-4 my-auto w-full">
        {/* Abstract Drive Field Trajectory Network */}
        <div className="w-full flex items-center justify-center mb-4">
          <DriveField variant="splash" />
        </div>

        {/* Wordmark Emergence */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-2"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2927] tracking-tight">
            Drive<span className="text-[#176B5B]">Sense</span>
          </h1>
        </motion.div>

        {/* Sequenced Statement: "Understand your vehicle." -> "Drive with confidence." */}
        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-base sm:text-xl text-[#66736F] font-normal leading-relaxed">
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            Understand your vehicle.
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#1F2927] font-medium"
          >
            Drive with confidence.
          </motion.span>
        </div>
      </div>

      {/* Bottom Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2.8, duration: 0.4 }}
        className="relative z-10 pb-4 text-xs text-[#66736F]"
      >
        <span>Click anywhere to continue</span>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
