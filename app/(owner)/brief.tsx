import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '@/context/DataContext';
import { useChat } from '@/context/ChatContext';
import { useSession } from '@/context/SessionContext';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { colors, radius, spacing } from '@/theme/theme';

const SUGGESTIONS = [
  'God morgen! Husk sikkerhedsudstyr på byggepladserne i dag. 👷',
  'Vejret bliver regnfuldt – kør forsigtigt mellem opgaverne. 🌧️',
  'Materialer til badeværelsesrenovering er klar på lageret.',
];

export default function MorningBriefScreen() {
  const { employees } = useData();
  const { sendMorningBrief } = useChat();
  const { currentUser } = useSession();
  const navigation = useNavigation();

  const [message, setMessage] = React.useState('');
  const [toTeam, setToTeam] = React.useState(true);
  const [selected, setSelected] = React.useState<string[]>(employees.map((e) => e.id));
  const [sentAt, setSentAt] = React.useState<string | null>(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerLargeTitle: true, title: 'Morgenbrief' });
  }, [navigation]);

  React.useEffect(() => {
    setSelected(employees.map((e) => e.id));
  }, [employees]);

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const canSend = message.trim().length > 0 && (toTeam || selected.length > 0) && !!currentUser;

  const handleSend = () => {
    if (!canSend || !currentUser) return;
    sendMorningBrief({
      authorId: currentUser.id,
      message,
      recipientIds: selected,
      toTeam,
    });
    setSentAt(new Date().toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' }));
    setMessage('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Ionicons name="sunny" size={28} color={colors.statusInProgress} />
          <Text style={styles.heroText}>
            Send dagens brief til holdet og til hver medarbejder personligt.
          </Text>
        </View>

        <Text style={styles.label}>BESKED</Text>
        <TextInput
          style={styles.input}
          placeholder="Skriv morgenbrief…"
          placeholderTextColor={colors.textTertiary}
          value={message}
          onChangeText={setMessage}
          multiline
        />

        <View style={styles.chips}>
          {SUGGESTIONS.map((s, i) => (
            <Pressable key={i} style={styles.chip} onPress={() => setMessage(s)}>
              <Text style={styles.chipText} numberOfLines={1}>
                {s}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.teamRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.teamTitle}>Send til fælleschat</Text>
            <Text style={styles.teamSub}>Vises i "Hele holdet"</Text>
          </View>
          <Switch value={toTeam} onValueChange={setToTeam} trackColor={{ true: colors.primary }} />
        </View>

        <Text style={styles.label}>PERSONLIGT TIL</Text>
        {employees.map((m) => {
          const on = selected.includes(m.id);
          return (
            <Pressable key={m.id} style={styles.memberRow} onPress={() => toggle(m.id)}>
              <Avatar name={m.name} color={m.avatarColor} size={38} />
              <Text style={styles.memberName}>{m.name}</Text>
              <Ionicons
                name={on ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={on ? colors.statusDone : colors.textTertiary}
              />
            </Pressable>
          );
        })}

        {sentAt && (
          <View style={styles.sentBanner}>
            <Ionicons name="checkmark-circle" size={18} color={colors.statusDone} />
            <Text style={styles.sentText}>Brief sendt kl. {sentAt}</Text>
          </View>
        )}

        <Button
          title="Send morgenbrief"
          icon="paper-plane"
          onPress={handleSend}
          disabled={!canSend}
          style={{ marginTop: spacing.lg }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.statusInProgress + '18',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  heroText: { flex: 1, fontSize: 14, color: colors.textSecondary },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textTertiary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    minHeight: 100,
    fontSize: 16,
    color: colors.text,
    textAlignVertical: 'top',
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  chip: {
    backgroundColor: colors.fill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    maxWidth: '100%',
  },
  chipText: { fontSize: 13, color: colors.textSecondary },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.lg,
  },
  teamTitle: { fontSize: 16, color: colors.text, fontWeight: '500' },
  teamSub: { fontSize: 13, color: colors.textTertiary, marginTop: 1 },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  memberName: { flex: 1, fontSize: 16, color: colors.text },
  sentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.statusDone + '18',
    padding: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.lg,
  },
  sentText: { fontSize: 15, color: colors.statusDone, fontWeight: '500' },
});
