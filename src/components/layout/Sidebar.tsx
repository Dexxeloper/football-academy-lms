'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, User, ShieldAlert, Award, FileText, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Course Catalog', href: '/courses', icon: BookOpen },
    { name: 'Coach Profile', href: '/profile', icon: User },
    { name: 'Admin Portal', href: '/admin', icon: ShieldAlert },
  ];

  return (
    <aside className="w-64 bg-navy-card border-r border-navy-border hidden lg:flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] p-4">
      <div className="space-y-6">
        {/* Navigation Group */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">Main Navigation</p>
          <div className="space-y-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Stats Panel */}
        <div className="p-4 bg-navy-dark/70 rounded-xl border border-navy-border/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-400" /> Active License
            </span>
            <Badge variant="emerald" size="sm">UEFA A</Badge>
          </div>
          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Completed Modules</span>
              <span className="font-bold text-white">14 / 20</span>
            </div>
            <div className="flex justify-between">
              <span>Certificates Earned</span>
              <span className="font-bold text-emerald-400">2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 text-center">
        <p className="font-bold text-slate-300">Football Academy LMS v1.0</p>
        <p className="mt-0.5">UEFA Coaching Curriculum</p>
      </div>
    </aside>
  );
}
