import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  View,
  Text,
  Input,
  Button,
  YStack,
  XStack,
  Separator,
  Spinner,
} from 'tamagui';
import { useAuthStore } from '../../stores/auth';

type SignUpFormProps = {
  onSwitchToSignIn: () => void;
  onSwitchToMagicLink: () => void;
};

export function SignUpForm({ onSwitchToSignIn, onSwitchToMagicLink }: SignUpFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuthStore();

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password, displayName || undefined);
      Alert.alert(
        'Check your email',
        'We sent you a confirmation link. Please check your email and click the link to verify your account.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert('Sign Up Error', error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      await useAuthStore.getState().signIn('google');
    } catch (error: any) {
      Alert.alert('Sign Up Error', error.message || 'Failed to sign up with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignUp = async () => {
    setIsLoading(true);
    try {
      await useAuthStore.getState().signIn('apple');
    } catch (error: any) {
      Alert.alert('Sign Up Error', error.message || 'Failed to sign up with Apple');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <YStack
          padding="$4"
          maxWidth={400}
          width="100%"
          alignSelf="center"
          space="$4"
        >
          <YStack space="$2" alignItems="center">
            <Text fontSize="$8" fontWeight="bold" color="$color12">
              Create Account
            </Text>
            <Text fontSize="$4" color="$color10" textAlign="center">
              Start your CELPIP practice journey
            </Text>
          </YStack>

          <YStack space="$3">
            <YStack space="$2">
              <Text fontSize="$3" fontWeight="600" color="$color12">
                Display Name (Optional)
              </Text>
              <Input
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Enter your name"
                autoCapitalize="words"
                borderColor="$borderColor"
                focusStyle={{
                  borderColor: '$blue10',
                }}
              />
            </YStack>

            <YStack space="$2">
              <Text fontSize="$3" fontWeight="600" color="$color12">
                Email
              </Text>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                borderColor="$borderColor"
                focusStyle={{
                  borderColor: '$blue10',
                }}
              />
            </YStack>

            <YStack space="$2">
              <Text fontSize="$3" fontWeight="600" color="$color12">
                Password
              </Text>
              <Input
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
                secureTextEntry
                autoCapitalize="none"
                borderColor="$borderColor"
                focusStyle={{
                  borderColor: '$blue10',
                }}
              />
            </YStack>

            <YStack space="$2">
              <Text fontSize="$3" fontWeight="600" color="$color12">
                Confirm Password
              </Text>
              <Input
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                secureTextEntry
                autoCapitalize="none"
                borderColor="$borderColor"
                focusStyle={{
                  borderColor: '$blue10',
                }}
              />
            </YStack>

            <Button
              onPress={handleSignUp}
              disabled={isLoading}
              backgroundColor="$blue10"
              color="white"
              size="$4"
              marginTop="$2"
            >
              {isLoading ? <Spinner color="white" /> : 'Create Account'}
            </Button>
          </YStack>

          <XStack alignItems="center" space="$3" marginVertical="$4">
            <Separator flex={1} />
            <Text fontSize="$2" color="$color10">
              or
            </Text>
            <Separator flex={1} />
          </XStack>

          <YStack space="$3">
            <Button
              onPress={handleGoogleSignUp}
              disabled={isLoading}
              backgroundColor="white"
              borderWidth={1}
              borderColor="$borderColor"
              color="$color12"
              size="$4"
            >
              Continue with Google
            </Button>

            <Button
              onPress={handleAppleSignUp}
              disabled={isLoading}
              backgroundColor="black"
              color="white"
              size="$4"
            >
              Continue with Apple
            </Button>
          </YStack>

          <XStack justifyContent="center" space="$2" marginTop="$4">
            <Text fontSize="$3" color="$color10">
              Already have an account?
            </Text>
            <Button
              onPress={onSwitchToSignIn}
              paddingHorizontal="$2"
              paddingVertical="$1"
              backgroundColor="transparent"
              borderWidth={0}
            >
              <Text color="$blue10" fontWeight="600">
                Sign In
              </Text>
            </Button>
          </XStack>

          <XStack justifyContent="center" space="$2">
            <Text fontSize="$3" color="$color10">
              Prefer a magic link?
            </Text>
            <Button
              onPress={onSwitchToMagicLink}
              paddingHorizontal="$2"
              paddingVertical="$1"
              backgroundColor="transparent"
              borderWidth={0}
            >
              <Text color="$blue10" fontWeight="600">
                Send Magic Link
              </Text>
            </Button>
          </XStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}