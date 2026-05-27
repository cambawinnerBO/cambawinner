# CambaWinner — Buenas Prácticas y Manifiesto Arquitectónico

> **Leer este archivo COMPLETO antes de tocar cualquier archivo del proyecto.**
> Aplica para todo el equipo y para cualquier agente de IA (Claude Code, etc).
> Actúas como Tech Lead y Desarrollador Senior Full-Stack. Máxima calidad, escalabilidad y seguridad en todo momento.

---

## 1. Identidad del producto

**Nombre:** CambaWinner  
**Dominio:** cambawinner.site  
**Descripción:** Plataforma boliviana de pronósticos deportivos con comparador de cuotas, tracking público de yield y sección VIP de análisis premium.  
**Mercado:** Bolivia — apostador informado, no hincha impulsivo.  
**Tono de marca:** Serio y técnico. Fintech, no casino. Bloomberg, no Las Vegas.

---

## 2. Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Next.js App Router | 14 |
| Estilos | Tailwind CSS | 3 |
| Base de datos | Supabase (PostgreSQL) | latest |
| Auth | Supabase Auth | latest |
| Hosting | Vercel | — |
| Control de versiones | GitHub | — |
| Tipografía | Inter + JetBrains Mono | Google Fonts |

**Regla:** No agregar librerías nuevas sin justificación. Antes de instalar algo nuevo, verificar si ya existe una solución en el stack actual. Toda librería externa debe consumirse a través de un wrapper o interfaz intermedia para facilitar sustitución tecnológica sin impactar el núcleo.

---

## 3. Sistema de diseño — Tokenización semántica

**Prohibido** usar valores hexadecimales directos en la UI. Siempre usar los tokens definidos.

### Tokens de color

```js
// lib/theme.js — fuente única de verdad para el diseño
export const Theme = {
  Colors: {
    // Primarios
    Navy:      '#0A2540',  // Fondo principal, headers, texto
    Green:     '#1D9E75',  // Acento, cuotas top, CTAs, "Winner"
    Surface:   '#F5F7FA',  // Fondos secundarios, cards

    // Semánticos
    Success:   '#1D9E75',  // Pick ganado, yield positivo
    Error:     '#D32F2F',  // Pick perdido
    Warning:   '#E89B17',  // Pick pendiente
    Muted:     '#888780',  // Pick anulado

    // Textos
    TextPrimary:   '#0A2540',
    TextSecondary: '#5A6B85',
    TextMuted:     '#A0A8B5',
    TextInverse:   '#F5F7FA',  // Sobre fondos oscuros
    TextAccent:    '#B8D4F4',  // Taglines sobre navy
  },
  Spacing: {
    XS: '4px',
    SM: '8px',
    MD: '12px',
    LG: '16px',
    XL: '24px',
    XXL: '32px',
  },
  Radius: {
    SM: '6px',   // inputs, badges
    MD: '8px',   // cards, botones
    LG: '12px',  // modales, panels
    XL: '15px',  // isotipo del logo
  },
}
```

### Tokens tipográficos

```js
export const Typography = {
  // UI, títulos, cuerpo — SIEMPRE Inter
  UI: "font-family: 'Inter', -apple-system, sans-serif",

  // SOLO para números: cuotas, yield, ROI, fechas, stats
  Data: "font-family: 'JetBrains Mono', monospace",

  Scale: {
    H1:    { size: '32px', weight: 600, tracking: '-0.02em' },
    H2:    { size: '22px', weight: 600 },
    H3:    { size: '16px', weight: 500 },
    Body:  { size: '15px', weight: 400, lineHeight: 1.6 },
    Small: { size: '12px', weight: 400 },
    Label: { size: '11px', weight: 500, uppercase: true, tracking: '0.05em' },
    Odds:  { size: '18-22px', weight: 500, font: 'JetBrains Mono' },
    Stats: { size: '14-16px', weight: 400, font: 'JetBrains Mono' },
  }
}
```

**Regla:** JetBrains Mono SOLO para datos numéricos. Nunca para texto corrido.

---

## 4. Arquitectura — Separación estricta de responsabilidades

```
UI Layer (components/)
    ↓ solo renderiza, no conoce la fuente de datos
Logic Layer (lib/hooks/, lib/services/)
    ↓ procesa, transforma, no conoce la UI
Data Layer (lib/supabase/, lib/api/)
    ↓ solo acceso a datos, sin lógica de negocio
```

