import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/**
 * CustomSelect: Open Canvas custom-styled dropdown.
 * Sits on a thin baseline rule with smooth keyboard & mouse selection.
 */
export const CustomSelect = ({
  label,
  id,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  required = false,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const selectedOption = options.find((opt) =>
    typeof opt === 'string' ? opt === value : opt.value === value || opt.id === value
  );

  const selectedLabel = selectedOption
    ? typeof selectedOption === 'string'
      ? selectedOption
      : selectedOption.label || selectedOption.name
    : '';

  const handleSelect = (option) => {
    const val = typeof option === 'string' ? option : option.value || option.id || option.name;
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`w-full flex flex-col relative group text-left ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={selectId}
          className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-150 mb-1.5 ${
            error
              ? 'text-[#D86666]'
              : isOpen
              ? 'text-[#176B5B]'
              : 'text-[#66736F]'
          }`}
        >
          {label}
          {required && <span className="text-[#D86666] ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      {/* Select Trigger */}
      <button
        id={selectId}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          w-full py-2.5 px-0 text-base sm:text-lg bg-transparent text-left flex items-center justify-between
          transition-colors duration-150 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
          ${selectedLabel ? 'text-[#1F2927]' : 'text-[#66736F]/50'}
        `}
      >
        <span className="truncate">{selectedLabel || placeholder}</span>
        <ChevronDown
          className={`w-4 h-4 text-[#66736F] transition-transform duration-200 flex-shrink-0 ml-2 ${
            isOpen ? 'rotate-180 text-[#176B5B]' : ''
          }`}
        />
      </button>

      {/* Baseline rule */}
      <div className="relative w-full h-[1px] bg-[#DCE7E3]">
        <motion.div
          className={`absolute inset-0 origin-left ${
            error ? 'bg-[#D86666]' : 'bg-[#176B5B]'
          }`}
          initial={{ scaleX: 0 }}
          animate={{
            scaleX: isOpen || error ? 1 : 0,
          }}
          transition={{
            duration: shouldReduceMotion ? 0.01 : 0.25,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ height: '2px', top: '-0.5px' }}
        />
      </div>

      {/* Inline friendly error */}
      {error && (
        <p className="text-xs text-[#D86666] font-medium mt-1.5" role="alert">
          {error}
        </p>
      )}

      {/* Dropdown Menu (Open Canvas styling with clean border and subtle elevation) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-[#DCE7E3] rounded-ds shadow-subtle max-h-56 overflow-y-auto py-1 text-left"
          >
            {options.length === 0 ? (
              <div className="px-4 py-3 text-xs text-[#66736F]">No options available</div>
            ) : (
              options.map((option, idx) => {
                const optVal = typeof option === 'string' ? option : option.value || option.id || option.name;
                const optLabel = typeof option === 'string' ? option : option.label || option.name;
                const isSelected = optVal === value;

                return (
                  <button
                    key={`${optVal}_${idx}`}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`
                      w-full px-4 py-2.5 text-sm text-left flex items-center justify-between
                      transition-colors duration-100 hover:bg-[#E8F5F1]/60 focus:bg-[#E8F5F1] focus:outline-none
                      ${isSelected ? 'font-semibold text-[#176B5B] bg-[#E8F5F1]/40' : 'text-[#1F2927]'}
                    `}
                  >
                    <span>{optLabel}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#176B5B] stroke-[2.5]" />}
                  </button>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;
