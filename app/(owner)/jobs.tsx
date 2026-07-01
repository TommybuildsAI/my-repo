import React from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { useData } from '@/context/DataContext';
import { JobCard } from '@/components/JobCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { colors, radius, spacing } from '@/theme/theme';
import type { Job } from '@/types/models';

type Filter = 'all' | 'unassigned' | 'active' | 'done';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Alle' },
  { key: 'unassigned', label: 'Ikke tildelt' },
  { key: 'active', label: 'Aktive' },
  { key: 'done', label: 'Færdige' },
];

export default function OwnerJobsScreen() {
  const { jobs, memberById, refreshFromCrm, loading } = useData();
  const router = useRouter();
  const navigation = useNavigation();
  const [filter, setFilter] = React.useState<Filter>('all');

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerLargeTitle: true, title: 'Opgaver' });
  }, [navigation]);

  const filtered = jobs.filter((j: Job) => {
    switch (filter) {
      case 'unassigned':
        return j.assignedToId === null;
      case 'active':
        return j.status === 'assigned' || j.status === 'in_progress';
      case 'done':
        return j.status === 'done';
      default:
        return true;
    }
  });

  const unassignedCount = jobs.filter((j) => j.assignedToId === null).length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refreshFromCrm} tintColor={colors.primary} />
      }
    >
      <View style={styles.segment}>
        {FILTERS.map((f) => (
          <Pressable
            key={f.key}
            onPress={() => setFilter(f.key)}
            style={[styles.segmentItem, filter === f.key && styles.segmentItemActive]}
          >
            <Text style={[styles.segmentText, filter === f.key && styles.segmentTextActive]}>
              {f.label}
              {f.key === 'unassigned' && unassignedCount > 0 ? ` (${unassignedCount})` : ''}
            </Text>
          </Pressable>
        ))}
      </View>

      {filtered.length === 0 ? (
        <EmptyState icon="checkmark-done-outline" title="Ingen opgaver her" />
      ) : (
        filtered.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            assignee={memberById(job.assignedToId)}
            onPress={() => router.push(`/job/${job.id}`)}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.fillSecondary,
    borderRadius: radius.md,
    padding: 3,
    marginBottom: spacing.lg,
  },
  segmentItem: { flex: 1, paddingVertical: 7, borderRadius: radius.sm, alignItems: 'center' },
  segmentItemActive: {
    backgroundColor: colors.card,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  segmentText: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
  segmentTextActive: { color: colors.text, fontWeight: '600' },
});
