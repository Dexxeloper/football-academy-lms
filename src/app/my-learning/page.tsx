'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { CourseCard } from '@/components/ui/CourseCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { createClient } from '@/lib/supabase/client';
import { Course } from '@/types/database';
import { GraduationCap, BookOpen, Loader2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export default function MyLearningPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const supabase = createClient();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLearningData() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        // Fetch courses from Supabase
        const { data: coursesData, error } = await supabase
          .from('courses')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching courses:', error);
          setCourses([]);
        } else if (coursesData && coursesData.length > 0) {
          const coursesWithLessons = await Promise.all(
            coursesData.map(async (course) => {
              const { count } = await supabase
                .from('lessons')
                .select('*', { count: 'exact', head: true })
                .eq('course_id', course.id);

              return {
                ...course,
                total_lessons: count || course.total_lessons || 0,
                thumbnail_url: course.thumbnail_url || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
                progress: course.progress || (course.id.includes('pressing') ? 67 : 0),
              } as Course;
            })
          );
          setCourses(coursesWithLessons);
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error('Failed to load learning data:', err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }

    loadLearningData();
  }, [supabase, router]);

  const activeCourses = courses.filter((c) => (c.progress ?? 0) < 100);
  const completedCourses = courses.filter((c) => (c.progress ?? 0) === 100);

  return (
    <BaseLayout>
      <div className="space-y-8">
        <PageHeader
          icon={GraduationCap}
          title={t('myLearning.title')}
          subtitle={t('myLearning.subtitle')}
        />

        {loading ? (
          <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{t('common.loading')}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Active Courses Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">{t('myLearning.activeCourses')}</h2>
                <span className="text-xs font-semibold text-gray-500">{activeCourses.length} {t('common.courses')}</span>
              </div>

              {activeCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={BookOpen}
                  title={t('myLearning.noActiveCourses')}
                  description={t('myLearning.noActiveCoursesDesc')}
                  action={
                    <Link
                      href="/courses"
                      className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
                    >
                      {t('myLearning.browseCourses')}
                    </Link>
                  }
                />
              )}
            </div>

            {/* Completed Courses Section */}
            {completedCourses.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900">{t('myLearning.completedCourses')}</h2>
                  <span className="text-xs font-semibold text-gray-500">{completedCourses.length} {t('common.courses')}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </BaseLayout>
  );
}
