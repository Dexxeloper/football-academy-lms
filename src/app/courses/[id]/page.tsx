'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
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
import { useTranslation } from '@/lib/i18n';

const FALLBACK_THUMBNAIL = 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80';

export default function CourseDetailsPage() {
  const params = useParams();
  const courseId = params.id as string;
  const supabase = createClient();
  const { t } = useTranslation();

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
          setErrorMsg(t('courseDetail.courseNotFound'));
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
  }, [courseId, supabase, t]);

  if (loading) {
    return (
      <BaseLayout>
        <div className="text-center py-20 bg-white border border-gray-200 rounded-3xl shadow-sm">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{t('common.loading')}</p>
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
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t('courseDetail.backToCourses')}
          </Link>

          <EmptyState
            icon={AlertCircle}
            title={errorMsg || t('courseDetail.courseNotFound')}
            description={t('courseDetail.courseNotFoundDesc')}
            action={
              <Link
                href="/courses"
                className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
              >
                {t('courseDetail.browseCourses')}
              </Link>
            }
          />
        </div>
      </BaseLayout>
    );
  }

  const completedCount = lessons.filter((l) => l.completed).length;
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;
  const thumbnail = course.thumbnail_url || FALLBACK_THUMBNAIL;

  return (
    <BaseLayout>
      <div className="space-y-8">
        {/* Back Button */}
        <div>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t('courseDetail.backToCourses')}
          </Link>
        </div>

        {/* Hero Header */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          {/* Controlled Hero Banner Image */}
          <div className="relative aspect-video w-full max-h-56 sm:max-h-64 md:max-h-80 rounded-2xl overflow-hidden border border-gray-200 mb-6">
            <Image
              src={thumbnail}
              alt={course.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90" />
            
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex flex-wrap gap-2">
              <Badge variant="green" size="md" className="bg-white/95 text-green-800 shadow-sm border-white/60">
                {course.category}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-green-600" /> {course.duration_minutes} {t('common.minutes')}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-green-600" /> {lessons.length} {t('common.lessons')}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                {course.title}
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed">
                {course.description}
              </p>

              {/* Instructor Card */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-green-500 shrink-0">
                  <Image
                    src={course.instructor_avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                    alt={course.instructor_name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">{course.instructor_name}</div>
                  <div className="text-[11px] text-gray-500">{course.instructor_role || t('courseDetail.instructor')}</div>
                </div>
              </div>
            </div>

            {/* Right Card: Progress & Primary CTA */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200/90 space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  {t('courseDetail.yourProgress')}
                </h3>
                <ProgressBar value={progressPercent} size="lg" label={t('common.inProgress')} />
                <p className="text-xs text-gray-500 mt-2 font-medium">
                  {completedCount} / {lessons.length} {t('courseDetail.lessonsCompleted')}
                </p>
              </div>

              {lessons.length > 0 ? (
                <Link
                  href={`/courses/${course.id}/lessons/${lessons[0].id}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-green-600/20"
                >
                  <PlayCircle className="w-5 h-5 fill-white stroke-green-600" />
                  <span>
                    {progressPercent === 100
                      ? t('courseDetail.reviewCourse')
                      : progressPercent > 0
                      ? t('courseDetail.continueCourse')
                      : t('courseDetail.startCourse')}
                  </span>
                </Link>
              ) : (
                <div className="p-3 bg-white rounded-xl text-center text-xs text-gray-500 font-medium border border-gray-200">
                  {t('courseDetail.noLessons')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lesson Curriculum List */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-600" />
              <span>{t('courseDetail.curriculum')}</span>
            </h2>
            <span className="text-xs text-green-700 font-bold bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
              {completedCount} / {lessons.length} {t('common.completed')}
            </span>
          </div>

          {lessons.length > 0 ? (
            <div className="space-y-3">
              {lessons.map((lesson, idx) => (
                <Link
                  key={lesson.id}
                  href={`/courses/${course.id}/lessons/${lesson.id}`}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 group ${
                    lesson.completed
                      ? 'bg-green-50/40 border-green-200 hover:border-green-400'
                      : 'bg-white border-gray-200 hover:border-green-400'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                        lesson.completed
                          ? 'bg-green-600 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 group-hover:bg-green-600 group-hover:text-white'
                      }`}
                    >
                      {lesson.completed ? <CheckCircle2 className="w-5 h-5" /> : lesson.position || idx + 1}
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-green-700 transition-colors truncate">
                        {lesson.title}
                      </h3>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{lesson.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 text-xs text-gray-500">
                    {lesson.has_quiz && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                        <HelpCircle className="w-3 h-3" /> {t('courseDetail.quizIncluded')}
                      </span>
                    )}
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-gray-400" /> {lesson.duration_minutes} {t('common.minutes')}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-700 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-gray-400">
              {t('courseDetail.noLessons')}
            </div>
          )}
        </div>
      </div>
    </BaseLayout>
  );
}
