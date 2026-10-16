'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { QuizCard } from '@/components/ui/QuizCard';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { MOCK_COURSES, MOCK_LESSONS, MOCK_QUIZZES } from '@/lib/mock-data';
import {
  PlayCircle,
  CheckCircle2,
  Download,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  FileText,
  HelpCircle,
  Sparkles,
  BookOpen,
  Clock,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export default function LessonPage() {
  const { t } = useTranslation();
  const params = useParams();

  const courseId = (params.id as string) || 'course-pressing-mastery';
  const lessonId = (params.lessonId as string) || 'les-press-01';

  const course = MOCK_COURSES.find((c) => c.id === courseId) || MOCK_COURSES[0];
  const lessons = MOCK_LESSONS[course.id] || MOCK_LESSONS['course-pressing-mastery'] || [];
  
  const currentLessonIndex = lessons.findIndex((l) => l.id === lessonId);
  const lesson = lessons[currentLessonIndex >= 0 ? currentLessonIndex : 0] || {
    id: lessonId,
    title: 'Lesson',
    description: '',
    duration_minutes: 30,
    downloadable_materials: [],
    completed: false,
  };

  const [isCompleted, setIsCompleted] = useState(lesson.completed || false);
  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'quiz'>('overview');

  const prevLesson = currentLessonIndex > 0 ? lessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < lessons.length - 1 ? lessons[currentLessonIndex + 1] : null;

  const quiz = lesson.quiz_id ? MOCK_QUIZZES[lesson.quiz_id] || MOCK_QUIZZES['quiz-press-01'] : null;

  const toggleCompleted = () => {
    setIsCompleted(!isCompleted);
  };

  const completedCount = lessons.filter((l) => l.completed).length + (isCompleted && !lesson.completed ? 1 : 0);
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  return (
    <BaseLayout showSidebar={false}>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Top Breadcrumb & Navigation */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <Link
            href={`/courses/${course.id}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t('lesson.backToCourse')}: {course.title}
          </Link>

          <div className="flex items-center gap-2">
            {prevLesson && (
              <Link
                href={`/courses/${course.id}/lessons/${prevLesson.id}`}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 flex items-center gap-1 shadow-2xs transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> {t('lesson.prevLesson')}
              </Link>
            )}
            {nextLesson && (
              <Link
                href={`/courses/${course.id}/lessons/${nextLesson.id}`}
                className="px-3.5 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-xs font-bold text-white flex items-center gap-1 shadow-sm transition-colors"
              >
                <span>{t('lesson.nextLesson')}</span> <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Video & Content Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tactical Video Area */}
            <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="relative aspect-video w-full max-h-[460px] bg-gray-900 flex items-center justify-center group overflow-hidden">
                {/* Background Image Preview */}
                <Image
                  src={course.thumbnail_url}
                  alt={lesson.title}
                  fill
                  className="object-cover opacity-25 scale-105"
                />

                {/* Embedded Video Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-600/90 hover:bg-green-600 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-green-600/40 cursor-pointer">
                    <PlayCircle className="w-10 h-10 sm:w-12 sm:h-12 fill-white text-green-700" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white max-w-lg mb-1 leading-snug">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-gray-300 max-w-md">
                    {t('lesson.videoSession')}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-green-300 bg-black/40 px-3 py-1 rounded-full border border-green-500/30">
                    <Sparkles className="w-3 h-3 text-green-400" /> HD Tactical Footage
                  </div>
                </div>
              </div>

              {/* Video Info Bar & Completion Action */}
              <div className="p-5 sm:p-6 bg-white border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="green">
                      {t('lesson.lessonOf', { current: currentLessonIndex + 1, total: lessons.length })}
                    </Badge>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" /> {lesson.duration_minutes} {t('common.minutes')}
                    </span>
                  </div>
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900">{lesson.title}</h1>
                </div>

                <button
                  type="button"
                  onClick={toggleCompleted}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-xs shrink-0 ${
                    isCompleted
                      ? 'bg-green-50 text-green-700 border border-green-300'
                      : 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/20'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isCompleted ? t('lesson.completedCheck') : t('lesson.markCompleted')}</span>
                </button>
              </div>
            </div>

            {/* Content Tabs (Overview, Downloadables, Quiz) */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex border-b border-gray-200 gap-6 text-sm font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`pb-3 border-b-2 transition-colors ${
                    activeTab === 'overview'
                      ? 'border-green-600 text-green-700 font-extrabold'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {t('lesson.overview')}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('materials')}
                  className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'materials'
                      ? 'border-green-600 text-green-700 font-extrabold'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>{t('lesson.materials')} ({lesson.downloadable_materials?.length || 0})</span>
                </button>
                {quiz && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('quiz')}
                    className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                      activeTab === 'quiz'
                        ? 'border-green-600 text-green-700 font-extrabold'
                        : 'border-transparent text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>{t('lesson.quiz')}</span>
                  </button>
                )}
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-gray-900">{t('lesson.objectives')}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{lesson.description}</p>
                  
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/80 text-xs text-gray-700 space-y-2">
                    <p className="font-bold text-green-800 uppercase tracking-wider text-[11px]">
                      {t('lesson.keyTakeaways')}:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-gray-600 leading-relaxed">
                      <li>Recognize backward body shape of opponent center-backs before initiating high sprint.</li>
                      <li>Curve pressing run to isolate play to the touchline.</li>
                      <li>Ensure central midfielders maintain compact rest-defense positions behind the initial press.</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'materials' && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-gray-900">{t('lesson.downloadMaterials')}</h3>
                  {lesson.downloadable_materials && lesson.downloadable_materials.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {lesson.downloadable_materials.map((mat) => (
                        <div
                          key={mat.id}
                          className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between gap-3 hover:border-green-300 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2.5 rounded-lg bg-green-100 text-green-700 shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-gray-900 truncate">{mat.title}</h4>
                              <span className="text-[10px] text-gray-500">{mat.size} &bull; PDF Document</span>
                            </div>
                          </div>

                          <a
                            href={mat.download_url}
                            onClick={(e) => {
                              e.preventDefault();
                              alert(`Downloading ${mat.title}`);
                            }}
                            className="p-2 rounded-lg bg-white hover:bg-green-600 hover:text-white text-green-700 border border-gray-200 transition-colors shrink-0"
                            title={t('lesson.download')}
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">No downloadable materials for this lesson.</p>
                  )}
                </div>
              )}

              {activeTab === 'quiz' && quiz && (
                <div>
                  <QuizCard quiz={quiz} />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Course Curriculum Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-green-600" />
                    <span>{t('lesson.curriculumSidebar')}</span>
                  </h3>
                  <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
                    {progressPercent}%
                  </span>
                </div>
                <ProgressBar value={progressPercent} size="sm" showLabel={false} />
              </div>

              <div className="space-y-2">
                {lessons.map((item, idx) => {
                  const isCurrent = item.id === lesson.id;
                  return (
                    <Link
                      key={item.id}
                      href={`/courses/${course.id}/lessons/${item.id}`}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs ${
                        isCurrent
                          ? 'bg-green-50 border-green-400 text-green-950 font-bold shadow-xs'
                          : 'bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            item.completed
                              ? 'bg-green-600 text-white'
                              : isCurrent
                              ? 'bg-green-200 text-green-900'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {item.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                        </div>
                        <span className="truncate">{item.title}</span>
                      </div>

                      <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                        {item.duration_minutes}m
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
