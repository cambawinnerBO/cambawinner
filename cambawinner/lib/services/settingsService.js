import { supabase } from '@/lib/supabase';

export async function obtenerSettings() {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .limit(1)
    .maybeSingle();
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function actualizarSettings(datos) {
  const { data, error } = await supabase
    .from('settings')
    .update({
      whatsapp_numero: datos.whatsapp_numero,
      whatsapp_canal:  datos.whatsapp_canal,
      precio_semanal:  datos.precio_semanal,
      precio_mensual:  datos.precio_mensual,
      bankroll_base:   datos.bankroll_base,
      updated_at:      new Date().toISOString(),
    })
    .eq('id', datos.id)
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}
