# Nexus — Design Context & Guidelines

Guía de diseño del proyecto Nexus. Todo el sistema visual vive en tokens de Tailwind v4
definidos en `src/routes/layout.css` (bloque `@theme`). **No hardcodees colores, fuentes ni
radios**: usa siempre las utilidades que generan estos tokens.

---

## 1. Stack

- **SvelteKit 3** + **Svelte 5 (runes)** — modo runes forzado en `vite.config.ts`.
- **Tailwind CSS v4** (config CSS-first, sin `tailwind.config.js`).
- **TypeScript** estricto.
- Alias de imports: `#lib/*` → `src/lib/*` (definido en `package.json > imports`).
  `$lib` **fue eliminado en SvelteKit 3**; no lo uses.
- Fuentes vía Google Fonts en `src/routes/+layout.svelte`.

### Comandos

| Acción     | Comando       |
| ---------- | ------------- |
| Dev        | `pnpm dev`    |
| Build      | `pnpm build`  |
| Type-check | `pnpm check`  |
| Lint       | `pnpm lint`   |
| Formatear  | `pnpm format` |

> Requiere `BACKEND_URL` y `BACKEND_URL_DEV` (validadas en `src/env.ts`) para `pnpm dev`/`build`.

---

## 2. Tema (tokens)

Definidos en `src/routes/layout.css`. Cambiar un token aquí propaga el cambio a toda la app.

### Color

| Token Tailwind                | CSS variable                   | Valor     | Uso                                        |
| ----------------------------- | ------------------------------ | --------- | ------------------------------------------ |
| `bg-background`               | `--color-background`           | `#0a0c10` | Fondo global de la app                     |
| `text-foreground`             | `--color-foreground`           | `#eef1f6` | Texto principal                            |
| `border-border`               | `--color-border`               | `#232a35` | Bordes por defecto                         |
| `bg-card`                     | `--color-card`                 | `#11161d` | Superficie de tarjetas                     |
| `bg-surface`                  | `--color-surface`              | `#0f1319` | Superficie secundaria (secciones, sidebar) |
| `bg-elevated`                 | `--color-elevated`             | `#161c26` | Capa elevada (headers de card, avatares)   |
| `bg-input`                    | `--color-input`                | `#12161d` | Fondo de inputs y campos                   |
| `bg-muted`                    | `--color-muted`                | `#161b23` | Fondos apagados, badges neutros            |
| `text-muted-foreground`       | `--color-muted-foreground`     | `#8e96a5` | Texto secundario / placeholders            |
| `bg-primary`                  | `--color-primary`              | `#5b9cff` | Acento principal, CTA, links activos       |
| `text-primary-foreground`     | `--color-primary-foreground`   | `#ffffff` | Texto sobre `primary`                      |
| `bg-secondary`                | `--color-secondary`            | `#1a2230` | Fondos de chip/nav seleccionado            |
| `text-secondary-foreground`   | `--color-secondary-foreground` | `#9cc4ff` | Texto sobre `secondary`                    |
| `text-accent`                 | `--color-accent`               | `#7fb4ff` | Acento claro (avatares, links en preview)  |
| `bg-accent-dim`               | `--color-accent-dim`           | `#16283f` | Fondo tenue del acento (pill activo)       |
| `text-success` / `bg-success` | `--color-success`              | `#3dd598` | Estados positivos, "live", métricas        |
| `text-warning`                | `--color-warning`              | `#fbbf24` | Ratings, advertencias                      |

### Tipografía

| Token           | Fuente            | Rol                                       |
| --------------- | ----------------- | ----------------------------------------- |
| `font-body`     | **Inter**         | Texto general (aplicado al `body`)        |
| `font-headings` | **Space Grotesk** | Títulos (`h1`, `h2`) y nombres de prompts |
| `font-mono`     | **IBM Plex Mono** | Métricas, código, contadores, versiones   |

Escala usada en el diseño: `text-4xl` (hero), `text-2xl` (títulos de sección), `text-lg`,
`text-base`, `text-sm`, `text-xs`, y tamaños arbitrarios `text-[15px]`, `text-[13px]`,
`text-[12px]`, `text-[11px]`, `text-[10px]`. Interlineados: `leading-[1.08]` (hero),
`leading-snug`, `leading-relaxed`, `leading-tight`.

### Radios

| Token        | Valor  | Uso                              |
| ------------ | ------ | -------------------------------- |
| `rounded-sm` | `6px`  | Chips, badges, botones pequeños  |
| `rounded-md` | `8px`  | Botones, inputs, contenedores    |
| `rounded-lg` | `12px` | Tarjetas, paneles                |
| `rounded-xl` | `16px` | Contenedores grandes (hero card) |

### Espaciado y layout

- Escala base Tailwind (`--spacing: 0.25rem`): `gap-2` = 8px, `p-4` = 16px, etc.
- Ancho de contenido máximo: `max-w-[1440px] mx-auto px-6`.
- Altura de barra de navegación: `h-16`.

---

## 3. Estructura del proyecto de UI

```
src/
  lib/
    components/
      Logo.svelte        # Marca (mark + wordmark, prop opcional `beta`)
      TopNav.svelte      # Barra superior: logo, nav, buscador, acciones
      HeroBanner.svelte  # Hero con preview de prompt + ticker de actividad
      FilterPanel.svelte # Sidebar de filtros (categorías, modelo, casos de uso)
      PromptCard.svelte  # Tarjeta de prompt (recibe la preview vía snippet `output`)
      Footer.svelte      # Pie de página + suscripción
  routes/
    +layout.svelte       # Carga de fuentes + layout global
    layout.css           # ★ Tokens de diseño (@theme) y base
    +page.svelte         # Pantalla "Discovery" (ensambla todo)
```

