import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useData } from '@/context/DataContext';
import { useSession } from '@/context/SessionContext';
import { directThreadId } from '@/data/seed';
import { Avatar } from '@/components/ui/Avatar';
import { LargeTitle } from '@/components/ui/LargeTitle';
import { ListSection, ListRow } from '@/components/ui/List';
import { colors, spacing } from '@/theme/theme';

export default function OwnerTeamScreen() {
  const { employees, jobsForMember } = useData();
  const { currentUser, logout } = useSession();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const activeJobFor = (memberId: string) =>
    jobsForMember(memberId).find((j) => j.status === 'in_progress') ??
    jobsForMember(memberId).find((j) => j.status === 'assigned');

  const subtitleFor = (memberId: string, title: string) => {
    const active = activeJobFor(memberId);
    if (!active) return title;
    return active.status === 'in_progress' ? `I gang · ${active.title}` : `Næste · ${active.title}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top, paddingBottom: spacing.xxl }}>
        <LargeTitle
          title="Hold"
          subtitle={`Hej ${currentUser?.name.split(' ')[0]} · ${employees.length} medarbejdere`}
          action={{ icon: 'log-out-outline', onPress: logout }}
        />

        <ListSection separatorInset={60}>
          {employees.map((m) => (
            <ListRow
              key={m.id}
              leading={<Avatar name={m.name} color={m.avatarColor} size={38} />}
              title={m.name}
              subtitle={subtitleFor(m.id, m.title)}
              onPress={() => router.push(`/chat/${directThreadId(m.id)}`)}
            />
          ))}
        </ListSection>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.groupedBackground },
});
