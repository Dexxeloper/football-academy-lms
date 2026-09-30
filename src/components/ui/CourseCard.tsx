import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Course } from '@/types/database';
import { ProgressBar } from './ProgressBar';
import { Badge } from './Badge';
import { Clock, BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const isCompleted = course.progress === 100 || course.enrollment_status === 'completed';
  const isInProgress = (course.progress ?? 0) > 0 && !isCompleted;

  return (
    <div className="bg-navy-card border border-navy-border/80 hover:border-emerald-500/40 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full bg-slate-800 overflow-hidden">
        <Image
          src={course.thumbnail_url}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-card via-transparent to-black/30" />
        
        {/* Category & Status Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="emerald">{course.category}</Badge>
        </div>

        {isCompleted && (
          <div className="absolute top-3 right-3 bg-emerald-500/90 text-navy font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1 mb-2">
            {course.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {course.description}
          </p>

          {/* Meta specs */}
          <div className="flex items-center gap-4 text-xs text-slate-400 mb-4 pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>{course.total_lessons} Lessons</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{course.duration_minutes} Mins</span>
            </div>
          </div>
        </div>

        {/* Progress & Action */}
        <div>
          {(isInProgress || isCompleted) && (
            <div className="mb-4">
              <ProgressBar value={course.progress || 0} size="sm" />
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-700 overflow-hidden relative border border-slate-600">
                {course.instructor_avatar ? (
                  <Image src={course.instructor_avatar} alt={course.instructor_name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-emerald-600 text-navy font-bold text-[10px] flex items-center justify-center">
                    {course.instructor_name[0]}
                  </div>
                )}
              </div>
              <span className="text-xs text-slate-300 font-medium truncate max-w-[130px]">
                {course.instructor_name}
              </span>
            </div>

            <Link
              href={`/courses/${course.id}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-navy text-xs font-bold transition-all border border-emerald-500/30"
            >
              {isCompleted ? 'Review' : isInProgress ? 'Continue' : 'Start'}
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
