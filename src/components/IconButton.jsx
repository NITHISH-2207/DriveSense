import React from 'react';

/**
 * Reusable IconButton component
 */
export const IconButton = ({
  icon,
  onClick,
  ariaLabel,
  title,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4B7BEC] disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    ghost: 'text-[#687384] hover:text-[#18202B] hover:bg-[#EAF1FF]',
    outline: 'border border-[#DDE3EA] bg-white text-[#18202B] hover:bg-[#F5F7FA]',
    primary: 'bg-[#4B7BEC] text-white hover:bg-[#3867D6]',
  };

  const sizes = {
    sm: 'w-7 h-7 p-1',
    md: 'w-9 h-9 p-2',
    lg: 'w-11 h-11 p-2.5',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || title}
      title={title || ariaLabel}
      className={`${baseStyles} ${variants[variant] || variants.ghost} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
};

export default IconButton;
