import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  accentColor?: 'emerald' | 'blue' | 'purple' | 'amber';
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, accentColor = 'emerald' }: StatCardProps) {
  const iconColorStyles = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <div className="bg-navy-card border border-navy-border/60 rounded-xl p-5 hover:border-emerald-500/30 transition-all shadow-lg group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{title}</p>
          <h3 className="text-2xl font-extrabold text-white tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          {trend && <p className="text-xs text-emerald-400 font-medium mt-1">{trend}</p>}
        </div>
        <div className={`p-3 rounded-xl border ${iconColorStyles[accentColor]} group-hover:scale-105 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
