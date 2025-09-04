import React from 'react';
import { YStack, Text } from 'tamagui';
import { AuthGuard } from '../components/auth/AuthGuard';

function HistoryContent() {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" backgroundColor="$background">
      <Text fontSize="$6" fontWeight="bold" color="$color12" marginBottom="$2">
        Practice History
      </Text>
      <Text fontSize="$4" color="$color10" marginBottom="$4" textAlign="center">
        View your past sessions and progress
      </Text>
      <Text fontSize="$5" color="$blue10" fontWeight="600">
        Coming Soon!
      </Text>
    </YStack>
  );
}

export default function HistoryScreen() {
  return (
    <AuthGuard>
      <HistoryContent />
    </AuthGuard>
  );
}