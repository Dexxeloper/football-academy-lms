'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CURRENT_COACH } from '@/lib/mock-data';
import { Shield, Menu, X, LogOut, User } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { Sidebar } from './Sidebar';
import { useTranslation } from '@/lib/i18n';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
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

  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

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
        console.error('Navbar user load error:', err);
      }
    }
    loadUser();
  }, [supabase]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Mobile Toggle & Brand (on mobile) / Title (on desktop) */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <Link href="/dashboard" className="flex items-center gap-2.5 lg:hidden">
                <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center text-white shadow-sm shadow-green-600/30">
                  <Shield className="w-5 h-5 fill-white stroke-white" />
                </div>
                <span className="font-extrabold text-gray-900 text-sm tracking-tight uppercase">
                  Football Academy
                </span>
              </Link>

              {/* Desktop breadcrumb / current section subtitle */}
              <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-gray-500">
                <span className="w-2 h-2 rounded-full bg-green-600 inline-block" />
                <span>UEFA Coaching & Tactical Education Platform</span>
              </div>
            </div>

            {/* Right: Language Switcher, User & Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              <LanguageSwitcher />

              <div className="h-5 w-px bg-gray-200" />

              <Link href="/profile" className="flex items-center gap-2.5 group">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-green-500/80 group-hover:border-green-600 transition-colors shadow-sm">
                  <Image
                    src={userProfile.avatar_url}
                    alt={userProfile.full_name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-gray-900 group-hover:text-green-700 transition-colors truncate max-w-[130px]">
                    {userProfile.full_name}
                  </div>
                  <div className="text-[10px]">
                    <Badge variant={userProfile.role === 'admin' ? 'purple' : 'green'} size="sm">
                      {userProfile.role}
                    </Badge>
                  </div>
                </div>
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title={t('nav.logout')}
                aria-label={t('nav.logout')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[80vw] h-full bg-white shadow-2xl z-10 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200">
            <div className="p-4 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white">
                  <Shield className="w-4 h-4 fill-white" />
                </div>
                <span className="font-bold text-xs uppercase text-gray-900 tracking-tight">
                  Football Academy
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1">
              <Sidebar onNavClick={() => setMobileMenuOpen(false)} isMobile />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
