'use client';

import React, { useState, useEffect } from 'react';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { CourseCard } from '@/components/ui/CourseCard';
import { createClient } from '@/lib/supabase/client';
import { Course } from '@/types/database';
import { Search, Filter, BookOpen, Loader2 } from 'lucide-react';

export default function CoursesPage() {
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
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-navy-border/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-6 h-6 text-emerald-400" />
              <h1 className="text-2xl font-black text-white tracking-tight">Academy Course Catalog</h1>
            </div>
            <p className="text-xs text-slate-300">
              UEFA Accredited tactical analysis, match preparation, and physical load management modules.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search courses or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-400 outline-none transition-all"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-navy shadow-md shadow-emerald-500/20'
                  : 'bg-navy-card text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20 bg-navy-card border border-navy-border rounded-2xl">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Loading Courses from Supabase...</p>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-navy-card border border-navy-border rounded-2xl p-8">
            <BookOpen className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No Published Courses Found</h3>
            <p className="text-slate-400 text-xs max-w-md mx-auto mb-4">
              {searchTerm
                ? `No courses matching your search filter "${searchTerm}".`
                : 'There are currently no published courses in the database. Log in as an Administrator to create and publish new courses.'}
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-xl border border-emerald-500/30"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}
      </div>
    </BaseLayout>
  );
}
