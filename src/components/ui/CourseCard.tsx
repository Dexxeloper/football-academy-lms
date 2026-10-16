'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Course } from '@/types/database';
import { ProgressBar } from './ProgressBar';
import { Badge } from './Badge';
import { Clock, BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface CourseCardProps {
  course: Course;
}

const FALLBACK_THUMBNAIL = 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80';

export function CourseCard({ course }: CourseCardProps) {
  const { t } = useTranslation();
  const [imgSrc, setImgSrc] = useState(course.thumbnail_url || FALLBACK_THUMBNAIL);

  const isCompleted = course.progress === 100 || course.enrollment_status === 'completed';
  const isInProgress = (course.progress ?? 0) > 0 && !isCompleted;

  return (
    <div className="bg-white border border-gray-200 hover:border-green-400/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
      {/* Thumbnail with fixed aspect ratio */}
      <div className="relative aspect-video w-full bg-gray-100 overflow-hidden">
        <Image
          src={imgSrc}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImgSrc(FALLBACK_THUMBNAIL)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />
        
        {/* Category & Status Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="green" size="sm" className="bg-white/95 text-green-800 shadow-sm border-white/60">
            {course.category}
          </Badge>
        </div>

        {isCompleted && (
          <div className="absolute top-3 right-3 bg-green-600 text-white font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t('common.completed')}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-1 mb-1.5">
            {course.title}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
            {course.description}
          </p>

          {/* Meta specs */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-green-600" />
              <span>{course.total_lessons} {t('common.lessons')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-green-600" />
              <span>{course.duration_minutes} {t('common.minutes')}</span>
            </div>
          </div>
        </div>

        {/* Progress & Action */}
        <div>
          {(isInProgress || isCompleted) && (
            <div className="mb-4">
              <ProgressBar value={course.progress || 0} size="sm" label={t('common.inProgress')} />
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <div className="w-7 h-7 rounded-full bg-green-100 text-green-800 overflow-hidden relative border border-green-200 shrink-0 flex items-center justify-center font-bold text-xs">
                {course.instructor_avatar ? (
                  <Image src={course.instructor_avatar} alt={course.instructor_name} fill className="object-cover" />
                ) : (
                  <span>{course.instructor_name?.[0] || 'T'}</span>
                )}
              </div>
              <span className="text-xs text-gray-700 font-medium truncate">
                {course.instructor_name}
              </span>
            </div>

            <Link
              href={`/courses/${course.id}`}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-green-50 hover:bg-green-600 text-green-700 hover:text-white text-xs font-bold transition-all border border-green-200 hover:border-green-600 shadow-sm shrink-0"
            >
              <span>{isCompleted ? t('courses.reviewCourse') : isInProgress ? t('courses.continueCourse') : t('courses.startCourse')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
