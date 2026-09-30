export type UserRole = 'admin' | 'coach' | 'student';

export type CourseStatus = 'draft' | 'published' | 'archived';

export type EnrollmentStatus = 'enrolled' | 'in_progress' | 'completed';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  academy_position?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  instructor_name: string;
  instructor_role?: string;
  instructor_avatar?: string;
  thumbnail_url: string;
  status: CourseStatus;
  duration_minutes: number;
  total_lessons: number;
  progress?: number;
  enrollment_status?: EnrollmentStatus;
  created_at?: string;
}

export interface LessonMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'doc';
  size: string;
  download_url: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  video_url: string;
  duration_minutes: number;
  position: number;
  completed?: boolean;
  downloadable_materials: LessonMaterial[];
  has_quiz?: boolean;
  quiz_id?: string;
}

export interface CourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: EnrollmentStatus;
  progress_percent: number;
  enrolled_at: string;
  completed_at?: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at?: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  options: string[];
  correct_option_index: number;
  explanation: string;
  position: number;
}

export interface Quiz {
  id: string;
  lesson_id?: string;
  course_id?: string;
  title: string;
  description: string;
  passing_score: number;
  max_attempts: number;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  passed: boolean;
  attempted_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  course_title: string;
  user_name: string;
  certificate_code: string;
  issue_date: string;
}

export interface ActivityItem {
  id: string;
  user_name: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'lesson' | 'quiz' | 'certificate' | 'course';
}