**Reglas:**
- La UI es agnóstica: solo renderiza props, no llama a Supabase directamente
- La lógica es ciega: desconoce la representación visual
- Los datos son inmutables por defecto: la mutación es la excepción, no la regla

### Estructura de archivos

```
cambawinner/
├── app/
│   ├── layout.js               # Layout raíz con header y bottom nav
│   ├── page.js                 # Home — partidos del día + últimos picks
│   ├── cuotas/page.js          # Comparador completo de cuotas
│   ├── picks/page.js           # Pronósticos free + yield público
│   ├── vip/page.js             # Muro de suscripción + picks premium
│   ├── track-record/page.js    # Historial verificable público
│   └── globals.css             # Variables CSS + reset
├── components/
│   ├── ui/                     # Componentes genéricos reutilizables
│   │   ├── Badge.jsx           # Ganado / Perdido / Pendiente / Anulado
│   │   ├── Button.jsx          # Primario / Secundario / Ghost
│   │   ├── Card.jsx            # Card base con estados Loading/Error/Empty
│   │   └── OddsTable.jsx       # Tabla de cuotas con mejor destacada
│   ├── layout/
│   │   ├── Header.jsx          # Header desktop
│   │   └── BottomNav.jsx       # Navegación móvil
│   ├── picks/
│   │   ├── PickCard.jsx        # Card de un pick individual
│   │   └── YieldBadge.jsx      # Badge de yield acumulado
│   └── odds/
│       ├── MatchCard.jsx       # Card de partido con cuotas
│       └── BookmakerRow.jsx    # Fila de cuota por casa
├── lib/
│   ├── theme.js                # Tokens de diseño (colores, spacing, radius)
│   ├── supabase.js             # Wrapper cliente Supabase
│   ├── services/
│   │   ├── picksService.js     # Lógica de picks (fetch, calcular yield)
│   │   ├── oddsService.js      # Lógica de cuotas (fetch, comparar)
│   │   └── authService.js      # Lógica de auth (login, registro, rol)
│   └── utils.js                # Funciones utilitarias puras
├── public/
│   ├── icons/                  # App icons PWA (16 a 1024px)
│   └── favicon.ico
├── BUENAS-PRACTICAS.md         # Este archivo
├── CONTEXT.md                  # Contexto resumido para Claude Code
└── .env.local                  # Variables de entorno (NUNCA commitear)
```

---

## 5. Estándares de código — Clean Code

### Nombres semánticos — código auto-documentado

```js
// ✅ Correcto — nombre describe exactamente qué hace
async function fetchPublicPicksWithYield() { ... }
async function calculateAccumulatedYield(picks) { ... }
function isUserVip(userRole) { ... }

// ❌ Incorrecto — ambiguo, no describe intención
async function getData() { ... }
function check(x) { ... }
```

### Early Return — sin anidamiento excesivo

```js
// ✅ Correcto — valida fallos al inicio
async function getVipPicks(user) {
  if (!user) return { error: 'No autenticado' }
  if (user.role !== 'vip') return { error: 'Acceso restringido' }
  
  const { data, error } = await supabase
    .from('picks')
    .select('*')
    .eq('is_vip', true)
  
  if (error) return { error: error.message }
  return { data }
}

// ❌ Incorrecto — arrow code, anidamiento excesivo
async function getVipPicks(user) {
  if (user) {
    if (user.role === 'vip') {
      const { data, error } = await supabase...
      if (!error) {
        return data
      }
    }
  }
}
```

### Componentización — máximo 20 líneas antes de extraer

```jsx
// ✅ Correcto — componente extraído y reutilizable
export default function MatchCard({ home, away, odds, time }) {
  return (
    <Card>
      <MatchHeader home={home} away={away} time={time} />
      <OddsTable odds={odds} />
    </Card>
  )
}

// ❌ Incorrecto — todo mezclado en un solo componente gigante
export default function Home() {
  return (
    <div>
      {/* 200 líneas de JSX mezclando layout, lógica y datos */}
    </div>
  )
}
```

### Gestión de estados obligatorios en todo componente

