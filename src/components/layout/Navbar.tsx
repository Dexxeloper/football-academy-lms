'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CURRENT_COACH } from '@/lib/mock-data';
import { Shield, Bell, Menu, X, LogOut, User, LayoutDashboard, BookOpen, ShieldAlert } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Try loading profile from DB
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
    }
    loadUser();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Admin', href: '/admin', icon: ShieldAlert },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-navy/90 backdrop-blur-md border-b border-navy-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-navy font-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Shield className="w-6 h-6 fill-navy stroke-navy" />
              </div>
              <div>
                <span className="font-black text-white text-base tracking-wider uppercase block leading-none">
                  FOOTBALL ACADEMY
                </span>
                <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                  COACH LEARNING SYSTEM
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action & Profile */}
          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
            </button>

            <div className="h-6 w-px bg-slate-800" />

            <Link href="/profile" className="flex items-center gap-3 pl-1 group">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-emerald-500/50 group-hover:border-emerald-400 transition-colors">
                <Image
                  src={userProfile.avatar_url}
                  alt={userProfile.full_name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {userProfile.full_name}
                </div>
                <div className="text-[10px] text-slate-400">
                  <Badge variant={userProfile.role === 'admin' ? 'purple' : 'emerald'} size="sm">
                    {userProfile.role}
                  </Badge>
                </div>
              </div>
            </Link>

            <button
              onClick={handleSignOut}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-card border-b border-navy-border p-4 space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500">
              <Image src={userProfile.avatar_url} alt={userProfile.full_name} fill className="object-cover" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{userProfile.full_name}</div>
              <div className="text-xs text-slate-400">{userProfile.academy_position}</div>
            </div>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800"
                >
                  <Icon className="w-5 h-5 text-emerald-400" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => { setMobileMenuOpen(false); handleSignOut(); }}
              className="flex items-center gap-2 text-rose-400 text-sm font-semibold px-3 py-2 w-full text-left"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
