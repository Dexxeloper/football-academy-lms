'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { StatCard } from '@/components/ui/StatCard';
import { CourseCard } from '@/components/ui/CourseCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { createClient } from '@/lib/supabase/client';
import { Course } from '@/types/database';
import {
  CURRENT_COACH,
  MOCK_CERTIFICATES,
  MOCK_ACTIVITIES,
} from '@/lib/mock-data';
import {
  BookOpen,
  Award,
  CheckCircle2,
  TrendingUp,
  Play,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export default function DashboardPage() {
  const { t } = useTranslation();
  const supabase = createClient();
  const [courses, setCourses] = useState<Course[]>([]);
  const [userProfile, setUserProfile] = useState({
    full_name: CURRENT_COACH.full_name,
    role: CURRENT_COACH.role,
    avatar_url: CURRENT_COACH.avatar_url!,
    academy_position: CURRENT_COACH.academy_position!,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        // Fetch current user
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          setUserProfile({
            full_name: profile?.full_name || user.user_metadata?.full_name || CURRENT_COACH.full_name,
            role: profile?.role || user.user_metadata?.role || CURRENT_COACH.role,
            avatar_url: profile?.avatar_url || CURRENT_COACH.avatar_url!,
            academy_position: profile?.academy_position || CURRENT_COACH.academy_position!,
          });
        }

        // Fetch courses from Supabase
        const { data: coursesData } = await supabase
          .from('courses')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (coursesData && coursesData.length > 0) {
          const coursesWithLessons = await Promise.all(
            coursesData.map(async (course) => {
              const { count } = await supabase
                .from('lessons')
                .select('*', { count: 'exact', head: true })
                .eq('course_id', course.id);

              return {
                ...course,
                total_lessons: count || 0,
                thumbnail_url: course.thumbnail_url || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
              } as Course;
            })
          );
          setCourses(coursesWithLessons);
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error('Dashboard data load error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [supabase]);

  const activeCourse = courses.length > 0 ? courses[0] : null;

  return (
    <BaseLayout>
      <div className="space-y-8">
        {/* Welcome Hero Card */}
        <div className="relative bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-green-500 shadow-md shrink-0">
                <Image
                  src={userProfile.avatar_url}
                  alt={userProfile.full_name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-1">
                  <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                    {t('dashboard.welcomeBack')}, {userProfile.full_name}!
                  </h1>
                  <Badge variant={userProfile.role === 'admin' ? 'purple' : 'green'}>
                    {userProfile.role}
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-gray-500">
                  {userProfile.academy_position}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1 text-green-700 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-600" /> {t('nav.coachTrack')}
                  </span>
                  <span>&bull;</span>
                  <span>{t('nav.season')}</span>
                </div>
              </div>
            </div>

            {activeCourse && (
              <Link
                href={`/courses/${activeCourse.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm shadow-green-600/20 shrink-0"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{t('dashboard.continueButton')}</span>
              </Link>
            )}
          </div>
        </div>

        {/* Overview Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t('dashboard.overallProgress')}
            value="67%"
            subtitle={`14 / 20 ${t('dashboard.lessonsCompleted')}`}
            icon={TrendingUp}
            accentColor="green"
          />
          <StatCard
            title={t('dashboard.coursesEnrolled')}
            value={courses.length}
            subtitle={`${courses.length} ${t('common.published')}`}
            icon={BookOpen}
            accentColor="blue"
          />
          <StatCard
            title={t('dashboard.coursesCompleted')}
            value="2"
            subtitle={t('common.completed')}
            icon={CheckCircle2}
            accentColor="purple"
          />
          <StatCard
            title={t('dashboard.certificates')}
            value={MOCK_CERTIFICATES.length}
            subtitle="UEFA Validated"
            icon={Award}
            accentColor="amber"
          />
        </div>

        {/* Active Current Course Widget */}
        {activeCourse ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-extrabold text-gray-900">{t('dashboard.continueLearning')}</h2>
              </div>
              <Badge variant="green">{t('common.inProgress')}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Image Preview with fixed aspect ratio */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-gray-200">
                <Image
                  src={activeCourse.thumbnail_url}
                  alt={activeCourse.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs font-bold text-green-800 bg-white/95 px-2.5 py-1 rounded-md shadow-sm">
                    {activeCourse.category}
                  </span>
                </div>
              </div>

              {/* Course Info & Progress */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">{activeCourse.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{activeCourse.description}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80 space-y-3">
                  <ProgressBar value={activeCourse.progress || 67} size="md" label={t('dashboard.overallProgress')} />
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                    <span>{t('dashboard.instructor')}: <strong className="text-gray-800">{activeCourse.instructor_name}</strong></span>
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-green-600" /> {activeCourse.duration_minutes} {t('common.minutes')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-1">
                  <Link
                    href={`/courses/${activeCourse.id}`}
                    className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-bold text-xs group"
                  >
                    <span>{t('dashboard.viewCurriculum')}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center shadow-sm">
            <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-gray-900 mb-1">{t('dashboard.noCourses')}</h3>
            <p className="text-xs text-gray-500">{t('dashboard.noCoursesDesc')}</p>
          </div>
        )}

        {/* Two Column Section: All Courses & Activity Log */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Courses Catalog Showcase (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-gray-900">{t('dashboard.academyCourses')}</h2>
              <Link href="/courses" className="text-xs font-bold text-green-700 hover:text-green-800 hover:underline">
                {t('dashboard.viewAllCourses')} &rarr;
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-10 bg-white border border-gray-200 rounded-2xl">
                <Loader2 className="w-6 h-6 text-green-600 animate-spin mx-auto mb-2" />
                <p className="text-xs text-gray-500">{t('common.loading')}</p>
              </div>
            ) : courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.slice(0, 4).map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white border border-gray-200 rounded-2xl p-6">
                <p className="text-xs text-gray-500">{t('dashboard.noCoursesDesc')}</p>
              </div>
            )}
          </div>

          {/* Right Column: Certificates & Recent Activity */}
          <div className="space-y-6">
            {/* Certificates Box */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-green-600" />
                  <span>{t('dashboard.earnedCertificates')}</span>
                </h3>
                <span className="text-xs text-gray-400 font-semibold">{MOCK_CERTIFICATES.length} Total</span>
              </div>

              <div className="space-y-3">
                {MOCK_CERTIFICATES.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/80 hover:border-green-300 transition-all flex items-start gap-3"
                  >
                    <div className="p-2 rounded-lg bg-green-100/70 text-green-700 shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 truncate">{cert.course_title}</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">Code: {cert.certificate_code}</p>
                      <p className="text-[10px] text-green-700 font-medium mt-1">Issued: {cert.issue_date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Log */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-600" />
                <span>{t('dashboard.recentActivity')}</span>
              </h3>

              <div className="space-y-4">
                {MOCK_ACTIVITIES.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-green-600 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-gray-700 font-medium">
                        <strong className="text-gray-900">{act.action}</strong>: {act.target}
                      </p>
                      <span className="text-[10px] text-gray-400">{act.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
