import React from 'react';
import { DriveSenseLogo } from './DriveSenseLogo';
import { DriveField } from './DriveField';
import { AnimatedText } from './AnimatedText';

/**
 * AuthCanvas: The Open Canvas Layout.
 * Features an asymmetric editorial composition with the Drive Field living in the environment.
 * Strictly NO split card boxes, NO borders, NO navbar badges, NO footer bars.
 */
export const AuthCanvas = ({
  statement,
  supporting,
  fieldVariant = 'login',
  activeField = null,
  children,
}) => {
  return (
    <div className="min-h-screen w-full bg-[#FAFCFB] open-canvas-gradient flex flex-col justify-between py-8 sm:py-12 px-6 sm:px-12 lg:px-20 relative overflow-hidden">
      {/* 1. Minimal Top-Left Wordmark (No navbar pills, no badges) */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-start relative z-20">
        <DriveSenseLogo size="md" />
      </header>

      {/* 2. Large Environmental Canvas */}
      <main className="w-full max-w-6xl mx-auto my-auto relative z-10 py-8 lg:py-12">
        {/* Drive Field Environmental Background Layer */}
        <div className="absolute inset-0 flex items-center justify-center lg:justify-end pointer-events-none -z-10 opacity-70 lg:opacity-100">
          <div className="w-full max-w-2xl lg:max-w-3xl translate-y-4 lg:translate-y-0 lg:translate-x-12">
            <DriveField variant={fieldVariant} activeField={activeField} />
          </div>
        </div>

        {/* Editorial Content & Open-Canvas Form */}
        <div className="w-full max-w-xl text-left relative z-20">
          {/* Large Editorial Statement */}
          <div className="space-y-2 mb-10 sm:mb-12">
            <AnimatedText as="h1" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1F2927] tracking-tight leading-[1.1]">
              {statement}
            </AnimatedText>
            {supporting && (
              <AnimatedText as="p" delay={0.1} className="text-lg sm:text-xl text-[#66736F] font-normal leading-relaxed">
                {supporting}
              </AnimatedText>
            )}
          </div>

          {/* Form directly on the canvas */}
          <div className="w-full">
            {children}
          </div>
        </div>
      </main>

      {/* 3. Empty Bottom Spacer (Strictly no conventional footer bar on auth pages) */}
      <div className="w-full max-w-6xl mx-auto opacity-0 pointer-events-none text-xs">
        DriveSense
      </div>
    </div>
  );
};

export default AuthCanvas;
