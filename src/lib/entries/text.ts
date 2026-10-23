/** Matches `{{variable}}` placeholders. Names allow letters (incl. accents), digits, _ and -. */
const VARIABLE = /\{\{\s*([\p{L}\d_-]+)\s*\}\}/gu;

export type Segment = { kind: 'text'; value: string } | { kind: 'var'; name: string };

export function extractVariables(body: string): string[] {
	const names = new Set<string>();
	for (const match of body.matchAll(VARIABLE)) names.add(match[1]);
	return [...names];
}

export function segment(body: string): Segment[] {
	const out: Segment[] = [];
	let last = 0;
	for (const match of body.matchAll(VARIABLE)) {
		const index = match.index ?? 0;
		if (index > last) out.push({ kind: 'text', value: body.slice(last, index) });
		out.push({ kind: 'var', name: match[1] });
		last = index + match[0].length;
	}
	if (last < body.length) out.push({ kind: 'text', value: body.slice(last) });
	return out;
}

export function fill(body: string, values: Record<string, string>): string {
	return body.replace(VARIABLE, (whole, name: string) => values[name]?.trim() || whole);
}

/** Accent- and case-insensitive folding for search. */
export function normalize(input: string): string {
	return input
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();
}

export function slugify(input: string): string {
	return (
		normalize(input)
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '')
			.slice(0, 60) || 'entrada'
	);
}

export function highlight(text: string, query: string): { value: string; hit: boolean }[] {
	const terms = normalize(query).split(/\s+/).filter(Boolean);
	if (!terms.length) return [{ value: text, hit: false }];
	// Folding must keep 1:1 character positions; bail out for exotic input.
	const folded = [...text].map((ch) => normalize(ch)).join('');
	if (folded.length !== text.length) return [{ value: text, hit: false }];
	const marks = new Array<boolean>(text.length).fill(false);
	for (const term of terms) {
		let from = 0;
		for (;;) {
			const at = folded.indexOf(term, from);
			if (at === -1) break;
			marks.fill(true, at, at + term.length);
			from = at + term.length;
		}
	}
	const out: { value: string; hit: boolean }[] = [];
	for (let i = 0; i < text.length; i++) {
		const prev = out.at(-1);
		if (prev && prev.hit === marks[i]) prev.value += text[i];
		else out.push({ value: text[i], hit: marks[i] });
	}
	return out;
}

const dateFormat = new Intl.DateTimeFormat('es', {
	day: 'numeric',
	month: 'short',
	year: 'numeric'
});

export function formatDate(iso: string): string {
	return dateFormat.format(new Date(iso));
}

export function relativeDate(iso: string, now = Date.now()): string {
	const minutes = Math.round((now - new Date(iso).getTime()) / 60000);
	if (minutes < 1) return 'ahora mismo';
	if (minutes < 60) return `hace ${minutes} min`;
	const hours = Math.round(minutes / 60);
	if (hours < 24) return `hace ${hours} h`;
	const days = Math.round(hours / 24);
	if (days < 30) return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
	return formatDate(iso);
}

export function compact(n: number): string {
	return new Intl.NumberFormat('es', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
}

export function plural(n: number, one: string, many: string): string {
	return `${n} ${n === 1 ? one : many}`;
}
