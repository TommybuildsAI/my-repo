import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Job, TeamMember } from '@/types/models';
import { colors, radius, spacing } from '@/theme/theme';
import { Avatar } from '@/components/ui/Avatar';

interface Props {
  member: TeamMember;
  activeJob?: Job;
  jobCount?: number;
  onPress?: () => void;
}

export function TeamMemberRow({ member, activeJob, jobCount, onPress }: Props) {
  const online = !!activeJob && activeJob.status === 'in_progress';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View>
        <Avatar name={member.name} color={member.avatarColor} size={46} />
        <View style={[styles.statusDot, { backgroundColor: online ? colors.online : colors.offline }]} />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{member.name}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {activeJob
            ? `${online ? 'I gang: ' : 'Næste: '}${activeJob.title}`
            : member.title}
        </Text>
      </View>

      {typeof jobCount === 'number' && (
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{jobCount}</Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  pressed: { opacity: 0.6 },
  statusDot: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.card,
  },
  info: { flex: 1 },
  name: { fontSize: 17, fontWeight: '600', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 1 },
  countBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 7,
    backgroundColor: colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
});
