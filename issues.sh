#!/bin/bash

# Cellpipe Coach - MVP Issues Creation Script
# Run this script from your local celpip-coach repository directory
# Prerequisites: GitHub CLI installed and authenticated (gh auth login)

echo "Creating MVP issues for Cellpipe Coach..."

# Phase 1: Foundation (Critical Path)
gh issue create \
--title "Project Setup and Supabase Backend" \
--body "**Epic:** Foundation  
**Priority:** Critical  
**Estimate:** 4 days

**Description:**
Set up the complete project foundation including React Native app and Supabase backend.

**Tasks:**
- Initialize React Native project with Expo Dev Client and TypeScript
- Configure Expo Router for navigation
- Set up essential dependencies (expo-av, react-native-reanimated, zustand)
- Create Supabase project and database schema
- Set up all database tables (users, profiles, credits, sessions, tasks, feedback)
- Configure Row Level Security (RLS) policies
- Set up Storage bucket for audio files
- Create basic Edge Functions structure
- Create basic project structure and folder organization

**Acceptance Criteria:**
- Project builds successfully on iOS and Android
- Supabase database is fully configured with all tables
- RLS policies are working
- Storage bucket is configured for audio files
- Connection between client and Supabase is established

**Database Schema:**
\`\`\`sql
-- users handled by auth.users
create table profiles (
  user_id uuid primary key references auth.users on delete cascade,
  created_at timestamptz default now(),
  display_name text,
  free_credit_granted boolean default false
);

create table credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  source text check (source in ('free','purchase')),
  remaining integer not null,
  created_at timestamptz default now()
);

create table sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  mode text check (mode in ('full','single','custom')),
  created_at timestamptz default now()
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions on delete cascade,
  user_id uuid references auth.users on delete cascade,
  task_type integer not null check (task_type between 1 and 8),
  prompt_id text not null,
  prep_seconds integer not null,
  speak_seconds integer not null,
  audio_path text,
  transcript text,
  status text check (status in ('recorded','processing','scored','error')),
  created_at timestamptz default now()
);

create table feedback (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references tasks on delete cascade,
  user_id uuid references auth.users on delete cascade,
  rubric jsonb,
  band integer,
  strengths text[],
  issues text[],
  suggestions jsonb,
  prosody jsonb,
  created_at timestamptz default now()
);
\`\`\`" \
--label "epic:foundation,priority:critical" \
--milestone "MVP"

# Phase 2: Authentication
gh issue create \
--title "Authentication System with Free Credit" \
--body "**Epic:** Authentication  
**Priority:** Critical  
**Estimate:** 3 days

**Description:**
Complete authentication system with automatic free credit granting.

**Tasks:**
- Configure Supabase Auth providers (Apple, Google, Magic Link)
- Create authentication screens (sign in, sign up)
- Implement auth state management with Zustand
- Create user profile management and settings screen
- Set up automatic free credit granting on first sign in
- Add auth guards for protected routes
- Implement logout and account deletion

**Acceptance Criteria:**
- Users can sign in with Apple, Google, or email
- Auth state persists across app restarts
- New users receive one free credit automatically
- Protected routes redirect to auth when needed
- Users can delete their account and all data" \
--label "epic:auth,priority:critical" \
--milestone "MVP"

# Phase 3: Core App Structure
gh issue create \
--title "App Navigation and Home Screen" \
--body "**Epic:** Core App  
**Priority:** High  
**Estimate:** 2 days

**Description:**
Create main app navigation and home screen with credit display.

**Tasks:**
- Set up Expo Router with Auth, Practice, History, Settings stacks
- Create home screen showing available credits and quick start options
- Implement navigation between main sections
- Add basic UI components and styling system
- Create loading states and error boundaries
- Build practice mode selection (Full Exam, Single Task, Custom Mix)

**Acceptance Criteria:**
- Smooth navigation between all main sections
- Home screen displays user credits and practice options
- Users can select different practice modes
- Consistent styling across the app
- Proper loading states and error handling" \
--label "epic:core-app,priority:high" \
--milestone "MVP"

# Phase 4: Task Engine Core
gh issue create \
--title "Task Recording Engine with Official Timing" \
--body "**Epic:** Task Engine  
**Priority:** Critical  
**Estimate:** 6 days

**Description:**
Build the complete task recording functionality with CELPIP timing rules.

**Tasks:**
- Implement audio recording with expo-av (44.1 kHz, mono AAC)
- Configure official timing for all 8 task types:
  - Task 1 Advice: 30s prep, 90s speak
  - Task 2 Personal Experience: 30s prep, 90s speak  
  - Task 3 Describe a Scene: 30s prep, 60s speak
  - Task 4 Predictions: 30s prep, 60s speak
  - Task 5 Compare and Persuade: 60s prep, 60s speak
  - Task 6 Difficult Situation: 60s prep, 60s speak
  - Task 7 Express Opinions: 30s prep, 90s speak
  - Task 8 Unusual Situation: 30s prep, 60s speak
- Create prep countdown timer with visual feedback
- Build response timer with auto-stop functionality
- Add vibration alerts for last 5 seconds
- Add microphone permission handling
- Implement recording controls (start, stop, re-record)
- Create audio waveform visualization during recording
- Handle edge cases (silence detection, background interruptions)

**Acceptance Criteria:**
- Audio records at specified quality settings
- All 8 task types have correct official timing
- Timers work accurately with visual countdown and vibration
- Recording auto-stops at time limit with 2-second grace
- Microphone permissions handled gracefully
- Users can re-record within a task
- App handles silence and interruptions appropriately" \
--label "epic:task-engine,priority:critical" \
--milestone "MVP"

# Phase 5: Prompt System
gh issue create \
--title "Prompt System and Task Player Interface" \
--body "**Epic:** Task Engine  
**Priority:** High  
**Estimate:** 4 days

**Description:**
Create prompt management system and main task interface.

**Tasks:**
- Create prompts table with task_type, text, tags, difficulty
- Build prompt selection algorithm (weighted random, seeded)
- Implement anti-repetition logic
- Seed initial prompt bank (minimum 5 prompts per task type for MVP)
- Build task player screen with prompt display
- Add prep timer with countdown visual
- Implement recording interface with waveform
- Create \"Get Feedback\" button (initially disabled)
- Add task navigation for multi-task sessions
- Handle task state management

**Acceptance Criteria:**
- At least 5 prompts per task type in database
- Selection algorithm avoids recent repetition
- Prompts are seeded for reproducible feedback
- Prompt displays clearly with proper formatting
- Timers are visually prominent and accurate
- Recording interface is intuitive and responsive
- Get Feedback button enables after successful recording
- Multi-task sessions navigate smoothly" \
--label "epic:prompts,priority:high" \
--milestone "MVP"

# Phase 6: Audio Upload
gh issue create \
--title "Audio Upload and Storage System" \
--body "**Epic:** Backend Processing  
**Priority:** Critical  
**Estimate:** 3 days

**Description:**
Implement secure audio file upload with retry logic.

**Tasks:**
- Create audio upload functionality to Supabase Storage
- Implement upload queue with exponential backoff retry
- Add upload progress indicators
- Set up signed URL access for audio files
- Handle network failure and offline scenarios
- Implement background upload with expo-task-manager
- Add upload status tracking

**Acceptance Criteria:**
- Audio uploads reliably to secure storage
- Upload queue handles failures with exponential backoff
- Progress is shown to users during upload
- Audio files are accessible only to the owner
- Background uploads work when app is backgrounded" \
--label "epic:backend,priority:critical" \
--milestone "MVP"

# Phase 7: ASR Integration
gh issue create \
--title "Speech-to-Text Integration" \
--body "**Epic:** Backend Processing  
**Priority:** Critical  
**Estimate:** 4 days

**Description:**
Integrate ASR for transcript generation with basic analysis.

**Tasks:**
- Research and select ASR provider (recommend OpenAI Whisper)
- Create Edge Function for ASR processing
- Implement audio format conversion if needed
- Add transcript generation with timestamps
- Handle ASR failures and edge cases
- Add basic prosody feature extraction:
  - Words per minute
  - Pause length analysis
  - Filler word detection
  - Basic sentence length metrics

**Acceptance Criteria:**
- ASR reliably generates accurate transcripts
- Timestamps are captured for analysis
- Basic speech metrics are extracted
- Failures are handled gracefully with retry logic
- Edge Function processes audio within reasonable time limits" \
--label "epic:backend,priority:critical" \
--milestone "MVP"

# Phase 8: LLM Feedback Generation
gh issue create \
--title "AI Feedback Generation System" \
--body "**Epic:** Feedback System  
**Priority:** Critical  
**Estimate:** 5 days

**Description:**
Create LLM-powered feedback generation with CELPIP rubric scoring.

**Tasks:**
- Design LLM prompt template for CELPIP rubric scoring
- Integrate LLM provider (recommend GPT-4 or Claude)
- Implement structured JSON response parsing
- Create rubric scoring logic (5 dimensions, 1-12 scale):
  - Content and Coherence
  - Vocabulary Range and Precision
  - Grammar and Sentence Control
  - Pronunciation and Intelligibility
  - Fluency and Delivery
- Add basic heuristics calculation (filler rate, lexical diversity)
- Create feedback processing Edge Function
- Implement feedback status tracking (queued, processing, ready, error)
- Connect task completion to feedback request

**Acceptance Criteria:**
- LLM generates consistent, rubric-aligned feedback
- Scores are properly calibrated to CELPIP bands (1-12)
- Feedback includes strengths, issues, and actionable suggestions
- System handles LLM failures with appropriate fallbacks
- Users can request feedback after completing a task
- Processing status updates in real-time

**Example LLM Prompt:**
\`\`\`
You are an expert CELPIP speaking rater. Score this response on five dimensions from 1 to 12:
1. Content and Coherence
2. Vocabulary Range and Precision  
3. Grammar and Sentence Control
4. Pronunciation and Intelligibility
5. Fluency and Delivery

Task: {task_prompt}
Transcript: {transcript}
Speech Metrics: WPM: {wpm}, Filler Rate: {filler_rate}, Avg Pause: {avg_pause}ms

Return JSON with: rubric scores (1-12), overall band (1-12), 3 strengths, 3 issues, 5 specific suggestions including connectors and sentence starters.
\`\`\`" \
--label "epic:feedback,priority:critical" \
--milestone "MVP"

# Phase 9: Feedback UI
gh issue create \
--title "Feedback Display Interface" \
--body "**Epic:** Feedback System  
**Priority:** High  
**Estimate:** 4 days

**Description:**
Create comprehensive feedback display with transcript and suggestions.

**Tasks:**
- Build score summary with rubric dimension bars
- Create transcript display with highlights for:
  - Filler words
  - Grammar issues
  - Strong phrases
- Implement suggestion cards organized by type:
  - Connectors (\"First of all\", \"Moreover\", \"However\")
  - Sentence starters (\"In my view\", \"If I were you\")
  - Grammar rewrites
- Add audio playback controls for reviewing recording
- Create copy-to-clipboard functionality for phrases
- Handle feedback loading states and errors
- Add feedback caching and retrieval

**Acceptance Criteria:**
- Scores display clearly with visual progress bars
- Transcript is readable with meaningful color-coded highlights
- Suggestions are actionable and easy to copy to clipboard
- Audio playback works smoothly with play/pause controls
- Interface is accessible and user-friendly
- Completed feedback is cached and quickly retrievable
- Loading states and errors are handled gracefully

**Example Feedback JSON:**
\`\`\`json
{
  \"band\": 8,
  \"rubric\": {
    \"content\": 8,
    \"vocabulary\": 7,
    \"grammar\": 7,
    \"pronunciation\": 8,
    \"fluency\": 7
  },
  \"strengths\": [\"Clear organization\", \"Good examples\", \"Natural pace\"],
  \"issues\": [\"Some repetition\", \"Limited connectors\", \"Minor grammar slips\"],
  \"suggestions\": {
    \"connectors\": [\"First of all\", \"Moreover\", \"However\", \"As a result\"],
    \"starters\": [\"In my view\", \"If I were you\", \"I believe that\"],
    \"rewrites\": [
      {\"from\": \"I think it good\", \"to\": \"I think it is good because\"}
    ]
  },
  \"prosody\": {\"wpm\": 135, \"filler_rate\": 4.2, \"avg_pause_ms\": 420}
}
\`\`\`" \
--label "epic:feedback,priority:high" \
--milestone "MVP"

# Phase 10: Credit Management
gh issue create \
--title "Credit System and Validation" \
--body "**Epic:** Credits  
**Priority:** High  
**Estimate:** 2 days

**Description:**
Implement credit tracking and consumption logic.

**Tasks:**
- Create credit balance display throughout the app
- Implement credit consumption on feedback request (not on recording)
- Add credit validation before allowing feedback generation
- Create credit transaction history
- Handle edge cases (concurrent usage, processing failures)
- Add credit warnings when balance is low
- Implement free retry on processing failures (don't consume extra credit)

**Acceptance Criteria:**
- Credit balance is always accurate and visible to users
- Credits are consumed only when feedback is successfully generated
- Users cannot request feedback without sufficient credits
- Transaction history is maintained for debugging
- Processing failures don't consume credits unfairly
- Clear messaging about credit requirements" \
--label "epic:credits,priority:high" \
--milestone "MVP"

# Phase 11: In-App Purchases
gh issue create \
--title "RevenueCat Payment Integration" \
--body "**Epic:** Payments  
**Priority:** High  
**Estimate:** 4 days

**Description:**
Integrate RevenueCat for in-app purchases and credit top-up.

**Tasks:**
- Set up RevenueCat SDK and configuration
- Configure product: 8-credit pack for \$4.99
- Create paywall screen with clear value proposition
- Implement purchase flow with loading states
- Add webhook handling for purchase verification
- Create purchase restoration functionality
- Handle purchase edge cases and failures
- Add purchase success/failure messaging
- Create Edge Function to add credits after purchase

**Acceptance Criteria:**
- Users can purchase 8-credit packs for \$4.99
- Paywall clearly explains the value and pricing
- Purchases are verified and credits added automatically
- Purchase restoration works across devices and app reinstalls
- Failed purchases are handled gracefully with clear error messages
- Webhook correctly adds credits to user account

**RevenueCat Webhook Flow:**
1. Purchase completed in app
2. RevenueCat sends webhook to Edge Function
3. Edge Function verifies purchase and adds credits
4. User sees updated balance immediately" \
--label "epic:payments,priority:high" \
--milestone "MVP"

# Phase 12: Basic History
gh issue create \
--title "Session History and Audio Playback" \
--body "**Epic:** History  
**Priority:** Medium  
**Estimate:** 3 days

**Description:**
Create basic session history with audio playback capability.

**Tasks:**
- Build history list view showing:
  - Session date and time
  - Task types completed
  - Overall scores
  - Duration
- Create session detail view with:
  - All task results
  - Individual feedback
  - Audio playback for each task
- Add basic filtering by date range
- Implement audio playback from history
- Add transcript viewing from history
- Handle empty states (no history yet)

**Acceptance Criteria:**
- Users can view all past sessions in chronological order
- History includes audio, transcript, and feedback for each task
- Audio playback works reliably from history
- Session details show comprehensive results
- Empty states guide new users appropriately
- History loads efficiently (pagination if needed)" \
--label "epic:history,priority:medium" \
--milestone "MVP"

# Phase 13: Error Handling & Polish
gh issue create \
--title "Error Handling, Loading States, and MVP Polish" \
--body "**Epic:** Polish  
**Priority:** Medium  
**Estimate:** 3 days

**Description:**
Add comprehensive error handling and polish the MVP user experience.

**Tasks:**
- Implement comprehensive error boundaries and error screens
- Add proper loading states for all async operations:
  - Authentication
  - Audio upload
  - Feedback generation
  - Purchase processing
- Create offline state handling and messaging
- Add haptic feedback for important actions
- Implement proper app state handling (background/foreground)
- Add crash prevention for common edge cases
- Create user-friendly error messages
- Add app icon and splash screen
- Test and fix common user flows

**Acceptance Criteria:**
- App never crashes on common user actions
- Loading states provide clear feedback on progress
- Error messages are user-friendly and actionable
- Offline scenarios are handled gracefully
- App feels responsive with appropriate feedback
- Common user flows work smoothly end-to-end
- App icon and splash screen are professional

**Key User Flows to Test:**
1. Sign up → Complete first task → Get feedback
2. Purchase credits → Complete multiple tasks → View history
3. Network loss during upload → Recovery
4. App backgrounding during recording → Recovery" \
--label "epic:polish,priority:medium" \
--milestone "MVP"

# Phase 14: Performance & Deployment
gh issue create \
--title "Performance Optimization and App Store Preparation" \
--body "**Epic:** Deployment  
**Priority:** Medium  
**Estimate:** 2 days

**Description:**
Optimize performance and prepare for app store submission.

**Tasks:**
- Optimize audio recording and playback performance
- Implement efficient image and asset loading
- Add performance monitoring for key metrics
- Optimize database queries and API calls
- Create production build configurations
- Set up EAS Build for iOS and Android
- Create app store assets (screenshots, descriptions)
- Configure app store metadata
- Test production builds on physical devices
- Create privacy policy and terms of service

**Acceptance Criteria:**
- App runs smoothly on older devices (iPhone 8, Android API 21+)
- Audio recording has minimal latency
- App startup time is under 3 seconds
- Production builds work correctly on iOS and Android
- App store assets are ready for submission
- Privacy policy covers all data collection and usage" \
--label "epic:deployment,priority:medium"

echo "✅ Created 14 MVP issues successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Review the issues in GitHub and adjust estimates based on your team"
echo "2. Assign issues to team members"  
echo "3. Start with Issue #1 (Foundation) - it's the critical blocker"
echo "4. Focus on getting Issues 1-8 done first for core functionality"
echo "5. Issues 9-11 complete the feedback loop"
echo "6. Issues 12-14 add payments and polish for MVP launch"
echo ""
echo "⏱️  Estimated MVP Timeline: ~40-45 development days"
echo "🎯 Critical Path: Issues 1 → 4 → 7 → 8 → 9 → 11"