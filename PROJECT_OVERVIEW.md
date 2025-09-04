# CELPIP Speaking Coach - Technical Implementation Guide

## Project Overview

A React Native mobile app that helps users practice CELPIP Speaking with AI-powered feedback. The app delivers eight task types mirroring the official test, records user responses, and provides automated scoring with rubric-aligned feedback.

## Technology Stack

### Frontend
- **React Native** with Expo Dev Client
- **TypeScript** for type safety
- **Expo Router** for navigation
- **Zustand** for state management
- **TanStack React Query** for data fetching
- **expo-av** for audio recording/playback
- **react-native-reanimated** for animations
- **Tamagui** for cross-platform UI components

### Backend
- **Supabase** (PostgreSQL, Auth, Storage, Edge Functions)
- **Row Level Security (RLS)** for data protection
- **Supabase Edge Functions** for AI processing

### Third-Party Services
- **RevenueCat** for in-app purchases
- **OpenAI Whisper** for speech-to-text
- **OpenAI GPT-4** for feedback generation
- **PostHog** (optional) for analytics

## Project Structure

```
celpip-coach/
├── apps/
│   └── mobile/                 # React Native app
│       ├── app/               # Expo Router pages
│       ├── components/        # Reusable UI components
│       ├── hooks/            # Custom React hooks
│       ├── lib/              # Utilities and configurations
│       ├── stores/           # Zustand stores
│       ├── types/            # TypeScript type definitions
│       └── constants/        # App constants
├── packages/
│   ├── ui/                   # Shared UI components
│   ├── database/             # Database types and utilities
│   └── api/                  # API utilities and types
├── supabase/
│   ├── migrations/           # Database migrations
│   ├── functions/            # Edge Functions
│   └── seed.sql             # Initial data
└── docs/                    # Documentation
```

## Database Schema

### Core Tables

```sql
-- User profiles (extends auth.users)
CREATE TABLE profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  display_name TEXT,
  free_credit_granted BOOLEAN DEFAULT FALSE
);

-- Credit management
CREATE TABLE credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  source TEXT CHECK (source IN ('free','purchase')),
  remaining INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Practice sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  mode TEXT CHECK (mode IN ('full','single','custom')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual tasks within sessions
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  task_type INTEGER NOT NULL CHECK (task_type BETWEEN 1 AND 8),
  prompt_id TEXT NOT NULL,
  prep_seconds INTEGER NOT NULL,
  speak_seconds INTEGER NOT NULL,
  audio_path TEXT,
  transcript TEXT,
  status TEXT CHECK (status IN ('recorded','processing','scored','error')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI-generated feedback
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  rubric JSONB,             -- detailed sub-scores
  band INTEGER,             -- predicted CELPIP level 1-12
  strengths TEXT[],
  issues TEXT[],
  suggestions JSONB,        -- connectors, phrases, rewrites
  prosody JSONB,            -- rate, pause, pitch metrics
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prompt bank
CREATE TABLE prompts (
  id TEXT PRIMARY KEY,
  task_type INTEGER NOT NULL CHECK (task_type BETWEEN 1 AND 8),
  text TEXT NOT NULL,
  tags TEXT[],
  difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 5),
  active BOOLEAN DEFAULT TRUE,
  locale TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security Policies

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Similar policies for other tables...
```

## Task Types and Timing

| Task | Description | Prep Time | Response Time |
|------|-------------|-----------|---------------|
| 1 | Advice | 30s | 90s |
| 2 | Personal Experience | 30s | 90s |
| 3 | Describe a Scene | 30s | 60s |
| 4 | Predictions | 30s | 60s |
| 5 | Compare and Persuade | 60s | 60s |
| 6 | Difficult Situation | 60s | 60s |
| 7 | Express Opinions | 30s | 90s |
| 8 | Unusual Situation | 30s | 60s |

## CELPIP Rubric Scoring

### Five Dimensions (1-12 scale)
1. **Content and Coherence** - Organization, relevance, completeness
2. **Vocabulary Range and Precision** - Word choice, variety, accuracy
3. **Grammar and Sentence Control** - Sentence structure, accuracy, complexity
4. **Pronunciation and Intelligibility** - Clarity, accent, stress patterns
5. **Fluency and Delivery** - Pace, rhythm, naturalness

### Band Descriptions
- **1-3**: Limited effectiveness
- **4-6**: Adequate effectiveness
- **7-9**: Good effectiveness
- **10-12**: Excellent effectiveness

## Audio Processing Pipeline