Páginas futuras: crea `src/routes/<ruta>/+page.svelte` y reutiliza los componentes
existentes. Si un elemento se repite en 2+ pantallas, extráelo a `src/lib/components/`.

---

## 4. Patrones de componentes

### Superficies y bordes

- Estructura estándar de panel: `rounded-lg border border-border bg-surface p-4`.
- Tarjeta de contenido: `rounded-lg border border-border bg-card p-4`.
- Tarjeta destacada: misma estructura con `border-primary` (y a menudo `bg-accent-dim`).
- Separadores internos: `<div class="h-px bg-border my-4"></div>` o `border-t border-border`.

### Botones

| Variante   | Clases base                                                                           |
| ---------- | ------------------------------------------------------------------------------------- |
| Primario   | `text-sm font-medium bg-primary text-primary-foreground rounded-md px-4 py-2`         |
| Secundario | `text-sm font-medium border border-border rounded-md px-3 py-2 bg-surface`            |
| Sutil      | `text-sm font-medium border border-border text-muted-foreground rounded-md px-3 py-2` |

Siempre `<button type="button">`. Sustituye por `<a href>` solo cuando la ruta exista.

### Badges / pills

- Versión: `text-[11px] font-mono text-accent bg-accent-dim rounded-sm px-1.5 py-0.5`.
- Tag `#`: `text-[11px] font-mono text-secondary-foreground bg-secondary rounded-sm px-1.5 py-0.5`.
- Modelo: `text-[11px] text-muted-foreground border border-border rounded-sm px-1.5 py-0.5`.
- Estado "live": `text-[11px] font-mono text-success ...` con punto `●`.
- Etiqueta superior (eyebrow): `text-xs font-bold uppercase tracking-wider` + color de acento.

### Inputs

Inputs y buscadores: contenedor `bg-input border border-border rounded-md`, input interno
`flex-1 min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground`
(Tailwind v4 ya resetea `border` y `padding` de los inputs).

### Avatares

`w-8 h-8 rounded-full bg-accent-dim border border-border flex items-center justify-center`
con iniciales en `text-xs font-bold text-accent`. Tamaños alternos: `w-6 h-6` (10px),
`w-7 h-7`, `w-8 h-8`. Se apilan con `flex -space-x-2`.

### Iconografía

El diseño usa **glifos Unicode** como iconos, no una librería: `⌕` (buscar), `⌘`, `+`, `★` /
`☆` (rating), `⧉` (copiar), `⑂` (fork), `✓`, `●`, `✦`, `◈`, `◎`, `✉`, `⬣`, `▦`.
Mantén este enfoque para consistencia; si migras a iconos SVG, hazlo de forma global.

### Efectos de fondo

- Glow radial: div absoluto con `rounded-full opacity-25` y
  `style="background: radial-gradient(closest-side, #5b9cff, transparent);"`.
- Rejilla técnica: `background-image` con dos `linear-gradient` de `#232a35` a `36px`,
  recortada con `mask-image: radial-gradient(...)`.

### Reactividad (Svelte 5)

- Estado local con `$state` (p. ej. pestaña activa en `+page.svelte`, filtros en
  `FilterPanel.svelte`). Usa `$props()` / `$derived` según necesidad; evita stores.
- **Contenido dinámico por snippet**: `PromptCard` recibe la preview como prop-snippet y se
  pasa con un bloque `{#snippet output()}…{/snippet}` dentro del componente. Úsalo cuando un
  componente deba renderizar contenido arbitrario por parte del consumidor.

---

## 5. Convenciones de código

- Modo **runes** obligatorio (`$state`, `$props`, `$derived`, `$effect`) — nada de `export let`.
- Eventos con sintaxis `onclick={...}` (no `on:click`).
- Estilos siempre con utilidades Tailwind; CSS propio solo en `layout.css` para tokens/base.
- Atributos `class` condicionales con arrays/objetos tipo clsx:
  `class={['base', active ? 'a' : 'b']}`.
- Formato: **tabs**, comillas simples, `printWidth: 100` (ver `prettier.config.js`).
  El plugin `prettier-plugin-tailwindcss` ordena las clases automáticamente → ejecuta
  `pnpm format` antes de commitear.
- Nombres de componentes en `PascalCase.svelte`; props tipadas con una interfaz `Props`
  cuando el componente tiene varios props.
- No añadir comentarios salvo cuando aporten contexto no obvio.

---

## 6. Colores "hardcodeados" permitidos

Solo dentro de `style=` para gradientes/glows y visualizaciones de datos donde el color es
parte de la escena (mini-barras de gráficos, tiles de colección). Valores de referencia:

- Azul primario `#5b9cff`, verde `#3dd598`, ámbar `#fbbf24`, gris-bar `#2b3546`.
- Tinte translúcido de un color: `{color}22` (p. ej. `#5b9cff22`).

Para cualquier otro uso, **siempre** tokens del tema.

---

## 7. Checklist para nuevas páginas

1. ¿Reutiliza `TopNav`, `Footer` y los tokens del tema? (no dupliques estilos).
2. ¿El contenido va en un contenedor `max-w-[1440px] mx-auto px-6`?
3. ¿Los textos usan `font-headings` (títulos) / `font-mono` (datos) / `font-body` (cuerpo)?
4. ¿Los estados activo/inactivo siguen el patrón `bg-accent-dim + border-primary` vs
   `text-muted-foreground border-transparent`?
5. `pnpm format`, `pnpm lint` y `pnpm check` en verde antes de terminar.
