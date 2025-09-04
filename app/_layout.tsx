import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Home' }} />
          <Stack.Screen name="auth" options={{ title: 'Authentication' }} />
          <Stack.Screen name="practice" options={{ title: 'Practice' }} />
          <Stack.Screen name="history" options={{ title: 'History' }} />
          <Stack.Screen name="settings" options={{ title: 'Settings' }} />
        </Stack>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
