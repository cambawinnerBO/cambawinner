'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { registrar, login, logout, getPerfil } from '@/lib/services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario]   = useState(null);
  const [perfil,  setPerfil]    = useState(null);
  const [loading, setLoading]   = useState(true);

  async function cargarPerfil(user) {
    if (!user) { setPerfil(null); return; }
    const { data } = await getPerfil(user.id);
    setPerfil(data);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user ?? null;
      setUsuario(user);
      cargarPerfil(user).finally(() => setLoading(false));
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setUsuario(user);
      cargarPerfil(user);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogin(email, password) {
    const result = await login(email, password);
    return result;
  }

  async function handleRegistrar(email, password, nombre, username) {
    const result = await registrar(email, password, nombre, username);
    return result;
  }

  async function handleLogout() {
    const result = await logout();
    if (!result.error) { setUsuario(null); setPerfil(null); }
    return result;
  }

  return (
    <AuthContext.Provider value={{ usuario, perfil, loading, login: handleLogin, registrar: handleRegistrar, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
