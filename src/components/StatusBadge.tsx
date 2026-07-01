import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { JobStatus, Priority } from '@/types/models';
import { colors, radius } from '@/theme/theme';

const statusLabels: Record<JobStatus, string> = {
  assigned: 'Tildelt',
  in_progress: 'I gang',
  done: 'Færdig',
};

const statusColors: Record<JobStatus, string> = {
  assigned: colors.statusAssigned,
  in_progress: colors.statusInProgress,
  done: colors.statusDone,
};

export function StatusBadge({ status }: { status: JobStatus }) {
  const color = statusColors[status];
  return (
    <View style={[styles.badge, { backgroundColor: color + '22' }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{statusLabels[status]}</Text>
    </View>
  );
}

const priorityLabels: Record<Priority, string> = {
  low: 'Lav',
  normal: 'Normal',
  high: 'Haster',
};

const priorityColors: Record<Priority, string> = {
  low: colors.priorityLow,
  normal: colors.priorityNormal,
  high: colors.priorityHigh,
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  if (priority === 'normal') return null;
  const color = priorityColors[priority];
  return (
    <View style={[styles.badge, { backgroundColor: color + '22' }]}>
      <Text style={[styles.text, { color }]}>{priorityLabels[priority]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  dot: { width: 7, height: 7, borderRadius: 4, marginRight: 5 },
  text: { fontSize: 12, fontWeight: '600' },
});
