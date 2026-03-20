import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Task } from '@/types';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onPress: () => void;
}

const categoryColors: Record<string, string> = {
  Work: '#3B82F6',
  Personal: '#8B5CF6',
  Fitness: '#10B981',
  Shopping: '#F59E0B',
  Health: '#EF4444',
  Other: '#6B7280',
};

const priorityIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  high: 'alert-circle',
  medium: 'ellipse',
  low: 'ellipse-outline',
};

export function TaskItem({ task, onToggle, onDelete, onPress }: TaskItemProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onToggle();
  };

  const handleDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onDelete();
  };

  return (
    <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)} className="mb-3">
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[
          styles.container,
          { backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.95)' },
          task.completed && styles.completedContainer,
        ]}>
        {task.imageUrl && (
          <Image
            source={{ uri: task.imageUrl }}
            style={styles.image}
            placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
            contentFit="cover"
            transition={200}
          />
        )}
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleToggle} style={styles.checkbox}>
              <View
                style={[
                  styles.checkboxInner,
                  { borderColor: categoryColors[task.category] },
                  task.completed && { backgroundColor: categoryColors[task.category] },
                ]}>
                {task.completed && <Ionicons name="checkmark" size={16} color="white" />}
              </View>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text
                style={[
                  styles.title,
                  { color: isDark ? '#fff' : '#1f2937' },
                  task.completed && styles.completedText,
                ]}
                numberOfLines={1}>
                {task.title}
              </Text>
              {task.description && (
                <Text
                  style={[styles.description, { color: isDark ? '#9ca3af' : '#6b7280' }]}
                  numberOfLines={1}>
                  {task.description}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.footer}>
            <View style={styles.tags}>
              <View style={[styles.categoryBadge, { backgroundColor: categoryColors[task.category] }]}>
                <Text style={styles.categoryText}>{task.category}</Text>
              </View>
              <Ionicons
                name={priorityIcons[task.priority]}
                size={16}
                color={task.priority === 'high' ? '#EF4444' : task.priority === 'medium' ? '#F59E0B' : '#10B981'}
              />
              {task.dueDate && (
                <View style={styles.dueDateContainer}>
                  <Ionicons name="calendar-outline" size={14} color={isDark ? '#9ca3af' : '#6b7280'} />
                  <Text style={[styles.dueDate, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
  },
  completedContainer: {
    opacity: 0.7,
  },
  image: {
    width: 80,
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    marginRight: 12,
    padding: 2,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  description: {
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDate: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 4,
  },
});
