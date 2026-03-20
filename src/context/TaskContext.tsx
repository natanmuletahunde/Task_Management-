import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, UserProfile, Category, Priority } from '@/types';
import { StorageService } from '@/src/storage';

interface TaskContextType {
  tasks: Task[];
  profile: UserProfile;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  getFilteredTasks: (filter: 'all' | 'completed' | 'pending') => Task[];
  getTasksByCategory: (category: Category) => Task[];
  getStats: () => { total: number; completed: number; pending: number; completionRate: number };
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'User',
    dailyStepGoal: 10000,
    theme: 'system',
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [loadedTasks, loadedProfile] = await Promise.all([
      StorageService.getTasks(),
      StorageService.getProfile(),
    ]);
    setTasks(loadedTasks);
    setProfile(loadedProfile);
    setIsLoaded(true);
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    StorageService.saveTasks(updatedTasks);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
    );
    setTasks(updatedTasks);
    StorageService.saveTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    StorageService.saveTasks(updatedTasks);
  };

  const toggleTask = (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() } : task
    );
    setTasks(updatedTasks);
    StorageService.saveTasks(updatedTasks);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);
    StorageService.saveProfile(updatedProfile);
  };

  const getFilteredTasks = (filter: 'all' | 'completed' | 'pending'): Task[] => {
    switch (filter) {
      case 'completed':
        return tasks.filter((task) => task.completed);
      case 'pending':
        return tasks.filter((task) => !task.completed);
      default:
        return tasks;
    }
  };

  const getTasksByCategory = (category: Category): Task[] => {
    return tasks.filter((task) => task.category === category);
  };

  const getStats = () => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    return { total, completed, pending, completionRate };
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        profile,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        updateProfile,
        getFilteredTasks,
        getTasksByCategory,
        getStats,
      }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}
