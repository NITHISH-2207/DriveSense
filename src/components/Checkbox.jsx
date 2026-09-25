import React from 'react';
import { Check } from 'lucide-react';

/**
 * Accessible Checkbox component with Precision Motion styling
 */
export const Checkbox = ({
  id,
  checked,
  onChange,
  label,
  children,
  error,
  disabled = false,
  className = '',
}) => {
  const inputId = id || 'custom-checkbox';

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label
        htmlFor={inputId}
        className={`inline-flex items-start gap-2.5 select-none cursor-pointer group ${
          disabled ? 'opacity-60 cursor-not-allowed' : ''
        }`}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            id={inputId}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="peer sr-only"
          />
          <div
            className={`
              w-4 h-4 rounded-md border transition-all duration-150 flex items-center justify-center
              ${checked
                ? 'bg-[#4B7BEC] border-[#4B7BEC] text-white shadow-subtle'
                : 'bg-white border-[#DDE3EA] group-hover:border-[#4B7BEC]'
              }
              peer-focus-visible:ring-2 peer-focus-visible:ring-[#4B7BEC] peer-focus-visible:ring-offset-1
              ${error ? 'border-[#D95C5C]' : ''}
            `}
          >
            {checked && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
        </div>

        <div className="text-xs sm:text-sm text-[#18202B] leading-tight">
          {children || label}
        </div>
      </label>

      {error && (
        <p className="text-xs text-[#D95C5C] font-medium ml-6" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default Checkbox;
