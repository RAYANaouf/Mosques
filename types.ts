export interface Student {
  id: string;
  name: string;
  grade: number; // 0-100
  behaviorScore: number; // 0-10
  interests: string[];
  notes?: string;
  birthDate?: string;
  age?: number;
  email?: string;
  password?: string;
  phone?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  parentPassword?: string; // New field for parent login
  currentSurah?: string; // Tracking progress
  currentAyah?: number; // Tracking Ayah number
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  email: string;
  password?: string;
  yearsExperience: number;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  studentIds: string[];
  teacherId?: string; // Link to a teacher
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string; // ISO string
  durationMinutes: number;
  groupId?: string; // Optional linkage to a group
  teacherId?: string; // Optional linkage to a teacher
  type: 'class' | 'meeting' | 'activity';
}

export type ViewState = 'dashboard' | 'students' | 'teachers' | 'groups' | 'scheduler' | 'settings';