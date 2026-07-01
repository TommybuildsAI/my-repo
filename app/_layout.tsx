import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SessionProvider, useSession } from '@/context/SessionContext';
import { DataProvider } from '@/context/DataContext';
import { ChatProvider } from '@/context/ChatContext';
import { LocationProvider } from '@/context/LocationContext';
import { colors } from '@/theme/theme';

function RootNavigator() {
  const { currentUser, role, ready } = useSession();
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    if (!ready) return;
    const group = segments[0]; // 'index' | '(owner)' | '(employee)' | 'job' | 'chat' | undefined
    const inOwner = group === '(owner)';
    const inEmployee = group === '(employee)';

    if (!currentUser) {
      // Not logged in -> ensure we're on the login screen
      if (inOwner || inEmployee) router.replace('/');
      return;
    }
    // Logged in but sitting on the login screen -> route to the right home
    if (group === undefined || group === 'index') {
      router.replace(role === 'owner' ? '/(owner)/team' : '/(employee)/assignments');
    }
  }, [ready, currentUser, role, segments, router]);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.label, fontWeight: '600' },
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerBackTitle: 'Tilbage',
        contentStyle: { backgroundColor: colors.groupedBackground },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(owner)" />
      <Stack.Screen name="(employee)" />
      <Stack.Screen name="job/[id]" options={{ headerShown: true, title: 'Opgave' }} />
      <Stack.Screen name="chat/[threadId]" options={{ headerShown: true, title: 'Chat' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <SessionProvider>
        <DataProvider>
          <ChatProvider>
            <LocationProvider>
              <RootNavigator />
            </LocationProvider>
          </ChatProvider>
        </DataProvider>
      </SessionProvider>
    </SafeAreaProvider>
  );
}
