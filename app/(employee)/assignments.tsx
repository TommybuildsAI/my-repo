import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useData } from '@/context/DataContext';
import { useSession } from '@/context/SessionContext';
import { JobRow } from '@/components/JobRow';
import { LargeTitle } from '@/components/ui/LargeTitle';
import { ListSection } from '@/components/ui/List';
import { EmptyState } from '@/components/ui/EmptyState';
import { colors, spacing } from '@/theme/theme';

export default function AssignmentsScreen() {
  const { jobsForMember } = useData();
  const { currentUser, logout } = useSession();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const myJobs = currentUser ? jobsForMember(currentUser.id) : [];
  const open = myJobs
    .filter((j) => j.status !== 'done')
    .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor));
  const done = myJobs.filter((j) => j.status === 'done');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top, paddingBottom: spacing.xxl }}>
        <LargeTitle
          title="Mine opgaver"
          subtitle={`Hej ${currentUser?.name.split(' ')[0]} · ${open.length} i dag${
            done.length ? ` · ${done.length} færdige` : ''
          }`}
          action={{ icon: 'log-out-outline', onPress: logout }}
        />

        {open.length === 0 && done.length === 0 ? (
          <EmptyState icon="cafe-outline" title="Ingen opgaver endnu" subtitle="Din chef tildeler dig opgaver herfra." />
        ) : null}

        {open.length > 0 ? (
          <ListSection header="Dagens opgaver" separatorInset={58}>
            {open.map((job) => (
              <JobRow key={job.id} job={job} showAssignee={false} onPress={() => router.push(`/job/${job.id}`)} />
            ))}
          </ListSection>
        ) : null}

        {done.length > 0 ? (
          <ListSection header="Færdige" separatorInset={58}>
            {done.map((job) => (
              <JobRow key={job.id} job={job} showAssignee={false} onPress={() => router.push(`/job/${job.id}`)} />
            ))}
          </ListSection>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.groupedBackground },
});
