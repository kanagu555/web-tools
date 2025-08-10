/**
 * Supabase client configuration for Next.js
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration missing. Some features may not work.');
}

// Create Supabase client
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Check if Supabase is properly configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

/**
 * Test Supabase connection
 */
export const testSupabaseConnection = async () => {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase.from('_test').select('*').limit(1);
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "relation does not exist" which is expected
      return { success: false, error: error.message };
    }
    
    return { success: true, data: 'Connection successful' };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

/**
 * Analytics tracking with Supabase
 */
export const trackAnalytics = async (event: {
  event_name: string;
  tool_name?: string;
  user_agent?: string;
  timestamp?: string;
  metadata?: Record<string, any>;
}) => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured, skipping analytics tracking');
    return;
  }

  try {
    const { error } = await supabase
      .from('analytics_events')
      .insert([{
        ...event,
        timestamp: event.timestamp || new Date().toISOString(),
        user_agent: event.user_agent || (typeof window !== 'undefined' ? window.navigator.userAgent : ''),
      }]);

    if (error) {
      console.error('Error tracking analytics:', error);
    }
  } catch (error) {
    console.error('Error tracking analytics:', error);
  }
};

/**
 * Store user feedback
 */
export const submitFeedback = async (feedback: {
  tool_name: string;
  rating: number;
  comment?: string;
  user_email?: string;
}) => {
  if (!isSupabaseConfigured) {
    throw new Error('Feedback service not available');
  }

  try {
    const { data, error } = await supabase
      .from('user_feedback')
      .insert([{
        ...feedback,
        created_at: new Date().toISOString(),
      }]);

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

/**
 * Get tool usage statistics
 */
export const getToolStats = async (toolName?: string) => {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    let query = supabase
      .from('analytics_events')
      .select('event_name, tool_name, created_at')
      .eq('event_name', 'tool_usage');

    if (toolName) {
      query = query.eq('tool_name', toolName);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};