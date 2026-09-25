import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck } from 'lucide-react';
import { DriveLineVisual } from './DriveLineVisual';

/**
 * BrandVisual: Left-hand brand side container for Login & Auth layouts.
 * Combines signature Drive Lines with the supporting message:
 * "Your vehicle has a story. Let's understand it."
 */
export const BrandVisual = () => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-8 lg:p-10 overflow-hidden bg-gradient-to-b from-[#F5F7FA] to-[#EDF3FF]/70 rounded-2xl border border-[#DDE3EA]">
      {/* Top subtle badge */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white text-[#182433] border border-[#DDE3EA] shadow-subtle">
          <span className="w-1.5 h-1.5 rounded-full bg-[#45A978]" />
          Vehicle Intelligence
        </span>

        <span className="text-[11px] font-medium text-[#687384] tracking-wide uppercase">
          MDP IT + ECE
        </span>
      </div>

      {/* Central Signature Visual: Drive Lines */}
      <div className="relative z-10 my-auto py-6 flex flex-col items-center justify-center">
        <DriveLineVisual />
      </div>

      {/* Bottom Brand Statement */}
      <div className="relative z-10 pt-4 border-t border-[#DDE3EA]/80">
        <h3 className="text-xl lg:text-2xl font-extrabold text-[#182433] tracking-tight leading-snug">
          Your vehicle has a story.
        </h3>
        <p className="mt-1 text-sm lg:text-base text-[#687384] font-normal leading-relaxed">
          Let&apos;s understand it. DriveSense brings clarity to every journey.
        </p>
      </div>
    </div>
  );
};

export default BrandVisual;
