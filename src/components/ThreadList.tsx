import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { ChatThread } from '@/types/models';
import { useChat } from '@/context/ChatContext';
import { useData } from '@/context/DataContext';
import { Avatar } from '@/components/ui/Avatar';
import { colors, spacing, type } from '@/theme/theme';
import { formatRelative } from '@/utils/format';

interface Props {
  threads: ChatThread[];
}

/** iOS Messages-style list: full-width rows, avatar, preview, inset separators. */
export function ThreadList({ threads }: Props) {
  const router = useRouter();
  const { memberById } = useData();
  const { messagesForThread } = useChat();

  const sorted = [...threads].sort((a, b) =>
    (b.lastMessageAt ?? '').localeCompare(a.lastMessageAt ?? '')
  );

  return (
    <ScrollView
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingBottom: spacing.xxl }}
    >
      {sorted.map((thread, i) => {
        const isTeam = thread.type === 'team';
        const other = isTeam
          ? undefined
          : memberById(thread.memberIds.find((id) => memberById(id)?.role === 'employee'));
        const preview =
          thread.lastMessagePreview ??
          messagesForThread(thread.id).at(-1)?.text ??
          'Ingen beskeder endnu';

        return (
          <Pressable
            key={thread.id}
            onPress={() => router.push(`/chat/${thread.id}`)}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            {isTeam ? (
              <View style={styles.teamIcon}>
                <Ionicons name="people" size={24} color={colors.white} />
              </View>
            ) : (
              <Avatar name={other?.name ?? thread.title} color={other?.avatarColor} size={52} />
            )}

            <View style={styles.content}>
              <View style={styles.topLine}>
                <Text style={[type.headline, styles.title]} numberOfLines={1}>
                  {thread.title}
                </Text>
                {thread.lastMessageAt ? (
                  <Text style={[type.footnote, styles.time]}>
                    {formatRelative(thread.lastMessageAt)}
                  </Text>
                ) : null}
                <Ionicons name="chevron-forward" size={15} color={colors.tertiaryLabel} />
              </View>
              <Text style={[type.subhead, styles.preview]} numberOfLines={2}>
                {preview.replace(/\n/g, ' ')}
              </Text>
              {i < sorted.length - 1 ? <View style={styles.separator} /> : null}
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  row: { flexDirection: 'row', paddingLeft: spacing.lg, alignItems: 'flex-start' },
  pressed: { backgroundColor: colors.gray6 },
  teamIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1, marginLeft: spacing.md, paddingVertical: 10, paddingRight: spacing.lg },
  topLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { flex: 1, color: colors.label },
  time: { color: colors.secondaryLabel },
  preview: { color: colors.secondaryLabel, marginTop: 2 },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.separator,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
