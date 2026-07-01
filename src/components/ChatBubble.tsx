import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ChatMessage } from '@/types/models';
import { colors, radius, spacing } from '@/theme/theme';
import { formatTime } from '@/utils/format';

interface Props {
  message: ChatMessage;
  mine: boolean;
  senderName?: string; // shown for other people's messages in group threads
  showSender?: boolean;
}

export function ChatBubble({ message, mine, senderName, showSender }: Props) {
  const isBrief = message.kind === 'brief';
  return (
    <View style={[styles.container, mine ? styles.alignRight : styles.alignLeft]}>
      {!mine && showSender && senderName && (
        <Text style={styles.sender}>{senderName}</Text>
      )}
      <View
        style={[
          styles.bubble,
          mine ? styles.mine : styles.theirs,
          isBrief && styles.brief,
        ]}
      >
        <Text style={[styles.text, mine && !isBrief && styles.mineText]}>{message.text}</Text>
      </View>
      <Text style={styles.time}>{formatTime(message.createdAt)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md, maxWidth: '82%' },
  alignRight: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  alignLeft: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  sender: { fontSize: 12, color: colors.textTertiary, marginBottom: 2, marginLeft: 12 },
  bubble: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.lg },
  mine: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  theirs: { backgroundColor: colors.card, borderBottomLeftRadius: 4 },
  brief: { backgroundColor: colors.brief + '18', borderWidth: 1, borderColor: colors.brief + '55' },
  text: { fontSize: 16, color: colors.text, lineHeight: 21 },
  mineText: { color: colors.textInverse },
  time: { fontSize: 11, color: colors.textTertiary, marginTop: 2, marginHorizontal: 6 },
});
