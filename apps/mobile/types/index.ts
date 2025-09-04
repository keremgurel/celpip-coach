// Database types
export interface Profile {
  user_id: string;
  created_at: string;
  display_name?: string;
  free_credit_granted: boolean;
}

export interface Credit {
  id: string;
  user_id: string;
  source: 'free' | 'purchase';
  remaining: number;
  created_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  mode: 'full' | 'single' | 'custom';
  created_at: string;
}

export interface Task {
  id: string;
  session_id: string;
  user_id: string;
  task_type: number; // 1-8
  prompt_id: string;
  prep_seconds: number;
  speak_seconds: number;
  audio_path?: string;
  transcript?: string;
  status: 'recorded' | 'processing' | 'scored' | 'error';
  created_at: string;
}

export interface Feedback {
  id: string;
  task_id: string;
  user_id: string;
  rubric: {
    content: number;
    vocabulary: number;
    grammar: number;
    pronunciation: number;
    fluency: number;
  };
  band: number; // 1-12
  strengths: string[];
  issues: string[];
  suggestions: {
    connectors: string[];
    starters: string[];
    rewrites: Array<{
      from: string;
      to: string;
    }>;
  };
  prosody: {
    wpm: number;
    filler_rate: number;
    avg_pause_ms: number;
  };
  created_at: string;
}

export interface Prompt {
  id: string;
  task_type: number;
  text: string;
  tags: string[];
  difficulty: number; // 1-5
  active: boolean;
  locale: string;
  created_at: string;
}

// App state types
export interface AuthState {
  user: any | null;
  isLoading: boolean;
  signIn: (provider: 'apple' | 'google' | 'email') => Promise<void>;
  signOut: () => Promise<void>;
}

export interface CreditsState {
  balance: number;
  isLoading: boolean;
  consumeCredit: () => Promise<boolean>;
  refreshBalance: () => Promise<void>;
}

export interface TaskState {
  currentTask: Task | null;
  isRecording: boolean;
  recordingTime: number;
  startRecording: () => void;
  stopRecording: () => Promise<void>;
  submitForFeedback: () => Promise<void>;
}

// Task timing configuration
export const TASK_TIMING = {
  1: { prep: 30, speak: 90 }, // Advice
  2: { prep: 30, speak: 90 }, // Personal Experience
  3: { prep: 30, speak: 60 }, // Describe a Scene
  4: { prep: 30, speak: 60 }, // Predictions
  5: { prep: 60, speak: 60 }, // Compare and Persuade
  6: { prep: 60, speak: 60 }, // Difficult Situation
  7: { prep: 30, speak: 90 }, // Express Opinions
  8: { prep: 30, speak: 60 }, // Unusual Situation
} as const;

// CELPIP rubric dimensions
export const RUBRIC_DIMENSIONS = [
  'content',
  'vocabulary',
  'grammar',
  'pronunciation',
  'fluency',
] as const;

export type RubricDimension = typeof RUBRIC_DIMENSIONS[number];
