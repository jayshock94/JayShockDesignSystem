import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SavedTheme {
  id: string;
  user_id: string;
  name: string;
  theme_config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export async function saveTheme(userId: string, name: string, config: Record<string, unknown>) {
  return supabase
    .from('themes')
    .upsert({
      user_id: userId,
      name,
      theme_config: config,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,name' })
    .select()
    .single();
}

export async function loadThemes(userId: string) {
  return supabase
    .from('themes')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
}

export async function deleteTheme(id: string) {
  return supabase.from('themes').delete().eq('id', id);
}