```jsx
// Todo componente que carga datos DEBE manejar estos 4 estados
function PicksList() {
  const { data, loading, error } = usePicks()

  if (loading) return <PicksListSkeleton />           // Loading
  if (error)   return <ErrorMessage message={error} /> // Error
  if (!data?.length) return <EmptyState />              // Empty
  if (data.length > 50) return <PaginatedList />        // Data Overflow

  return data.map(pick => <PickCard key={pick.id} {...pick} />)
}
```

### Gestión de errores — nunca catch vacío

```js
// ✅ Correcto — error gestionado y escalado
try {
  const picks = await picksService.fetchPublicPicks()
  setPicks(picks)
} catch (error) {
  console.error('[PicksList] Error al cargar picks:', error)
  setError('No se pudieron cargar los pronósticos. Intentá de nuevo.')
}

// ❌ Incorrecto — catch vacío
try {
  const picks = await fetchPicks()
} catch (e) {}
```

---

## 6. Seguridad

### Zero-Trust UI — la UI nunca decide accesos

```js
// ✅ Correcto — la autorización vive en Supabase RLS, no en el frontend
// El frontend solo muestra u oculta UI, pero el dato ya viene filtrado del backend

// ❌ Incorrecto — el frontend evalúa el acceso
if (user.role === 'vip') {
  const data = await supabase.from('picks').select('*') // PELIGROSO
}
```

### Variables de entorno — sin credenciales en el código

```bash
# .env.local — NUNCA commitear al repositorio
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

```js
// ✅ Correcto — validación al arranque de la app
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL no está definida')
}
```

---

## 7. Base de datos — Supabase

### Tablas principales

```sql
-- Usuarios
users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'free' CHECK (role IN ('free', 'vip')),
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Picks — INMUTABLES una vez publicados (solo result y yield_units se actualizan)
picks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match TEXT NOT NULL,
  league TEXT NOT NULL,
  market TEXT NOT NULL,         -- "1X2", "Over/Under", "AH"
  odds DECIMAL(5,2) NOT NULL,   -- cuota al momento de publicar — INMUTABLE
  stake DECIMAL(3,1) NOT NULL,  -- unidades recomendadas — INMUTABLE
  result TEXT CHECK (result IN ('ganado', 'perdido', 'pendiente', 'anulado')),
  is_vip BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ DEFAULT NOW(), -- INMUTABLE
  yield_units DECIMAL(5,2),     -- calculado al resolver
  analysis TEXT
)

-- Partidos
matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home TEXT NOT NULL,
  away TEXT NOT NULL,
  league TEXT NOT NULL,
  sport TEXT DEFAULT 'football',
  match_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'live', 'finished'))
)

-- Cuotas por casa
odds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id),
  bookmaker TEXT NOT NULL,
  odd_1 DECIMAL(5,2),
  odd_x DECIMAL(5,2),
  odd_2 DECIMAL(5,2),
  affiliate_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

### Row Level Security (RLS) — obligatorio

```sql
-- picks VIP: solo usuarios con role = 'vip'
CREATE POLICY "vip_picks_policy" ON picks
  FOR SELECT USING (
    is_vip = false OR
    auth.jwt()->>'role' = 'vip'
  );

-- odds: público
CREATE POLICY "public_odds" ON odds FOR SELECT USING (true);
```

---

## 8. Lógica de negocio — Yield

```js
// lib/services/picksService.js

// Yield de un pick individual (en unidades)
function calculatePickYield(pick) {
  if (pick.result === 'ganado')   return (pick.odds - 1) * pick.stake
  if (pick.result === 'perdido')  return -pick.stake
  if (pick.result === 'anulado')  return 0
  return null // pendiente
}

// Yield acumulado % — se calcula en PostgreSQL, no en frontend
// yield_total / total_apostado * 100
// Ejemplo: 3.1u ganados / 25u apostadas = +12.4%
```

**Regla crítica:** Una vez publicado un pick, `odds`, `stake` y `published_at` son **inmutables**. Solo `result` y `yield_units` se actualizan al resolver. Esto garantiza la verificabilidad pública del track record.

---

## 9. Performance

- Imágenes: siempre `next/image`, nunca `<img>` directo
- Fuentes: cargar desde `next/font/google`, no desde `<link>`
- Cuotas: `fetch` con `revalidate: 60` segundos
- Listas largas (historial de picks): Lazy Loading + paginación desde el inicio
- Componentes pesados: `dynamic` import con `{ ssr: false }`
- Re-renderizaciones: prohibidas las innecesarias — usar `useMemo` y `useCallback` donde corresponda
- Tolerancia a fallos de red: reintentos con Exponential Backoff antes de mostrar error al usuario

