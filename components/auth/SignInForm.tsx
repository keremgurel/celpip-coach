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

type SignInFormProps = {
  onSwitchToSignUp: () => void;
  onSwitchToMagicLink: () => void;
};

export function SignInForm({ onSwitchToSignUp, onSwitchToMagicLink }: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuthStore();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await signIn('email', email, password);
    } catch (error: any) {
      Alert.alert('Sign In Error', error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google');
    } catch (error: any) {
      Alert.alert('Sign In Error', error.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('apple');
    } catch (error: any) {
      Alert.alert('Sign In Error', error.message || 'Failed to sign in with Apple');
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
              Welcome Back
            </Text>
            <Text fontSize="$4" color="$color10" textAlign="center">
              Sign in to continue practicing
            </Text>
          </YStack>

          <YStack space="$3">
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
                placeholder="Enter your password"
                secureTextEntry
                autoCapitalize="none"
                borderColor="$borderColor"
                focusStyle={{
                  borderColor: '$blue10',
                }}
              />
            </YStack>

            <Button
              onPress={handleSignIn}
              disabled={isLoading}
              backgroundColor="$blue10"
              color="white"
              size="$4"
              marginTop="$2"
            >
              {isLoading ? <Spinner color="white" /> : 'Sign In'}
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
              onPress={handleGoogleSignIn}
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
              onPress={handleAppleSignIn}
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
              Don't have an account?
            </Text>
            <Button
              onPress={onSwitchToSignUp}
              paddingHorizontal="$2"
              paddingVertical="$1"
              backgroundColor="transparent"
              borderWidth={0}
            >
              <Text color="$blue10" fontWeight="600">
                Sign Up
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