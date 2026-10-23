import fs from 'node:fs';
let r = fs.readFileSync('README.md', 'utf8');
r = r.replace(
	/prompts, skills, subagentes,\nconfiguraciones de proyecto, contextos y automatizaciones\./,
	'prompts, skills, subagentes,\najustes (reglas, MCP, `.env.example`) y contextos.'
);
r = r.replace(
	/\| \*\*Seis tipos de entrada\*\* *\|[^\n]*\|/,
	'| **Cinco tipos de entrada** | Prompt · Skill · Subagente · Ajustes (AGENTS.md, CLAUDE.md, `.cursor/rules`, `.mcp.json`, `.env.example`) · Contexto. Cada tipo tiene su color, su icono y su archivo de inicio. |'
);
if (!r.includes('Sin secretos publicados'))
	r = r.replace(
		'- **ZIP sin dependencias.**',
		'- **Sin secretos publicados.** El editor rechaza archivos `.env` reales (solo `.env.example`) y\n  contenido con forma de credencial (OpenAI, Anthropic, GitHub, AWS, Google, Slack, claves\n  privadas).\n- **ZIP sin dependencias.**'
	);
fs.writeFileSync('README.md', r);
console.log(/Seis|Automatiza/.test(r) ? 'README still old' : 'README ok');
const d = fs.readFileSync('DESIGN.md', 'utf8');
console.log(/k-workflow|`config`|Automatiza/.test(d) ? 'DESIGN still old' : 'DESIGN ok');
