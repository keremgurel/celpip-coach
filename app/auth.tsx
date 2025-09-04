import React, { useState } from 'react';
import { YStack } from 'tamagui';
import { SignInForm } from '../components/auth/SignInForm';
import { SignUpForm } from '../components/auth/SignUpForm';
import { MagicLinkForm } from '../components/auth/MagicLinkForm';

type AuthMode = 'signin' | 'signup' | 'magiclink';

export default function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('signin');

  const renderForm = () => {
    switch (mode) {
      case 'signin':
        return (
          <SignInForm
            onSwitchToSignUp={() => setMode('signup')}
            onSwitchToMagicLink={() => setMode('magiclink')}
          />
        );
      case 'signup':
        return (
          <SignUpForm
            onSwitchToSignIn={() => setMode('signin')}
            onSwitchToMagicLink={() => setMode('magiclink')}
          />
        );
      case 'magiclink':
        return (
          <MagicLinkForm
            onSwitchToSignIn={() => setMode('signin')}
            onSwitchToSignUp={() => setMode('signup')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      {renderForm()}
    </YStack>
  );
}