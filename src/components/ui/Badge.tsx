import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'green' | 'blue' | 'purple' | 'amber' | 'slate' | 'gray' | 'red';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'green', size = 'sm', className }: BadgeProps) {
  const variantStyles = {
    emerald: 'bg-green-50 text-green-700 border-green-200/90 font-semibold',
    green: 'bg-green-50 text-green-700 border-green-200/90 font-semibold',
    blue: 'bg-blue-50 text-blue-700 border-blue-200 font-semibold',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 font-semibold',
    amber: 'bg-amber-50 text-amber-800 border-amber-200 font-semibold',
    slate: 'bg-gray-100 text-gray-700 border-gray-200 font-medium',
    gray: 'bg-gray-100 text-gray-700 border-gray-200 font-medium',
    red: 'bg-red-50 text-red-700 border-red-200 font-semibold',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center rounded-full border tracking-wide uppercase',
          variantStyles[variant] || variantStyles.green,
          sizeStyles[size],
          className
        )
      )}
    >
      {children}
    </span>
  );
}
