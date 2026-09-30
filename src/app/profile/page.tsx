'use client';

import React from 'react';
import Image from 'next/image';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { Badge } from '@/components/ui/Badge';
import { CURRENT_COACH, MOCK_CERTIFICATES, MOCK_COURSES } from '@/lib/mock-data';
import { User, Mail, ShieldCheck, Award, BookOpen, CheckCircle2, Clock, FileCheck } from 'lucide-react';

export default function ProfilePage() {
  const completedCourses = MOCK_COURSES.filter((c) => c.progress === 100);

  return (
    <BaseLayout>
      <div className="space-y-8">
        {/* Profile Header Card */}
        <div className="bg-navy-card border border-navy-border/90 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-xl shrink-0">
              <Image
                src={CURRENT_COACH.avatar_url!}
                alt={CURRENT_COACH.full_name}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h1 className="text-2xl font-black text-white">{CURRENT_COACH.full_name}</h1>
                <Badge variant="emerald">{CURRENT_COACH.role}</Badge>
              </div>

              <p className="text-xs text-slate-300 font-medium">{CURRENT_COACH.academy_position}</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" /> {CURRENT_COACH.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> UEFA A License Credential
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-navy-card border border-navy-border p-5 rounded-2xl">
            <BookOpen className="w-5 h-5 text-emerald-400 mb-2" />
            <div className="text-2xl font-black text-white">5</div>
            <div className="text-xs text-slate-400">Total Enrolled</div>
          </div>

          <div className="bg-navy-card border border-navy-border p-5 rounded-2xl">
            <CheckCircle2 className="w-5 h-5 text-blue-400 mb-2" />
            <div className="text-2xl font-black text-white">{completedCourses.length}</div>
            <div className="text-xs text-slate-400">Completed Courses</div>
          </div>

          <div className="bg-navy-card border border-navy-border p-5 rounded-2xl">
            <Award className="w-5 h-5 text-amber-400 mb-2" />
            <div className="text-2xl font-black text-white">{MOCK_CERTIFICATES.length}</div>
            <div className="text-xs text-slate-400">Certificates Earned</div>
          </div>

          <div className="bg-navy-card border border-navy-border p-5 rounded-2xl">
            <Clock className="w-5 h-5 text-purple-400 mb-2" />
            <div className="text-2xl font-black text-white">42 hrs</div>
            <div className="text-xs text-slate-400">Total Study Time</div>
          </div>
        </div>

        {/* Certificates Gallery */}
        <div className="bg-navy-card border border-navy-border/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" /> Official UEFA Academy Certificates
            </h2>
            <Badge variant="emerald">{MOCK_CERTIFICATES.length} Valid Certificates</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_CERTIFICATES.map((cert) => (
              <div
                key={cert.id}
                className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-navy-dark border border-slate-800 hover:border-emerald-500/40 transition-all space-y-4 shadow-lg relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
                    {cert.certificate_code}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {cert.course_title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Issued to {cert.user_name}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Date: <strong className="text-slate-200">{cert.issue_date}</strong></span>
                  <button
                    onClick={() => alert(`Certificate Code ${cert.certificate_code} verified for ${cert.course_title}`)}
                    className="text-emerald-400 hover:underline font-bold flex items-center gap-1"
                  >
                    <FileCheck className="w-3.5 h-3.5" /> Verify Credential
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Courses List */}
        <div className="bg-navy-card border border-navy-border/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Completed Modules History
          </h2>

          <div className="space-y-3">
            {completedCourses.map((course) => (
              <div
                key={course.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-bold text-white text-sm">{course.title}</h4>
                  <p className="text-slate-400">{course.category} &bull; {course.total_lessons} Lessons</p>
                </div>
                <Badge variant="emerald">100% Completed</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
