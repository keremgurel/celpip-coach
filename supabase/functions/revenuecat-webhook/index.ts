import { serve } from 'std/http/server.ts';
import { createClient } from 'supabase';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RevenueCatEvent {
  type: string;
  app_user_id: string;
  product_id: string;
  purchased_at_ms: number;
  original_app_user_id?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify webhook signature (optional but recommended)
    const signature = req.headers.get('authorization');
    const expectedSignature = Deno.env.get('REVENUECAT_WEBHOOK_SECRET');
    
    if (expectedSignature && signature !== `Bearer ${expectedSignature}`) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const event: RevenueCatEvent = await req.json();

    // Only process purchase events
    if (event.type !== 'INITIAL_PURCHASE' && event.type !== 'RENEWAL') {
      return new Response(
        JSON.stringify({ message: 'Event type not processed' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create a Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user by app_user_id (this should match the user_id in our auth system)
    const { data: user, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('user_id')
      .eq('user_id', event.app_user_id)
      .single();

    if (userError || !user) {
      console.error('User not found:', event.app_user_id);
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Determine credit amount based on product_id
    let creditAmount = 0;
    switch (event.product_id) {
      case 'credit_pack_8':
        creditAmount = 8;
        break;
      default:
        console.error('Unknown product_id:', event.product_id);
        return new Response(
          JSON.stringify({ error: 'Unknown product' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
    }

    // Add credits to user account
    const { error: creditError } = await supabaseAdmin
      .from('credits')
      .insert({
        user_id: event.app_user_id,
        source: 'purchase',
        remaining: creditAmount,
      });

    if (creditError) {
      console.error('Error adding credits:', creditError);
      return new Response(
        JSON.stringify({ error: 'Failed to add credits' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Added ${creditAmount} credits to user ${event.app_user_id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Added ${creditAmount} credits successfully` 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in revenuecat-webhook function:', error);
    
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
