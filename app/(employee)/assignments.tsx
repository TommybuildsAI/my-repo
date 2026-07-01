import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '@/context/DataContext';
import { useSession } from '@/context/SessionContext';
import { JobCard } from '@/components/JobCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { colors, spacing } from '@/theme/theme';

export default function AssignmentsScreen() {
  const { jobsForMember } = useData();
  const { currentUser, logout } = useSession();
  const router = useRouter();
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLargeTitle: true,
      headerRight: () => (
        <Pressable onPress={logout} hitSlop={10} style={{ marginRight: spacing.lg }}>
          <Ionicons name="log-out-outline" size={24} color={colors.primary} />
        </Pressable>
      ),
    });
  }, [navigation, logout]);

  const myJobs = currentUser ? jobsForMember(currentUser.id) : [];
  const open = myJobs
    .filter((j) => j.status !== 'done')
    .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor));
  const done = myJobs.filter((j) => j.status === 'done');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Hej {currentUser?.name.split(' ')[0]} 👋</Text>
      <Text style={styles.subtitle}>
        {open.length} opgaver i dag{done.length ? ` · ${done.length} færdige` : ''}
      </Text>

      {open.length === 0 && done.length === 0 && (
        <EmptyState
          icon="cafe-outline"
          title="Ingen opgaver endnu"
          subtitle="Din chef tildeler dig opgaver herfra."
        />
      )}

      {open.length > 0 && <Text style={styles.sectionLabel}>DAGENS OPGAVER</Text>}
      {open.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          showAssignee={false}
          onPress={() => router.push(`/job/${job.id}`)}
        />
      ))}

      {done.length > 0 && <Text style={styles.sectionLabel}>FÆRDIGE</Text>}
      {done.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          showAssignee={false}
          onPress={() => router.push(`/job/${job.id}`)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  greeting: { fontSize: 26, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginTop: 2, marginBottom: spacing.md },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textTertiary,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
    marginLeft: spacing.xs,
  },
});
