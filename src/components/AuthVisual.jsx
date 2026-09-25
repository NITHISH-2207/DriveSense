import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Activity, Cpu } from 'lucide-react';

/**
 * AuthVisual: Minimal, calm abstract visual for the brand side of the auth layout.
 * Shows vehicle-inspired geometric contours and subtle sensor nodes.
 */
export const AuthVisual = () => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-8 lg:p-12 overflow-hidden bg-gradient-to-br from-[#E8F5F1]/80 via-[#FAFCFB] to-[#E8F5F1]/40 rounded-3xl border border-[#DCE7E3]/70">
      {/* Subtle decorative background ambient curves */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
        viewBox="0 0 500 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-40 180 C 120 120, 240 260, 540 160"
          stroke="#176B5B"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
        <path
          d="M-20 340 C 160 280, 280 440, 560 320"
          stroke="#176B5B"
          strokeWidth="1"
          strokeOpacity="0.6"
        />
        <circle cx="180" cy="190" r="140" stroke="#176B5B" strokeWidth="0.75" strokeOpacity="0.2" />
        <circle cx="180" cy="190" r="80" stroke="#176B5B" strokeWidth="0.75" strokeOpacity="0.25" />
      </svg>

      {/* Top Tagline / Micro-badge */}
      <div className="relative z-10 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-[#176B5B] border border-[#DCE7E3] shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3C9A70] animate-pulse" />
          Vehicle Intelligence
        </span>
      </div>

      {/* Central Abstract Vehicle Health Graphic */}
      <div className="relative z-10 my-auto py-8 flex flex-col items-center justify-center">
        <div className="relative w-64 h-56 flex items-center justify-center">
          {/* Outer calm pulsating aura */}
          <motion.div
            className="absolute w-52 h-52 rounded-full bg-[#E8F5F1]/90"
            animate={{ scale: [1, 1.04, 1], opacity: [0.7, 0.9, 0.7] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Abstract vehicle contour outline */}
          <svg
            className="relative z-10 w-52 h-36"
            viewBox="0 0 200 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Streamlined vehicle silhouette contour */}
            <path
              d="M20 85 C 30 85, 45 80, 60 60 C 75 40, 110 35, 140 45 C 165 54, 180 70, 185 85"
              stroke="#176B5B"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Underbody ground line */}
            <path
              d="M15 88 L 188 88"
              stroke="#DCE7E3"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Sensor connectivity paths */}
            <path
              d="M60 60 L 95 72 L 140 45"
              stroke="#176B5B"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              strokeOpacity="0.7"
            />
            <path
              d="M95 72 L 100 88"
              stroke="#176B5B"
              strokeWidth="1.2"
              strokeDasharray="2 2"
              strokeOpacity="0.6"
            />

            {/* Sensor nodes */}
            {/* Node 1: Front subsystem */}
            <circle cx="60" cy="60" r="4.5" fill="#FFFFFF" stroke="#176B5B" strokeWidth="2" />
            <circle cx="60" cy="60" r="1.8" fill="#176B5B" />

            {/* Node 2: Core processing hub */}
            <circle cx="95" cy="72" r="5" fill="#176B5B" />
            <circle cx="95" cy="72" r="2.2" fill="#FFFFFF" />

            {/* Node 3: Rear alert/status accent node */}
            <circle cx="140" cy="45" r="4.5" fill="#FFFFFF" stroke="#E5A84B" strokeWidth="2" />
            <circle cx="140" cy="45" r="2" fill="#E5A84B" />

            {/* Wheel center indicators */}
            <circle cx="48" cy="88" r="8" fill="#FFFFFF" stroke="#176B5B" strokeWidth="1.8" />
            <circle cx="48" cy="88" r="2.5" fill="#3C9A70" />

            <circle cx="156" cy="88" r="8" fill="#FFFFFF" stroke="#176B5B" strokeWidth="1.8" />
            <circle cx="156" cy="88" r="2.5" fill="#3C9A70" />
          </svg>

          {/* Floating calm micro-status chips */}
          <motion.div
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute -top-1 -right-2 bg-white/95 backdrop-blur-xs border border-[#DCE7E3] rounded-xl px-2.5 py-1.5 shadow-sm flex items-center gap-2 text-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#3C9A70]" />
            <span className="text-xs font-semibold text-[#1F2927]">Systems Ready</span>
          </motion.div>

          <motion.div
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute -bottom-2 -left-2 bg-white/95 backdrop-blur-xs border border-[#DCE7E3] rounded-xl px-2.5 py-1.5 shadow-sm flex items-center gap-2 text-xs"
          >
            <Activity className="w-3.5 h-3.5 text-[#176B5B]" />
            <span className="text-xs font-semibold text-[#1F2927]">Continuous Health</span>
          </motion.div>
        </div>
      </div>

      {/* Bottom Brand Statement */}
      <div className="relative z-10">
        <h3 className="text-xl lg:text-2xl font-bold text-[#1F2927] tracking-tight leading-snug">
          Your vehicle tells a story.
        </h3>
        <p className="mt-1 text-sm lg:text-base text-[#66736F] font-normal leading-relaxed">
          DriveSense helps you understand it with clarity and confidence.
        </p>
      </div>
    </div>
  );
};

export default AuthVisual;
