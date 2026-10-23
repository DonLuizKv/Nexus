import { browser } from '$app/env';
import { SEED } from './seed';
import { normalize, slugify } from './text';
import type { CategoryId, Entry, EntryDraft, Kind } from './types';

// Bumped when the Kind set changes so old saved data can't reference removed kinds.
const STORAGE_KEY = 'nexus:library:v3';

export type SortKey = 'relevance' | 'recent' | 'stars' | 'uses';

export interface SearchOptions {
	query?: string;
	kind?: Kind | '';
	category?: CategoryId | '';
	target?: string;
	sort?: SortKey;
}

/**
 * Client-side library. Seeds with demo data and persists changes to localStorage until the
 * external API is connected. Components only use this public surface.
 */
class Library {
	entries = $state<Entry[]>(structuredClone(SEED));
	/** handle → starred slugs. */
	stars = $state<Record<string, string[]>>({});
	/** True once localStorage has been read (always false during SSR). */
	ready = $state(false);

	/** Call once after hydration so server and client render the same first frame. */
	load() {
		if (!browser || this.ready) return;
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const saved = JSON.parse(raw) as { entries: Entry[]; stars: Record<string, string[]> };
				if (Array.isArray(saved.entries)) this.entries = saved.entries;
				if (saved.stars && typeof saved.stars === 'object') this.stars = saved.stars;
			}
		} catch {
			// Corrupt storage: fall back to the seed.
		}
		this.ready = true;
	}

	#persist() {
		if (!browser) return;
		try {
			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({ entries: this.entries, stars: this.stars })
			);
		} catch {
			// Quota exceeded or storage disabled; keep working in memory.
		}
	}

	get(slug: string): Entry | undefined {
		return this.entries.find((e) => e.slug === slug);
	}

	get publicEntries(): Entry[] {
		return this.entries.filter((e) => e.visibility === 'public');
	}

	byAuthor(handle: string, includePrivate = false): Entry[] {
		return this.entries
			.filter((e) => e.author === handle && (includePrivate || e.visibility === 'public'))
			.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
	}

	count(filter: { kind?: Kind; category?: CategoryId }): number {
		return this.publicEntries.filter(
			(e) =>
				(!filter.kind || e.kind === filter.kind) &&
				(!filter.category || e.category === filter.category)
		).length;
	}

	search({ query = '', kind = '', category = '', target = '', sort = 'relevance' }: SearchOptions) {
		const terms = normalize(query).split(/\s+/).filter(Boolean);
		const scored = this.publicEntries
			.filter(
				(e) =>
					(!kind || e.kind === kind) &&
					(!category || e.category === category) &&
					(!target || e.targets.includes(target))
			)
			.map((e) => {
				if (!terms.length) return { e, score: 1 };
				const title = normalize(e.title);
				const rest = normalize(
					[
						e.summary,
						e.tags.join(' '),
						e.author,
						...e.files.map((f) => `${f.path} ${f.content}`)
					].join(' ')
				);
				let score = 0;
				for (const term of terms) {
					if (title.includes(term)) score += 5;
					else if (rest.includes(term)) score += 1;
					else return { e, score: 0 };
				}
				return { e, score };
			})
			.filter((r) => r.score > 0);

		type Row = (typeof scored)[number];
		const by: Record<SortKey, (a: Row, b: Row) => number> = {
			relevance: (a, b) => b.score - a.score || b.e.stars - a.e.stars,
			recent: (a, b) => b.e.updatedAt.localeCompare(a.e.updatedAt),
			stars: (a, b) => b.e.stars - a.e.stars,
			uses: (a, b) => b.e.uses - a.e.uses
		};
		return scored.sort(by[sort]).map((r) => r.e);
	}

	random(exclude?: string): Entry | undefined {
		const pool = this.publicEntries.filter((e) => e.slug !== exclude);
		return pool[Math.floor(Math.random() * pool.length)];
	}

	/** Previous / next public entry, wrapping around — the webring. */
	neighbours(slug: string): { prev?: Entry; next?: Entry } {
		const ring = this.publicEntries;
		const i = ring.findIndex((e) => e.slug === slug);
		if (i === -1 || ring.length < 2) return {};
		return {
			prev: ring[(i - 1 + ring.length) % ring.length],
			next: ring[(i + 1) % ring.length]
		};
	}

	#uniqueSlug(title: string): string {
		const base = slugify(title);
		let slug = base;
		for (let n = 2; this.get(slug); n++) slug = `${base}-${n}`;
		return slug;
	}

	create(draft: EntryDraft, author: string): Entry {
		const now = new Date().toISOString();
		const entry: Entry = {
			...($state.snapshot(draft) as EntryDraft),
			slug: this.#uniqueSlug(draft.title),
			author,
			stars: 0,
			uses: 0,
			comments: [],
			createdAt: now,
			updatedAt: now
		};
		this.entries.unshift(entry);
		this.#persist();
		return entry;
	}

	/** Only the author may edit; returns undefined otherwise. */
	update(slug: string, draft: EntryDraft, by: string): Entry | undefined {
		const entry = this.get(slug);
		if (!entry || entry.author !== by) return;
		Object.assign(entry, $state.snapshot(draft) as EntryDraft, {
			updatedAt: new Date().toISOString()
		});
		this.#persist();
		return entry;
	}

	remove(slug: string, by?: string) {
		const entry = this.get(slug);
		// Burn-after-reading entries are removed by whoever opens them.
		if (!entry || (entry.visibility !== 'burn' && entry.author !== by)) return;
		this.entries = this.entries.filter((e) => e.slug !== slug);
		this.#persist();
	}

	starredBy(handle: string): Entry[] {
		const slugs = this.stars[handle] ?? [];
		return slugs.map((s) => this.get(s)).filter((e): e is Entry => !!e);
	}

	isStarred(slug: string, handle?: string): boolean {
		return !!handle && (this.stars[handle] ?? []).includes(slug);
	}

	toggleStar(slug: string, handle: string) {
		const entry = this.get(slug);
		if (!entry) return;
		const mine = this.stars[handle] ?? [];
		if (mine.includes(slug)) {
			this.stars[handle] = mine.filter((s) => s !== slug);
			entry.stars = Math.max(0, entry.stars - 1);
		} else {
			this.stars[handle] = [...mine, slug];
			entry.stars += 1;
		}
		this.#persist();
	}

	recordUse(slug: string) {
		const entry = this.get(slug);
		if (!entry) return;
		entry.uses += 1;
		this.#persist();
	}

	comment(slug: string, author: string, message: string) {
		const entry = this.get(slug);
		if (!entry || !message.trim()) return;
		entry.comments.unshift({
			id: crypto.randomUUID(),
			author,
			message: message.trim().slice(0, 500),
			createdAt: new Date().toISOString()
		});
		this.#persist();
	}
}

export function toDraft(entry: Entry): EntryDraft {
	const { kind, title, summary, category, tags, targets, visibility, files } = entry;
	return $state.snapshot({
		kind,
		title,
		summary,
		category,
		tags,
		targets,
		visibility,
		files
	}) as EntryDraft;
}

export const library = new Library();
