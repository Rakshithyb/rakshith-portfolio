import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'draft' | 'published' | 'accent';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const variantStyles = {
    default: 'bg-zinc-100 text-zinc-800 border-zinc-200',
    outline: 'bg-transparent text-zinc-600 border-zinc-300',
    draft: 'bg-amber-50 text-amber-800 border-amber-200',
    published: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    accent: 'bg-zinc-900 text-white border-zinc-900',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono border tracking-tight ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
