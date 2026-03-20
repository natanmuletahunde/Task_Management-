import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTaskContext } from '@/src/context/TaskContext';
import { GlassCard } from '@/components/GlassCard';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { profile, updateProfile } = useTaskContext();
  const { tasks } = useTaskContext();
  const [name, setName] = useState(profile.name);
  const [stepGoal, setStepGoal] = useState(profile.dailyStepGoal.toString());
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a valid name');
      return;
    }
    updateProfile({
      name: name.trim(),
      dailyStepGoal: parseInt(stepGoal) || 10000,
    });
    setIsEditing(false);
  };

  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.completed).length,
    fitnessTasks: tasks.filter((t) => t.category === 'Fitness').length,
    completionRate: tasks.length > 0 ? ((tasks.filter((t) => t.completed).length / tasks.length) * 100).toFixed(1) : '0',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0f0f0f' : '#f5f5f5' }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Text style={[styles.title, { color: isDark ? '#fff' : '#1f2937' }]}>Profile</Text>
          <Text style={[styles.subtitle, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            Manage your settings and preferences
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <GlassCard style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, { backgroundColor: '#3B82F6' }]}>
                <Text style={styles.avatarText}>{profile.name.charAt(0).toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.profileInfo}>
              {isEditing ? (
                <>
                  <TextInput
                    style={[styles.input, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', color: isDark ? '#fff' : '#1f2937' }]}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                  />
                  <View style={styles.stepGoalContainer}>
                    <Text style={[styles.stepGoalLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                      Daily Step Goal:
                    </Text>
                    <TextInput
                      style={[styles.stepGoalInput, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', color: isDark ? '#fff' : '#1f2937' }]}
                      value={stepGoal}
                      onChangeText={setStepGoal}
                      keyboardType="numeric"
                      placeholder="10000"
                      placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                    />
                  </View>
                  <View style={styles.editButtons}>
                    <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.cancelButton}>
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                      <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <Text style={[styles.profileName, { color: isDark ? '#fff' : '#1f2937' }]}>
                    {profile.name}
                  </Text>
                  <Text style={[styles.stepGoalText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                    Daily step goal: {profile.dailyStepGoal.toLocaleString()}
                  </Text>
                  <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
                    <Ionicons name="create-outline" size={18} color="#3B82F6" />
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <GlassCard style={styles.statsCard}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#1f2937' }]}>
              Your Statistics
            </Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                  <Ionicons name="list" size={24} color="#3B82F6" />
                </View>
                <Text style={[styles.statValue, { color: isDark ? '#fff' : '#1f2937' }]}>
                  {stats.totalTasks}
                </Text>
                <Text style={[styles.statLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                  Total Tasks
                </Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                  <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                </View>
                <Text style={[styles.statValue, { color: isDark ? '#fff' : '#1f2937' }]}>
                  {stats.completedTasks}
                </Text>
                <Text style={[styles.statLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                  Completed
                </Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}>
                  <Ionicons name="fitness" size={24} color="#8B5CF6" />
                </View>
                <Text style={[styles.statValue, { color: isDark ? '#fff' : '#1f2937' }]}>
                  {stats.fitnessTasks}
                </Text>
                <Text style={[styles.statLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                  Fitness Tasks
                </Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                  <Ionicons name="analytics-outline" size={24} color="#F59E0B" />
                </View>
                <Text style={[styles.statValue, { color: isDark ? '#fff' : '#1f2937' }]}>
                  {stats.completionRate}%
                </Text>
                <Text style={[styles.statLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                  Completion Rate
                </Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <GlassCard style={styles.settingsCard}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#1f2937' }]}>
              Quick Actions
            </Text>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="notifications-outline" size={24} color="#3B82F6" />
                <Text style={[styles.settingText, { color: isDark ? '#fff' : '#1f2937' }]}>
                  Notifications
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="color-palette-outline" size={24} color="#8B5CF6" />
                <Text style={[styles.settingText, { color: isDark ? '#fff' : '#1f2937' }]}>
                  Appearance
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="shield-checkmark-outline" size={24} color="#10B981" />
                <Text style={[styles.settingText, { color: isDark ? '#fff' : '#1f2937' }]}>
                  Privacy
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="help-circle-outline" size={24} color="#F59E0B" />
                <Text style={[styles.settingText, { color: isDark ? '#fff' : '#1f2937' }]}>
                  Help & Support
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
            </TouchableOpacity>
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.footer}>
          <Text style={[styles.version, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            Todo App v1.0.0
          </Text>
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
  profileCard: {
    marginBottom: 16,
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  stepGoalText: {
    fontSize: 14,
    marginBottom: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  editButtonText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  stepGoalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  stepGoalLabel: {
    fontSize: 14,
  },
  stepGoalInput: {
    padding: 8,
    borderRadius: 8,
    fontSize: 16,
    width: 100,
    textAlign: 'center',
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontWeight: '600',
  },
  saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  statsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: 16,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  settingsCard: {
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  version: {
    fontSize: 12,
  },
});
