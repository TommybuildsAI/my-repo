import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useData } from '@/context/DataContext';
import { JobRow } from '@/components/JobRow';
import { LargeTitle } from '@/components/ui/LargeTitle';
import { Segmented } from '@/components/ui/Segmented';
import { ListSection } from '@/components/ui/List';
import { EmptyState } from '@/components/ui/EmptyState';
import { colors, spacing } from '@/theme/theme';
import type { Job } from '@/types/models';

type Filter = 'all' | 'unassigned' | 'active' | 'done';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Alle' },
  { key: 'unassigned', label: 'Ny' },
  { key: 'active', label: 'Aktive' },
  { key: 'done', label: 'Færdige' },
];

export default function OwnerJobsScreen() {
  const { jobs, memberById, refreshFromCrm, loading } = useData();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = React.useState<Filter>('all');

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
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: spacing.xxl }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshFromCrm} tintColor={colors.gray} />
        }
      >
        <LargeTitle
          title="Opgaver"
          subtitle={unassignedCount > 0 ? `${unassignedCount} nye fra CRM` : 'Alle opgaver tildelt'}
        />

        <View style={styles.segment}>
          <Segmented options={FILTERS} value={filter} onChange={setFilter} />
        </View>

        {filtered.length === 0 ? (
          <EmptyState icon="checkmark-done-outline" title="Ingen opgaver her" />
        ) : (
          <ListSection separatorInset={58}>
            {filtered.map((job) => (
              <JobRow
                key={job.id}
                job={job}
                assignee={memberById(job.assignedToId)}
                onPress={() => router.push(`/job/${job.id}`)}
              />
            ))}
          </ListSection>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.groupedBackground },
  segment: { marginBottom: spacing.lg },
});
