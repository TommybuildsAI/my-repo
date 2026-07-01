import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '@/context/DataContext';
import { useSession } from '@/context/SessionContext';
import { TeamMemberRow } from '@/components/TeamMemberRow';
import { colors, spacing, typography } from '@/theme/theme';

export default function LoginScreen() {
  const { members, loading } = useData();
  const { login } = useSession();
  const insets = useSafeAreaInsets();

  const owner = members.find((m) => m.role === 'owner');
  const employees = members.filter((m) => m.role === 'employee');

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xl }]}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Ionicons name="water" size={30} color={colors.textInverse} />
        </View>
        <Text style={styles.appName}>VVS Hold</Text>
        <Text style={styles.tagline}>Aarhus VVS & Varme</Text>
      </View>

      <Text style={styles.prompt}>Vælg din profil for at logge ind</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}>
        {owner && (
          <>
            <Text style={styles.sectionLabel}>EJER</Text>
            <TeamMemberRow member={owner} onPress={() => login(owner)} />
          </>
        )}

        <Text style={styles.sectionLabel}>MEDARBEJDERE</Text>
        {employees.map((m) => (
          <TeamMemberRow key={m.id} member={m} onPress={() => login(m)} />
        ))}

        {loading && <Text style={styles.loading}>Henter hold…</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  appName: { ...typography.largeTitle, color: colors.text },
  tagline: { fontSize: 15, color: colors.textSecondary, marginTop: 2 },
  prompt: { fontSize: 15, color: colors.textSecondary, marginBottom: spacing.md },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textTertiary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  loading: { textAlign: 'center', color: colors.textTertiary, marginTop: spacing.lg },
});
