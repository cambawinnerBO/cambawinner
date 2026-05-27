# CambaWinner — Contexto para Claude Code

> Pegá este archivo al inicio de cada sesión nueva de Claude Code.

---

## Producto
Plataforma boliviana de pronósticos deportivos.
- Comparador de cuotas (Betano, Betsson, 1xBet, 22Bet, Rivalo)
- Picks free con yield público verificable
- Sección VIP con registro y pago
- Afiliación: cada cuota lleva enlace de afiliado

## Stack
- Next.js 14 App Router
- Supabase (PostgreSQL + Auth + RLS)
- Tailwind CSS
- PWA con next-pwa
- Vercel + cambawinner.site

## Colores
- Navy: #0A2540 (fondo, headers)
- Verde: #1D9E75 (acento, CTAs, cuotas top)
- Superficie: #F5F7FA (cards, fondos secundarios)
- Ganado: #1D9E75 | Perdido: #D32F2F | Pendiente: #E89B17

## Tipografías
- Inter: todo texto UI (400/500/600)
- JetBrains Mono: SOLO números (cuotas, yield, stats)

## Páginas
- / → Home con partidos + picks recientes
- /cuotas → Comparador por deporte/liga
- /picks → Pronósticos free + yield acumulado
- /vip → Muro suscripción + picks premium
- /track-record → Historial público verificable

## Reglas clave
- Estilo fintech-serio, NO casino
- Picks publicados son inmutables (solo resultado se actualiza)
- Picks VIP ocultos a usuarios free (RLS en Supabase)
- Siempre next/image, nunca img directo
- Siempre variables de entorno para credenciales

## Lee BUENAS-PRACTICAS.md para el detalle completo.
