import React, { useState, useEffect } from 'react';
import {
  Alert,
  ScrollView,
} from 'react-native';
import {
  View,
  Text,
  Input,
  Button,
  YStack,
  XStack,
  Card,
  Spinner,
  Separator,
} from 'tamagui';
import { useAuthStore } from '../stores/auth';
import { useCreditsStore } from '../stores/credits';
import { AuthGuard } from '../components/auth/AuthGuard';

function SettingsContent() {
  const [displayName, setDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { user, profile, updateProfile, signOut, deleteAccount, isLoading } = useAuthStore();
  const { balance, refreshBalance } = useCreditsStore();

  useEffect(() => {
    if (profile?.display_name) {
      setDisplayName(profile.display_name);
    }
    refreshBalance();
  }, [profile, refreshBalance]);

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({ display_name: displayName });
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirm Deletion',
              'Type "DELETE" to confirm account deletion',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await deleteAccount();
                    } catch (error: any) {
                      Alert.alert('Error', error.message || 'Failed to delete account');
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

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

  return (
    <YStack flex={1} backgroundColor="$backgroundHover">
      <ScrollView style={{ flex: 1 }}>
        <YStack padding="$4" backgroundColor="$background" borderBottomWidth={1} borderBottomColor="$borderColor">
          <Text fontSize="$8" fontWeight="bold" color="$color12" marginBottom="$1">
            Settings
          </Text>
          <Text fontSize="$4" color="$color10">
            Manage your account and preferences
          </Text>
        </YStack>

        <Card margin="$2" padding="$4" backgroundColor="$background" borderRadius="$4">
          <Text fontSize="$5" fontWeight="600" color="$color12" marginBottom="$4">
            Account Information
          </Text>
          
          <YStack space="$3">
            <XStack justifyContent="space-between" alignItems="center" paddingVertical="$3">
              <Text fontSize="$4" color="$color12" fontWeight="500">
                Email
              </Text>
              <Text fontSize="$4" color="$color10" flex={1} textAlign="right">
                {user?.email}
              </Text>
            </XStack>

            <Separator />

            <XStack justifyContent="space-between" alignItems="center" paddingVertical="$3">
              <Text fontSize="$4" color="$color12" fontWeight="500">
                Credits
              </Text>
              <Text fontSize="$4" color="$color10" flex={1} textAlign="right">
                {balance} remaining
              </Text>
            </XStack>

            <Separator />

            <YStack space="$2" paddingVertical="$3">
              <Text fontSize="$4" color="$color12" fontWeight="500">
                Display Name
              </Text>
              {isEditing ? (
                <XStack space="$2" alignItems="center">
                  <Input
                    flex={1}
                    value={displayName}
                    onChangeText={setDisplayName}
                    placeholder="Enter display name"
                    autoFocus
                    borderColor="$borderColor"
                    focusStyle={{
                      borderColor: '$blue10',
                    }}
                  />
                  <Button
                    size="$3"
                    backgroundColor="$green10"
                    onPress={handleUpdateProfile}
                    paddingHorizontal="$3"
                  >
                    <Text color="white" fontSize="$3" fontWeight="600">
                      Save
                    </Text>
                  </Button>
                  <Button
                    size="$3"
                    backgroundColor="$red10"
                    onPress={() => {
                      setIsEditing(false);
                      setDisplayName(profile?.display_name || '');
                    }}
                    paddingHorizontal="$3"
                  >
                    <Text color="white" fontSize="$3" fontWeight="600">
                      Cancel
                    </Text>
                  </Button>
                </XStack>
              ) : (
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="$4" color="$color10" flex={1}>
                    {profile?.display_name || 'Not set'}
                  </Text>
                  <Button
                    size="$3"
                    backgroundColor="$blue10"
                    onPress={() => setIsEditing(true)}
                    paddingHorizontal="$3"
                  >
                    <Text color="white" fontSize="$3" fontWeight="600">
                      Edit
                    </Text>
                  </Button>
                </XStack>
              )}
            </YStack>
          </YStack>
        </Card>

        <Card margin="$2" padding="$4" backgroundColor="$background" borderRadius="$4">
          <Text fontSize="$5" fontWeight="600" color="$color12" marginBottom="$4">
            Account Actions
          </Text>
          
          <YStack space="$3">
            <Button
              backgroundColor="$backgroundHover"
              borderWidth={1}
              borderColor="$borderColor"
              color="$color12"
              size="$4"
              onPress={handleSignOut}
            >
              <Text color="$color12" fontSize="$4" fontWeight="500">
                Sign Out
              </Text>
            </Button>

            <Button
              backgroundColor="white"
              borderWidth={1}
              borderColor="$red10"
              color="$red10"
              size="$4"
              onPress={handleDeleteAccount}
            >
              <Text color="$red10" fontSize="$4" fontWeight="500">
                Delete Account
              </Text>
            </Button>
          </YStack>
        </Card>

        <Card margin="$2" padding="$4" backgroundColor="$background" borderRadius="$4">
          <Text fontSize="$5" fontWeight="600" color="$color12" marginBottom="$4">
            About
          </Text>
          <Text fontSize="$3" color="$color10" lineHeight="$1" marginBottom="$2">
            CELPIP Speaking Coach helps you practice for the CELPIP Speaking test with AI-powered feedback.
          </Text>
          <Text fontSize="$2" color="$color9">
            Version 1.0.0
          </Text>
        </Card>
      </ScrollView>
    </YStack>
  );
}

export default function SettingsScreen() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  );
}