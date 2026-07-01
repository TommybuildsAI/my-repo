import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { ChatThread } from '@/types/models';
import { useChat } from '@/context/ChatContext';
import { useData } from '@/context/DataContext';
import { Avatar } from '@/components/ui/Avatar';
import { colors, radius, spacing } from '@/theme/theme';
import { formatRelative } from '@/utils/format';

interface Props {
  threads: ChatThread[];
}

export function ThreadList({ threads }: Props) {
  const router = useRouter();
  const { memberById } = useData();
  const { messagesForThread } = useChat();

  const sorted = [...threads].sort((a, b) =>
    (b.lastMessageAt ?? '').localeCompare(a.lastMessageAt ?? '')
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {sorted.map((thread) => {
        const isTeam = thread.type === 'team';
        // For a direct thread, show the non-owner participant's colour/avatar.
        const other = isTeam
          ? undefined
          : memberById(thread.memberIds.find((id) => memberById(id)?.role === 'employee'));
        const preview =
          thread.lastMessagePreview ??
          (messagesForThread(thread.id).at(-1)?.text ?? 'Ingen beskeder endnu');

        return (
          <Pressable
            key={thread.id}
            onPress={() => router.push(`/chat/${thread.id}`)}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            {isTeam ? (
              <View style={[styles.teamIcon]}>
                <Ionicons name="people" size={22} color={colors.textInverse} />
              </View>
            ) : (
              <Avatar name={other?.name ?? thread.title} color={other?.avatarColor} size={46} />
            )}

            <View style={styles.info}>
              <Text style={styles.title}>{thread.title}</Text>
              <Text style={styles.preview} numberOfLines={1}>
                {preview.replace(/\n/g, ' ')}
              </Text>
            </View>

            {thread.lastMessageAt && (
              <Text style={styles.time}>{formatRelative(thread.lastMessageAt)}</Text>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  pressed: { opacity: 0.6 },
  teamIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  title: { fontSize: 17, fontWeight: '600', color: colors.text },
  preview: { fontSize: 14, color: colors.textSecondary, marginTop: 1 },
  time: { fontSize: 12, color: colors.textTertiary },
});
