import React from 'react';
import { DriveSenseLogo } from './DriveSenseLogo';
import { BreathingVehicle } from './BreathingVehicle';

/**
 * AuthLayout: Living Interface Spatial Composition.
 * Rather than a generic card on a blank page or a split-screen template,
 * elements float in open, breathable space with the Breathing Vehicle
 * existing naturally in the background/environment.
 */
export const AuthLayout = ({
  children,
  title,
  subtitle,
  visualVariant = 'login',
}) => {
  return (
    <div className="min-h-screen w-full bg-[#FAFCFB] living-space flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-8 lg:px-12 relative overflow-hidden">
      {/* Upper Navigation / Branding */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between pb-6 sm:pb-8 relative z-20">
        <DriveSenseLogo size="md" />
        
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[#66736F] bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-full border border-[#DCE7E3]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3C9A70]" />
          <span>Vehicle Companion</span>
        </div>
      </header>

      {/* Main Spatial Composition */}
      <main className="w-full max-w-5xl mx-auto my-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        {/* Environmental Living Visual (Desktop: Left/Center ambiance; Mobile: Compact top element) */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left order-1 lg:order-1">
          {/* Living Heading Area */}
          <div className="space-y-2 mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2927] tracking-tight leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-base sm:text-lg text-[#66736F] font-normal leading-relaxed max-w-md">
                {subtitle}
              </p>
            )}
          </div>

          {/* Living Breathing Vehicle Graphic residing naturally in the space */}
          <div className="w-full max-w-sm lg:max-w-md my-2 opacity-90 transition-opacity">
            <BreathingVehicle variant={visualVariant} />
          </div>
        </div>

        {/* Form Container (Clean, unbloated, floating softly in space) */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto lg:mx-0 order-2 lg:order-2">
          <div className="bg-white rounded-ds-lg border border-[#DCE7E3] shadow-subtle p-6 sm:p-9 transition-all">
            {children}
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full max-w-5xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#66736F] relative z-20">
        <p>© {new Date().getFullYear()} DriveSense. Understand your vehicle.</p>
        <span className="text-[11px] text-[#66736F]/70">Drive with confidence</span>
      </footer>
    </div>
  );
};

export default AuthLayout;
