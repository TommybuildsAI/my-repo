import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Job, TeamMember } from '@/types/models';
import { useLocations } from '@/context/LocationContext';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/StatusBadge';
import { colors, radius, spacing } from '@/theme/theme';

interface Props {
  members: TeamMember[];
  jobs: Job[];
}

/**
 * Shown instead of the interactive map on standalone Android builds that have
 * no Google Maps API key configured. Presents the same live data (team members
 * with their moving coordinates + job sites) as an iOS-styled list, so the tab
 * is still useful without a key.
 */
export function MapFallback({ members, jobs }: Props) {
  const { pings } = useLocations();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.note}>
        <Ionicons name="information-circle" size={18} color={colors.primary} />
        <Text style={styles.noteText}>
          Live-listevisning. Tilføj en Google Maps-nøgle for det interaktive kort på Android.
        </Text>
      </View>

      <Text style={styles.sectionLabel}>HOLDET LIGE NU</Text>
      {members.map((m) => {
        const ping = pings[m.id];
        return (
          <View key={m.id} style={styles.row}>
            <Avatar name={m.name} color={m.avatarColor} size={40} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{m.name}</Text>
              <Text style={styles.coord}>
                {ping
                  ? `${ping.coordinate.latitude.toFixed(4)}, ${ping.coordinate.longitude.toFixed(4)}`
                  : 'Ingen position'}
              </Text>
            </View>
            <Ionicons name="navigate" size={16} color={colors.textTertiary} />
          </View>
        );
      })}

      <Text style={styles.sectionLabel}>OPGAVER PÅ KORTET</Text>
      {jobs.map((j) => (
        <View key={j.id} style={styles.row}>
          <View style={styles.pin}>
            <Ionicons name="location" size={18} color={colors.textInverse} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{j.title}</Text>
            <Text style={styles.coord} numberOfLines={1}>
              {j.address}
            </Text>
          </View>
          <StatusBadge status={j.status} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary + '14',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  noteText: { flex: 1, fontSize: 13, color: colors.textSecondary },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textTertiary,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
    marginLeft: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  coord: { fontSize: 13, color: colors.textTertiary, marginTop: 1 },
  pin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.priorityNormal,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
