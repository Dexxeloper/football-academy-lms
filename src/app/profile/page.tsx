'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { createClient } from '@/lib/supabase/client';
import { CURRENT_COACH, MOCK_CERTIFICATES, MOCK_COURSES } from '@/lib/mock-data';
import { User, Mail, ShieldCheck, Award, BookOpen, CheckCircle2, Clock, FileCheck, LogOut } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export default function ProfilePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState({
    full_name: CURRENT_COACH.full_name,
    email: CURRENT_COACH.email,
    role: CURRENT_COACH.role,
    avatar_url: CURRENT_COACH.avatar_url!,
    academy_position: CURRENT_COACH.academy_position!,
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: dbProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          setProfile({
            full_name: dbProfile?.full_name || user.user_metadata?.full_name || user.email || CURRENT_COACH.full_name,
            email: dbProfile?.email || user.email || CURRENT_COACH.email,
            role: dbProfile?.role || user.user_metadata?.role || CURRENT_COACH.role,
            avatar_url: dbProfile?.avatar_url || user.user_metadata?.avatar_url || CURRENT_COACH.avatar_url!,
            academy_position: dbProfile?.academy_position || CURRENT_COACH.academy_position!,
          });
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
      }
    }
    fetchUser();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const completedCourses = MOCK_COURSES.filter((c) => c.progress === 100);

  return (
    <BaseLayout>
      <div className="space-y-8">
        <PageHeader
          icon={User}
          title={t('profile.title')}
          subtitle={t('profile.subtitle')}
        />

        {/* Profile Header Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-green-500 shadow-md shrink-0">
              <Image
                src={profile.avatar_url}
                alt={profile.full_name}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h2 className="text-2xl font-black text-gray-900">{profile.full_name}</h2>
                <Badge variant={profile.role === 'admin' ? 'purple' : 'green'}>{profile.role}</Badge>
              </div>

              <p className="text-xs text-gray-500 font-medium">{profile.academy_position}</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-500 pt-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-green-600" /> {profile.email}
                </span>
                <span className="flex items-center gap-1.5 font-medium text-green-700">
                  <ShieldCheck className="w-3.5 h-3.5" /> UEFA A License Credential
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs border border-rose-200 transition-colors shadow-2xs shrink-0"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('profile.signOut')}</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
            <BookOpen className="w-5 h-5 text-green-600 mb-2" />
            <div className="text-2xl font-black text-gray-900">5</div>
            <div className="text-xs text-gray-500 mt-0.5">{t('profile.totalEnrolled')}</div>
          </div>

          <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mb-2" />
            <div className="text-2xl font-black text-gray-900">{completedCourses.length}</div>
            <div className="text-xs text-gray-500 mt-0.5">{t('profile.completedCourses')}</div>
          </div>

          <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
            <Award className="w-5 h-5 text-amber-600 mb-2" />
            <div className="text-2xl font-black text-gray-900">{MOCK_CERTIFICATES.length}</div>
            <div className="text-xs text-gray-500 mt-0.5">{t('profile.certificatesEarned')}</div>
          </div>

          <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
            <Clock className="w-5 h-5 text-purple-600 mb-2" />
            <div className="text-2xl font-black text-gray-900">42 {t('profile.hours')}</div>
            <div className="text-xs text-gray-500 mt-0.5">{t('profile.studyTime')}</div>
          </div>
        </div>

        {/* Certificates Gallery */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-green-600" />
              <span>{t('profile.officialCertificates')}</span>
            </h3>
            <Badge variant="green">{MOCK_CERTIFICATES.length} Valid Credentials</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_CERTIFICATES.map((cert) => (
              <div
                key={cert.id}
                className="p-6 rounded-2xl bg-gray-50 border border-gray-200 hover:border-green-300 transition-all space-y-4 shadow-2xs relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-green-100 text-green-700 border border-green-200/60">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-gray-600 bg-white border border-gray-200 px-2.5 py-1 rounded-md shadow-2xs">
                    {cert.certificate_code}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                    {cert.course_title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">Issued to {cert.user_name}</p>
                </div>

                <div className="pt-3 border-t border-gray-200/80 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Date: <strong className="text-gray-800">{cert.issue_date}</strong></span>
                  <button
                    type="button"
                    onClick={() => alert(`Certificate Code ${cert.certificate_code} verified for ${cert.course_title}`)}
                    className="text-green-700 hover:underline font-bold flex items-center gap-1"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>{t('certificates.verifyCertificate')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Courses List */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>{t('profile.completedModules')}</span>
          </h3>

          <div className="space-y-3">
            {completedCourses.map((course) => (
              <div
                key={course.id}
                className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{course.title}</h4>
                  <p className="text-gray-500 mt-0.5">{course.category} &bull; {course.total_lessons} {t('common.lessons')}</p>
                </div>
                <Badge variant="green">100% {t('common.completed')}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
