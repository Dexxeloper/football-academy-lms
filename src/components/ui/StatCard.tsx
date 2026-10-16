import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  accentColor?: 'emerald' | 'green' | 'blue' | 'purple' | 'amber';
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, accentColor = 'green' }: StatCardProps) {
  const iconColorStyles = {
    emerald: 'bg-green-50 text-green-700 border-green-200/60',
    green: 'bg-green-50 text-green-700 border-green-200/60',
    blue: 'bg-blue-50 text-blue-700 border-blue-200/60',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/60',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/60',
  };

  const selectedColor = iconColorStyles[accentColor] || iconColorStyles.green;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-green-400/80 transition-all shadow-sm group">
      <div className="flex items-center justify-between">
        <div className="min-w-0 pr-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1 truncate">{title}</p>
          <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-1 truncate">{subtitle}</p>}
          {trend && <p className="text-xs text-green-600 font-semibold mt-1">{trend}</p>}
        </div>
        <div className={`p-3 rounded-xl border ${selectedColor} shrink-0 group-hover:scale-105 transition-transform`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
