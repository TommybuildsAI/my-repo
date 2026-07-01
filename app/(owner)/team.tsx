import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '@/context/DataContext';
import { useSession } from '@/context/SessionContext';
import { directThreadId } from '@/data/seed';
import { TeamMemberRow } from '@/components/TeamMemberRow';
import { colors, spacing } from '@/theme/theme';

export default function OwnerTeamScreen() {
  const { employees, jobsForMember } = useData();
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

  const activeJobFor = (memberId: string) =>
    jobsForMember(memberId).find((j) => j.status === 'in_progress') ??
    jobsForMember(memberId).find((j) => j.status === 'assigned');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Hej {currentUser?.name.split(' ')[0]} 👋</Text>
      <Text style={styles.subtitle}>{employees.length} medarbejdere på holdet</Text>

      <Text style={styles.sectionLabel}>MEDARBEJDERE</Text>
      {employees.map((m) => {
        const active = activeJobFor(m.id);
        const openCount = jobsForMember(m.id).filter((j) => j.status !== 'done').length;
        return (
          <TeamMemberRow
            key={m.id}
            member={m}
            activeJob={active}
            jobCount={openCount}
            onPress={() => router.push(`/chat/${directThreadId(m.id)}`)}
          />
        );
      })}
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
    marginLeft: spacing.xs,
  },
});