### Recording Specifications
- **Format**: AAC M4A
- **Sample Rate**: 44.1 kHz
- **Channels**: Mono
- **Bit Rate**: 128 kbps

### Processing Flow
1. **Record** → Local storage with waveform visualization
2. **Upload** → Supabase Storage with signed URLs
3. **ASR** → OpenAI Whisper for transcript generation
4. **Analysis** → Extract prosody features (WPM, pauses, fillers)
5. **Scoring** → GPT-4 with CELPIP rubric prompt
6. **Storage** → Save feedback to database
7. **Display** → Render scores, transcript, and suggestions

## State Management Architecture

### Zustand Stores

```typescript
// Auth Store
interface AuthStore {
  user: User | null;
  isLoading: boolean;
  signIn: (provider: 'apple' | 'google' | 'email') => Promise<void>;
  signOut: () => Promise<void>;
}

// Credits Store
interface CreditsStore {
  balance: number;
  isLoading: boolean;
  consumeCredit: () => Promise<boolean>;
  refreshBalance: () => Promise<void>;
}

// Task Store
interface TaskStore {
  currentTask: Task | null;
  isRecording: boolean;
  recordingTime: number;
  startRecording: () => void;
  stopRecording: () => void;
  submitForFeedback: () => Promise<void>;
}
```

## API Endpoints

### Supabase Edge Functions

```typescript
// Process feedback
POST /functions/v1/process-feedback
{
  "task_id": "uuid",
  "audio_url": "signed_url"
}

// Grant free credit
POST /functions/v1/grant-free-credit
{
  "user_id": "uuid"
}

// RevenueCat webhook
POST /functions/v1/revenuecat-webhook
{
  "event": "INITIAL_PURCHASE",
  "app_user_id": "uuid",
  "product_id": "credit_pack_8"
}
```

## Security Considerations

### Data Protection
- All audio files stored with signed URLs
- RLS policies prevent cross-user data access
- API keys stored in Supabase Vault
- User data encrypted at rest

### Privacy Compliance
- Audio retention settings per user
- Account deletion removes all data
- No background recording
- Clear data usage explanations

## Performance Optimizations

### Client-Side
- Lazy loading for non-critical components
- Audio compression before upload
- Efficient state updates with Zustand
- Image optimization with Expo Image

### Server-Side
- Database indexing on frequently queried columns
- Edge Function timeout handling
- Audio processing queue with retry logic
- Caching for frequently accessed data

## Error Handling Strategy

### Client Errors
- Network failures → Retry with exponential backoff
- Audio permission denied → Graceful fallback with instructions
- Recording failures → Clear error messages and retry options

### Server Errors
- ASR failures → Mark task as error, allow free retry
- LLM failures → Fallback to basic feedback
- Upload failures → Queue for retry

## Testing Strategy

### Unit Tests
- Timer logic and state management
- Credit consumption logic
- Audio recording utilities

### Integration Tests
- Complete task flow with Detox
- Authentication flows
- Purchase and credit management

### E2E Tests
- Full user journey from signup to feedback
- Cross-platform compatibility
- Offline/online scenarios

## Deployment Pipeline

### Development
- Expo Dev Client for rapid iteration
- Supabase local development with CLI
- Hot reloading for immediate feedback

### Production
- EAS Build for iOS and Android
- Supabase production environment
- App Store and Play Store deployment

## Monitoring and Analytics

### Key Metrics
- Task completion rates
- Feedback generation success
- Purchase conversion rates
- User retention and engagement

### Error Tracking
- Crash reporting with Expo
- API error monitoring
- Performance metrics

## Future Enhancements

### Phase 2 Features
- Pronunciation heatmap with phoneme analysis
- Multi-accent ASR support
- Listening, Reading, Writing modules
- Advanced progress tracking and streaks

### Technical Improvements
- Offline mode with sync
- Advanced caching strategies
- Real-time collaboration features
- Advanced analytics dashboard

## Development Workflow

### Getting Started
1. Clone repository
2. Install dependencies with `yarn install`
3. Set up Supabase project
4. Configure environment variables
5. Run development server with `yarn dev`

### Code Standards
- TypeScript strict mode enabled
- ESLint and Prettier configured
- Conventional commit messages
- Comprehensive error handling

### Git Workflow
- Feature branches for new development
- Pull requests for code review
- Automated testing on CI/CD
- Semantic versioning for releases

---

This technical implementation guide provides the foundation for building a robust, scalable CELPIP Speaking Coach app. The architecture supports the core requirements while remaining flexible for future enhancements.
