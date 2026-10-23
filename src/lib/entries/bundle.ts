import type { Entry, EntryFile } from './types';

/**
 * Relative POSIX path made of safe segments: letters, digits, dot, dash, underscore.
 * No absolute paths and no `..`, so generated install scripts can't write outside the project.
 */
const SAFE_PATH = /^(?!.*(?:^|\/)\.\.(?:\/|$))[\w.-]+(?:\/[\w.-]+)*$/;

export const MAX_FILES = 12;
export const MAX_FILE_BYTES = 200_000;

/** `.env`, `.env.local`… but not `.env.example` / `.env.sample` / `.env.template`. */
const REAL_ENV = /(?:^|\/)\.env(?:\.(?!example$|sample$|template$)[\w-]+)?$/;

/** Common credential shapes. Not exhaustive: a seatbelt, not a scanner. */
const SECRET_PATTERNS = [
	/sk-(?:ant-|proj-)?[A-Za-z0-9_-]{20,}/, // OpenAI / Anthropic
	/gh[pousr]_[A-Za-z0-9]{30,}/, // GitHub
	/AKIA[0-9A-Z]{16}/, // AWS access key
	/AIza[0-9A-Za-z_-]{35}/, // Google API key
	/xox[abpr]-[A-Za-z0-9-]{10,}/, // Slack
	/-----BEGIN [A-Z ]*PRIVATE KEY-----/
];

export function pathError(path: string, others: string[]): string {
	if (!path.trim()) return 'Escribe una ruta, p. ej. AGENTS.md';
	if (!SAFE_PATH.test(path))
		return 'Usa una ruta relativa con letras, números, . - _ y /. Sin espacios ni "..".';
	if (REAL_ENV.test(path))
		return 'No publiques un .env real. Usa .env.example con los nombres de las variables y sin valores.';
	if (others.includes(path)) return 'Ya hay otro archivo con esta ruta.';
	return '';
}

export function looksLikeSecret(content: string): boolean {
	return SECRET_PATTERNS.some((re) => re.test(content));
}

const LANGUAGES: Record<string, string> = {
	md: 'Markdown',
	mdc: 'Markdown',
	txt: 'Texto',
	json: 'JSON',
	jsonc: 'JSON',
	yml: 'YAML',
	yaml: 'YAML',
	toml: 'TOML',
	ts: 'TypeScript',
	js: 'JavaScript',
	mjs: 'JavaScript',
	py: 'Python',
	sh: 'Shell',
	ps1: 'PowerShell',
	sql: 'SQL'
};

export function fileName(path: string): string {
	return path.split('/').at(-1) ?? path;
}

export function language(path: string): string {
	const ext = fileName(path).split('.').at(-1)?.toLowerCase() ?? '';
	return LANGUAGES[ext] ?? 'Texto';
}

/** Markdown-ish files read better on the ruled sheet; everything else is code. */
export function isProse(path: string): boolean {
	return ['Markdown', 'Texto'].includes(language(path));
}

export function bytes(text: string): number {
	return new TextEncoder().encode(text).length;
}

/** Bundle as one Markdown message, ready to paste into an agent chat. */
export function toMarkdown(entry: Entry, url: string): string {
	const fence = (content: string) => (content.includes('```') ? '~~~~' : '```');
	const files = entry.files
		.map((f) => `**\`${f.path}\`**\n\n${fence(f.content)}\n${f.content}\n${fence(f.content)}`)
		.join('\n\n');
	return `Crea estos archivos en la raíz del proyecto (${entry.title}, vía Nexus: ${url}).\n\n${files}\n`;
}

function delimiter(files: EntryFile[]): string {
	let tag = 'NEXUS_EOF';
	for (let n = 1; files.some((f) => f.content.includes(tag)); n++) tag = `NEXUS_EOF_${n}`;
	return tag;
}

function dirs(files: EntryFile[]): string[] {
	const set = new Set<string>();
	for (const f of files) {
		const dir = f.path.split('/').slice(0, -1).join('/');
		if (dir) set.add(dir);
	}
	return [...set];
}

