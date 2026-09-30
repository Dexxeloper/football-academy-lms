'use client';

import React, { useState, useEffect } from 'react';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
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
  Trash2,
  CheckCircle2,
  X,
  Sparkles,
  Loader2,
  AlertCircle,
  Save,
} from 'lucide-react';

export default function AdminDashboardPage() {
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
    if (!confirm('Seed the initial UEFA tactical courses into your Supabase database?')) return;
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
        <div className="bg-gradient-to-r from-purple-950/80 via-navy-card to-navy-dark border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 border border-purple-500/40 text-purple-400 rounded-2xl shrink-0">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-white">Academy Admin Control Center</h1>
                  <Badge variant="purple">Admin System</Badge>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Manage Academy Courses, Lessons, User Profiles, and UEFA Certification issuance in Supabase.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={openCreateModal}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-navy font-extrabold rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20"
              >
                <Plus className="w-4 h-4" /> Create Course
              </button>
            </div>
          </div>
        </div>

        {/* Platform Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Supabase Courses" value={courses.length} subtitle={`${courses.filter(c => c.status === 'published').length} Published`} icon={BookOpen} accentColor="emerald" />
          <StatCard title="Registered Profiles" value={profiles.length || 5} subtitle="User Profiles in Database" icon={Users} accentColor="purple" />
          <StatCard title="Issued Certificates" value={MOCK_CERTIFICATES.length} subtitle="UEFA Credentials" icon={Award} accentColor="amber" />
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Management Tabs */}
        <div className="bg-navy-card border border-navy-border/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              {(['courses', 'users', 'certificates'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {tab} ({tab === 'courses' ? courses.length : tab === 'users' ? profiles.length : MOCK_CERTIFICATES.length})
                </button>
              ))}
            </div>

            {courses.length === 0 && (
              <button
                onClick={handleSeedMockCourses}
                disabled={saving}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                Seed Initial Tactical Courses to Supabase
              </button>
            )}
          </div>

          {/* TAB 1: COURSES */}
          {activeTab === 'courses' && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Loading courses from Supabase...</p>
                </div>
              ) : courses.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3">Course Title</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Instructor</th>
                        <th className="p-3">Duration</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {courses.map((course) => (
                        <tr key={course.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="p-3 font-bold text-white max-w-xs truncate">{course.title}</td>
                          <td className="p-3">{course.category}</td>
                          <td className="p-3 text-slate-400">{course.instructor_name}</td>
                          <td className="p-3">{course.duration_minutes}m</td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5">
                              <Badge
                                variant={
                                  course.status === 'published'
                                    ? 'emerald'
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
                                className="bg-slate-900 text-[10px] text-slate-400 border border-slate-700 rounded px-1.5 py-0.5 outline-none"
                              >
                                <option value="published">published</option>
                                <option value="draft">draft</option>
                                <option value="archived">archived</option>
                              </select>
                            </div>
                          </td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              onClick={() => openEditModal(course)}
                              className="text-slate-400 hover:text-emerald-400 p-1.5 rounded-lg bg-slate-900 border border-slate-800"
                              title="Edit Course"
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
                <div className="text-center py-12 bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                  <p className="text-xs text-slate-400 mb-3">No courses exist in the Supabase database yet.</p>
                  <button
                    onClick={openCreateModal}
                    className="px-4 py-2 bg-emerald-500 text-navy font-bold rounded-xl text-xs"
                  >
                    + Create First Course
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: USERS */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3">User Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Academy Position</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {profiles.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-900/50">
                        <td className="p-3 font-bold text-white">{user.full_name}</td>
                        <td className="p-3 text-slate-400">{user.email}</td>
                        <td className="p-3">
                          <Badge variant={user.role === 'admin' ? 'purple' : 'emerald'}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="p-3">{user.academy_position || 'Academy Staff'}</td>
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
              <h3 className="text-sm font-bold text-white">Issued Certificates Registry</h3>
              <div className="space-y-2">
                {MOCK_CERTIFICATES.map((c) => (
                  <div key={c.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">{c.user_name}</span> &bull; {c.course_title}
                    </div>
                    <Badge variant="emerald">{c.certificate_code}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Course Create / Edit Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-card border border-navy-border rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingCourse ? 'Edit Course Details' : 'Create New Academy Course'}
              </h3>
              <button
                onClick={() => setShowCourseModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl p-2.5 text-white outline-none"
                  placeholder="e.g. High-Pressing Mechanics"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl p-2.5 text-white outline-none"
                  placeholder="Course tactical overview..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl p-2.5 text-white outline-none"
                  >
                    <option value="Tactical Analysis">Tactical Analysis</option>
                    <option value="Sports Science">Sports Science</option>
                    <option value="Specialist Coaching">Specialist Coaching</option>
                    <option value="Performance Analysis">Performance Analysis</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as CourseStatus)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl p-2.5 text-white outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Instructor Name</label>
                  <input
                    type="text"
                    required
                    value={formInstructor}
                    onChange={(e) => setFormInstructor(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl p-2.5 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    required
                    value={formDuration}
                    onChange={(e) => setFormDuration(parseInt(e.target.value) || 60)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl p-2.5 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Thumbnail Image URL</label>
                <input
                  type="url"
                  required
                  value={formThumbnail}
                  onChange={(e) => setFormThumbnail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl p-2.5 text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-navy font-bold rounded-xl flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingCourse ? 'Update Course' : 'Save New Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </BaseLayout>
  );
}
