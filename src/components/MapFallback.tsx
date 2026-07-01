import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { Job, TeamMember } from '@/types/models';
import { useLocations } from '@/context/LocationContext';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/StatusBadge';
import { ListSection, ListRow, Cell } from '@/components/ui/List';
import { colors, spacing, type } from '@/theme/theme';

interface Props {
  members: TeamMember[];
  jobs: Job[];
}

/**
 * Shown instead of the interactive map on standalone Android builds with no
 * Google Maps key. Presents the same live data as iOS grouped lists.
 */
export function MapFallback({ members, jobs }: Props) {
  const { pings } = useLocations();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.md }]}
    >
      <View style={styles.note}>
        <Ionicons name="information-circle" size={18} color={colors.primary} />
        <Text style={[type.footnote, styles.noteText]}>
          Live-liste. Tilføj en Google Maps-nøgle for det interaktive kort på Android.
        </Text>
      </View>

      <ListSection header="Holdet lige nu" separatorInset={64}>
        {members.map((m) => {
          const ping = pings[m.id];
          return (
            <ListRow
              key={m.id}
              leading={<Avatar name={m.name} color={m.avatarColor} size={36} />}
              title={m.name}
              subtitle={
                ping
                  ? `${ping.coordinate.latitude.toFixed(4)}, ${ping.coordinate.longitude.toFixed(4)}`
                  : 'Ingen position'
              }
              rightNode={<Ionicons name="navigate" size={16} color={colors.tertiaryLabel} />}
            />
          );
        })}
      </ListSection>

      <ListSection header="Opgaver på kortet" separatorInset={58}>
        {jobs.map((j) => (
          <Cell key={j.id}>
            <View style={[styles.pin, { backgroundColor: colors.primary }]}>
              <Ionicons name="location" size={16} color={colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={type.body} numberOfLines={1}>
                {j.title}
              </Text>
              <Text style={[type.footnote, styles.addr]} numberOfLines={1}>
                {j.address}
              </Text>
            </View>
            <StatusBadge status={j.status} />
          </Cell>
        ))}
      </ListSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.groupedBackground },
  content: { paddingTop: spacing.md, paddingBottom: spacing.xxl },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  noteText: { flex: 1, color: colors.secondaryLabel },
  pin: {
    width: 30,
    height: 30,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  addr: { color: colors.secondaryLabel, marginTop: 1 },
});
