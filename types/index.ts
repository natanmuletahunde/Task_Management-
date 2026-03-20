export type Category = 'Work' | 'Personal' | 'Fitness' | 'Shopping' | 'Health' | 'Other';

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category: Category;
  priority: Priority;
  dueDate?: string;
  imageUrl?: string;
  stepGoal?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  name: string;
  dailyStepGoal: number;
  theme: 'light' | 'dark' | 'system';
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
}
