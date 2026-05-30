import { supabase } from '@/lib/supabase';

export async function registrar(email, password, nombre, username) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nombre, username },
    },
  });

  if (error) {
    const msg = error.message ?? '';
    const isUniqueViolation =
      error.code === '23505' ||
      msg.toLowerCase().includes('unique') ||
      msg.toLowerCase().includes('username');
    if (isUniqueViolation)
      return { data: null, error: 'Ese nombre de usuario ya está en uso. Elegí otro.' };
    return { data: null, error: msg };
  }

  return { data, error: null };
}

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) return { error: error.message };
  return { error: null };
}

export async function getUsuarioActual() {
  const { data: { user } } = await supabase.auth.getUser();
  return user ?? null;
}

export async function aceptarTerminos(userId) {
  const { error } = await supabase
    .from('profiles')
    .update({ terminos_aceptados: true, terminos_fecha: new Date().toISOString() })
    .eq('id', userId);
  if (error) return { error: error.message };
  return { error: null };
}

export async function getPerfil(userId) {
  if (!userId) return { data: null, error: 'Sin usuario' };
  const { data, error } = await supabase
    .from('profiles')
    .select('role, nombre, username, vip_vence, terminos_aceptados')
    .eq('id', userId)
    .single();
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}
