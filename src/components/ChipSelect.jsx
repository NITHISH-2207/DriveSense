import React from 'react';

/**
 * ChipSelect: Minimal selectable pills for options like Vehicle Type and Fuel Type.
 */
export const ChipSelect = ({
  label,
  options = [],
  value,
  onChange,
  error,
  required = false,
  className = '',
}) => {
  return (
    <div className={`w-full flex flex-col text-left ${className}`}>
      {/* Label */}
      {label && (
        <span className="text-xs font-semibold uppercase tracking-wider text-[#66736F] mb-2">
          {label}
          {required && <span className="text-[#D86666] ml-1" aria-hidden="true">*</span>}
        </span>
      )}

      {/* Chips Container */}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`
                px-3.5 py-1.5 rounded-cta text-xs sm:text-sm font-medium transition-all duration-150
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176B5B]
                ${
                  isSelected
                    ? 'bg-[#E8F5F1] text-[#176B5B] border border-[#176B5B] font-semibold'
                    : 'bg-white text-[#66736F] border border-[#DCE7E3] hover:border-[#B8CEC6] hover:text-[#1F2927]'
                }
              `}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-[#D86666] font-medium mt-1.5" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default ChipSelect;
