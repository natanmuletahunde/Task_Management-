import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTaskContext } from '@/src/context/TaskContext';
import { Category, Priority } from '@/types';
import { useTheme } from '@/src/context/ThemeContext';

const categories: Category[] = ['Work', 'Personal', 'Fitness', 'Shopping', 'Health', 'Other'];
const priorities: Priority[] = ['low', 'medium', 'high'];

export default function AddTaskModal() {
  const router = useRouter();
  const { taskId } = useLocalSearchParams<{ taskId?: string }>();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { tasks, addTask, updateTask } = useTaskContext();

  const existingTask = taskId ? tasks.find((t) => t.id === taskId) : null;

  const [title, setTitle] = useState(existingTask?.title || '');
  const [description, setDescription] = useState(existingTask?.description || '');
  const [category, setCategory] = useState<Category>(existingTask?.category || 'Work');
  const [priority, setPriority] = useState<Priority>(existingTask?.priority || 'medium');
  const [stepGoal, setStepGoal] = useState(existingTask?.stepGoal?.toString() || '');
  const [dueDate, setDueDate] = useState(existingTask?.dueDate?.split('T')[0] || '');

  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title);
      setDescription(existingTask.description || '');
      setCategory(existingTask.category);
      setPriority(existingTask.priority);
      setStepGoal(existingTask.stepGoal?.toString() || '');
      setDueDate(existingTask.dueDate?.split('T')[0] || '');
    }
  }, [existingTask]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim() || undefined,
      completed: existingTask?.completed || false,
      category,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      stepGoal: stepGoal ? parseInt(stepGoal) : undefined,
    };

    if (existingTask) {
      updateTask(existingTask.id, taskData);
    } else {
      addTask(taskData);
    }

    router.back();
  };

  const categoryColors: Record<string, string> = {
    Work: '#3B82F6',
    Personal: '#8B5CF6',
    Fitness: '#10B981',
    Shopping: '#F59E0B',
    Health: '#EF4444',
    Other: '#6B7280',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0f0f0f' : '#f5f5f5' }]} edges={['bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <View style={[styles.header, { borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={isDark ? '#fff' : '#1f2937'} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#1f2937' }]}>
            {existingTask ? 'Edit Task' : 'New Task'}
          </Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <Animated.View entering={FadeIn.delay(100)}>
            <Text style={[styles.label, { color: isDark ? '#fff' : '#1f2937' }]}>Title *</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', color: isDark ? '#fff' : '#1f2937' },
              ]}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter task title"
              placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
            />
          </Animated.View>

          <Animated.View entering={FadeIn.delay(150)}>
            <Text style={[styles.label, { color: isDark ? '#fff' : '#1f2937' }]}>Description</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', color: isDark ? '#fff' : '#1f2937' },
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter task description"
              placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
              multiline
              numberOfLines={3}
            />
          </Animated.View>

          <Animated.View entering={FadeIn.delay(200)}>
            <Text style={[styles.label, { color: isDark ? '#fff' : '#1f2937' }]}>Category</Text>
            <View style={styles.optionsGrid}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={[
                    styles.optionButton,
                    { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
                    category === cat && { backgroundColor: categoryColors[cat] },
                  ]}>
                  <Text
                    style={[
                      styles.optionText,
                      { color: isDark ? '#fff' : '#1f2937' },
                      category === cat && styles.selectedOptionText,
                    ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(250)}>
            <Text style={[styles.label, { color: isDark ? '#fff' : '#1f2937' }]}>Priority</Text>
            <View style={styles.priorityContainer}>
              {priorities.map((pri) => (
                <TouchableOpacity
                  key={pri}
                  onPress={() => setPriority(pri)}
                  style={[
                    styles.priorityButton,
                    { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
                    priority === pri && styles.selectedPriority,
                    priority === pri && {
                      backgroundColor:
                        pri === 'high' ? '#EF4444' : pri === 'medium' ? '#F59E0B' : '#10B981',
                    },
                  ]}>
                  <Ionicons
                    name={pri === 'high' ? 'alert-circle' : pri === 'medium' ? 'ellipse' : 'ellipse-outline'}
                    size={20}
                    color={priority === pri ? '#fff' : isDark ? '#fff' : '#1f2937'}
                  />
                  <Text
                    style={[
                      styles.priorityText,
                      { color: isDark ? '#fff' : '#1f2937' },
                      priority === pri && styles.selectedOptionText,
                    ]}>
                    {pri.charAt(0).toUpperCase() + pri.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(300)}>
            <Text style={[styles.label, { color: isDark ? '#fff' : '#1f2937' }]}>Due Date</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', color: isDark ? '#fff' : '#1f2937' },
              ]}
              value={dueDate}
              onChangeText={setDueDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
            />
          </Animated.View>

          {category === 'Fitness' && (
            <Animated.View entering={FadeIn.delay(350)}>
              <Text style={[styles.label, { color: isDark ? '#fff' : '#1f2937' }]}>Step Goal</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', color: isDark ? '#fff' : '#1f2937' },
                ]}
                value={stepGoal}
                onChangeText={setStepGoal}
                placeholder="e.g., 5000"
                placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                keyboardType="numeric"
              />
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 16,
  },
  input: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#fff',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  selectedPriority: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
