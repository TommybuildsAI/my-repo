import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ChatMessage } from '@/types/models';
import { colors, spacing, type } from '@/theme/theme';
import { formatTime } from '@/utils/format';

interface Props {
  message: ChatMessage;
  mine: boolean;
  senderName?: string;
  showSender?: boolean;
}

export function ChatBubble({ message, mine, senderName, showSender }: Props) {
  // Morning briefs render as a centred announcement card (iMessage-style note).
  if (message.kind === 'brief') {
    const body = message.text.replace(/^☀️\s*Morgenbrief\s*\n?/, '');
    return (
      <View style={styles.briefWrap}>
        <View style={styles.briefCard}>
          <Text style={[type.caption1, styles.briefLabel]}>☀️ MORGENBRIEF</Text>
          <Text style={[type.subhead, styles.briefBody]}>{body}</Text>
          <Text style={[type.caption2, styles.briefTime]}>{formatTime(message.createdAt)}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, mine ? styles.right : styles.left]}>
      {!mine && showSender && senderName ? (
        <Text style={[type.caption1, styles.sender]}>{senderName}</Text>
      ) : null}
      <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
        <Text style={[type.body, mine ? styles.mineText : styles.theirsText]}>{message.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 2, maxWidth: '78%' },
  right: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  left: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  sender: { color: colors.secondaryLabel, marginBottom: 2, marginLeft: 12 },
  bubble: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 20 },
  mine: { backgroundColor: colors.primary },
  theirs: { backgroundColor: '#E9E9EB' }, // iOS incoming-bubble grey
  mineText: { color: colors.white },
  theirsText: { color: colors.label },

  briefWrap: { alignItems: 'center', marginVertical: spacing.sm },
  briefCard: {
    backgroundColor: colors.gray6,
    borderRadius: 14,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    maxWidth: '92%',
  },
  briefLabel: { color: colors.indigo, fontWeight: '700', letterSpacing: 0.5, marginBottom: 4 },
  briefBody: { color: colors.label },
  briefTime: { color: colors.tertiaryLabel, marginTop: 6, textAlign: 'right' },
});
