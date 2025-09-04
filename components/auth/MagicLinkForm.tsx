import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  Input,
  Button,
  YStack,
  XStack,
  Spinner,
} from 'tamagui';
import { useAuthStore } from '../../stores/auth';

type MagicLinkFormProps = {
  onSwitchToSignIn: () => void;
  onSwitchToSignUp: () => void;
};

export function MagicLinkForm({ onSwitchToSignIn, onSwitchToSignUp }: MagicLinkFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { signInWithMagicLink } = useAuthStore();

  const handleSendMagicLink = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      await signInWithMagicLink(email);
      setEmailSent(true);
      Alert.alert(
        'Check your email',
        'We sent you a magic link. Please check your email and click the link to sign in.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send magic link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setEmailSent(false);
    setEmail('');
  };

  if (emailSent) {
    return (
      <YStack
        flex={1}
        justifyContent="center"
        padding="$4"
        maxWidth={400}
        width="100%"
        alignSelf="center"
        space="$4"
      >
        <YStack space="$2" alignItems="center">
          <Text fontSize="$8" fontWeight="bold" color="$color12">
            Check Your Email
          </Text>
          <Text fontSize="$4" color="$color10" textAlign="center">
            We sent a magic link to {email}
          </Text>
          <Text fontSize="$3" color="$color10" textAlign="center" lineHeight="$1">
            Click the link in your email to sign in. The link will expire in 1 hour.
          </Text>
        </YStack>

        <Button
          onPress={handleResend}
          backgroundColor="$blue10"
          color="white"
          size="$4"
        >
          Send to Different Email
        </Button>

        <XStack justifyContent="center" space="$2">
          <Text fontSize="$3" color="$color10">
            Didn't receive the email?
          </Text>
          <Button
            onPress={handleResend}
            paddingHorizontal="$2"
            paddingVertical="$1"
            backgroundColor="transparent"
            borderWidth={0}
          >
            <Text color="$blue10" fontWeight="600">
              Resend
            </Text>
          </Button>
        </XStack>

        <XStack justifyContent="center" space="$2">
          <Text fontSize="$3" color="$color10">
            Remember your password?
          </Text>
          <Button
            backgroundColor="transparent"
            borderWidth={0}
            onPress={onSwitchToSignIn}
            paddingHorizontal="$2"
            paddingVertical="$1"
          >
            <Text color="$blue10" fontWeight="600">
              Sign In
            </Text>
          </Button>
        </XStack>
      </YStack>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <YStack
        flex={1}
        justifyContent="center"
        padding="$4"
        maxWidth={400}
        width="100%"
        alignSelf="center"
        space="$4"
      >
        <YStack space="$2" alignItems="center">
          <Text fontSize="$8" fontWeight="bold" color="$color12">
            Magic Link Sign In
          </Text>
          <Text fontSize="$4" color="$color10" textAlign="center">
            Enter your email and we'll send you a secure link to sign in
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
              autoFocus
              borderColor="$borderColor"
              focusStyle={{
                borderColor: '$blue10',
              }}
            />
          </YStack>

          <Button
            onPress={handleSendMagicLink}
            disabled={isLoading}
            backgroundColor="$blue10"
            color="white"
            size="$4"
          >
            {isLoading ? <Spinner color="white" /> : 'Send Magic Link'}
          </Button>
        </YStack>

        <XStack justifyContent="center" space="$2">
          <Text fontSize="$3" color="$color10">
            Remember your password?
          </Text>
          <Button
            backgroundColor="transparent"
            borderWidth={0}
            onPress={onSwitchToSignIn}
            paddingHorizontal="$2"
            paddingVertical="$1"
          >
            <Text color="$blue10" fontWeight="600">
              Sign In
            </Text>
          </Button>
        </XStack>

        <XStack justifyContent="center" space="$2">
          <Text fontSize="$3" color="$color10">
            Don't have an account?
          </Text>
          <Button
            backgroundColor="transparent"
            borderWidth={0}
            onPress={onSwitchToSignUp}
            paddingHorizontal="$2"
            paddingVertical="$1"
          >
            <Text color="$blue10" fontWeight="600">
              Sign Up
            </Text>
          </Button>
        </XStack>
      </YStack>
    </KeyboardAvoidingView>
  );
}