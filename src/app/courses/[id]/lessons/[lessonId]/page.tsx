'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { QuizCard } from '@/components/ui/QuizCard';
import { Badge } from '@/components/ui/Badge';
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
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();

  const courseId = (params.id as string) || 'course-pressing-mastery';
  const lessonId = (params.lessonId as string) || 'les-press-01';

  const course = MOCK_COURSES.find((c) => c.id === courseId) || MOCK_COURSES[0];
  const lessons = MOCK_LESSONS[course.id] || MOCK_LESSONS['course-pressing-mastery'];
  
  const currentLessonIndex = lessons.findIndex((l) => l.id === lessonId);
  const lesson = lessons[currentLessonIndex >= 0 ? currentLessonIndex : 0];

  const [isCompleted, setIsCompleted] = useState(lesson.completed || false);
  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'quiz'>('overview');

  const prevLesson = currentLessonIndex > 0 ? lessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < lessons.length - 1 ? lessons[currentLessonIndex + 1] : null;

  const quiz = lesson.quiz_id ? MOCK_QUIZZES[lesson.quiz_id] || MOCK_QUIZZES['quiz-press-01'] : null;

  const toggleCompleted = () => {
    setIsCompleted(!isCompleted);
  };

  return (
    <BaseLayout showSidebar={false}>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Top Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href={`/courses/${course.id}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to {course.title}
          </Link>

          <div className="flex items-center gap-2">
            {prevLesson && (
              <Link
                href={`/courses/${course.id}/lessons/${prevLesson.id}`}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </Link>
            )}
            {nextLesson && (
              <Link
                href={`/courses/${course.id}/lessons/${nextLesson.id}`}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-400 flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Tactical Video Area */}
        <div className="bg-navy-card border border-navy-border/90 rounded-3xl overflow-hidden shadow-2xl">
          <div className="relative aspect-video w-full max-h-[480px] bg-black flex items-center justify-center group overflow-hidden">
            {/* Background Course Image Overlay */}
            <Image
              src={course.thumbnail_url}
              alt={lesson.title}
              fill
              className="object-cover opacity-20 blur-sm scale-105"
            />

            {/* Embedded Video Player Placeholder with High Tech Coaching UI */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/80 via-navy-dark/90 to-black/95 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform shadow-2xl shadow-emerald-500/30 cursor-pointer">
                <PlayCircle className="w-12 h-12 fill-emerald-500 text-navy" />
              </div>
              <h3 className="text-xl font-black text-white max-w-lg mb-2">
                {lesson.title}
              </h3>
              <p className="text-xs text-slate-400 max-w-md">
                Tactical Video Session &bull; HD Tactical Analysis & Pitch Overlay
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-navy/80 px-3 py-1 rounded-full border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" /> High-Intensity Pressing Mechanics
              </div>
            </div>
          </div>

          {/* Video Control Bar & Action */}
          <div className="p-6 bg-slate-900/90 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="emerald">Lesson {currentLessonIndex + 1} of {lessons.length}</Badge>
                <span className="text-xs text-slate-400">{lesson.duration_minutes} Minutes</span>
              </div>
              <h1 className="text-xl font-bold text-white">{lesson.title}</h1>
            </div>

            <button
              onClick={toggleCompleted}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-lg shrink-0 ${
                isCompleted
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-navy shadow-emerald-500/20'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {isCompleted ? 'Completed Checkmark' : 'Mark as Completed'}
            </button>
          </div>
        </div>

        {/* Content Tabs (Overview, Downloadables, Quiz) */}
        <div className="space-y-6">
          <div className="flex border-b border-navy-border/80 gap-6 text-sm font-bold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Lesson Overview
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'materials'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              Downloadable Materials ({lesson.downloadable_materials.length})
            </button>
            {quiz && (
              <button
                onClick={() => setActiveTab('quiz')}
                className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'quiz'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                Lesson Quiz
              </button>
            )}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="bg-navy-card border border-navy-border/80 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white">Tactical Objectives</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{lesson.description}</p>
              
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2">
                <p className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">Key Coaching Takeaways:</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-400">
                  <li>Recognize backward body shape of opponent center-backs before initiating high sprint.</li>
                  <li>Curve pressing run to isolate play to the sideline.</li>
                  <li>Ensure central midfielders maintain compact rest-defense positions.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'materials' && (
            <div className="bg-navy-card border border-navy-border/80 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white">Session Plans & Whitepapers</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lesson.downloadable_materials.map((mat) => (
                  <div
                    key={mat.id}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{mat.title}</h4>
                        <span className="text-[10px] text-slate-400">{mat.size} &bull; PDF Document</span>
                      </div>
                    </div>

                    <a
                      href={mat.download_url}
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Downloading ${mat.title}`);
                      }}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-navy text-emerald-400 transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'quiz' && quiz && (
            <div>
              <QuizCard quiz={quiz} />
            </div>
          )}
        </div>
      </div>
    </BaseLayout>
  );
}