/** POSIX shell installer. Quoted heredocs: content is written verbatim, never expanded. */
export function toBash(entry: Entry): string {
	const tag = delimiter(entry.files);
	const mk = dirs(entry.files).map((d) => `mkdir -p '${d}'`);
	const writes = entry.files.map((f) => `cat > '${f.path}' <<'${tag}'\n${f.content}\n${tag}`);
	return [`# ${entry.title} — Nexus`, ...mk, ...writes].join('\n') + '\n';
}

/** PowerShell installer using literal here-strings. */
export function toPowerShell(entry: Entry): string {
	const mk = dirs(entry.files).map(
		(d) => `New-Item -ItemType Directory -Force -Path '${d}' | Out-Null`
	);
	const writes = entry.files.map((f) => {
		// A line starting with '@ would end the here-string early; indent it by one space.
		const safe = f.content.replace(/^'@/gm, " '@");
		return `@'\n${safe}\n'@ | Set-Content -Encoding utf8 -Path '${f.path}'`;
	});
	return [`# ${entry.title} - Nexus`, ...mk, ...writes].join('\n') + '\n';
}

/* ---------- Minimal ZIP writer (STORE, no compression). Enough for text files. ---------- */

const CRC_TABLE = (() => {
	const table = new Uint32Array(256);
	for (let n = 0; n < 256; n++) {
		let c = n;
		for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		table[n] = c >>> 0;
	}
	return table;
})();

function crc32(data: Uint8Array): number {
	let crc = 0xffffffff;
	for (const byte of data) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
	return (crc ^ 0xffffffff) >>> 0;
}

/** 1980-01-01, the DOS epoch. A zero date makes some unzip tools complain. */
const DOS_DATE = (1 << 5) | 1;

export function toZip(files: EntryFile[]): Blob {
	const encoder = new TextEncoder();
	const local: Uint8Array[] = [];
	const central: Uint8Array[] = [];
	let offset = 0;

	for (const file of files) {
		const name = encoder.encode(file.path);
		const data = encoder.encode(file.content);
		const crc = crc32(data);

		const header = new DataView(new ArrayBuffer(30));
		header.setUint32(0, 0x04034b50, true);
		header.setUint16(4, 20, true); // version needed
		header.setUint16(6, 0x0800, true); // UTF-8 names
		header.setUint16(12, DOS_DATE, true);
		header.setUint32(14, crc, true);
		header.setUint32(18, data.length, true);
		header.setUint32(22, data.length, true);
		header.setUint16(26, name.length, true);
		local.push(new Uint8Array(header.buffer), name, data);

		const entry = new DataView(new ArrayBuffer(46));
		entry.setUint32(0, 0x02014b50, true);
		entry.setUint16(4, 20, true);
		entry.setUint16(6, 20, true);
		entry.setUint16(8, 0x0800, true);
		entry.setUint16(14, DOS_DATE, true);
		entry.setUint32(16, crc, true);
		entry.setUint32(20, data.length, true);
		entry.setUint32(24, data.length, true);
		entry.setUint16(28, name.length, true);
		entry.setUint32(42, offset, true);
		central.push(new Uint8Array(entry.buffer), name);

		offset += 30 + name.length + data.length;
	}

	const centralSize = central.reduce((sum, part) => sum + part.length, 0);
	const end = new DataView(new ArrayBuffer(22));
	end.setUint32(0, 0x06054b50, true);
	end.setUint16(8, files.length, true);
	end.setUint16(10, files.length, true);
	end.setUint32(12, centralSize, true);
	end.setUint32(16, offset, true);

	return new Blob([...local, ...central, new Uint8Array(end.buffer)] as BlobPart[], {
		type: 'application/zip'
	});
}

export function download(name: string, data: Blob | string) {
	const blob = typeof data === 'string' ? new Blob([data], { type: 'text/plain' }) : data;
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = name;
	a.click();
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}
