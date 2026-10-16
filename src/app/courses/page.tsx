'use client';

import React, { useState, useEffect } from 'react';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { CourseCard } from '@/components/ui/CourseCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { createClient } from '@/lib/supabase/client';
import { Course } from '@/types/database';
import { Search, Filter, BookOpen, Loader2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export default function CoursesPage() {
  const { t } = useTranslation();
  const supabase = createClient();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Tactical Analysis', 'Sports Science', 'Specialist Coaching', 'Performance Analysis'];

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      try {
        // Query published courses from Supabase
        const { data: coursesData, error } = await supabase
          .from('courses')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching courses from Supabase:', error);
          setCourses([]);
        } else if (coursesData && coursesData.length > 0) {
          // Fetch lesson counts for each course
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
              } as Course;
            })
          );
          setCourses(coursesWithLessons);
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error('Failed to connect to Supabase:', err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [supabase]);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <BaseLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Page Header */}
        <PageHeader
          icon={BookOpen}
          title={t('courses.title')}
          subtitle={t('courses.subtitle')}
          actions={
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder={t('courses.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 rounded-xl py-2 pl-10 pr-4 text-xs text-gray-900 placeholder-gray-400 outline-none transition-all shadow-xs"
              />
            </div>
          }
        />

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Filter className="w-4 h-4 text-gray-400 shrink-0 mr-1" />
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const label = cat === 'All' ? t('courses.allCategories') : cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-green-600 text-white shadow-sm shadow-green-600/20'
                    : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{t('common.loading')}</p>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title={t('courses.noCoursesFound')}
            description={t('courses.noCoursesFoundDesc')}
            action={
              (searchTerm || selectedCategory !== 'All') ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                  }}
                  className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-bold rounded-xl border border-green-200 transition-colors"
                >
                  {t('courses.resetFilters')}
                </button>
              ) : null
            }
          />
        )}
      </div>
    </BaseLayout>
  );
}
