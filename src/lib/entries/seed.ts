import type { Entry } from './types';

// Demo content until the external API is connected.
export const SEED: Entry[] = [
	{
		slug: 'revisor-de-pull-requests',
		kind: 'prompt',
		title: 'Revisor de pull requests sin piedad',
		summary:
			'Lee un diff como lo haría tu compañera más exigente: errores primero, estilo al final, y nada de halagos vacíos.',
		category: 'codigo',
		tags: ['code-review', 'git', 'calidad'],
		targets: ['Claude', 'ChatGPT'],
		author: 'marta.dev',
		visibility: 'public',
		stars: 1284,
		uses: 9312,
		createdAt: '2026-08-02T10:00:00Z',
		updatedAt: '2026-10-21T18:40:00Z',
		files: [
			{
				path: 'prompt.md',
				content: `Eres un revisor de código senior con criterio y poca paciencia para el ruido.
Revisa el siguiente diff escrito en {{lenguaje}}.
Contexto del equipo: {{contexto}}

Ordena tus hallazgos por severidad:
1. Bugs y riesgos de seguridad
2. Problemas de diseño
3. Estilo (máximo 3 puntos)

Para cada hallazgo indica archivo, línea y una corrección concreta.
No escribas halagos ni resúmenes genéricos.

{{diff}}`
			}
		],
		comments: [
			{
				id: 'c1',
				author: 'pablo_r',
				message: 'La regla de "máximo 3 puntos de estilo" me ahorró media hora de discusiones.',
				createdAt: '2026-10-21T20:02:00Z'
			},
			{
				id: 'c2',
				author: 'nadia',
				message: 'Con Claude funciona mejor si pegas el diff en formato unificado.',
				createdAt: '2026-10-19T11:30:00Z'
			}
		]
	},
	{
		slug: 'skill-tests-con-vitest',
		kind: 'skill',
		title: 'Skill: tests con Vitest que sí detectan bugs',
		summary:
			'Enseña a tu agente a escribir tests de comportamiento, no de implementación. Incluye un ejemplo de referencia.',
		category: 'codigo',
		tags: ['testing', 'vitest', 'typescript'],
		targets: ['Claude Code', 'Kiro', 'Cursor'],
		author: 'marta.dev',
		visibility: 'public',
		stars: 864,
		uses: 3410,
		createdAt: '2026-09-12T09:00:00Z',
		updatedAt: '2026-10-20T16:10:00Z',
		files: [
			{
				path: 'skills/vitest-tests/SKILL.md',
				content: `---
name: vitest-tests
description: Úsala cuando el usuario pida tests unitarios o de integración en un proyecto con Vitest.
---

# Tests con Vitest

## Reglas
1. Prueba comportamiento observable, nunca detalles privados.
2. Un \`describe\` por unidad, un \`it\` por regla de negocio.
3. Nombra los tests como frases: "devuelve 0 si el carrito está vacío".
4. Nada de mocks si una dependencia real es rápida y determinista.

## Pasos
1. Lee el módulo y lista sus casos límite antes de escribir nada.
2. Escribe primero el test que falla.
3. Ejecuta \`pnpm vitest --run <archivo>\` y pega la salida.

Consulta \`examples/carrito.test.ts\` como referencia de estilo.`
			},
			{
				path: 'skills/vitest-tests/examples/carrito.test.ts',
				content: `import { describe, expect, it } from 'vitest';
import { total } from '../src/carrito';

describe('total', () => {
	it('devuelve 0 si el carrito está vacío', () => {
		expect(total([])).toBe(0);
	});

	it('aplica el descuento solo a partir de 3 unidades', () => {
		expect(total([{ precio: 10, unidades: 2 }])).toBe(20);
		expect(total([{ precio: 10, unidades: 3 }])).toBe(27);
	});
});`
			}
		],
		comments: [
			{
				id: 'c3',
				author: 'nadia',
				message: 'La regla 4 sola ya cambió la calidad de los tests que genera mi agente.',
				createdAt: '2026-10-20T18:00:00Z'
			}
		]
	},
	{
		slug: 'subagente-revisor-de-seguridad',
		kind: 'agent',
		title: 'Subagente revisor de seguridad',
		summary:
			'Un agente de solo lectura que audita cambios en busca de inyecciones, secretos y permisos rotos antes de cada merge.',
		category: 'codigo',
		tags: ['seguridad', 'owasp', 'auditoría'],
		targets: ['Claude Code', 'Kiro'],
		author: 'ops.tomas',
		visibility: 'public',
		stars: 1102,
		uses: 2980,
		createdAt: '2026-09-01T12:00:00Z',
		updatedAt: '2026-10-21T09:30:00Z',
		files: [
			{
				path: '.claude/agents/security-reviewer.md',
				content: `---
name: security-reviewer
description: Delega aquí cualquier revisión de seguridad de un diff o de un módulo antes de hacer merge.
tools: Read, Grep, Glob
---

Eres un auditor de seguridad de aplicaciones. Solo lees; nunca modificas archivos.

Revisa, en este orden:
1. Entradas sin validar que llegan a SQL, shell, HTML o rutas de archivo.
2. Secretos o tokens en el código o en logs.
3. Comprobaciones de autorización ausentes en endpoints nuevos.
4. Dependencias añadidas con versiones abiertas.

Devuelve una tabla: severidad · archivo:línea · problema · corrección propuesta.
Si no encuentras nada, dilo en una línea. No inventes hallazgos.`
			}
		],
		comments: []
	},
	{
		slug: 'agents-md-sveltekit-tailwind',
		kind: 'settings',
		title: 'AGENTS.md para SvelteKit + Tailwind v4',
		summary:
			'Reglas de proyecto listas para usar: runes de Svelte 5, Tailwind CSS-first y comandos de verificación.',
		category: 'codigo',
		tags: ['sveltekit', 'tailwind', 'reglas'],
		targets: ['Codex', 'Cursor', 'Claude Code', 'Kiro'],
		author: 'luiz',
		visibility: 'public',
		stars: 742,
		uses: 4120,
		createdAt: '2026-10-02T15:00:00Z',
		updatedAt: '2026-10-18T11:00:00Z',
		files: [
			{
				path: 'AGENTS.md',
				content: `# Reglas del proyecto

## Stack
- SvelteKit + Svelte 5 en modo runes ($state, $derived, $props). Nada de \`export let\`.
- Tailwind CSS v4 con configuración en CSS (@theme). No hay tailwind.config.js.
- TypeScript estricto.

## Comandos
- Verificar tipos: \`pnpm check\`
- Lint y formato: \`pnpm lint\` / \`pnpm format\`

## Convenciones
- Eventos como atributos: onclick={...}
- Componentes en PascalCase dentro de src/lib/components.
- Termina cada cambio con check y lint en verde.`
			},
			{
				path: '.cursor/rules/svelte.mdc',
				content: `---
description: Svelte 5 runes
globs: ["**/*.svelte", "**/*.svelte.ts"]
---

Usa siempre runes. Lee AGENTS.md antes de editar componentes.`
			}
		],
		comments: []
	},
	{
		slug: 'mcp-documentacion-y-env',
		kind: 'settings',
		title: 'Servidores MCP de documentación + .env.example',
		summary:
			'Conecta tu agente a la documentación oficial de tus librerías. Las claves van en un .env que nunca se sube.',
		category: 'codigo',
		tags: ['mcp', 'env', 'claves'],
		targets: ['Claude Code', 'Cursor', 'Kiro'],
		author: 'ops.tomas',
		visibility: 'public',
		stars: 588,
		uses: 2310,
		createdAt: '2026-09-25T10:00:00Z',
		updatedAt: '2026-10-19T13:20:00Z',
		files: [
			{
				path: '.mcp.json',
				content: `{
  "mcpServers": {
    "docs": {
      "command": "uvx",
      "args": ["awslabs.aws-documentation-mcp-server@latest"],
      "env": { "FASTMCP_LOG_LEVEL": "ERROR" }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "\${GITHUB_TOKEN}" }
    }
  }
}`
			},
			{
				path: '.env.example',
				content: `# Copia este archivo a .env y rellena tus valores. No subas .env al repositorio.
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GITHUB_TOKEN=
# Modelo por defecto para tus scripts y agentes
DEFAULT_MODEL=claude-sonnet`
			}
		],
		comments: []
	},
	{
		slug: 'editor-de-tono',
		kind: 'prompt',
		title: 'Editor de tono: de robot a persona',
		summary:
			'Reescribe un texto para que suene humano, cercano y claro, conservando cada dato del original.',
		category: 'escritura',
		tags: ['tono', 'edición', 'claridad'],
		targets: ['ChatGPT', 'Claude', 'Gemini'],
		author: 'lucia_escribe',
		visibility: 'public',
		stars: 932,
		uses: 6120,
		createdAt: '2026-07-11T14:00:00Z',
		updatedAt: '2026-10-18T08:15:00Z',
		files: [
			{
				path: 'prompt.md',
				content: `Reescribe este texto con un tono {{tono}}.
Público: {{publico}}.
No inventes datos nuevos y conserva todas las cifras.
Frases cortas. Nada de muletillas corporativas.

Al final, en una lista breve, explica los 3 cambios más importantes que hiciste.

Texto:
{{texto}}`
			}
		],
		comments: [
			{
				id: 'c4',
				author: 'tomasín',
				message:
					'Lo uso para los correos a clientes. Tono "cálido pero directo" funciona muy bien.',
				createdAt: '2026-10-17T16:45:00Z'
			}
		]
	},
	{
		slug: 'contexto-guia-api-rest',
		kind: 'context',
		title: 'Contexto: guía de estilo para APIs REST',
		summary:
			'Pégalo o adjúntalo para que el modelo diseñe endpoints coherentes: nombres, errores, paginación y versiones.',
		category: 'codigo',
		tags: ['api', 'rest', 'diseño'],
		targets: ['Claude', 'ChatGPT', 'Cursor', 'Kiro'],
		author: 'data_ines',
		visibility: 'public',
		stars: 498,
		uses: 2240,
		createdAt: '2026-08-30T08:00:00Z',
		updatedAt: '2026-10-14T10:40:00Z',
		files: [
			{
				path: 'docs/api-style.md',
				content: `# Guía de estilo de la API

## Recursos
- Sustantivos en plural y kebab-case: /pedidos, /lineas-de-pedido
- Anidar solo un nivel: /pedidos/{id}/lineas

## Errores
Siempre JSON con esta forma:
{ "error": { "code": "pedido_no_encontrado", "message": "…", "details": [] } }

## Paginación
Por cursor: ?limit=20&cursor=abc. Responde con { "data": [], "next": "def" | null }.

## Fechas
ISO 8601 en UTC. Nunca timestamps numéricos.`
			}
		],
		comments: []
	},
	{
		slug: 'director-de-fotografia',
		kind: 'prompt',
		title: 'Director de fotografía para imágenes',
		summary:
			'Convierte una idea vaga en una descripción de plano: lente, luz, paleta, textura y composición.',
		category: 'imagen',
		tags: ['fotografía', 'dirección de arte', 'luz'],
		targets: ['Midjourney', 'ChatGPT'],
		author: 'kiko.lumen',
		visibility: 'public',
		stars: 2210,
		uses: 15400,
		createdAt: '2026-06-01T09:00:00Z',
		updatedAt: '2026-10-12T22:10:00Z',
		files: [
			{
				path: 'prompt.md',
				content: `Actúa como director de fotografía.
Idea: {{idea}}
Época o estilo: {{estilo}}

Describe el plano en una sola línea con: tipo de lente, hora del día, fuente de luz,
paleta de color, textura de la película y composición. Evita adjetivos vacíos como "épico".`
			}
		],
		comments: []
	},
	{
		slug: 'extractor-de-facturas',
		kind: 'prompt',
		title: 'Extractor de facturas a JSON',
		summary:
			'Saca proveedor, fechas, importes e impuestos de cualquier factura y devuelve JSON válido, nada más.',
		category: 'datos',
		tags: ['json', 'extracción', 'contabilidad'],
		targets: ['Claude', 'Gemini'],
		author: 'data_ines',
		visibility: 'public',
		stars: 780,
		uses: 4890,
		createdAt: '2026-09-03T12:00:00Z',
		updatedAt: '2026-10-15T10:00:00Z',
		files: [
			{
				path: 'prompt.md',
				content: `Extrae los datos de esta factura y responde SOLO con JSON válido.
Esquema:
{ "proveedor": string, "fecha": "YYYY-MM-DD", "total": number, "moneda": "{{moneda}}",
  "impuestos": [{ "tipo": string, "importe": number }] }

Si un campo no aparece, usa null. No adivines.

Factura:
{{factura}}`
			}
		],
		comments: []
	},
	{
		slug: 'tutor-socratico',
		kind: 'prompt',
		title: 'Tutor socrático que no da la respuesta',
		summary:
			'Guía a un estudiante con preguntas hasta que llega solo a la solución. Paciente, breve y honesto.',
		category: 'aprendizaje',
		tags: ['educación', 'tutor', 'preguntas'],
		targets: ['Claude', 'ChatGPT', 'Llama'],
		author: 'profe_andres',
		visibility: 'public',
		stars: 1650,
		uses: 7020,
		createdAt: '2026-05-20T08:00:00Z',
		updatedAt: '2026-10-10T19:30:00Z',
		files: [
			{
				path: 'prompt.md',
				content: `Eres un tutor de {{materia}} para un estudiante de nivel {{nivel}}.
Nunca des la respuesta directamente.
Haz una sola pregunta por turno y espera su respuesta.
Si se equivoca, dilo con amabilidad y ofrece una pista más pequeña.

Problema del estudiante:
{{problema}}`
			}
		],
		comments: [
			{
				id: 'c5',
				author: 'sofi',
				message: 'Mi hermano por fin entendió las fracciones. Gracias.',
				createdAt: '2026-10-09T13:10:00Z'
			}
		]
	},
	{
		slug: 'correo-de-seguimiento',
		kind: 'prompt',
		title: 'Correo de seguimiento que sí se responde',
		summary:
			'Un correo corto para retomar una conversación comercial sin sonar desesperado ni pesado.',
		category: 'negocio',
		tags: ['ventas', 'correo', 'seguimiento'],
		targets: ['ChatGPT', 'Gemini'],
		author: 'carla.b2b',
		visibility: 'public',
		stars: 540,
		uses: 3980,
		createdAt: '2026-09-28T15:00:00Z',
		updatedAt: '2026-10-05T09:45:00Z',
		files: [
			{
				path: 'prompt.md',
				content: `Escribe un correo de seguimiento para {{nombre}}, de {{empresa}}.
Última conversación: {{contexto}}

Reglas: máximo 90 palabras, una sola pregunta al final, sin "solo quería saber",
asunto de menos de 6 palabras.`
			}
		],
		comments: []
	}
];
