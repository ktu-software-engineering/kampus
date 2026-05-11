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
  created_at: string;
}

export interface Instructor {
  id: string;
  full_name: string;
  title: string | null;
  department_id: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor_id: string | null;
  department_id: string | null;
  term: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  course_id: string;
  instructor_id: string | null;
  teaching_quality: number;
  course_difficulty: number;
  exam_difficulty: number;
  attendance_required: boolean;
  comment: string | null;
  is_hidden: boolean;
  created_at: string;
}

export interface ReviewUpvote {
  review_id: string;
  user_id: string;
  created_at: string;
}

export interface Report {
  id: string;
  review_id: string;
  reported_by: string;
  reason: string;
  status: ReportStatus;
  created_at: string;
}

export interface Suggestion {
  id: string;
  type: SuggestionType;
  data: Record<string, unknown>;
  suggested_by: string | null;
  vote_count: number;
  status: SuggestionStatus;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  university_id: string | null;
  department_id: string | null;
  role: UserRole;
  is_verified: boolean;
  failed_login_count: number;
  locked_until: string | null;
  created_at: string;
}

// Join sorgular için ilişkili tipler
export interface ReviewWithDetails extends Review {
  course: Course;
  instructor: Instructor | null;
  upvote_count: number;
}

export interface InstructorWithDepartment extends Instructor {
  department: Department | null;
}

export interface CourseWithInstructor extends Course {
  instructor: Instructor | null;
  department: Department | null;
}
