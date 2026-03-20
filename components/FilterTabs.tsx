import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/context/ThemeContext';

interface FilterTabsProps {
  activeFilter: 'all' | 'completed' | 'pending';
  onFilterChange: (filter: 'all' | 'completed' | 'pending') => void;
  counts: { all: number; completed: number; pending: number };
}

const filters: Array<{ key: 'all' | 'completed' | 'pending'; label: string; icon: string }> = [
  { key: 'all', label: 'All', icon: 'list' },
  { key: 'pending', label: 'Pending', icon: 'time-outline' },
  { key: 'completed', label: 'Done', icon: 'checkmark-circle' },
];

export function FilterTabs({ activeFilter, onFilterChange, counts }: FilterTabsProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)' }]}>
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.key}
          onPress={() => onFilterChange(filter.key)}
          style={[
            styles.tab,
            activeFilter === filter.key && styles.activeTab,
            activeFilter === filter.key && { backgroundColor: '#3B82F6' },
          ]}>
          <Ionicons
            name={filter.icon as any}
            size={18}
            color={activeFilter === filter.key ? '#fff' : (isDark ? '#9ca3af' : '#6b7280')}
          />
          <Text
            style={[
              styles.tabText,
              { color: isDark ? '#fff' : '#1f2937' },
              activeFilter === filter.key && styles.activeTabText,
            ]}>
            {filter.label}
          </Text>
          <View
            style={[
              styles.badge,
              activeFilter === filter.key ? { backgroundColor: 'rgba(255,255,255,0.2)' } : { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
            ]}>
            <Text
              style={[
                styles.badgeText,
                activeFilter === filter.key && { color: '#fff' },
              ]}>
              {counts[filter.key]}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 6,
  },
  activeTab: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
});
