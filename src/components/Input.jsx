import React, { forwardRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Open Canvas Input:
 * Editorial baseline input featuring a thin bottom border rule rather than a boxed container.
 * Transitions smoothly on focus with an active baseline indicator.
 */
export const Input = forwardRef(({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  isValid = false,
  helperText,
  rightIcon,
  required = false,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <div className={`w-full flex flex-col group text-left ${className}`}>
      {/* Label with generous spacing */}
      {label && (
        <label
          htmlFor={inputId}
          className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-150 mb-1.5 ${
            error
              ? 'text-[#D86666]'
              : isFocused
              ? 'text-[#176B5B]'
              : 'text-[#66736F]'
          }`}
        >
          {label}
          {required && <span className="text-[#D86666] ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      {/* Input Row sitting directly on the canvas */}
      <div className="relative flex items-center">
        <input
          ref={ref}
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          className={`
            w-full py-2.5 px-0 text-base sm:text-lg bg-transparent text-[#1F2927] placeholder:text-[#66736F]/40
            focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
            ${rightIcon ? 'pr-8' : ''}
          `}
          {...props}
        />

        {/* Right Icon (e.g. password toggle or valid mark) */}
        {rightIcon && (
          <div className="absolute right-0 flex items-center text-[#66736F]">
            {rightIcon}
          </div>
        )}
      </div>

      {/* Baseline rule */}
      <div className="relative w-full h-[1px] bg-[#DCE7E3]">
        {/* Animated active focus underline */}
        <motion.div
          className={`absolute inset-0 origin-left ${
            error ? 'bg-[#D86666]' : 'bg-[#176B5B]'
          }`}
          initial={{ scaleX: 0 }}
          animate={{
            scaleX: isFocused || error ? 1 : 0,
          }}
          transition={{
            duration: shouldReduceMotion ? 0.01 : 0.25,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ height: '2px', top: '-0.5px' }}
        />
      </div>

      {/* Inline friendly error feedback */}
      {error && (
        <p
          id={`${inputId}-error`}
          className="text-xs text-[#D86666] font-medium mt-1.5"
          role="alert"
        >
          {error}
        </p>
      )}

      {!error && helperText && (
        <p
          id={`${inputId}-helper`}
          className="text-xs text-[#66736F] mt-1.5"
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
