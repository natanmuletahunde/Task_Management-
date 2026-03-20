import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, UserProfile } from '@/types';

const TASKS_KEY = '@todo_tasks';
const PROFILE_KEY = '@todo_profile';

export const StorageService = {
  async getTasks(): Promise<Task[]> {
    try {
      const data = await AsyncStorage.getItem(TASKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  },

  async saveTasks(tasks: Task[]): Promise<void> {
    try {
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  },

  async getProfile(): Promise<UserProfile> {
    try {
      const data = await AsyncStorage.getItem(PROFILE_KEY);
      return data ? JSON.parse(data) : { name: 'User', dailyStepGoal: 10000, theme: 'system' };
    } catch (error) {
      console.error('Error loading profile:', error);
      return { name: 'User', dailyStepGoal: 10000, theme: 'system' };
    }
  },

  async saveProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  },
};
