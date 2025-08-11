export interface QTIItem {
  id: string;
  title: string;
  content: string;
  qtiVersion: '2.1' | '3.0';
  createdAt: Date;
  updatedAt: Date;
}

export interface Assessment {
  id: string;
  title: string;
  description?: string;
  itemIds: string[]; // Order matters for assessment flow
  settings: AssessmentSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssessmentSettings {
  shuffleItems?: boolean;
  timeLimit?: number; // in minutes
  allowReview?: boolean;
  showFeedback?: boolean;
  maxAttempts?: number;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  items: QTIItem[];
  assessments: Assessment[];
  createdAt: Date;
  updatedAt: Date;
  ownerId?: string; // null for temporary projects
  isTemporary?: boolean; // true for localStorage projects
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  isTemporary?: boolean;
}

export interface ProjectSummary {
  id: string;
  name: string;
  description?: string;
  itemCount: number;
  assessmentCount: number;
  createdAt: Date;
  updatedAt: Date;
  isTemporary?: boolean;
}