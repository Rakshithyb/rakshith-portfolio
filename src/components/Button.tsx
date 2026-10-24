import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded';

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-1.5 text-xs font-mono tracking-tight gap-2',
    lg: 'px-5 py-2.5 text-sm gap-2',
  };

  const variantStyles = {
    primary: 'bg-[#0F0F0F] text-[#FFFFFF] hover:bg-[#2B2B2B] border border-[#0F0F0F]',
    secondary: 'bg-[#FFFFFF] text-[#171717] hover:bg-[#DEDEDE] border border-[#D0D0D0]',
    outline: 'bg-transparent text-[#171717] hover:bg-[#DEDEDE] border border-[#D0D0D0]',
    danger: 'bg-[#2B2B2B] text-[#FFFFFF] hover:bg-[#0F0F0F] border border-[#363636]',
    ghost: 'bg-transparent text-[#4D4D4D] hover:text-[#171717] hover:bg-[#DEDEDE] border border-transparent',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
