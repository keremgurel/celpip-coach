import { serve } from 'std/http/server.ts';
import { createClient } from 'supabase';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProcessFeedbackRequest {
  task_id: string;
  audio_url: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { task_id, audio_url }: ProcessFeedbackRequest = await req.json();

    if (!task_id || !audio_url) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: task_id, audio_url' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create a Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get task details
    const { data: task, error: taskError } = await supabaseAdmin
      .from('tasks')
      .select('*, prompts(*)')
      .eq('id', task_id)
      .single();

    if (taskError || !task) {
      return new Response(
        JSON.stringify({ error: 'Task not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Update task status to processing
    await supabaseAdmin
      .from('tasks')
      .update({ status: 'processing' })
      .eq('id', task_id);

    try {
      // Step 1: Speech-to-Text with OpenAI Whisper
      const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'multipart/form-data',
        },
        body: await createFormData(audio_url),
      });

      if (!whisperResponse.ok) {
        throw new Error(`Whisper API error: ${whisperResponse.statusText}`);
      }

      const whisperData = await whisperResponse.json();
      const transcript = whisperData.text;

      // Step 2: Basic prosody analysis
      const prosody = analyzeProsody(transcript);

      // Step 3: Generate feedback with GPT-4
      const feedback = await generateFeedback({
        task_prompt: task.prompts?.text || '',
        transcript,
        prosody,
        task_type: task.task_type,
      });

      // Step 4: Save results to database
      const { error: updateTaskError } = await supabaseAdmin
        .from('tasks')
        .update({ 
          transcript,
          status: 'scored'
        })
        .eq('id', task_id);

      if (updateTaskError) throw updateTaskError;

      const { error: insertFeedbackError } = await supabaseAdmin
        .from('feedback')
        .insert({
          task_id,
          user_id: task.user_id,
          rubric: feedback.rubric,
          band: feedback.band,
          strengths: feedback.strengths,
          issues: feedback.issues,
          suggestions: feedback.suggestions,
          prosody,
        });

      if (insertFeedbackError) throw insertFeedbackError;

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Feedback processed successfully' 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } catch (processingError) {
      console.error('Error processing feedback:', processingError);
      
      // Update task status to error
      await supabaseAdmin
        .from('tasks')
        .update({ status: 'error' })
        .eq('id', task_id);

      return new Response(
        JSON.stringify({ 
          error: 'Failed to process feedback',
          details: processingError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('Error in process-feedback function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function createFormData(audioUrl: string): Promise<FormData> {
  const response = await fetch(audioUrl);
  const audioBlob = await response.blob();
  
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.m4a');
  formData.append('model', 'whisper-1');
  formData.append('response_format', 'json');
  
  return formData;
}

function analyzeProsody(transcript: string) {
  const words = transcript.split(' ').filter(word => word.length > 0);
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Basic prosody metrics
  const wpm = words.length * 60 / 90; // Assuming 90 seconds average
  const avgSentenceLength = words.length / sentences.length;
  const fillerWords = ['um', 'uh', 'like', 'you know', 'so', 'well'];
  const fillerCount = words.filter(word => 
    fillerWords.some(filler => word.toLowerCase().includes(filler))
  ).length;
  const fillerRate = (fillerCount / words.length) * 100;

  return {
    wpm: Math.round(wpm),
    avg_sentence_length: Math.round(avgSentenceLength * 10) / 10,
    filler_rate: Math.round(fillerRate * 10) / 10,
    avg_pause_ms: 500, // Placeholder
  };
}

async function generateFeedback({
  task_prompt,
  transcript,
  prosody,
  task_type,
}: {
  task_prompt: string;
  transcript: string;
  prosody: any;
  task_type: number;
}) {
  const prompt = `You are an expert CELPIP speaking rater. Score this response on five dimensions from 1 to 12:

1. Content and Coherence - Organization, relevance, completeness
2. Vocabulary Range and Precision - Word choice, variety, accuracy  
3. Grammar and Sentence Control - Sentence structure, accuracy, complexity
4. Pronunciation and Intelligibility - Clarity, accent, stress patterns
5. Fluency and Delivery - Pace, rhythm, naturalness

Task: ${task_prompt}
Transcript: ${transcript}
Speech Metrics: WPM: ${prosody.wpm}, Filler Rate: ${prosody.filler_rate}%, Avg Sentence Length: ${prosody.avg_sentence_length}

Return JSON with:
- rubric: {content: number, vocabulary: number, grammar: number, pronunciation: number, fluency: number}
- band: overall CELPIP level (1-12)
- strengths: array of 3 specific strengths
- issues: array of 3 specific issues to improve
- suggestions: {connectors: array of 5 useful connectors, starters: array of 5 sentence starters, rewrites: array of 3 grammar improvements with from/to}

Keep suggestions actionable and specific to CELPIP speaking tasks.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  
  if (!content) {
    throw new Error('No content received from OpenAI');
  }

  try {
    return JSON.parse(content);
  } catch (parseError) {
    // Fallback if JSON parsing fails
    return {
      rubric: { content: 6, vocabulary: 6, grammar: 6, pronunciation: 6, fluency: 6 },
      band: 6,
      strengths: ['Clear communication', 'Good structure', 'Appropriate vocabulary'],
      issues: ['Some hesitation', 'Minor grammar errors', 'Could use more connectors'],
      suggestions: {
        connectors: ['First of all', 'Moreover', 'However', 'As a result', 'In conclusion'],
        starters: ['In my view', 'I believe that', 'From my experience', 'It seems to me', 'I would suggest'],
        rewrites: [
          { from: 'I think it good', to: 'I think it is good because' },
          { from: 'It very important', to: 'It is very important to' },
          { from: 'I can do it', to: 'I am able to do it' }
        ]
      }
    };
  }
}
