import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChat } from '@/context/ChatContext';
import { useSession } from '@/context/SessionContext';
import { LargeTitle } from '@/components/ui/LargeTitle';
import { ThreadList } from '@/components/ThreadList';
import { colors } from '@/theme/theme';

export default function EmployeeChatScreen() {
  const { threads } = useChat();
  const { currentUser } = useSession();
  const insets = useSafeAreaInsets();

  const visible = threads.filter(
    (t) => t.type === 'team' || (currentUser ? t.memberIds.includes(currentUser.id) : false)
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LargeTitle title="Chat" />
      <ThreadList threads={visible} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});
