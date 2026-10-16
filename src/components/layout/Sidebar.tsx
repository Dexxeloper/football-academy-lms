'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Award,
  User,
  ShieldAlert,
  LogOut,
  Shield,
  ChevronRight,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/Badge';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useTranslation } from '@/lib/i18n';
import { CURRENT_COACH } from '@/lib/mock-data';

interface SidebarProps {
  onNavClick?: () => void;
  isMobile?: boolean;
}

export function Sidebar({ onNavClick, isMobile = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const supabase = createClient();

  const [userProfile, setUserProfile] = useState<{
    full_name: string;
    role: string;
    avatar_url: string;
    academy_position: string;
  }>({
    full_name: CURRENT_COACH.full_name,
    role: CURRENT_COACH.role,
    avatar_url: CURRENT_COACH.avatar_url!,
    academy_position: CURRENT_COACH.academy_position!,
  });

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          setUserProfile({
            full_name: profile?.full_name || user.user_metadata?.full_name || user.email || CURRENT_COACH.full_name,
            role: profile?.role || user.user_metadata?.role || CURRENT_COACH.role,
            avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url || CURRENT_COACH.avatar_url!,
            academy_position: profile?.academy_position || 'Academy Coach',
          });
        }
      } catch (err) {
        console.error('Sidebar user load error:', err);
      }
    }
    loadUser();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const navLinks = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('nav.courses'), href: '/courses', icon: BookOpen },
    { name: t('nav.myLearning'), href: '/my-learning', icon: GraduationCap },
    { name: t('nav.certificates'), href: '/certificates', icon: Award },
    { name: t('nav.profile'), href: '/profile', icon: User },
  ];

  // Admin link only for admin role
  if (userProfile.role === 'admin') {
    navLinks.push({ name: t('nav.admin'), href: '/admin', icon: ShieldAlert });
  }

  const containerClasses = isMobile
    ? 'flex flex-col h-full bg-white p-5'
    : 'w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] p-5';

  return (
    <aside className={containerClasses}>
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="pb-4 border-b border-gray-100">
          <Link
            href="/dashboard"
            onClick={onNavClick}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white shadow-sm shadow-green-600/30 group-hover:bg-green-700 transition-colors">
              <Shield className="w-5 h-5 fill-white stroke-white" />
            </div>
            <div className="min-w-0">
              <span className="font-black text-gray-900 text-sm tracking-tight block uppercase leading-none">
                Football Academy
              </span>
              <span className="text-[10px] font-bold tracking-widest text-green-700 uppercase">
                LMS Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-2">
            {t('nav.menu')}
          </p>
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onNavClick}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-green-50 text-green-700 font-extrabold border border-green-200/80 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
                    <span>{link.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-green-600" />}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Profile & Logout Area */}
      <div className="pt-4 border-t border-gray-100 space-y-4">
        {/* Language Switcher */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-medium text-gray-500">Язык / Lang:</span>
          <LanguageSwitcher />
        </div>

        {/* User preview card */}
        <Link
          href="/profile"
          onClick={onNavClick}
          className="p-2.5 rounded-xl bg-gray-50 border border-gray-200/80 hover:border-green-300 transition-all flex items-center gap-3 group"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-green-500/60 shrink-0">
            <Image
              src={userProfile.avatar_url}
              alt={userProfile.full_name}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-gray-900 truncate group-hover:text-green-700 transition-colors">
              {userProfile.full_name}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Badge variant={userProfile.role === 'admin' ? 'purple' : 'green'} size="sm">
                {userProfile.role}
              </Badge>
            </div>
          </div>
        </Link>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('nav.logout')}</span>
        </button>
      </div>
    </aside>
  );
}
