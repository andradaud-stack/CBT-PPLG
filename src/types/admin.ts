import { Difficulty, UserProfile } from "@/types";

export type UserRole = "student" | "teacher" | "admin";
export type UserStatus = "active" | "suspended";

export interface AdminUserRecord extends UserProfile {
  password?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastLoginAt?: string;
  totalAttempts?: number;
  averageIrtScore?: number;
  bestIrtScore?: number;
  weakestTopic?: string;
  strongestTopic?: string;
}

export interface QuestionModerationItem {
  id: string;
  questionId: string;
  stemSnippet: string;
  topic: string;
  difficulty: Difficulty;
  reportedBy: string; // student name or system
  reportReason: string;
  reportedAt: string;
  status: "pending" | "resolved" | "dismissed";
  ratingScore?: number; // thumbs up/down
}

export interface SystemAnnouncement {
  enabled: boolean;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "urgent";
  updatedAt: string;
}

export interface SimulationConfig {
  totalQuestions: number; // default: 30
  durationMinutes: number; // default: 50
  easyPercentage: number; // default: 30
  mediumPercentage: number; // default: 50
  hardPercentage: number; // default: 20
  kkmThreshold: number; // default: 500
  irtMinScore: number; // default: 200
  irtMaxScore: number; // default: 800
  strictProctoring: boolean; // default: true
}

export interface CurriculumElementWeight {
  elementId: number;
  elementName: string;
  weightPercentage: number;
  subElements: {
    id: string;
    name: string;
    topic: string;
    targetCount: number;
  }[];
}

export interface LearningModuleItem {
  id: string;
  elementId: number;
  title: string;
  summary: string;
  contentMarkdown: string;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProctoringLogEntry {
  id: string;
  attemptId: string;
  studentName: string;
  className: string;
  packageTitle: string;
  timestamp: string;
  eventType: "tab_switch" | "fullscreen_exit" | "context_menu" | "disqualified" | "exam_completed";
  severity: "low" | "medium" | "critical";
  description: string;
}
