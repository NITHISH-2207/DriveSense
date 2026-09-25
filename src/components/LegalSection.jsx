import React from 'react';

/**
 * LegalSection: Numbered editorial section for Terms and Privacy pages (01, 02...).
 */
export const LegalSection = ({
  number,
  title,
  children,
  className = '',
}) => {
  return (
    <section className={`pt-6 pb-6 border-b border-[#DDE3EA] last:border-b-0 space-y-3.5 text-left ${className}`}>
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-xs sm:text-sm font-bold text-[#4B7BEC] bg-[#EAF1FF] px-2.5 py-1 rounded-md">
          {number}
        </span>
        <h2 className="text-lg sm:text-xl font-bold text-[#182433] tracking-tight">
          {title}
        </h2>
      </div>
      <div className="space-y-3 text-sm sm:text-base text-[#687384] leading-relaxed pl-0 sm:pl-10">
        {children}
      </div>
    </section>
  );
};

export default LegalSection;
