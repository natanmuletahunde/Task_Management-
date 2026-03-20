import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTaskContext } from '@/src/context/TaskContext';
import { TaskItem } from '@/components/TaskItem';
import { FilterTabs } from '@/components/FilterTabs';
import { EmptyState } from '@/components/EmptyState';
import { GlassCard } from '@/components/GlassCard';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { tasks, toggleTask, deleteTask, getFilteredTasks, getStats, profile } = useTaskContext();
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const filteredTasks = getFilteredTasks(filter);
  const stats = getStats();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0f0f0f' : '#f5f5f5' }]} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              {getGreeting()}
            </Text>
            <Text style={[styles.name, { color: isDark ? '#fff' : '#1f2937' }]}>
              {profile.name}!
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/modal')}
            style={[styles.addButton, { backgroundColor: '#3B82F6' }]}>
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <GlassCard style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <Text style={[styles.statsTitle, { color: isDark ? '#fff' : '#1f2937' }]}>
                Today's Progress
              </Text>
              <Text style={[styles.completionRate, { color: '#3B82F6' }]}>
                {stats.completionRate.toFixed(0)}%
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${stats.completionRate}%`, backgroundColor: '#3B82F6' },
                  ]}
                />
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#10B981' }]}>{stats.completed}</Text>
                <Text style={[styles.statLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>Completed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#F59E0B' }]}>{stats.pending}</Text>
                <Text style={[styles.statLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>Pending</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#8B5CF6' }]}>{stats.total}</Text>
                <Text style={[styles.statLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>Total</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.filterContainer}>
          <FilterTabs
            activeFilter={filter}
            onFilterChange={setFilter}
            counts={{
              all: tasks.length,
              completed: tasks.filter((t) => t.completed).length,
              pending: tasks.filter((t) => !t.completed).length,
            }}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.tasksContainer}>
          {filteredTasks.length === 0 ? (
            <EmptyState />
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => toggleTask(task.id)}
                onDelete={() => deleteTask(task.id)}
                onPress={() => router.push({ pathname: '/modal', params: { taskId: task.id } })}
              />
            ))
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  statsCard: {
    marginBottom: 24,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  completionRate: {
    fontSize: 24,
    fontWeight: '700',
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  filterContainer: {
    marginBottom: 8,
  },
  tasksContainer: {
    flex: 1,
  },
});
