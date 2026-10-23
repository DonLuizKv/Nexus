import IconPrompt from '@tabler/icons-svelte-runes/icons/prompt';
import IconTool from '@tabler/icons-svelte-runes/icons/tool';
import IconRobot from '@tabler/icons-svelte-runes/icons/robot';
import IconSettings from '@tabler/icons-svelte-runes/icons/settings-2';
import IconBooks from '@tabler/icons-svelte-runes/icons/books';
import type { Category, CategoryId, Kind, Visibility } from './types';

export const CATEGORIES: Category[] = [
	{ id: 'codigo', label: 'Código', blurb: 'Revisión, tests, refactor, SQL' },
	{ id: 'escritura', label: 'Escritura', blurb: 'Redacción, tono, edición, guiones' },
	{ id: 'datos', label: 'Datos', blurb: 'Extracción, limpieza, análisis' },
	{ id: 'imagen', label: 'Imagen', blurb: 'Dirección de arte, estilos, escenas' },
	{ id: 'aprendizaje', label: 'Aprendizaje', blurb: 'Tutores, resúmenes, exámenes' },
	{ id: 'negocio', label: 'Negocio', blurb: 'Correos, propuestas, estrategia' }
];

/** Chat models and coding agents an entry can target. */
export const TARGETS = [
	'ChatGPT',
	'Claude',
	'Gemini',
	'Llama',
	'Midjourney',
	'Claude Code',
	'Cursor',
	'Kiro',
	'Copilot',
	'Codex'
];

interface KindInfo {
	label: string;
	plural: string;
	/** One line: what it is and who uses it. */
	hint: string;
	icon: typeof IconPrompt;
	/** Literal class strings so Tailwind can see them. */
	text: string;
	bg: string;
	soft: string;
	border: string;
	/** Suggested first file when creating an entry of this kind. */
	starter: (name: string) => { path: string; content: string };
}

export const KINDS: Record<Kind, KindInfo> = {
	prompt: {
		label: 'Prompt',
		plural: 'Prompts',
		hint: 'Texto para pegar en un chat. Admite variables {{así}}.',
		icon: IconPrompt,
		text: 'text-k-prompt',
		bg: 'bg-k-prompt',
		soft: 'bg-k-prompt/10',
		border: 'border-k-prompt',
		starter: () => ({
			path: 'prompt.md',
			content: 'Eres un experto en {{tema}}.\n\nTarea: {{tarea}}\n\nResponde en formato de lista.'
		})
	},
	skill: {
		label: 'Skill',
		plural: 'Skills',
		hint: 'Instrucciones y recursos que un agente carga cuando la tarea lo pide.',
		icon: IconTool,
		text: 'text-k-skill',
		bg: 'bg-k-skill',
		soft: 'bg-k-skill/10',
		border: 'border-k-skill',
		starter: (name) => ({
			path: `skills/${name}/SKILL.md`,
			content: `---\nname: ${name}\ndescription: Cuándo debe usar el agente esta skill.\n---\n\n# ${name}\n\n## Cuándo usarla\n\n## Pasos\n\n1. \n`
		})
	},
	agent: {
		label: 'Subagente',
		plural: 'Subagentes',
		hint: 'Un agente especializado con su propio rol, herramientas y límites.',
		icon: IconRobot,
		text: 'text-k-agent',
		bg: 'bg-k-agent',
		soft: 'bg-k-agent/10',
		border: 'border-k-agent',
		starter: (name) => ({
			path: `.claude/agents/${name}.md`,
			content: `---\nname: ${name}\ndescription: Qué hace y cuándo delegarle trabajo.\ntools: Read, Grep\n---\n\nEres un agente especializado en…\n`
		})
	},
	settings: {
		label: 'Ajustes',
		plural: 'Ajustes',
		hint: 'Cómo se configura tu IA: reglas (AGENTS.md, CLAUDE.md), servidores MCP y .env.example.',
		icon: IconSettings,
		text: 'text-k-settings',
		bg: 'bg-k-settings',
		soft: 'bg-k-settings/10',
		border: 'border-k-settings',
		starter: () => ({
			path: 'AGENTS.md',
			content: '# Reglas para el agente\n\n## Stack\n\n## Comandos\n\n## Convenciones\n'
		})
	},
	context: {
		label: 'Contexto',
		plural: 'Contextos',
		hint: 'Documentación de referencia para que el modelo entienda tu dominio.',
		icon: IconBooks,
		text: 'text-k-context',
		bg: 'bg-k-context',
		soft: 'bg-k-context/10',
		border: 'border-k-context',
		starter: (name) => ({
			path: `docs/${name}.md`,
			content: `# ${name}\n\n## Resumen\n\n## Términos\n\n## Ejemplos\n`
		})
	}
};

export const KIND_IDS = Object.keys(KINDS) as Kind[];

export const VISIBILITY: Record<Visibility, { label: string; hint: string }> = {
	public: { label: 'Público', hint: 'Aparece en el directorio y en las búsquedas.' },
	unlisted: { label: 'No listado', hint: 'Solo lo ve quien tenga el enlace.' },
	burn: { label: 'Se autodestruye', hint: 'El enlace funciona una sola vez y luego se borra.' }
};

export function categoryLabel(id: CategoryId): string {
	return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
