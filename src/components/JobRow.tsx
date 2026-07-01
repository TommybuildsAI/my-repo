import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Job, JobType, TeamMember } from '@/types/models';
import { colors, spacing, type } from '@/theme/theme';
import { formatSchedule } from '@/utils/format';
import { Cell } from '@/components/ui/List';
import { StatusBadge } from '@/components/StatusBadge';

interface Props {
  job: Job;
  assignee?: TeamMember;
  onPress: () => void;
  showAssignee?: boolean;
}

// Map each VVS job type to an SF-style icon + tint (like Settings app row icons).
const typeIcon: Record<JobType, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  'Utæt vandhane': { icon: 'water', color: colors.primary },
  'Afløb tilstoppet': { icon: 'water', color: colors.primary },
  'Toilet reparation': { icon: 'water', color: colors.primary },
  'Fjernvarme service': { icon: 'flame', color: colors.orange },
  'Gaskedel eftersyn': { icon: 'flame', color: colors.orange },
  'Vandvarmer udskiftning': { icon: 'thermometer', color: colors.red },
  'Radiator montering': { icon: 'thermometer', color: colors.red },
  'Badeværelse renovering': { icon: 'construct', color: colors.indigo },
};

export function JobRow({ job, assignee, onPress, showAssignee = true }: Props) {
  const { icon, color } = typeIcon[job.jobType];
  return (
    <Cell onPress={onPress} style={styles.cell}>
      <View style={[styles.iconTile, { backgroundColor: color }]}>
        <Ionicons name={icon} size={18} color={colors.white} />
      </View>

      <View style={styles.body}>
        <Text style={[type.body, styles.title]} numberOfLines={1}>
          {job.title}
        </Text>
        <Text style={[type.footnote, styles.secondary]} numberOfLines={1}>
          {job.customerName} · {job.address}
        </Text>
        <View style={styles.metaRow}>
          <Text style={[type.footnote, styles.meta]}>{formatSchedule(job.scheduledFor)}</Text>
          <Text style={styles.dotSep}>·</Text>
          <StatusBadge status={job.status} />
          {showAssignee ? (
            <>
              <Text style={styles.dotSep}>·</Text>
              <Text style={[type.footnote, styles.meta]} numberOfLines={1}>
                {assignee ? assignee.name.split(' ')[0] : 'Ikke tildelt'}
              </Text>
            </>
          ) : null}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={17} color={colors.tertiaryLabel} style={styles.chevron} />
    </Cell>
  );
}

const styles = StyleSheet.create({
  cell: { alignItems: 'flex-start' },
  iconTile: {
    width: 30,
    height: 30,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 1,
  },
  body: { flex: 1, gap: 2 },
  title: { color: colors.label, fontWeight: '400' },
  secondary: { color: colors.secondaryLabel },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  meta: { color: colors.secondaryLabel },
  dotSep: { color: colors.tertiaryLabel, fontSize: 12 },
  chevron: { marginLeft: 6, marginTop: 8, marginRight: -4 },
});
