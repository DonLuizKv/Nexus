/** What an entry is. Drives its color, icon, default file layout and available tools. */
export type Kind = 'prompt' | 'skill' | 'agent' | 'settings' | 'context';

export type Visibility = 'public' | 'unlisted' | 'burn';

export type CategoryId = 'escritura' | 'codigo' | 'imagen' | 'datos' | 'aprendizaje' | 'negocio';

/** A file inside an entry. `path` is relative to the project root where it gets installed. */
export interface EntryFile {
	path: string;
	content: string;
}

export interface Comment {
	id: string;
	author: string;
	message: string;
	createdAt: string;
}

export interface Entry {
	slug: string;
	kind: Kind;
	title: string;
	summary: string;
	category: CategoryId;
	tags: string[];
	/** Models or tools it was written for (ChatGPT, Claude Code, Cursor…). */
	targets: string[];
	/** Handle of the owner. */
	author: string;
	visibility: Visibility;
	/** The first file is the main one: it's what "Copiar" copies and what the test bench runs. */
	files: EntryFile[];
	stars: number;
	/** Copies + downloads. */
	uses: number;
	comments: Comment[];
	createdAt: string;
	updatedAt: string;
}

export type EntryDraft = Pick<
	Entry,
	'kind' | 'title' | 'summary' | 'category' | 'tags' | 'targets' | 'visibility' | 'files'
>;

export interface Category {
	id: CategoryId;
	label: string;
	blurb: string;
}
