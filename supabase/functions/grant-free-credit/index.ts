import { serve } from 'std/http/server.ts';
import { createClient } from 'supabase';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the user from the JWT token
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if user already has a profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('free_credit_granted')
      .eq('user_id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError;
    }

    // If profile doesn't exist, create it
    if (!profile) {
      const { error: insertError } = await supabaseClient
        .from('profiles')
        .insert({
          user_id: user.id,
          display_name: user.user_metadata?.full_name || user.email,
          free_credit_granted: false,
        });

      if (insertError) throw insertError;
    }

    // If user already received free credit, return success
    if (profile?.free_credit_granted) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Free credit already granted',
          already_granted: true 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Grant free credit
    const { error: creditError } = await supabaseClient
      .from('credits')
      .insert({
        user_id: user.id,
        source: 'free',
        remaining: 1,
      });

    if (creditError) throw creditError;

    // Update profile to mark free credit as granted
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({ free_credit_granted: true })
      .eq('user_id', user.id);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Free credit granted successfully' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error granting free credit:', error);
    
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
