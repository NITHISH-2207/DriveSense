import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { DriveSenseLogo } from './DriveSenseLogo';

/**
 * Reusable layout for Terms & Conditions and Privacy Policy pages.
 * Handles top nav with DriveSense logo, "Back to Signup" action, and student prototype framing.
 */
export const LegalPageLayout = ({
  title,
  subtitle,
  lastUpdated,
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine return path (defaulting to /signup)
  const returnPath = location.state?.from || '/signup';
  const returnLabel = returnPath === '/login' ? 'Back to Sign In' : 'Back to Sign Up';

  const handleBack = () => {
    navigate(returnPath);
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F7FA] bg-tech-grid flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      {/* Minimal Top Navigation */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between pb-6 sm:pb-8 border-b border-[#DDE3EA]">
        <DriveSenseLogo size="md" />

        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#182433] hover:text-[#4B7BEC] bg-white hover:bg-[#EAF1FF] border border-[#DDE3EA] px-3.5 py-2 rounded-xl transition-all shadow-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4B7BEC]"
          aria-label={returnLabel}
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          <span>{returnLabel}</span>
        </button>
      </header>

      {/* Main Legal Content Card */}
      <main className="w-full max-w-4xl mx-auto my-6 sm:my-8 bg-white rounded-2xl border border-[#DDE3EA] shadow-card p-6 sm:p-12">
        {/* Document Header */}
        <div className="border-b border-[#DDE3EA] pb-6 sm:pb-8 mb-4 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF1FF] text-[#4B7BEC] mb-3 border border-[#4B7BEC]/20">
            <Shield className="w-3.5 h-3.5" />
            <span>Academic Project Prototype</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#182433] tracking-tight">
            {title}
          </h1>
          
          {subtitle && (
            <p className="mt-2 text-sm sm:text-base text-[#687384] leading-relaxed">
              {subtitle}
            </p>
          )}
          
          {lastUpdated && (
            <p className="mt-3 text-xs text-[#687384] font-medium font-mono">
              Document Version: {lastUpdated}
            </p>
          )}
        </div>

        {/* Document Body */}
        <div className="divide-y divide-[#DDE3EA]">
          {children}
        </div>

        {/* Bottom Back Action */}
        <div className="mt-10 pt-8 border-t border-[#DDE3EA] flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#4B7BEC] hover:bg-[#3867D6] px-5 py-2.5 rounded-xl shadow-subtle transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4B7BEC]"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            <span>{returnLabel}</span>
          </button>
          <span className="text-xs text-[#687384]">
            DriveSense Multidisciplinary College Project Prototype
          </span>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full max-w-4xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#687384]">
        <p>© {new Date().getFullYear()} DriveSense. All rights reserved.</p>
        <p className="text-[11px] text-[#687384]/80">Student prototype — not a commercial contract</p>
      </footer>
    </div>
  );
};

export default LegalPageLayout;
