'use client';
import { useState, useEffect } from 'react';
import { obtenerSettings } from '@/lib/services/settingsService';

const DEFAULTS = {
  whatsapp_numero: '591XXXXXXXX',
  whatsapp_canal:  'https://whatsapp.com/channel/0029VbDOOoaHQbRv83CC6Q0H',
  precio_semanal:  100,
  precio_mensual:  350,
  bankroll_base:   1000,
};

export function useSettings() {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    async function cargar() {
      const { data } = await obtenerSettings();
      if (data) setSettings(data);
      setLoading(false);
    }
    cargar();
  }, []);

  return { settings, loading };
}
