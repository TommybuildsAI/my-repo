import React from 'react';
import { useNavigation } from 'expo-router';
import { useChat } from '@/context/ChatContext';
import { ThreadList } from '@/components/ThreadList';

export default function OwnerChatScreen() {
  const { threads } = useChat();
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerLargeTitle: true, title: 'Chat' });
  }, [navigation]);

  return <ThreadList threads={threads} />;
}
