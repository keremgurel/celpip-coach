import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

console.log('🔧 Supabase URL:', supabaseUrl);
console.log('🔑 Supabase Key:', supabaseAnonKey ? 'Present' : 'Missing');
console.warn('🚨 DEBUG: Supabase client being created');
alert('Supabase client being created!');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

console.log('✅ Supabase client created successfully');

// Database types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string;
          created_at: string;
          display_name: string | null;
          free_credit_granted: boolean;
        };
        Insert: {
          user_id: string;
          display_name?: string | null;
          free_credit_granted?: boolean;
        };
        Update: {
          display_name?: string | null;
          free_credit_granted?: boolean;
        };
      };
      credits: {
        Row: {
          id: string;
          user_id: string;
          source: 'free' | 'purchase';
          remaining: number;
          created_at: string;
        };
        Insert: {
          user_id: string;
          source: 'free' | 'purchase';
          remaining: number;
        };
        Update: {
          remaining?: number;
        };
      };
      sessions: {
        Row: {
          id: string;
          user_id: string;
          mode: 'full' | 'single' | 'custom';
          created_at: string;
        };
        Insert: {
          user_id: string;
          mode: 'full' | 'single' | 'custom';
        };
        Update: {
          mode?: 'full' | 'single' | 'custom';
        };
      };
      tasks: {
        Row: {
          id: string;
          session_id: string;
          user_id: string;
          task_type: number;
          prompt_id: string;
          prep_seconds: number;
          speak_seconds: number;
          audio_path: string | null;
          transcript: string | null;
          status: 'recorded' | 'processing' | 'scored' | 'error';
          created_at: string;
        };
        Insert: {
          session_id: string;
          user_id: string;
          task_type: number;
          prompt_id: string;
          prep_seconds: number;
          speak_seconds: number;
          audio_path?: string | null;
          transcript?: string | null;
          status?: 'recorded' | 'processing' | 'scored' | 'error';
        };
        Update: {
          audio_path?: string | null;
          transcript?: string | null;
          status?: 'recorded' | 'processing' | 'scored' | 'error';
        };
      };
      feedback: {
        Row: {
          id: string;
          task_id: string;
          user_id: string;
          rubric: any;
          band: number;
          strengths: string[];
          issues: string[];
          suggestions: any;
          prosody: any;
          created_at: string;
        };
        Insert: {
          task_id: string;
          user_id: string;
          rubric: any;
          band: number;
          strengths: string[];
          issues: string[];
          suggestions: any;
          prosody: any;
        };
        Update: {
          rubric?: any;
          band?: number;
          strengths?: string[];
          issues?: string[];
          suggestions?: any;
          prosody?: any;
        };
      };
      prompts: {
        Row: {
          id: string;
          task_type: number;
          text: string;
          tags: string[];
          difficulty: number;
          active: boolean;
          locale: string;
          created_at: string;
        };
        Insert: {
          id: string;
          task_type: number;
          text: string;
          tags: string[];
          difficulty: number;
          active?: boolean;
          locale?: string;
        };
        Update: {
          text?: string;
          tags?: string[];
          difficulty?: number;
          active?: boolean;
          locale?: string;
        };
      };
    };
  };
};
