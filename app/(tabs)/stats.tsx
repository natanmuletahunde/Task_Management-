import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTaskContext } from '@/src/context/TaskContext';
import { usePedometer } from '@/src/hooks/usePedometer';
import { GlassCard } from '@/components/GlassCard';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Task } from '@/types';

export default function StatsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { tasks, getStats, profile, getTasksByCategory } = useTaskContext();
  const { stepCount, isAvailable, permissionGranted, isLoading, refresh } = usePedometer();
  const [refreshing, setRefreshing] = useState(false);

  const stats = getStats();
  const stepProgress = Math.min((stepCount / profile.dailyStepGoal) * 100, 100);

  const categories = ['Work', 'Personal', 'Fitness', 'Shopping', 'Health', 'Other'] as const;
  const categoryStats: Array<{ category: Task['category']; total: number; completed: number }> = categories.map((cat) => {
    const catTasks = getTasksByCategory(cat);
    const completed = catTasks.filter((t) => t.completed).length;
    return { category: cat, total: catTasks.length, completed };
  });

  const onRefresh = () => {
    setRefreshing(true);
    refresh();
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0f0f0f' : '#f5f5f5' }]} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Text style={[styles.title, { color: isDark ? '#fff' : '#1f2937' }]}>Statistics</Text>
          <Text style={[styles.subtitle, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            Track your progress and fitness
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <GlassCard style={styles.pedometerCard}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <Ionicons name="footsteps" size={28} color="#10B981" />
              </View>
              <View>
                <Text style={[styles.cardTitle, { color: isDark ? '#fff' : '#1f2937' }]}>
                  Daily Steps
                </Text>
                <Text style={[styles.stepCount, { color: '#10B981' }]}>
                  {stepCount.toLocaleString()}
                </Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}>
                <View
                  style={[styles.progressFill, { width: `${stepProgress}%`, backgroundColor: '#10B981' }]}
                />
              </View>
              <Text style={[styles.progressText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                {stepProgress.toFixed(0)}% of {profile.dailyStepGoal.toLocaleString()} goal
              </Text>
            </View>

            {!isAvailable && !isLoading && (
              <View style={styles.unavailableContainer}>
                <Ionicons name="alert-circle-outline" size={20} color="#F59E0B" />
                <Text style={[styles.unavailableText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                  Pedometer not available on this device
                </Text>
              </View>
            )}

            {isAvailable && !permissionGranted && !isLoading && (
              <View style={styles.unavailableContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#F59E0B" />
                <Text style={[styles.unavailableText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                  Enable motion permissions to track steps
                </Text>
              </View>
            )}
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <GlassCard style={styles.overviewCard}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#1f2937' }]}>
              Task Overview
            </Text>
            <View style={styles.overviewGrid}>
              <View style={styles.overviewItem}>
                <View style={[styles.overviewIcon, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                  <Ionicons name="list" size={24} color="#3B82F6" />
                </View>
                <Text style={[styles.overviewValue, { color: isDark ? '#fff' : '#1f2937' }]}>
                  {stats.total}
                </Text>
                <Text style={[styles.overviewLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                  Total Tasks
                </Text>
              </View>
              <View style={styles.overviewItem}>
                <View style={[styles.overviewIcon, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                  <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                </View>
                <Text style={[styles.overviewValue, { color: isDark ? '#fff' : '#1f2937' }]}>
                  {stats.completed}
                </Text>
                <Text style={[styles.overviewLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                  Completed
                </Text>
              </View>
              <View style={styles.overviewItem}>
                <View style={[styles.overviewIcon, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                  <Ionicons name="time" size={24} color="#F59E0B" />
                </View>
                <Text style={[styles.overviewValue, { color: isDark ? '#fff' : '#1f2937' }]}>
                  {stats.pending}
                </Text>
                <Text style={[styles.overviewLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                  Pending
                </Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <GlassCard style={styles.categoriesCard}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#1f2937' }]}>
              Categories
            </Text>
            {categoryStats.map((cat) => {
              const percentage = cat.total > 0 ? (cat.completed / cat.total) * 100 : 0;
              return (
                <View key={cat.category} style={styles.categoryRow}>
                  <View style={styles.categoryInfo}>
                    <Text style={[styles.categoryName, { color: isDark ? '#fff' : '#1f2937' }]}>
                      {cat.category}
                    </Text>
                    <Text style={[styles.categoryCount, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                      {cat.completed}/{cat.total}
                    </Text>
                  </View>
                  <View style={[styles.categoryProgress, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}>
                    <View
                      style={[
                        styles.categoryFill,
                        { width: `${percentage}%`, backgroundColor: getCategoryColor(cat.category) },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </GlassCard>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Work: '#3B82F6',
    Personal: '#8B5CF6',
    Fitness: '#10B981',
    Shopping: '#F59E0B',
    Health: '#EF4444',
    Other: '#6B7280',
  };
  return colors[category] || '#6B7280';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  pedometerCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  stepCount: {
    fontSize: 32,
    fontWeight: '700',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 13,
    textAlign: 'center',
  },
  unavailableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
  },
  unavailableText: {
    fontSize: 13,
    flex: 1,
  },
  overviewCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  overviewGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewItem: {
    alignItems: 'center',
    flex: 1,
  },
  overviewIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
  },
  categoriesCard: {
    marginBottom: 16,
  },
  categoryRow: {
    marginBottom: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryCount: {
    fontSize: 13,
  },
  categoryProgress: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  categoryFill: {
    height: '100%',
    borderRadius: 4,
  },
});
