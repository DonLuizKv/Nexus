# Nexus --- Y2K Web Revival Design Context

Guía visual y de implementación para Nexus: una plataforma contemporánea
de descubrimiento, almacenamiento, versionado y compartición de prompts
de IA, presentada con la estética irónica de Internet entre 1999 y 2004.

La idea central es deliberada: **herramientas del futuro dentro de una
web que parece venir del pasado**. La interfaz puede ser juguetona,
maximalista y nostálgica, pero el producto debe seguir siendo rápido,
accesible, legible y confiable.

Este documento define la dirección visual y sus patrones de
implementación. No reemplaza la arquitectura funcional existente ni
autoriza a inventar funcionalidades que el producto todavía no tenga.

---

## 1. Principios de diseño

### 1.1 Contraste conceptual

- **Producto:** moderno, orientado a IA, versionado, reutilización y
  comunidad.
- **Presentación:** portal web de principios de los 2000, directorio
  de software, web personal y estética Y2K.
- **Tono:** juguetón, técnico, ligeramente irónico y consciente de su
  propia nostalgia.
- **Resultado:** una herramienta real, no una parodia ilegible ni una
  colección de adornos sin propósito.

### 1.2 Pilares visuales

1.  **Old Internet:** directorios, enlaces subrayados, banners, barras
    de estado, guestbook reinterpretado como actividad comunitaria y
    pequeños detalles de web personal.
2.  **Y2K futurista:** cromo, azul eléctrico, cian, reflejos, degradados
    brillantes, estrellas, órbitas y superficies glossy usados con
    moderación.
3.  **Portal técnico:** tablas compactas, metadatos visibles,
    contadores, etiquetas, historial de versiones, botones explícitos y
    navegación densa.
4.  **Usabilidad moderna:** responsive, accesible, estados claros,
    contraste suficiente y controles previsibles.

### 1.3 Lo que se debe evitar

- No convertir todas las superficies en vidrio, blur o neumorfismo.
- No usar neón en cada elemento ni llenar la pantalla de animaciones.
- No abusar de GIFs, emojis, cursores personalizados o texto
  parpadeante.
- No simular enlaces o botones que no funcionan.
- No sacrificar legibilidad, navegación móvil ni accesibilidad por
  nostalgia.
- No hacer que la plataforma parezca una página maliciosa, rota o de
  baja confianza.

---

## 2. Stack y convenciones técnicas

- **SvelteKit 3** + **Svelte 5** con runes.
- **Tailwind CSS v4**, configuración CSS-first.
- **TypeScript** estricto.
- Alias de imports: `#lib/*` → `src/lib/*`.
- Fuentes cargadas desde `src/routes/+layout.svelte`.
- Tokens de diseño definidos en `src/routes/layout.css`, dentro de
  `@theme`.

### Comandos

Acción Comando

---

Desarrollo `pnpm dev`
Build `pnpm build`
Type-check `pnpm check`
Lint `pnpm lint`
Formato `pnpm format`

El entorno requiere `BACKEND_URL` y `BACKEND_URL_DEV`, validadas en
`src/env.ts`.

No modificar el stack ni introducir dependencias visuales nuevas sin una
necesidad clara.

---

## 3. Sistema visual

Los tokens de `src/routes/layout.css` son la fuente de verdad. Los
componentes deben consumir las utilidades generadas por estos tokens en
lugar de repetir valores arbitrarios.

### 3.1 Paleta propuesta

La paleta debe sentirse como un portal de 2002: fondos claros, azules de
hipervínculo, cian tecnológico, plata y acentos violeta. El azul oscuro
puede reservarse para banners, títulos destacados o zonas de alto
contraste.

Token semántico Valor de referencia Uso

---

`background` `#DCEBFA` Fondo general azul claro
`foreground` `#142D50` Texto principal
`card` `#F8FBFF` Paneles de contenido
`surface` `#EAF3FC` Superficies secundarias
`elevated` `#FFFFFF` Paneles elevados y campos
`border` `#7FA7D1` Bordes definidos de paneles
`primary` `#0759B5` Acciones principales y enlaces activos
`primary-foreground` `#FFFFFF` Texto sobre azul principal
`secondary` `#C5E8F7` Chips y superficies cian
`secondary-foreground` `#164B78` Texto sobre cian
`accent` `#00A9D6` Acento Y2K cian
`accent-dim` `#D7F5FF` Fondo tenue para acentos
`muted` `#DCE6F1` Metadatos y zonas apagadas
`muted-foreground` `#526C89` Texto secundario
`success` `#16845B` Estados positivos
`warning` `#A86600` Avisos y atención

