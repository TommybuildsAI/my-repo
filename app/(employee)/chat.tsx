import React from 'react';
import { useNavigation } from 'expo-router';
import { useChat } from '@/context/ChatContext';
import { useSession } from '@/context/SessionContext';
import { ThreadList } from '@/components/ThreadList';

export default function EmployeeChatScreen() {
  const { threads } = useChat();
  const { currentUser } = useSession();
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerLargeTitle: true, title: 'Chat' });
  }, [navigation]);

  // Employees see the team thread and their own direct thread with the owner.
  const visible = threads.filter(
    (t) => t.type === 'team' || (currentUser ? t.memberIds.includes(currentUser.id) : false)
  );

  return <ThreadList threads={visible} />;
}
