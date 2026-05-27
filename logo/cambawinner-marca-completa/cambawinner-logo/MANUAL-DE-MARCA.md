# CambaWinner — Manual de marca

## Archivos incluidos

| Archivo | Uso |
|---|---|
| `cambawinner-logo-dark.svg` | Logo completo (isotipo + wordmark + tagline) — uso principal |
| `cambawinner-isotipo.svg` | Solo el isotipo — para headers, app icon, redes |
| `cambawinner-isotipo-blanco.svg` | Isotipo monocromático blanco — sobre fondos oscuros |
| `cambawinner-isotipo-negro.svg` | Isotipo monocromático negro — para impresión |
| `cambawinner-icon-16x16.png` | Favicon pequeño |
| `cambawinner-icon-32x32.png` | Favicon estándar |
| `cambawinner-icon-64x64.png` | Header web |
| `cambawinner-icon-128x128.png` | Header retina |
| `cambawinner-icon-192x192.png` | PWA icon (manifest.json) |
| `cambawinner-icon-512x512.png` | PWA icon splash |
| `cambawinner-icon-1024x1024.png` | App stores / material de marketing |
| `cambawinner-logo-horizontal.png` | Lockup horizontal para banners |
| `cambawinner-icon-blanco-192.png` | Isotipo blanco 192px |
| `cambawinner-icon-negro-192.png` | Isotipo negro 192px |
| `favicon.ico` | Favicon multi-tamaño para web (listo para usar) |

---

## Colores oficiales

| Nombre | Hex | Uso |
|---|---|---|
| Azul Camba | `#0A2540` | Fondo principal, headers, texto |
| Verde Oriente | `#1D9E75` | Acento, cuotas top, CTAs, "Winner" |
| Blanco Tiza | `#F5F7FA` | Fondos secundarios, texto sobre oscuro |
| Texto secundario | `#B8D4F4` | Taglines, textos sutiles |

---

## Tipografías

- **UI y textos:** Inter (Google Fonts) — pesos 400, 500, 600
- **Números y datos:** JetBrains Mono (Google Fonts) — pesos 400, 500

```html
<!-- Agregar en el <head> de tu web -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## Cómo usar en tu web (Next.js / PWA)

### favicon.ico
Copiar `favicon.ico` a la carpeta `/public` de tu proyecto.

### manifest.json (PWA)
```json
{
  "name": "CambaWinner",
  "short_name": "CambaWinner",
  "description": "Pronósticos con datos",
  "theme_color": "#0A2540",
  "background_color": "#0A2540",
  "display": "standalone",
  "icons": [
    { "src": "/icons/cambawinner-icon-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/cambawinner-icon-512x512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Meta tags HTML
```html
<link rel="icon" href="/favicon.ico" />
<link rel="apple-touch-icon" href="/icons/cambawinner-icon-192x192.png" />
<meta name="theme-color" content="#0A2540" />
<meta property="og:image" content="/icons/cambawinner-icon-512x512.png" />
```

---

## Reglas de uso

### ✅ Hacer
- Usar el logo sobre fondos `#0A2540` (azul camba) o `#F5F7FA` (blanco tiza)
- Respetar el espacio mínimo alrededor del logo (equivalente al alto de la letra C)
- Usar la versión monocromática blanca sobre fotografías oscuras
- Usar la versión monocromática negra para impresión en blanco y negro

### ❌ No hacer
- No cambiar los colores del logo
- No estirar ni deformar el isotipo
- No usar el logo sobre fondos que no contrasten (grises medios, verdes similares)
- No agregar sombras, brillos ni efectos al logo
- No rotar el logo
- No usar tipografías distintas a Inter para acompañar el logo

---

## Tagline oficial
**"Pronósticos con datos"**
— en minúsculas en textos corridos
— en MAYÚSCULAS con tracking amplio cuando acompaña al logo

---

*CambaWinner — Bolivia 2026*