Estos valores son la dirección inicial, no una obligación de usar todos
los colores en cada pantalla. Ajustar contraste cuando sea necesario y
mantener un rol consistente para cada token.

### 3.2 Color y contraste

- Usar azul clásico para enlaces y acciones que parezcan enlaces.
- Reservar cian y violeta para detalles tecnológicos, etiquetas o
  estados especiales.
- Usar plata y degradados glossy en áreas concretas: marca, banners o
  acciones destacadas.
- Evitar texto pequeño sobre gradientes complejos.
- El texto de contenido debe priorizar contraste sobre ornamentación.
- Los estados no deben comunicarse únicamente mediante color.

### 3.3 Tipografía

Preferir tipografías asociadas a interfaces web clásicas:

---

Rol Fuente sugerida Uso

---

`font-body` Arial o Verdana Texto general y
controles

`font-headings` Tahoma o Arial Black Encabezados, banners y
titulares

`font-mono` Courier New o IBM Plex Código, versiones, IDs
Mono y métricas
-----------------------------------------------------------------------

Se pueden mantener las fuentes actuales si el cambio de carga no
compensa. La estética Y2K debe surgir también de la composición, el
color, los bordes y los detalles gráficos; no depende exclusivamente de
la tipografía.

Usar títulos compactos y contundentes, texto de interfaz directo y
metadatos pequeños pero legibles. No reducir el texto funcional a
tamaños ilegibles por imitar webs antiguas.

### 3.4 Bordes, radios y profundidad

- Priorizar esquinas cuadradas o radios pequeños.
- Usar marcos visibles de 1 px para separar módulos.
- Los paneles importantes pueden usar un borde doble o un borde
  claro/oscuro que simule relieve.
- Aplicar sombras cortas y definidas, no grandes sombras difusas.
- Reservar reflejos, biseles y gradientes para elementos
  seleccionados.
- Evitar el aspecto uniforme de tarjetas modernas con radios grandes.

### 3.5 Espaciado y densidad

- Mantener una escala de espaciado consistente con Tailwind.
- La interfaz puede ser más densa que una aplicación minimalista
  moderna, especialmente en directorios, resultados y metadatos.
- Separar claramente los bloques con bordes, encabezados de panel o
  espacios regulares.
- No llenar todos los espacios vacíos con decoración.
- Mantener un contenedor central adaptable; el ancho máximo existente
  de `1440px` puede conservarse.
- La navegación debe adaptarse a pantallas pequeñas sin provocar
  scroll horizontal global.

---

## 4. Lenguaje gráfico Y2K

### Elementos permitidos

- Estrellas, destellos, órbitas, planetas y símbolos geométricos.
- Brillos cromados y degradados azul/cian.
- Fondos con patrones repetidos de baja intensidad.
- Pequeños banners con textos como `WELCOME`, `NEW`, `BETA` o
  `UNDER CONSTRUCTION` cuando tengan sentido contextual.
- Contadores y líneas de estado.
- Separadores decorativos y marcos de inspiración retro.
- Glifos Unicode y símbolos sencillos como `★`, `☆`, `✦`, `⌕`, `+`,
  `✓`, `↗` y `⧉`.

### Reglas de uso

- Cada elemento decorativo debe reforzar la identidad o ayudar a
  dividir la información.
- Los GIF animados deben ser opcionales, pequeños y no esenciales para
  comprender la interfaz.
- Respetar `prefers-reduced-motion` para animaciones.
- No usar texto parpadeante ni animaciones rápidas repetitivas.
- No sustituir iconos funcionales importantes por símbolos ambiguos.
- Evitar imágenes remotas decorativas que añadan latencia o
  dependencias innecesarias.

### Fondos y efectos

- Se permiten patrones CSS repetidos, gradientes lineales y pequeños
  brillos.
- Mantener los efectos fuera de las zonas de lectura prolongada.
- Evitar `backdrop-filter` y blur como lenguaje dominante.
- Si se usa un fondo estampado, colocar una superficie sólida detrás
  del contenido principal.
- Los valores de gradientes y efectos deben centralizarse cuando se
  repitan.

---

## 5. Estructura de la interfaz

La estructura debe recordar a un portal web clásico con módulos bien
delimitados, sin convertir todas las páginas en una única plantilla
rígida.

### Navegación superior

- Marca `Nexus` con una variante gráfica retro, por ejemplo un
  wordmark cromado o un símbolo pixel/estrella.
- Enlaces de navegación explícitos.
- Búsqueda fácilmente localizable.
- Acciones de cuenta y publicación claramente diferenciadas.
- En móvil, reducir enlaces secundarios y ofrecer una navegación
  compacta.

