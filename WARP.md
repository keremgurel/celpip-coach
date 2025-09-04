# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Commands
- `yarn install` - Install all workspace dependencies
- `yarn dev` - Start Expo development server with dev client
- `yarn ios` - Run on iOS simulator
- `yarn android` - Run on Android emulator
- `yarn web` - Run on web browser
- `yarn build` - Build the mobile app for production
- `yarn lint` - Run ESLint on mobile app
- `yarn type-check` - Run TypeScript type checking

### Supabase Commands
- `supabase start` - Start local Supabase instance (requires Docker)
- `supabase stop` - Stop local Supabase instance
- `supabase db push` - Apply migrations to database
- `supabase db reset` - Reset local database with fresh migrations
- `supabase functions serve` - Serve Edge Functions locally
- `supabase gen types typescript --project-id=celpip-coach > apps/mobile/lib/database.types.ts` - Generate TypeScript types from database schema

### Testing Individual Components
- To test a single Edge Function: `supabase functions serve --env-file .env.local process-feedback`
- To test database queries: Use Supabase Studio at `http://localhost:54323`
- To test mobile app with specific task: Modify the task type constants in `apps/mobile/constants/`

## Architecture Overview

### Project Structure
This is a **React Native monorepo** using Yarn workspaces with three main areas:
- `apps/mobile/` - Main React Native app with Expo
- `packages/` - Shared utilities (ui, api, database)
- `supabase/` - Backend infrastructure (database, Edge Functions)

### Tech Stack
- **Frontend**: React Native + Expo Dev Client, TypeScript, Zustand (state), TanStack React Query (data fetching)
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **AI Pipeline**: OpenAI Whisper (speech-to-text) + GPT-4 (feedback generation)
- **Payments**: RevenueCat integration
- **Audio**: expo-av for recording with M4A format

### Key Architectural Patterns

#### State Management with Zustand
The app uses Zustand stores for global state:
- `stores/auth.ts` - User authentication and session management
- `stores/credits.ts` - Credit balance and consumption tracking
- Other stores follow similar patterns with async actions and error handling

#### Database Architecture
The app centers around a **practice session workflow**:
1. **sessions** table tracks practice modes (full/single/custom)
2. **tasks** table stores individual CELPIP tasks within sessions
3. **feedback** table contains AI-generated scores and suggestions
4. **credits** table manages user's available feedback credits
5. **prompts** table holds the bank of CELPIP practice questions

All tables use Row Level Security (RLS) to ensure users only access their own data.

#### AI Processing Pipeline
Audio processing happens through Supabase Edge Functions:
1. User records audio → uploads to Supabase Storage
2. `process-feedback` Edge Function processes the audio:
   - Downloads audio file
   - Calls OpenAI Whisper for transcription
   - Analyzes prosody (WPM, filler words, sentence length)
   - Calls GPT-4 with CELPIP rubric for scoring
   - Stores results in database
3. Client polls for completion and displays results

### CELPIP-Specific Domain Knowledge

#### Task Types (1-8 with specific timing)
Each CELPIP task has fixed preparation and response times:
- Tasks 1,2,7: 30s prep + 90s response (longer speaking tasks)
- Tasks 3,4,8: 30s prep + 60s response (shorter speaking tasks)  
- Tasks 5,6: 60s prep + 60s response (complex analysis tasks)

#### Scoring Rubric (1-12 scale across 5 dimensions)
AI feedback evaluates:
1. Content and Coherence
2. Vocabulary Range and Precision
3. Grammar and Sentence Control
4. Pronunciation and Intelligibility
5. Fluency and Delivery

## Working with the Codebase

### Environment Setup
1. Copy `apps/mobile/env.example` to `apps/mobile/.env`
2. Set up Supabase project and populate environment variables:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - OpenAI API key in Supabase Vault for Edge Functions

### Development Workflow
- The mobile app uses Expo Dev Client, not Expo Go
- Hot reloading works for most changes
- Database schema changes require running migrations with `supabase db push`
- Edge Function changes require redeploying functions

### Key Files to Understand
- `apps/mobile/lib/supabase.ts` - Database client and type definitions
- `supabase/migrations/001_initial_schema.sql` - Complete database schema
- `supabase/functions/process-feedback/index.ts` - Core AI processing pipeline
- `apps/mobile/stores/` - Global state management patterns
- `metro.config.js` - Monorepo configuration for React Native

### Testing Strategies
- Use local Supabase instance for development: `supabase start`
- Test audio recording with physical device (not simulator)
- Mock OpenAI calls during development to avoid API costs
- Use Supabase Studio for direct database debugging

### Common Development Tasks

#### Adding New CELPIP Task Types
1. Update task_type constraints in database schema
2. Add timing constants to mobile app constants
3. Update task selection logic in practice flow
4. Add prompts to prompts table via seed data

#### Modifying AI Feedback Logic
1. Edit `supabase/functions/process-feedback/index.ts`
2. Update feedback generation prompts for GPT-4
3. Test with `supabase functions serve` locally
4. Deploy with `supabase functions deploy process-feedback`

#### Adding New Database Tables
1. Create migration file: `supabase migration new table_name`
2. Add table definition with RLS policies
3. Update TypeScript types in `apps/mobile/lib/supabase.ts`
4. Apply migration: `supabase db push`

### Audio Recording Considerations
- Audio format is AAC M4A, 44.1kHz mono, 128kbps
- Files are stored in Supabase Storage with signed URLs
- Recording requires physical device for testing
- Audio compression happens client-side before upload
- Waveform visualization uses react-native-reanimated

### Credit System Logic
- Users get free credits on first signup via `grant-free-credit` Edge Function
- RevenueCat webhook processes IAP purchases via `revenuecat-webhook` Edge Function  
- Credit consumption happens atomically when submitting tasks for feedback
- Failed feedback processing doesn't consume credits (marked as "error" status)

### Deployment Notes
- Mobile app deploys via EAS Build for iOS/Android app stores
- Supabase Edge Functions deploy independently of mobile app
- Database migrations must be applied before app releases that depend on schema changes
- Environment variables are managed separately in Expo and Supabase environments
