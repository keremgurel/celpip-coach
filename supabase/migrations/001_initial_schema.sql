-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  display_name TEXT,
  free_credit_granted BOOLEAN DEFAULT FALSE
);

-- Create credits table
CREATE TABLE credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  source TEXT CHECK (source IN ('free','purchase')),
  remaining INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  mode TEXT CHECK (mode IN ('full','single','custom')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tasks table
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
  status TEXT CHECK (status IN ('recorded','processing','scored','error')) DEFAULT 'recorded',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create feedback table
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

-- Create prompts table
CREATE TABLE prompts (
  id TEXT PRIMARY KEY,
  task_type INTEGER NOT NULL CHECK (task_type BETWEEN 1 AND 8),
  text TEXT NOT NULL,
  tags TEXT[],
  difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 5) DEFAULT 3,
  active BOOLEAN DEFAULT TRUE,
  locale TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_credits_user_id ON credits(user_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_session_id ON tasks(session_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_feedback_task_id ON feedback(task_id);
CREATE INDEX idx_feedback_user_id ON feedback(user_id);
CREATE INDEX idx_prompts_task_type ON prompts(task_type);
CREATE INDEX idx_prompts_active ON prompts(active);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for credits
CREATE POLICY "Users can view own credits" ON credits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credits" ON credits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own credits" ON credits
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for sessions
CREATE POLICY "Users can view own sessions" ON sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for tasks
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for feedback
CREATE POLICY "Users can view own feedback" ON feedback
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feedback" ON feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own feedback" ON feedback
  FOR UPDATE USING (auth.uid() = user_id);

-- Prompts are public (no RLS needed for reading)
-- Only admins can modify prompts (handled by service role)
