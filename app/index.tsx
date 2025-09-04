import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  Button,
  YStack,
  XStack,
  Spinner,
  Card,
} from 'tamagui';
import { useAuthStore } from '../stores/auth';
import { useCreditsStore } from '../stores/credits';
import { AuthGuard } from '../components/auth/AuthGuard';

function HomeContent() {
  const { user, profile, signOut } = useAuthStore();
  const { balance, refreshBalance } = useCreditsStore();
  const router = useRouter();

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      <YStack
        backgroundColor="$background"
        padding="$4"
        paddingTop="$8"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <YStack space="$2" alignItems="center">
          <Text fontSize="$8" fontWeight="bold" color="$color12" textAlign="center">
            CELPIP Speaking Coach
          </Text>
          <Text fontSize="$4" color="$color10" textAlign="center">
            Practice with AI-powered feedback
          </Text>
        </YStack>
        
        {profile && (
          <Card
            backgroundColor="$backgroundHover"
            padding="$4"
            marginTop="$4"
            alignItems="center"
            borderRadius="$4"
          >
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
              Welcome, {profile.display_name || user?.email}!
            </Text>
            <Text fontSize="$3" color="$color10">
              Credits: {balance} remaining
            </Text>
          </Card>
        )}
      </YStack>

      <YStack flex={1} padding="$4" justifyContent="center" space="$4">
        <Button
          onPress={() => router.push('/practice')}
          backgroundColor="$blue10"
          color="white"
          size="$5"
          borderRadius="$4"
        >
          <Text color="white" fontSize="$4" fontWeight="600">
            Start Practice
          </Text>
        </Button>

        <Button
          onPress={() => router.push('/history')}
          backgroundColor="white"
          borderWidth={1}
          borderColor="$borderColor"
          color="$color12"
          size="$5"
          borderRadius="$4"
        >
          <Text color="$color12" fontSize="$4" fontWeight="600">
            View History
          </Text>
        </Button>

        <Button
          onPress={() => router.push('/settings')}
          backgroundColor="white"
          borderWidth={1}
          borderColor="$borderColor"
          color="$color12"
          size="$5"
          borderRadius="$4"
        >
          <Text color="$color12" fontSize="$4" fontWeight="600">
            Settings
          </Text>
        </Button>
      </YStack>

      <YStack padding="$4" alignItems="center">
        <Button
          variant="outlined"
          onPress={handleSignOut}
          paddingHorizontal="$4"
          paddingVertical="$2"
        >
          <Text color="$red10" fontSize="$3" fontWeight="500">
            Sign Out
          </Text>
        </Button>
      </YStack>
    </YStack>
  );
}

export default function HomeScreen() {
  // Simple test to see if this component is even running
  console.log('🚨 HomeScreen component is running!');
  alert('HomeScreen is running!');
  
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    console.log('🏠 HomeScreen - Auth state:', { user: !!user, isLoading });
    console.warn('🚨 DEBUG: HomeScreen useEffect triggered');
    if (!isLoading && !user) {
      console.log('🔄 Redirecting to auth screen');
      console.warn('🚨 DEBUG: About to redirect to auth');
      router.replace('/auth');
    }
  }, [user, isLoading, router]);

  // Always show loading until initialization is complete
  if (isLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Spinner size="large" color="$blue10" />
        <Text marginTop="$4" fontSize="$4" color="$color10">
          Loading...
        </Text>
      </YStack>
    );
  }

  // If not loading and no user, show loading while redirecting
  if (!user) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Spinner size="large" color="$blue10" />
        <Text marginTop="$4" fontSize="$4" color="$color10">
          Redirecting to login...
        </Text>
      </YStack>
    );
  }

  return (
    <AuthGuard>
      <HomeContent />
    </AuthGuard>
  );
}