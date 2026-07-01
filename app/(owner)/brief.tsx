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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '@/context/DataContext';
import { useChat } from '@/context/ChatContext';
import { useSession } from '@/context/SessionContext';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { LargeTitle } from '@/components/ui/LargeTitle';
import { ListSection, ListRow, Cell } from '@/components/ui/List';
import { colors, radius, spacing, type } from '@/theme/theme';

const SUGGESTIONS = [
  'God morgen! Husk sikkerhedsudstyr på byggepladserne i dag.',
  'Vejret bliver regnfuldt – kør forsigtigt mellem opgaverne.',
  'Materialer til badeværelsesrenovering er klar på lageret.',
];

export default function MorningBriefScreen() {
  const { employees } = useData();
  const { sendMorningBrief } = useChat();
  const { currentUser } = useSession();
  const insets = useSafeAreaInsets();

  const [message, setMessage] = React.useState('');
  const [toTeam, setToTeam] = React.useState(true);
  const [selected, setSelected] = React.useState<string[]>(employees.map((e) => e.id));
  const [sentAt, setSentAt] = React.useState<string | null>(null);

  React.useEffect(() => {
    setSelected(employees.map((e) => e.id));
  }, [employees]);

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const canSend = message.trim().length > 0 && (toTeam || selected.length > 0) && !!currentUser;

  const handleSend = () => {
    if (!canSend || !currentUser) return;
    sendMorningBrief({ authorId: currentUser.id, message, recipientIds: selected, toTeam });
    setSentAt(new Date().toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' }));
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ paddingTop: insets.top, paddingBottom: spacing.xxl }}>
          <LargeTitle title="Morgenbrief" subtitle="Send dagens besked til holdet" />

          <ListSection header="Besked">
            <View style={styles.inputWrap}>
              <TextInput
                style={[type.body, styles.input]}
                placeholder="Skriv morgenbrief…"
                placeholderTextColor={colors.placeholder}
                value={message}
                onChangeText={setMessage}
                multiline
              />
            </View>
          </ListSection>

          <View style={styles.chips}>
            {SUGGESTIONS.map((s, i) => (
              <Pressable key={i} style={styles.chip} onPress={() => setMessage(s)}>
                <Text style={[type.footnote, styles.chipText]} numberOfLines={1}>
                  {s}
                </Text>
              </Pressable>
            ))}
          </View>

          <ListSection header="Modtagere">
            <Cell>
              <View style={{ flex: 1 }}>
                <Text style={type.body}>Send til fælleschat</Text>
                <Text style={[type.footnote, styles.sub]}>Vises i "Hele holdet"</Text>
              </View>
              <Switch value={toTeam} onValueChange={setToTeam} trackColor={{ true: colors.green }} />
            </Cell>
          </ListSection>

          <ListSection header="Personligt til" separatorInset={60}>
            {employees.map((m) => {
              const on = selected.includes(m.id);
              return (
                <ListRow
                  key={m.id}
                  leading={<Avatar name={m.name} color={m.avatarColor} size={36} />}
                  title={m.name}
                  onPress={() => toggle(m.id)}
                  rightNode={
                    <Ionicons
                      name={on ? 'checkmark-circle' : 'ellipse-outline'}
                      size={24}
                      color={on ? colors.green : colors.gray3}
                    />
                  }
                  accessory="none"
                />
              );
            })}
          </ListSection>

          {sentAt ? (
            <View style={styles.sentBanner}>
              <Ionicons name="checkmark-circle" size={18} color={colors.green} />
              <Text style={[type.subhead, styles.sentText]}>Brief sendt kl. {sentAt}</Text>
            </View>
          ) : null}

          <View style={styles.buttonWrap}>
            <Button title="Send morgenbrief" icon="paper-plane" onPress={handleSend} disabled={!canSend} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.groupedBackground },
  inputWrap: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  input: { minHeight: 90, color: colors.label, textAlignVertical: 'top' },
  sub: { color: colors.secondaryLabel, marginTop: 1 },
  chips: { paddingHorizontal: spacing.lg, gap: spacing.sm, marginBottom: spacing.xl, marginTop: -spacing.sm },
  chip: {
    backgroundColor: colors.groupedCard,
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.separator,
  },
  chipText: { color: colors.primary },
  sentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sentText: { color: colors.green, fontWeight: '500' },
  buttonWrap: { paddingHorizontal: spacing.lg, marginTop: spacing.sm },
});
