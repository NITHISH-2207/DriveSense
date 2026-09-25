import React from 'react';
import { Link } from 'react-router-dom';

/**
 * DriveSenseLogo: Minimal editorial wordmark for the Open Canvas experience.
 */
export const DriveSenseLogoMark = ({ size = 28, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`flex-shrink-0 ${className}`}
    aria-label="DriveSense Mark"
  >
    {/* Base geometric enclosure with 9px rounding */}
    <rect width="32" height="32" rx="9" fill="#176B5B" />
    
    {/* Trajectory curve */}
    <path
      d="M8 22C8 15 13 11 21 11"
      stroke="#E8F5F1"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeOpacity="0.8"
    />
    
    {/* Core node */}
    <circle cx="9" cy="22" r="2.2" fill="#FFFFFF" />
    
    {/* Accent beacon */}
    <circle cx="21" cy="11" r="2" fill="#E5A84B" />
  </svg>
);

export const DriveSenseLogo = ({
  size = 'md',
  to = '/login',
  clickable = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { mark: 22, text: 'text-base sm:text-lg' },
    md: { mark: 28, text: 'text-lg sm:text-xl' },
    lg: { mark: 36, text: 'text-2xl' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <DriveSenseLogoMark size={currentSize.mark} />
      <span className={`font-bold tracking-tight text-[#1F2927] ${currentSize.text} leading-none`}>
        Drive<span className="text-[#176B5B]">Sense</span>
      </span>
    </div>
  );

  if (clickable && to) {
    return (
      <Link
        to={to}
        className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176B5B] rounded-lg p-0.5"
        aria-label="DriveSense Home"
      >
        {content}
      </Link>
    );
  }

  return content;
};

export const Logo = DriveSenseLogo;
export default DriveSenseLogo;
