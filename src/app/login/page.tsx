'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Shield, Lock, Mail, UserCheck, ChevronRight, UserPlus, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useTranslation } from '@/lib/i18n';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const { t } = useTranslation();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'coach' | 'admin' | 'student'>('coach');
  const [showPassword, setShowPassword] = useState(false);
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
          setSuccessMessage(t('auth.accountCreated'));
          setTimeout(() => {
            if (role === 'admin') {
              router.push('/admin');
            } else {
              router.push('/dashboard');
            }
          }, 800);
        } else {
          setSuccessMessage(t('auth.confirmationSent'));
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
    setErrorMessage(null);
  };

  const fillDemoAdmin = () => {
    setMode('signin');
    setEmail('elena.rostova@footballacademy.com');
    setPassword('adminsecret123');
    setRole('admin');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-surface text-gray-900 flex flex-col items-center justify-center p-4 relative antialiased">
      {/* Top Language Bar */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xl relative z-10 my-8">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-green-50 border border-green-200 text-green-700 mb-3 shadow-sm">
            <Shield className="w-7 h-7 fill-green-600 stroke-green-600" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            FOOTBALL ACADEMY LMS
          </h1>
          <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">
            {t('auth.portalSubtitle')}
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl border border-gray-200 mb-6">
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMessage(null); }}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signin'
                ? 'bg-white text-green-700 shadow-sm border border-gray-200/80 font-extrabold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <UserCheck className="w-4 h-4" /> {t('auth.signIn')}
          </button>

          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMessage(null); }}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signup'
                ? 'bg-white text-green-700 shadow-sm border border-gray-200/80 font-extrabold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <UserPlus className="w-4 h-4" /> {t('auth.signUp')}
          </button>
        </div>

        {/* Demo Quick Select Buttons */}
        {mode === 'signin' && (
          <div className="mb-6 p-3 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-2">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">
              {t('auth.demoAccounts')}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillDemoCoach}
                className="p-2 rounded-xl text-xs font-bold transition-all text-left flex items-center gap-2 bg-white border border-gray-200 hover:border-green-400 text-gray-700 hover:text-green-700 shadow-xs"
              >
                <UserCheck className="w-4 h-4 shrink-0 text-green-600" />
                <div className="min-w-0">
                  <div className="truncate font-semibold text-gray-900">Marcus Vance</div>
                  <div className="text-[10px] text-gray-500 font-normal">{t('auth.coach')}</div>
                </div>
              </button>

              <button
                type="button"
                onClick={fillDemoAdmin}
                className="p-2 rounded-xl text-xs font-bold transition-all text-left flex items-center gap-2 bg-white border border-gray-200 hover:border-purple-400 text-gray-700 hover:text-purple-700 shadow-xs"
              >
                <Shield className="w-4 h-4 shrink-0 text-purple-600" />
                <div className="min-w-0">
                  <div className="truncate font-semibold text-gray-900">Elena Rostova</div>
                  <div className="text-[10px] text-gray-500 font-normal">{t('auth.administrator')}</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Notifications */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2 animate-in fade-in">
            <UserCheck className="w-4 h-4 shrink-0 text-green-600" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                {t('auth.fullName')}
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 rounded-xl py-2.5 px-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all shadow-xs"
                placeholder="Coach Alex Smith"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              {t('auth.email')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all shadow-xs"
                placeholder="coach@academy.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              {t('auth.password')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 rounded-xl py-2.5 pl-10 pr-10 text-sm text-gray-900 outline-none transition-all shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
                title={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                {t('auth.role')}
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'coach' | 'admin' | 'student')}
                className="w-full bg-white border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 rounded-xl py-2.5 px-3.5 text-sm text-gray-900 outline-none transition-all shadow-xs"
              >
                <option value="coach">{t('auth.roleCoach')}</option>
                <option value="admin">{t('auth.roleAdmin')}</option>
                <option value="student">{t('auth.roleStudent')}</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-5 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-xl text-sm transition-all shadow-md shadow-green-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading
              ? t('auth.processing')
              : mode === 'signin'
              ? t('auth.signInButton')
              : t('auth.signUpButton')}
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
          Football Academy LMS &bull; {t('auth.credentialsSecurity')}
        </div>
      </div>
    </div>
  );
}
