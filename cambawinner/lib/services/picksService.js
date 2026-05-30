import { supabase } from '@/lib/supabase';

export async function publicarPick(datos) {
  if (datos.is_pick_del_dia) {
    await supabase.from('picks').update({ is_pick_del_dia: false }).eq('is_pick_del_dia', true);
  }
  const { data, error } = await supabase
    .from('picks')
    .insert({ ...datos, result: 'pendiente' })
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function obtenerPickDelDia(isVip = false) {
  const { data, error } = await supabase
    .from('picks')
    .select('*')
    .eq('is_pick_del_dia', true)
    .eq('is_vip', isVip)
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function obtenerPicksPendientes() {
  const { data, error } = await supabase
    .from('picks')
    .select('*')
    .eq('result', 'pendiente')
    .order('published_at', { ascending: false });
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function marcarResultado(id, result, odds, stake) {
  let profit_bs = null;
  if (result === 'ganado')  profit_bs = parseFloat(((odds - 1) * stake * 10).toFixed(2));
  if (result === 'perdido') profit_bs = -(stake * 10);
  if (result === 'anulado') profit_bs = 0;

  const { data, error } = await supabase
    .from('picks')
    .update({ result, profit_bs })
    .eq('id', id)
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function obtenerUltimosPicks(limite = 5) {
  const { data, error } = await supabase
    .from('picks')
    .select('*')
    .eq('is_vip', false)
    .neq('result', 'pendiente')
    .order('published_at', { ascending: false })
    .limit(limite);
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function obtenerEstadisticas() {
  const { data: resueltos, error } = await supabase
    .from('picks')
    .select('stake, profit_bs')
    .in('result', ['ganado', 'perdido', 'anulado']);

  if (error || !resueltos || resueltos.length === 0)
    return { totalPicks: 0, ganancia: 0, yield: 0 };

  const totalApostado = resueltos.reduce((sum, p) => sum + (p.stake * 10), 0);
  const ganancia      = resueltos.reduce((sum, p) => sum + (p.profit_bs || 0), 0);
  const yieldPct      = totalApostado > 0
    ? Math.round((ganancia / totalApostado) * 1000) / 10
    : 0;

  return {
    totalPicks: resueltos.length,
    ganancia: Math.round(ganancia),
    yield: yieldPct,
  };
}

export async function obtenerPicksVip() {
  const { data, error } = await supabase
    .from('picks')
    .select('id, is_pick_del_dia, published_at, result')
    .eq('is_vip', true)
    .order('published_at', { ascending: false })
    .limit(5);
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function obtenerPicksRecomendadosVip() {
  const { data, error } = await supabase
    .from('picks')
    .select('*')
    .eq('is_vip', true)
    .eq('is_pick_del_dia', false)
    .order('published_at', { ascending: false });
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function obtenerPicksVipCompleto() {
  const { data, error } = await supabase
    .from('picks')
    .select('*')
    .eq('is_vip', true)
    .order('published_at', { ascending: false })
    .limit(5);
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function obtenerHistorialPicks(filtro = 'todos') {
  let query = supabase
    .from('picks')
    .select('*')
    .eq('is_vip', false)
    .order('published_at', { ascending: false });

  if (filtro === 'ganados')    query = query.eq('result', 'ganado');
  if (filtro === 'perdidos')   query = query.eq('result', 'perdido');
  if (filtro === 'pendientes') query = query.eq('result', 'pendiente');

  const { data, error } = await query;
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function obtenerEstadisticasCompletas() {
  const { data: picks, error } = await supabase
    .from('picks')
    .select('result, profit_bs, stake')
    .eq('is_vip', false);

  if (error || !picks) return {
    totalPicks: 0, ganados: 0, perdidos: 0,
    pendientes: 0, anulados: 0, ganancia: 0, yield: 0,
  };

  const totalPicks = picks.length;
  const ganados    = picks.filter(p => p.result === 'ganado').length;
  const perdidos   = picks.filter(p => p.result === 'perdido').length;
  const pendientes = picks.filter(p => p.result === 'pendiente').length;
  const anulados   = picks.filter(p => p.result === 'anulado').length;

  const resueltos     = picks.filter(p => p.result !== 'pendiente' && p.profit_bs != null);
  const totalApostado = resueltos.reduce((sum, p) => sum + (p.stake * 10), 0);
  const ganancia      = resueltos.reduce((sum, p) => sum + (p.profit_bs || 0), 0);
  const yieldPct      = totalApostado > 0
    ? Math.round((ganancia / totalApostado) * 1000) / 10
    : 0;

  return {
    totalPicks,
    ganados,
    perdidos,
    pendientes,
    anulados,
    ganancia: Math.round(ganancia),
    yield: yieldPct,
  };
}
