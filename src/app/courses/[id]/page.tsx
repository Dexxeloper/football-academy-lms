'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { createClient } from '@/lib/supabase/client';
import { Course, Lesson } from '@/types/database';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  PlayCircle,
  ChevronRight,
  ArrowLeft,
  HelpCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export default function CourseDetailsPage() {
  const params = useParams();
  const courseId = params.id as string;
  const supabase = createClient();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourseDetails() {
      setLoading(true);
      setErrorMsg(null);

      try {
        // 1. Fetch Course from Supabase
        const { data: courseData, error: courseErr } = await supabase
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .maybeSingle();

        if (courseErr) {
          console.error('Error fetching course:', courseErr);
          setErrorMsg('Failed to load course details from Supabase.');
          setLoading(false);
          return;
        }

        if (!courseData) {
          setErrorMsg('Course not found in database.');
          setLoading(false);
          return;
        }

        setCourse(courseData as Course);

        // 2. Fetch Lessons for this course ordered by position
        const { data: lessonsData, error: lessonsErr } = await supabase
          .from('lessons')
          .select('*')
          .eq('course_id', courseId)
          .order('position', { ascending: true });

        if (lessonsErr) {
          console.error('Error fetching lessons:', lessonsErr);
        } else {
          setLessons((lessonsData || []) as Lesson[]);
        }
      } catch (err: any) {
        console.error('Supabase query error:', err);
        setErrorMsg('Error loading course curriculum.');
      } finally {
        setLoading(false);
      }
    }

    if (courseId) {
      loadCourseDetails();
    }
  }, [courseId, supabase]);

  if (loading) {
    return (
      <BaseLayout>
        <div className="text-center py-20 bg-navy-card border border-navy-border rounded-3xl">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Loading Course Details...</p>
        </div>
      </BaseLayout>
    );
  }

  if (errorMsg || !course) {
    return (
      <BaseLayout>
        <div className="space-y-6">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Link>
          <div className="text-center py-16 bg-navy-card border border-navy-border rounded-3xl p-8">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">{errorMsg || 'Course Not Found'}</h3>
            <p className="text-xs text-slate-400 mb-6">The requested course could not be retrieved from the database.</p>
            <Link
              href="/courses"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-navy font-bold rounded-xl text-xs transition-colors"
            >
              Browse Available Courses
            </Link>
          </div>
        </div>
      </BaseLayout>
    );
  }

  const completedCount = lessons.filter((l) => l.completed).length;
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;
  const thumbnail = course.thumbnail_url || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80';

  return (
    <BaseLayout>
      <div className="space-y-8">
        {/* Back Button */}
        <div>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Link>
        </div>

        {/* Hero Header */}
        <div className="bg-navy-card border border-navy-border/90 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Controlled Hero Banner Image */}
          <div className="relative aspect-video w-full max-h-56 sm:max-h-64 md:max-h-72 rounded-2xl overflow-hidden border border-slate-800 mb-6">
            <Image
              src={thumbnail}
              alt={course.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-card via-transparent to-black/20" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="emerald">{course.category}</Badge>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" /> {course.duration_minutes} Mins
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> {lessons.length} Lessons
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{course.title}</h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{course.description}</p>

              {/* Instructor Card */}
              <div className="flex items-center gap-3 pt-2">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-emerald-500/50">
                  <Image
                    src={course.instructor_avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                    alt={course.instructor_name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{course.instructor_name}</div>
                  <div className="text-[10px] text-slate-400">{course.instructor_role || 'Lead Instructor'}</div>
                </div>
              </div>
            </div>

            {/* Right Card: Progress & Primary CTA */}
            <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Your Progress</h3>
                <ProgressBar value={progressPercent} size="lg" />
                <p className="text-[11px] text-slate-400 mt-2 font-medium">
                  {completedCount} of {lessons.length} lessons marked completed
                </p>
              </div>

              {lessons.length > 0 ? (
                <Link
                  href={`/courses/${course.id}/lessons/${lessons[0].id}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-navy font-black rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20"
                >
                  <PlayCircle className="w-5 h-5 fill-navy stroke-emerald-500" />
                  {progressPercent === 100 ? 'Review Lessons' : progressPercent > 0 ? 'Continue Course' : 'Start Course'}
                </Link>
              ) : (
                <div className="p-3 bg-slate-800/80 rounded-xl text-center text-xs text-slate-400 font-medium">
                  No lessons available in this course yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lesson Curriculum List */}
        <div className="bg-navy-card border border-navy-border/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" /> Course Curriculum & Lessons
            </h2>
            <span className="text-xs text-emerald-400 font-bold">{completedCount} / {lessons.length} Completed</span>
          </div>

          {lessons.length > 0 ? (
            <div className="space-y-3">
              {lessons.map((lesson, idx) => (
                <Link
                  key={lesson.id}
                  href={`/courses/${course.id}/lessons/${lesson.id}`}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 group ${
                    lesson.completed
                      ? 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/40'
                      : 'bg-navy-dark/90 border-slate-800/80 hover:border-emerald-500'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                        lesson.completed
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-300 group-hover:bg-emerald-500 group-hover:text-navy'
                      }`}
                    >
                      {lesson.completed ? <CheckCircle2 className="w-5 h-5" /> : lesson.position || idx + 1}
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                        {lesson.title}
                      </h3>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{lesson.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 text-xs text-slate-400">
                    {lesson.has_quiz && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-md">
                        <HelpCircle className="w-3 h-3" /> Quiz Included
                      </span>
                    )}
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-500" /> {lesson.duration_minutes}m
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-slate-400">
              No lessons have been added to this course curriculum yet.
            </div>
          )}
        </div>
      </div>
    </BaseLayout>
  );
}
