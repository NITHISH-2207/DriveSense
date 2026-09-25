import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from './Input';

/**
 * Open Canvas PasswordInput with Lucide SVG eye toggle.
 */
export const PasswordInput = forwardRef(({
  label = 'Password',
  id,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  placeholder = 'Enter your password',
  required = false,
  helperText,
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      ref={ref}
      id={id}
      type={showPassword ? 'text' : 'password'}
      label={label}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      error={error}
      placeholder={placeholder}
      required={required}
      helperText={helperText}
      rightIcon={
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="p-1 text-[#66736F] hover:text-[#176B5B] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#176B5B] rounded transition-colors"
          title={showPassword ? 'Hide password' : 'Show password'}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={0}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" strokeWidth={1.8} />
          ) : (
            <Eye className="w-4 h-4" strokeWidth={1.8} />
          )}
        </button>
      }
      className={className}
      {...props}
    />
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