---

## 10. PWA

```json
// public/manifest.json
{
  "name": "CambaWinner",
  "short_name": "CambaWinner",
  "description": "Pronósticos con datos",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0A2540",
  "theme_color": "#0A2540",
  "icons": [
    { "src": "/icons/cambawinner-icon-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/cambawinner-icon-512x512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

Meta tags obligatorios en `layout.js`:
```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#0A2540" />
<link rel="apple-touch-icon" href="/icons/cambawinner-icon-192x192.png" />
```

---

## 11. SEO

```js
export const metadata = {
  title: 'CambaWinner — Pronósticos con datos',
  description: 'Comparador de cuotas y pronósticos deportivos para Bolivia',
  openGraph: {
    title: 'CambaWinner',
    description: 'Pronósticos con datos',
    url: 'https://cambawinner.site',
    siteName: 'CambaWinner',
    locale: 'es_BO',
    type: 'website',
  }
}
```

---

## 12. Git — GitFlow y commits semánticos

### Ramas
```
main          → producción — NUNCA tocar directamente
develop       → integración de features
feature/xxx   → nueva funcionalidad
fix/xxx       → corrección de bug
```

**Regla:** Prohibido hacer push directo a `main`. Todo va por rama y Pull Request.

### Commits semánticos

```
feat:     nueva funcionalidad
fix:      corrección de bug
style:    cambios de estilos/UI sin lógica
refactor: refactorización sin cambio funcional
db:       cambios en base de datos
config:   configuración del proyecto
docs:     documentación
perf:     mejora de performance
```

Ejemplos:
```
feat: agregar tabla de cuotas en home
fix: corregir cálculo de yield en picks perdidos
style: ajustar colores del bottom nav en móvil
db: agregar RLS para picks VIP
refactor: extraer BookmakerRow a componente independiente
```

---

## 13. Protocolo de auto-corrección — antes de cada entrega

Antes de emitir cualquier código, validar internamente:

1. ✅ ¿Se mantiene la separación UI / Lógica / Datos?
2. ✅ ¿Se usan tokens de diseño (`Theme.Colors.X`) y no valores hardcodeados?
3. ✅ ¿El componente maneja estados Loading, Error, Empty y Data Overflow?
4. ✅ ¿Las credenciales están en variables de entorno?
5. ✅ ¿La autorización de contenido VIP vive en el backend (RLS), no en el frontend?
6. ✅ ¿Los errores están gestionados (sin catch vacíos)?
7. ✅ ¿El código es autocontenido y operativo (sin TODOs que rompan el sistema)?

Si alguna validación falla → refactorizar silenciosamente antes de responder.

---

## 14. Lo que NO hacer jamás

- ❌ Colores hexadecimales directos en la UI — usar `Theme.Colors.X`
- ❌ Tipografías distintas a Inter y JetBrains Mono
- ❌ Credenciales o URLs hardcodeadas en el código
- ❌ Modificar `odds`, `stake` o `published_at` de un pick ya publicado
- ❌ Mostrar picks VIP a usuarios free (ni en frontend ni en queries)
- ❌ `localStorage` para datos sensibles de usuario
- ❌ Instalar librerías sin revisar si ya existe solución en el stack
- ❌ `<img>` directo — siempre `next/image`
- ❌ Commitear `.env.local`
- ❌ Push directo a `main`
- ❌ Catch vacíos
- ❌ Componentes de más de 20 líneas sin extraer
- ❌ Rojos saturados, dorados brillantes, gradientes neón en el diseño
- ❌ Prometer rendimientos garantizados en ningún texto del sitio

---

## 15. Disclaimer legal — obligatorio en footer y páginas

```
CambaWinner es una plataforma de análisis e información deportiva.
Las apuestas deportivas implican riesgo. Jugá con responsabilidad.
Solo mayores de 18 años.
```

---

## 16. Cómo usar este archivo con Claude Code

Al inicio de cada sesión:
```
@BUENAS-PRACTICAS.md [tu tarea aquí]
```

O si querés el resumen rápido:
```
@CONTEXT.md [tu tarea aquí]
```

---

*CambaWinner — Bolivia 2026*
*Última actualización: Mayo 2026*
