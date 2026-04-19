// Proje genelinde kullanılan TypeScript tip tanımları

export type UserRole = "student" | "professor" | "moderator" | "admin";

export type ReportStatus = "pending" | "reviewed" | "removed";

export type SuggestionStatus = "pending" | "approved" | "rejected";

export type SuggestionType = "instructor" | "course";

export interface University {
  id: string;
  name: string;
  created_at: string;
}

export interface Department {
  id: string;
  university_id: string;
  name: string;
}

export interface Instructor {
  id: string;
  full_name: string;
  title: string;
  department_id: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor_id: string;
  department_id: string;
  term: string;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  course_id: string;
  instructor_id: string;
  teaching_quality: number;   // 1-5
  course_difficulty: number;  // 1-5
  exam_difficulty: number;    // 1-5
  attendance_required: boolean;
  comment: string;
  is_hidden: boolean;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  university_id: string;
  department_id: string;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
}
