import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { JobStatus, Priority } from '@/types/models';
import { colors, type } from '@/theme/theme';

const statusLabels: Record<JobStatus, string> = {
  assigned: 'Tildelt',
  in_progress: 'I gang',
  done: 'Færdig',
};

const statusColors: Record<JobStatus, string> = {
  assigned: colors.gray,
  in_progress: colors.orange,
  done: colors.green,
};

/** Inline status indicator: coloured dot + coloured label (no filled pill). */
export function StatusBadge({ status }: { status: JobStatus }) {
  const color = statusColors[status];
  return (
    <View style={styles.row}>
      {status === 'done' ? (
        <Ionicons name="checkmark-circle" size={15} color={color} />
      ) : (
        <View style={[styles.dot, { backgroundColor: color }]} />
      )}
      <Text style={[type.footnote, styles.label, { color }]}>{statusLabels[status]}</Text>
    </View>
  );
}

const priorityLabels: Record<Priority, string> = {
  low: 'Lav',
  normal: 'Normal',
  high: 'Haster',
};

/** Only "high" priority is surfaced, as a red SF-style label. */
export function PriorityBadge({ priority }: { priority: Priority }) {
  if (priority !== 'high') return null;
  return (
    <View style={styles.row}>
      <Ionicons name="alert-circle" size={15} color={colors.red} />
      <Text style={[type.footnote, styles.label, { color: colors.red }]}>{priorityLabels.high}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { fontWeight: '500' },
});
