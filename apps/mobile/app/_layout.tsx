import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider } from 'tamagui';
import { useAuthStore } from '../stores/auth';
import { useCreditsStore } from '../stores/credits';
import config from '../tamagui.config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

function AppContent() {
  const { user, refreshProfile, initialize } = useAuthStore();
  const { refreshBalance } = useCreditsStore();

  useEffect(() => {
    // Initialize auth store on app start
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Initialize auth state and refresh data when user is available
    if (user) {
      refreshProfile();
      refreshBalance();
    }
  }, [user, refreshProfile, refreshBalance]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="auth" options={{ title: 'Authentication' }} />
      <Stack.Screen name="practice" options={{ title: 'Practice' }} />
      <Stack.Screen name="history" options={{ title: 'History' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="auto" />
          <AppContent />
        </QueryClientProvider>
      </SafeAreaProvider>
    </TamaguiProvider>
  );
}
