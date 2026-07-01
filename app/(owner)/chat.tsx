import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChat } from '@/context/ChatContext';
import { LargeTitle } from '@/components/ui/LargeTitle';
import { ThreadList } from '@/components/ThreadList';
import { colors } from '@/theme/theme';

export default function OwnerChatScreen() {
  const { threads } = useChat();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LargeTitle title="Chat" />
      <ThreadList threads={threads} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});
