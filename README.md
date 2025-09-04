# CELPIP Speaking Coach - Mobile App

A React Native mobile app that helps users practice CELPIP Speaking with AI-powered feedback.

## Features

### Authentication System
- **Multiple Sign-in Methods**: Apple, Google, Email/Password, and Magic Link
- **Automatic Free Credit**: New users receive 1 free credit upon first sign-in
- **Profile Management**: Users can update their display name and view account information
- **Account Deletion**: Complete account deletion with data cleanup
- **Auth Guards**: Protected routes that redirect to authentication when needed

### User Interface
- **Tamagui Design System**: Modern, consistent UI components with cross-platform compatibility
- **Responsive Design**: Built-in responsive props and media queries
- **Theme Support**: Light/dark mode support with customizable themes
- **Performance Optimized**: Compile-time optimizations and tree flattening
- **Type Safety**: Fully typed components and props
- **Loading States**: Proper loading indicators and error handling
- **Form Validation**: Client-side validation for all input forms

## Setup

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Install dependencies:
```bash
yarn install
```

2. Configure environment variables:
```bash
cp env.example .env
# Edit .env with your Supabase credentials
```

3. Start the development server:
```bash
yarn dev
```

### Environment Variables

Create a `.env` file with the following variables:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure

```
apps/mobile/
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout with providers
│   ├── index.tsx          # Home screen (protected)
│   ├── auth.tsx           # Authentication screen
│   ├── practice.tsx       # Practice screen (protected)
│   ├── history.tsx        # History screen (protected)
│   └── settings.tsx       # Settings screen (protected)
├── components/
│   └── auth/              # Authentication components
│       ├── AuthGuard.tsx  # Route protection component
│       ├── SignInForm.tsx # Sign in form (Tamagui)
│       ├── SignUpForm.tsx # Sign up form (Tamagui)
│       └── MagicLinkForm.tsx # Magic link form (Tamagui)
├── stores/                # Zustand state management
│   ├── auth.ts           # Authentication store
│   └── credits.ts        # Credits store
├── lib/
│   └── supabase.ts       # Supabase client configuration
├── types/
│   └── index.ts          # TypeScript type definitions
├── tamagui.config.ts     # Tamagui configuration
└── babel.config.js       # Babel configuration with Tamagui plugin
```

## Authentication Flow

### Sign Up Process
1. User enters email, password, and optional display name
2. Account is created in Supabase Auth
3. Profile record is created in the database
4. User receives email confirmation (if email confirmation is enabled)
5. Upon first sign-in, user automatically receives 1 free credit

### Sign In Process
1. User can sign in with Apple, Google, email/password, or magic link
2. Auth state is managed by Zustand store
3. Profile and credits are automatically loaded
4. User is redirected to home screen

### Protected Routes
- All main app screens (home, practice, history, settings) are protected
- Unauthenticated users are automatically redirected to auth screen
- AuthGuard component handles route protection

## UI Framework - Tamagui

This app uses [Tamagui](https://tamagui.dev/) for the UI layer, providing:

### Benefits
- **Cross-platform Components**: Works seamlessly on iOS, Android, and Web
- **Type Safety**: Fully typed props and themes
- **Performance**: Compile-time optimizations and tree flattening
- **Responsive Design**: Built-in responsive props and media queries
- **Theming**: Easy theme management and dark mode support
- **Consistency**: Pre-built design system with consistent styling

### Key Components Used
- `YStack` / `XStack` - Layout components
- `Text` - Typography component
- `Button` - Interactive button component
- `Input` - Form input component
- `Card` - Container component
- `Spinner` - Loading indicator

## State Management

### Auth Store (`stores/auth.ts`)
- User authentication state
- Profile management
- Sign in/out methods
- Account deletion
- Free credit granting

### Credits Store (`stores/credits.ts`)
- Credit balance tracking
- Credit consumption
- Balance refresh

## Database Integration

The app integrates with Supabase for:
- User authentication
- Profile management
- Credit tracking
- Data persistence

### Required Database Tables
- `profiles` - User profile information
- `credits` - Credit balance tracking
- `sessions` - Practice sessions
- `tasks` - Individual practice tasks
- `feedback` - AI-generated feedback

## Development

### Running the App
```bash
# Start development server
yarn dev

# Run on iOS simulator
yarn ios

# Run on Android emulator
yarn android
```

### Building for Production
```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android
```

## Testing

The authentication system includes comprehensive error handling and user feedback:
- Form validation
- Network error handling
- Loading states
- Success/error alerts

## Security

- All API calls use Supabase's built-in security
- Row Level Security (RLS) policies protect user data
- Sensitive operations require authentication
- Account deletion removes all associated data

## Future Enhancements

- Biometric authentication
- Social login providers
- Advanced profile customization
- Offline authentication caching
- Multi-factor authentication
