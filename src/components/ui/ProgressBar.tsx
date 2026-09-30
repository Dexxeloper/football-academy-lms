import React from 'react';

interface ProgressBarProps {
  value: number; // 0 - 100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'emerald' | 'blue';
}

export function ProgressBar({ value, showLabel = true, size = 'md', color = 'emerald' }: ProgressBarProps) {
  const safeValue = Math.min(100, Math.max(0, value));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colorClasses = {
    emerald: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]',
    blue: 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-300">
          <span>Completion Progress</span>
          <span className="text-emerald-400 font-bold">{safeValue}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden ${heightClasses[size]} border border-slate-700/50`}>
        <div
          className={`${heightClasses[size]} ${colorClasses[color]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
