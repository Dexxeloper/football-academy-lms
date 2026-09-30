'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Shield, Lock, Mail, UserCheck, ChevronRight, UserPlus, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'coach' | 'admin' | 'student'>('coach');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // If real Supabase auth returns an error, show it clearly
          setErrorMessage(error.message);
          setLoading(false);
          return;
        }

        const userRole = data.user?.user_metadata?.role || 'coach';
        if (userRole === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        // Sign Up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: role,
            },
          },
        });

        if (error) {
          setErrorMessage(error.message);
          setLoading(false);
          return;
        }

        if (data.session) {
          setSuccessMessage('Account created and signed in successfully!');
          setTimeout(() => {
            if (role === 'admin') {
              router.push('/admin');
            } else {
              router.push('/dashboard');
            }
          }, 800);
        } else {
          setSuccessMessage('Registration successful! Please check your email for confirmation or sign in.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCoach = () => {
    setMode('signin');
    setEmail('marcus.vance@footballacademy.com');
    setPassword('coachsecret123');
    setRole('coach');
  };

  const fillDemoAdmin = () => {
    setMode('signin');
    setEmail('elena.rostova@footballacademy.com');
    setPassword('adminsecret123');
    setRole('admin');
  };

  return (
    <div className="min-h-screen bg-navy text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-navy-card border border-navy-border/90 rounded-3xl p-8 shadow-2xl relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-3 shadow-lg shadow-emerald-500/10">
            <Shield className="w-8 h-8 fill-emerald-400/20 stroke-emerald-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">FOOTBALL ACADEMY LMS</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-widest">
            UEFA Coach & Admin Auth Portal
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMessage(null); }}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signin'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" /> Sign In
          </button>

          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMessage(null); }}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signup'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" /> Sign Up
          </button>
        </div>

        {/* Demo Quick Select Buttons */}
        {mode === 'signin' && (
          <div className="mb-6 p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
              Demo Account Quick Switch
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillDemoCoach}
                className="p-2 rounded-xl text-xs font-bold transition-all text-left flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
              >
                <UserCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                <div>
                  <div className="truncate font-semibold">Marcus Vance</div>
                  <div className="text-[10px] opacity-75 font-normal">Coach Role</div>
                </div>
              </button>

              <button
                type="button"
                onClick={fillDemoAdmin}
                className="p-2 rounded-xl text-xs font-bold transition-all text-left flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
              >
                <Shield className="w-4 h-4 shrink-0 text-purple-400" />
                <div>
                  <div className="truncate font-semibold">Elena Rostova</div>
                  <div className="text-[10px] opacity-75 font-normal">Admin Role</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Notifications */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <UserCheck className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-500 outline-none transition-all"
                placeholder="Coach Alex Smith"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all"
                placeholder="coach@academy.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white outline-none transition-all"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Academy Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'coach' | 'admin' | 'student')}
                className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl py-2.5 px-4 text-sm text-white outline-none transition-all"
              >
                <option value="coach">Coach (Default)</option>
                <option value="admin">Administrator</option>
                <option value="student">Academy Student</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-navy font-black rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading
              ? 'Processing...'
              : mode === 'signin'
              ? 'Sign In to Portal'
              : 'Create Academy Account'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Football Academy LMS &bull; Powered by Supabase Auth & RLS
        </div>
      </div>
    </div>
  );
}
