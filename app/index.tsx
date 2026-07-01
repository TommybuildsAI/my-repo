import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '@/context/DataContext';
import { useSession } from '@/context/SessionContext';
import { Avatar } from '@/components/ui/Avatar';
import { ListSection, ListRow } from '@/components/ui/List';
import { colors, spacing, type } from '@/theme/theme';

export default function LoginScreen() {
  const { members } = useData();
  const { login } = useSession();
  const insets = useSafeAreaInsets();

  const owner = members.find((m) => m.role === 'owner');
  const employees = members.filter((m) => m.role === 'employee');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 40, paddingBottom: insets.bottom + spacing.xl }}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Ionicons name="water" size={34} color={colors.white} />
          </View>
          <Text style={[type.title1, styles.appName]}>VVS Hold</Text>
          <Text style={[type.subhead, styles.tagline]}>Aarhus VVS & Varme</Text>
        </View>

        {owner ? (
          <ListSection header="Ejer" separatorInset={60}>
            <ListRow
              leading={<Avatar name={owner.name} color={owner.avatarColor} size={38} />}
              title={owner.name}
              subtitle={owner.title}
              onPress={() => login(owner)}
            />
          </ListSection>
        ) : null}

        <ListSection header="Medarbejdere" footer="Vælg en profil for at logge ind. Ingen adgangskode i denne demo." separatorInset={60}>
          {employees.map((m) => (
            <ListRow
              key={m.id}
              leading={<Avatar name={m.name} color={m.avatarColor} size={38} />}
              title={m.name}
              subtitle={m.title}
              onPress={() => login(m)}
            />
          ))}
        </ListSection>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.groupedBackground },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  appName: { color: colors.label },
  tagline: { color: colors.secondaryLabel, marginTop: 2 },
});
