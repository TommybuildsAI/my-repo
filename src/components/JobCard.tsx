import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Job, TeamMember } from '@/types/models';
import { colors, radius, spacing } from '@/theme/theme';
import { formatSchedule } from '@/utils/format';
import { PriorityBadge, StatusBadge } from '@/components/StatusBadge';

interface Props {
  job: Job;
  assignee?: TeamMember;
  onPress: () => void;
  showAssignee?: boolean;
}

export function JobCard({ job, assignee, onPress, showAssignee = true }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={1}>
          {job.title}
        </Text>
        <PriorityBadge priority={job.priority} />
      </View>

      <Text style={styles.customer} numberOfLines={1}>
        {job.customerName}
      </Text>

      <View style={styles.metaRow}>
        <Ionicons name="location-outline" size={14} color={colors.textTertiary} />
        <Text style={styles.meta} numberOfLines={1}>
          {job.address}
        </Text>
      </View>

      <View style={styles.metaRow}>
        <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
        <Text style={styles.meta}>
          {formatSchedule(job.scheduledFor)} · {job.estimatedHours} t
        </Text>
      </View>

      <View style={styles.footerRow}>
        <StatusBadge status={job.status} />
        {showAssignee && (
          <View style={styles.assigneeRow}>
            <Ionicons
              name={assignee ? 'person-circle' : 'person-add-outline'}
              size={16}
              color={assignee ? colors.textSecondary : colors.primary}
            />
            <Text style={[styles.assignee, !assignee && { color: colors.primary }]}>
              {assignee ? assignee.name : 'Ikke tildelt'}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: 4,
  },
  pressed: { opacity: 0.6 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 17, fontWeight: '600', color: colors.text, flexShrink: 1, marginRight: 8 },
  customer: { fontSize: 15, color: colors.textSecondary },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  meta: { fontSize: 13, color: colors.textTertiary, flexShrink: 1 },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  assigneeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  assignee: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
});
