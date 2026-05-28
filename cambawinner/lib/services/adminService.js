import { supabase } from '@/lib/supabase';

export async function obtenerTodosLosUsuarios() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function activarVip(userId, plan) {
  const dias = plan === 'mensual' ? 30 : 7;
  const vip_vence = new Date(Date.now() + dias * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: 'vip', vip_vence })
    .eq('id', userId)
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function revocarVip(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: 'free', vip_vence: null })
    .eq('id', userId)
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}