### Hero / banner principal

- Encabezado de carácter editorial, más cercano a un banner web que a
  un hero minimalista.
- Una frase corta que explique el valor del producto.
- Acciones principales: explorar prompts y publicar/guardar un prompt,
  según las funcionalidades disponibles.
- Un pequeño estado o ticker comunitario solo si existe información
  real que mostrar.
- No inventar cifras de usuarios, actividad o popularidad.

### Exploración y directorio

- Diseñar filtros, categorías y resultados como módulos de un
  directorio.
- Mostrar etiquetas, modelo, autor, fecha y versión de forma ordenada.
- La densidad puede ser alta, pero los títulos y acciones deben
  distinguirse rápidamente.
- En escritorio se puede usar un panel lateral; en móvil, los filtros
  deben plegarse.

### Tarjetas de prompts

Las tarjetas deben recordar entradas de un catálogo de software antiguo:

- Título como enlace claramente identificable.
- Descripción o vista previa breve.
- Autor y metadatos.
- Etiquetas y modelo cuando estén disponibles.
- Versión visible.
- Acciones reales como abrir, copiar o crear un fork, solo cuando
  estén implementadas.
- Estados como `NEW`, `UPDATED` o `POPULAR` únicamente cuando los
  datos lo justifiquen.

No convertir cada tarjeta en un collage de stickers. La información del
prompt es el contenido principal.

### Versionado y forks

- El historial debe leerse como una lista cronológica o tabla técnica.
- Cada versión debe identificar su número, fecha y cambios relevantes
  disponibles.
- Los forks deben comunicar la relación entre el original y la
  variante.
- Usar líneas, sangrías o indicadores de parentesco en vez de depender
  únicamente de gráficos decorativos.
- Mantener visible la acción de comparar o consultar versiones si
  existe en el producto.

### Perfil y comunidad

- Inspiración en las páginas personales de Internet clásico.
- Avatar, nombre, breve descripción y enlaces relevantes.
- Listas de prompts publicados, guardados o derivados según permisos y
  funcionalidades existentes.
- Una sección de actividad o guestbook reinterpretado solo si el
  producto cuenta con esos datos o acciones.
- Respetar privacidad y visibilidad de contenido privado.

### Footer

- Puede incluir enlaces secundarios, versión del sitio, estado del
  servicio o una pequeña firma retro.
- Los mensajes humorísticos son bienvenidos si no ocultan información
  importante.
- No mostrar estados técnicos ficticios ni información operativa
  inventada.

---

## 6. Patrones de componentes

### 6.1 Paneles

Los paneles se componen con fondos claros, bordes visibles y encabezados
que distinguen cada sección.

- Panel estándar: superficie clara, borde definido y padding moderado.
- Panel destacado: borde azul principal o cabecera con degradado.
- Panel técnico: metadatos en monospace y separadores visibles.
- Evitar usar la misma composición para cada elemento; variar según su
  función, no solo por decoración.

### 6.2 Botones

- **Primario:** azul intenso, texto blanco, borde definido y posible
  relieve discreto.
- **Secundario:** fondo claro, borde azul/gris y texto oscuro.
- **Terciario:** enlace o botón textual para acciones de baja
  prioridad.
- Los estados hover/active pueden simular un botón físico presionado.
- Mantener foco de teclado claramente visible.
- No usar botones con apariencia interactiva si no ejecutan una
  acción.

### 6.3 Enlaces

- Los enlaces dentro de contenido pueden usar el azul clásico y
  subrayado.
- Los enlaces de navegación deben distinguirse del texto normal.
- No depender exclusivamente de hover para revelar que un elemento es
  clicable.
- Mantener los estados visitado/activo coherentes y accesibles.

### 6.4 Badges y etiquetas

- Usar etiquetas compactas con bordes y colores sólidos.
- Ejemplos conceptuales: `BETA`, `NEW`, `V1.2`, `FORK`, `OPEN SOURCE`.
- No usar una etiqueta si el estado no está respaldado por los datos.
- Las etiquetas de modelo y versión deben ser legibles, no meros
  adornos.

### 6.5 Inputs y búsqueda

- Campo de búsqueda con borde claro, fondo sólido y foco visible.
- El botón de búsqueda puede parecer un control de portal antiguo.
- Placeholder breve y útil.
- Los filtros deben comunicar selección, estado vacío y posibilidad de
  restablecerse.
- La estética retro nunca debe ocultar el funcionamiento del campo.

### 6.6 Iconografía

- Priorizar glifos Unicode y símbolos sencillos cuando sean
  reconocibles.
