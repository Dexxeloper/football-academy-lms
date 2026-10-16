'use client';

import React, { useState, useEffect } from 'react';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { Modal } from '@/components/ui/Modal';
import { createClient } from '@/lib/supabase/client';
import { Course, CourseStatus, Profile } from '@/types/database';
import { MOCK_COURSES, MOCK_CERTIFICATES } from '@/lib/mock-data';
import {
  ShieldAlert,
  Users,
  BookOpen,
  Award,
  Plus,
  Edit,
  Sparkles,
  Loader2,
  AlertCircle,
  Save,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<'courses' | 'users' | 'certificates'>('courses');
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal State for Course Create / Edit
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('Tactical Analysis');
  const [formInstructor, setFormInstructor] = useState('Head Tactical Coach');
  const [formThumbnail, setFormThumbnail] = useState('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80');
  const [formDuration, setFormDuration] = useState(120);
  const [formStatus, setFormStatus] = useState<CourseStatus>('published');

  // Load Data
  const loadData = React.useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // 1. Fetch all courses from Supabase
      const { data: coursesData, error: coursesErr } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (coursesErr) {
        console.error('Error fetching courses:', coursesErr);
        setErrorMsg('Failed to load courses from Supabase.');
      } else {
        setCourses((coursesData || []) as Course[]);
      }

      // 2. Fetch users from profiles table
      const { data: profilesData, error: profilesErr } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!profilesErr && profilesData) {
        setProfiles(profilesData as Profile[]);
      }
    } catch (err: any) {
      console.error('Admin query error:', err);
      setErrorMsg('Error loading admin management data.');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreateModal = () => {
    setEditingCourse(null);
    setFormTitle('');
    setFormDescription('');
    setFormCategory('Tactical Analysis');
    setFormInstructor('Head Tactical Coach');
    setFormThumbnail('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80');
    setFormDuration(120);
    setFormStatus('published');
    setShowCourseModal(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setFormTitle(course.title);
    setFormDescription(course.description);
    setFormCategory(course.category);
    setFormInstructor(course.instructor_name);
    setFormThumbnail(course.thumbnail_url || '');
    setFormDuration(course.duration_minutes);
    setFormStatus(course.status);
    setShowCourseModal(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    const payload = {
      title: formTitle,
      description: formDescription,
      category: formCategory,
      instructor_name: formInstructor,
      thumbnail_url: formThumbnail,
      duration_minutes: formDuration,
      status: formStatus,
    };

    try {
      if (editingCourse?.id) {
        // Update existing course
        const { error } = await supabase
          .from('courses')
          .update(payload)
          .eq('id', editingCourse.id);

        if (error) throw error;
      } else {
        // Create new course
        const { error } = await supabase
          .from('courses')
          .insert([payload]);

        if (error) throw error;
      }

      setShowCourseModal(false);
      await loadData();
    } catch (err: any) {
      console.error('Error saving course:', err);
      setErrorMsg(err.message || 'Failed to save course to Supabase.');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStatusToggle = async (course: Course, newStatus: CourseStatus) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ status: newStatus })
        .eq('id', course.id);

      if (error) throw error;
      await loadData();
    } catch (err: any) {
      alert(`Status update failed: ${err.message}`);
    }
  };

  const handleSeedMockCourses = async () => {
    if (!confirm(t('admin.seedConfirm'))) return;
    setSaving(true);

    try {
      for (const course of MOCK_COURSES) {
        const { data: insertedCourse, error: cErr } = await supabase
          .from('courses')
          .insert([
            {
              title: course.title,
              description: course.description,
              category: course.category,
              instructor_name: course.instructor_name,
              thumbnail_url: course.thumbnail_url,
              status: course.status,
              duration_minutes: course.duration_minutes,
            },
          ])
          .select()
          .single();

        if (cErr) {
          console.error('Seed course error:', cErr);
          continue;
        }

        // Also seed lessons for High Pressing course
        if (course.id === 'course-pressing-mastery' && insertedCourse) {
          const sampleLessons = [
            {
              course_id: insertedCourse.id,
              title: '1. Fundamentals of Pressing Triggers',
              description: 'Understanding body shape, touch quality, backward passes, and touchline constraints as signals to initiate high intensity pressing.',
              video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              duration_minutes: 25,
              position: 1,
            },
            {
              course_id: insertedCourse.id,
              title: '2. Cover Shadows & Blocking Passing Lanes',
              description: 'How pressing forwards use curved runs to slice the pitch in half and prevent switches of play to the weak-side fullback.',
              video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              duration_minutes: 30,
              position: 2,
            },
            {
              course_id: insertedCourse.id,
              title: '3. Rest Defense & Midfield Restructuration',
              description: 'Structuring the 3+2 or 2+3 safety net behind the pressing line to prevent counter-attacks when the first press is bypassed.',
              video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              duration_minutes: 28,
              position: 3,
            }
          ];

          await supabase.from('lessons').insert(sampleLessons);
        }
      }

      await loadData();
    } catch (err: any) {
      alert(`Seeding error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <BaseLayout>
      <div className="space-y-8">
        {/* Admin Header Banner */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-2xl shrink-0">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-gray-900">{t('admin.title')}</h1>
                  <Badge variant="green">Admin Portal</Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t('admin.subtitle')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={openCreateModal}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm shadow-green-600/20"
              >
                <Plus className="w-4 h-4" /> {t('admin.createCourse')}
              </button>
            </div>
          </div>
        </div>

        {/* Platform Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title={t('admin.courses')}
            value={courses.length}
            subtitle={`${courses.filter(c => c.status === 'published').length} ${t('common.published')}`}
            icon={BookOpen}
            accentColor="green"
          />
          <StatCard
            title={t('admin.usersTab')}
            value={profiles.length || 5}
            subtitle={t('admin.usersTab')}
            icon={Users}
            accentColor="blue"
          />
          <StatCard
            title={t('admin.certificatesTab')}
            value={MOCK_CERTIFICATES.length}
            subtitle="UEFA Credentials"
            icon={Award}
            accentColor="amber"
          />
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Management Tabs */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 flex-wrap gap-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              {(['courses', 'users', 'certificates'] as const).map((tab) => {
                const isActive = activeTab === tab;
                const tabTitle =
                  tab === 'courses'
                    ? t('admin.coursesTab')
                    : tab === 'users'
                    ? t('admin.usersTab')
                    : t('admin.certificatesTab');
                const count =
                  tab === 'courses' ? courses.length : tab === 'users' ? profiles.length : MOCK_CERTIFICATES.length;

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {tabTitle} ({count})
                  </button>
                );
              })}
            </div>

            {courses.length === 0 && (
              <button
                type="button"
                onClick={handleSeedMockCourses}
                disabled={saving}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-green-600" />
                {t('admin.seedCourses')}
              </button>
            )}
          </div>

          {/* TAB 1: COURSES */}
          {activeTab === 'courses' && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 text-green-600 animate-spin mx-auto mb-2" />
                  <p className="text-xs text-gray-500">{t('common.loading')}</p>
                </div>
              ) : courses.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider border-b border-gray-200">
                      <tr>
                        <th className="p-3.5">{t('admin.courseTitle')}</th>
                        <th className="p-3.5">{t('admin.category')}</th>
                        <th className="p-3.5">{t('admin.instructor')}</th>
                        <th className="p-3.5">{t('admin.duration')}</th>
                        <th className="p-3.5">{t('admin.status')}</th>
                        <th className="p-3.5 text-right">{t('admin.actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {courses.map((course) => (
                        <tr key={course.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="p-3.5 font-bold text-gray-900 max-w-xs truncate">{course.title}</td>
                          <td className="p-3.5">{course.category}</td>
                          <td className="p-3.5 text-gray-600">{course.instructor_name}</td>
                          <td className="p-3.5">{course.duration_minutes}m</td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  course.status === 'published'
                                    ? 'green'
                                    : course.status === 'draft'
                                    ? 'amber'
                                    : 'slate'
                                }
                              >
                                {course.status}
                              </Badge>
                              {/* Quick status selector */}
                              <select
                                value={course.status}
                                onChange={(e) => handleQuickStatusToggle(course, e.target.value as CourseStatus)}
                                className="bg-white text-[11px] text-gray-600 border border-gray-300 rounded px-1.5 py-0.5 outline-none focus:border-green-600 shadow-2xs"
                              >
                                <option value="published">published</option>
                                <option value="draft">draft</option>
                                <option value="archived">archived</option>
                              </select>
                            </div>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => openEditModal(course)}
                              className="text-gray-500 hover:text-green-700 p-1.5 rounded-lg bg-gray-50 hover:bg-green-50 border border-gray-200 transition-colors"
                              title={t('admin.editCourse')}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-3">{t('admin.noCourses')}</p>
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs shadow-sm"
                  >
                    + {t('admin.createFirstCourse')}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: USERS */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-600">
                  <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider border-b border-gray-200">
                    <tr>
                      <th className="p-3.5">{t('admin.userName')}</th>
                      <th className="p-3.5">{t('admin.userEmail')}</th>
                      <th className="p-3.5">{t('admin.userRole')}</th>
                      <th className="p-3.5">{t('admin.userPosition')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {profiles.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="p-3.5 font-bold text-gray-900">{user.full_name}</td>
                        <td className="p-3.5 text-gray-500">{user.email}</td>
                        <td className="p-3.5">
                          <Badge variant={user.role === 'admin' ? 'purple' : 'green'}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="p-3.5">{user.academy_position || 'Academy Staff'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CERTIFICATES */}
          {activeTab === 'certificates' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-900">{t('profile.officialCertificates')}</h3>
              <div className="space-y-2">
                {MOCK_CERTIFICATES.map((c) => (
                  <div key={c.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-gray-900">{c.user_name}</span> &bull; {c.course_title}
                    </div>
                    <Badge variant="green">{c.certificate_code}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Course Create / Edit Modal */}
      <Modal
        isOpen={showCourseModal}
        onClose={() => setShowCourseModal(false)}
        title={editingCourse ? t('admin.editCourse') : t('admin.createCourse')}
      >
        <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">{t('admin.courseTitle')}</label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full bg-white border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 rounded-xl p-2.5 text-gray-900 outline-none shadow-2xs"
              placeholder="e.g. High-Pressing Mechanics"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">{t('admin.description')}</label>
            <textarea
              required
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full bg-white border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 rounded-xl p-2.5 text-gray-900 outline-none shadow-2xs"
              placeholder="Course tactical overview..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">{t('admin.category')}</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full bg-white border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 rounded-xl p-2.5 text-gray-900 outline-none shadow-2xs"
              >
                <option value="Tactical Analysis">Tactical Analysis</option>
                <option value="Sports Science">Sports Science</option>
                <option value="Specialist Coaching">Specialist Coaching</option>
                <option value="Performance Analysis">Performance Analysis</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">{t('admin.status')}</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as CourseStatus)}
                className="w-full bg-white border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 rounded-xl p-2.5 text-gray-900 outline-none shadow-2xs"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">{t('admin.instructor')}</label>
              <input
                type="text"
                required
                value={formInstructor}
                onChange={(e) => setFormInstructor(e.target.value)}
                className="w-full bg-white border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 rounded-xl p-2.5 text-gray-900 outline-none shadow-2xs"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">{t('admin.duration')} (Mins)</label>
              <input
                type="number"
                required
                value={formDuration}
                onChange={(e) => setFormDuration(parseInt(e.target.value) || 60)}
                className="w-full bg-white border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 rounded-xl p-2.5 text-gray-900 outline-none shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">{t('admin.thumbnailUrl')}</label>
            <input
              type="url"
              required
              value={formThumbnail}
              onChange={(e) => setFormThumbnail(e.target.value)}
              className="w-full bg-white border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 rounded-xl p-2.5 text-gray-900 outline-none shadow-2xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowCourseModal(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
            >
              {t('admin.cancel')}
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl flex items-center gap-2 disabled:opacity-50 shadow-sm transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{editingCourse ? t('admin.save') : t('admin.createCourse')}</span>
            </button>
          </div>
        </form>
      </Modal>
    </BaseLayout>
  );
}
