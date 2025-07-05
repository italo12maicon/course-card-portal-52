
export interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  registrationDate: string;
  accessibleCourses: number[];
  ipAddress?: string;
  lastLogin?: string;
  loginCount?: number;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  isCompleted: boolean;
}

export interface Topic {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  lessons: Lesson[];
  progress: number;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  progress: number;
  category: string;
  isLocked: boolean;
  isFree: boolean;
  hasAccess: boolean;
  rating: number;
  students: number;
  topics: Topic[];
}

export interface Banner {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  buttonText: string;
  isActive: boolean;
  createdAt: string;
}

export interface Notification {
  id: number;
  message: string;
  type: "info" | "warning" | "success";
  isActive: boolean;
  hasButton: boolean;
  buttonText?: string;
  buttonUrl?: string;
}
