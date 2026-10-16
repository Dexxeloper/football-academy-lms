import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, icon: Icon, badge, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-200/80 flex items-center justify-center text-green-700 shrink-0">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h1>
          {badge && <div className="ml-1">{badge}</div>}
        </div>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>

      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
}
