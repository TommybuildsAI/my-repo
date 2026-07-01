import React from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useChat } from '@/context/ChatContext';
import { useData } from '@/context/DataContext';
import { useSession } from '@/context/SessionContext';
import { ChatBubble } from '@/components/ChatBubble';
import { EmptyState } from '@/components/ui/EmptyState';
import { colors, spacing, type } from '@/theme/theme';
import type { ChatMessage } from '@/types/models';

export default function ChatThreadScreen() {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const { threads, messagesForThread, sendMessage } = useChat();
  const { memberById } = useData();
  const { currentUser } = useSession();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const listRef = React.useRef<FlatList<ChatMessage>>(null);
  const [text, setText] = React.useState('');

  const thread = threads.find((t) => t.id === threadId);
  const messages = threadId ? messagesForThread(threadId) : [];
  const isGroup = thread?.type === 'team';

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: thread?.title ?? 'Chat' });
  }, [navigation, thread?.title]);

  const handleSend = () => {
    if (!currentUser || !threadId) return;
    sendMessage(threadId, currentUser.id, text);
    setText('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {messages.length === 0 ? (
        <View style={{ flex: 1 }}>
          <EmptyState icon="chatbubble-ellipses-outline" title="Ingen beskeder endnu" subtitle="Skriv den første besked." />
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.list}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item }) => (
            <ChatBubble
              message={item}
              mine={item.senderId === currentUser?.id}
              senderName={memberById(item.senderId)?.name}
              showSender={isGroup}
            />
          )}
        />
      )}

      <View style={[styles.inputBar, { paddingBottom: (insets.bottom || spacing.sm) }]}>
        <View style={styles.inputWrap}>
          <TextInput
            style={[type.body, styles.input]}
            placeholder="Besked"
            placeholderTextColor={colors.placeholder}
            value={text}
            onChangeText={setText}
            multiline
          />
        </View>
        <Pressable onPress={handleSend} disabled={!text.trim()} style={[styles.send, !text.trim() && styles.sendOff]}>
          <Ionicons name="arrow-up" size={20} color={colors.white} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg, gap: 2 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
    backgroundColor: colors.background,
  },
  inputWrap: {
    flex: 1,
    minHeight: 36,
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.gray3,
    borderRadius: 18,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  input: { color: colors.label, maxHeight: 120, padding: 0 },
  send: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
  sendOff: { backgroundColor: colors.gray3 },
});
