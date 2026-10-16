import React from 'react';

interface ProgressBarProps {
  value: number; // 0 - 100
  showLabel?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'emerald' | 'green' | 'blue';
}

export function ProgressBar({ value, showLabel = true, label, size = 'md', color = 'green' }: ProgressBarProps) {
  const safeValue = Math.min(100, Math.max(0, Math.round(value || 0)));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  const colorClasses = {
    emerald: 'bg-green-600',
    green: 'bg-green-600',
    blue: 'bg-blue-600',
  };

  const selectedColor = colorClasses[color] || colorClasses.green;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-semibold text-gray-600">
          <span>{label || 'Прогресс'}</span>
          <span className="text-green-700 font-bold">{safeValue}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${heightClasses[size]} border border-gray-200/80`}>
        <div
          className={`${heightClasses[size]} ${selectedColor} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${safeValue}%` }}
          role="progressbar"
          aria-valuenow={safeValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