- Mantener un estilo consistente dentro de cada grupo de acciones.
- Si se introduce una librería de iconos, hacerlo de forma global y
  justificada.
- Los iconos de acciones críticas deben tener un nombre accesible o
  texto asociado.

---

## 7. Interacción y movimiento

- Hover: cambio de borde, brillo ligero o variación de fondo.
- Active: desplazamiento visual mínimo o bisel presionado.
- Focus: outline visible y de contraste suficiente.
- Loading: texto o indicador claro; no depender de una animación
  ornamental.
- Éxito/error: mensajes inequívocos y accesibles.
- Transiciones cortas y discretas.
- No animar continuamente banners, fondos o elementos que distraigan
  de la lectura.
- Respetar `prefers-reduced-motion`.

La ironía se expresa principalmente mediante el lenguaje visual y los
microtextos; no hace falta que cada interacción sea una broma.

---

## 8. Responsive y accesibilidad

- Diseñar primero la jerarquía y después los adornos.
- En móvil, convertir barras densas en navegación compacta y filtros
  plegables.
- Permitir que las tablas se transformen en listas cuando el ancho sea
  insuficiente.
- Evitar scroll horizontal de página.
- Mantener tamaños de interacción adecuados para pantalla táctil.
- No transmitir información solo con color, iconos o animaciones.
- Verificar contraste, foco de teclado, etiquetas accesibles y
  estructura semántica.
- Los efectos decorativos no deben bloquear controles ni lectores de
  pantalla.

---

## 9. Svelte 5 y organización del proyecto

Estructura de referencia:

```text
src/
  lib/
    components/
      Logo.svelte
      TopNav.svelte
      HeroBanner.svelte
      FilterPanel.svelte
      PromptCard.svelte
      Footer.svelte
  routes/
    +layout.svelte
    layout.css
    +page.svelte
```

Páginas futuras deben reutilizar los componentes existentes cuando
corresponda. Si un elemento se repite en dos o más pantallas, considerar
extraerlo a `src/lib/components/`.

### Convenciones obligatorias

- Usar runes de Svelte 5: `$state`, `$props`, `$derived` y `$effect`
  cuando corresponda.
- No usar `export let`.
- Eventos con `onclick={...}`, no `on:click`.
- Preferir utilidades de Tailwind CSS v4.
- Mantener tokens y estilos base en `layout.css`.
- No duplicar colores, radios o efectos repetidos mediante valores
  arbitrarios.
- Usar arrays/objetos para clases condicionales cuando sea apropiado.
- Mantener TypeScript estricto.
- Usar snippets para contenido arbitrario cuando el diseño del
  componente lo requiera.
- No añadir comentarios salvo que expliquen una decisión no obvia.

### Tokens

Cambiar la identidad global mediante `@theme` en
`src/routes/layout.css`. Si el proyecto mantiene los nombres de tokens
actuales (`background`, `foreground`, `card`, `surface`, `primary`,
`accent`, etc.), conservarlos y modificar sus valores semánticos en un
único lugar. No propagar colores manualmente por todos los componentes.

Los valores hexadecimales directos solo se permiten cuando sean
necesarios para un efecto gráfico localizado que no se pueda representar
razonablemente mediante tokens; los efectos compartidos deben
centralizarse.

---

## 10. Checklist de implementación

Antes de cerrar una pantalla, comprobar:

1.  ¿Se percibe la mezcla de portal clásico, Y2K y producto técnico?
2.  ¿La información principal se entiende antes que la decoración?
3.  ¿Se reutilizan los componentes y tokens existentes?
4.  ¿Los enlaces, botones, filtros y estados tienen comportamiento real?
5.  ¿Los metadatos y las versiones son legibles?
6.  ¿La página funciona en móvil sin scroll horizontal global?
7.  ¿El contraste y el foco de teclado son claros?
8.  ¿Las animaciones son discretas y respetan `prefers-reduced-motion`?
9.  ¿Se evitaron datos ficticios, contadores inventados y etiquetas
    engañosas?
10. ¿Pasan `pnpm format`, `pnpm lint`, `pnpm check` y `pnpm build`?

---

## 11. Resumen de identidad

**Nexus es el Internet de 2003 imaginando cómo compartiríamos prompts de
IA en el futuro.**

La interfaz debe parecer más expresiva, brillante, modular y comunitaria
que una aplicación SaaS minimalista actual. Su nostalgia es intencional;
su funcionalidad, no nostálgica: explorar, guardar, compartir, versionar
y reutilizar prompts debe seguir siendo una experiencia moderna.
