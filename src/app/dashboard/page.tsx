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

export default function DashboardPage() {
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
        {/* Hero Welcome Card */}
        <div className="relative bg-gradient-to-r from-navy-card via-slate-900 to-navy-dark border border-navy-border/80 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-emerald-500/80 shadow-xl shrink-0">
                <Image
                  src={userProfile.avatar_url}
                  alt={userProfile.full_name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Welcome back, {userProfile.full_name}!
                  </h1>
                  <Badge variant={userProfile.role === 'admin' ? 'purple' : 'emerald'}>
                    {userProfile.role}
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-slate-300">
                  {userProfile.academy_position}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> UEFA A License Track
                  </span>
                  <span>&bull;</span>
                  <span>Academy Season 2026/27</span>
                </div>
              </div>
            </div>

            {activeCourse && (
              <Link
                href={`/courses/${activeCourse.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-navy font-black rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 shrink-0"
              >
                <Play className="w-4 h-4 fill-navy" /> Resume Active Course
              </Link>
            )}
          </div>
        </div>

        {/* Overview Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Overall Progress"
            value="67%"
            subtitle="14 / 20 Lessons Completed"
            icon={TrendingUp}
            accentColor="emerald"
          />
          <StatCard
            title="Enrolled Courses"
            value={courses.length}
            subtitle={`${courses.length} Active in Database`}
            icon={BookOpen}
            accentColor="blue"
          />
          <StatCard
            title="Completed Courses"
            value="2"
            subtitle="Fully Certified"
            icon={CheckCircle2}
            accentColor="purple"
          />
          <StatCard
            title="Certificates"
            value={MOCK_CERTIFICATES.length}
            subtitle="UEFA Validated"
            icon={Award}
            accentColor="amber"
          />
        </div>

        {/* Active Current Course Widget */}
        {activeCourse ? (
          <div className="bg-navy-card border border-navy-border/90 rounded-3xl p-6 sm:p-8 shadow-xl relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-extrabold text-white">Current Active Course</h2>
              </div>
              <Badge variant="emerald">In Progress</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Image Preview */}
              <div className="relative aspect-video h-44 sm:h-48 md:h-52 w-full rounded-2xl overflow-hidden border border-slate-800">
                <Image
                  src={activeCourse.thumbnail_url}
                  alt={activeCourse.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs font-bold text-emerald-400 bg-navy/80 px-2.5 py-1 rounded-md border border-emerald-500/30">
                    {activeCourse.category}
                  </span>
                </div>
              </div>

              {/* Course Info & Progress */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h3 className="text-xl font-black text-white mb-2">{activeCourse.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{activeCourse.description}</p>
                </div>

                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <ProgressBar value={activeCourse.progress || 67} size="md" />
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>Instructor: <strong className="text-slate-200">{activeCourse.instructor_name}</strong></span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" /> {activeCourse.duration_minutes} Minutes
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-2">
                  <Link
                    href={`/courses/${activeCourse.id}`}
                    className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold text-xs group"
                  >
                    View Curriculum & Lessons
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-navy-card border border-navy-border/90 rounded-3xl p-6 text-center">
            <BookOpen className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-white mb-1">No Active Courses in Database</h3>
            <p className="text-xs text-slate-400">Head to the Admin control panel to create and publish courses.</p>
          </div>
        )}

        {/* Two Column Section: All Courses & Activity Log */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Courses Catalog Showcase (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-white">Academy Courses</h2>
              <Link href="/courses" className="text-xs font-bold text-emerald-400 hover:underline">
                View All Courses &rarr;
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-10 bg-navy-card border border-navy-border rounded-2xl">
                <Loader2 className="w-6 h-6 text-emerald-400 animate-spin mx-auto mb-2" />
                <p className="text-xs text-slate-400">Loading courses...</p>
              </div>
            ) : courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.slice(0, 4).map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-navy-card border border-navy-border rounded-2xl p-6">
                <p className="text-xs text-slate-400">No published courses found in Supabase.</p>
              </div>
            )}
          </div>

          {/* Right Column: Certificates & Recent Activity */}
          <div className="space-y-6">
            {/* Certificates Box */}
            <div className="bg-navy-card border border-navy-border/80 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" /> Earned Certificates
                </h3>
                <span className="text-xs text-slate-400 font-semibold">{MOCK_CERTIFICATES.length} Total</span>
              </div>

              <div className="space-y-3">
                {MOCK_CERTIFICATES.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/30 transition-all flex items-start gap-3"
                  >
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{cert.course_title}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Code: {cert.certificate_code}</p>
                      <p className="text-[10px] text-emerald-400 font-medium mt-1">Issued: {cert.issue_date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Log */}
            <div className="bg-navy-card border border-navy-border/80 rounded-2xl p-5 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" /> Recent Activity
              </h3>

              <div className="space-y-4">
                {MOCK_ACTIVITIES.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-slate-200 font-medium">
                        <strong className="text-white">{act.action}</strong>: {act.target}
                      </p>
                      <span className="text-[10px] text-slate-400">{act.timestamp}</span>
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
