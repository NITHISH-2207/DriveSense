import React, { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Loader2, ArrowRight } from 'lucide-react';

/**
 * PrimaryAction: Compact CTA for the Open Canvas layout.
 * Features:
 * - Compact footprint with 10-12px corner radius (#176B5B background, #125247 hover, white text).
 * - Arrow shifts slightly right on hover.
 * - Magnetic hover pull (Desktop-only via pointer: fine media query).
 */
export const PrimaryAction = ({
  children,
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDesktopPointer, setIsDesktopPointer] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Desktop-only fine pointer detection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
      setIsDesktopPointer(mediaQuery.matches);

      const handler = (e) => setIsDesktopPointer(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  const handleMouseMove = (e) => {
    if (!isDesktopPointer || disabled || isLoading || shouldReduceMotion || !buttonRef.current) return;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = (e.clientX - centerX) * 0.15; // subtle magnetic pull
    const deltaY = (e.clientY - centerY) * 0.15;
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`
        group relative inline-flex items-center justify-center gap-2.5 h-11 sm:h-12 px-6 sm:px-7
        bg-[#176B5B] hover:bg-[#125247] active:bg-[#0E3E36] text-white text-sm sm:text-base font-semibold
        rounded-cta transition-colors duration-150 select-none
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#176B5B]
        disabled:bg-[#DCE7E3] disabled:text-[#66736F] disabled:cursor-not-allowed disabled:active:scale-100
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          <span>{children}</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5 flex-shrink-0" />
        </>
      )}
    </motion.button>
  );
};

export const Button = PrimaryAction;
export default PrimaryAction;
