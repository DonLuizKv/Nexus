<script lang="ts">
	import { tick } from 'svelte';
	import { beforeNavigate } from '$app/navigation';
	import IconPlus from '@tabler/icons-svelte-runes/icons/plus';
	import IconUpload from '@tabler/icons-svelte-runes/icons/file-upload';
	import IconTrash from '@tabler/icons-svelte-runes/icons/trash';
	import IconBraces from '@tabler/icons-svelte-runes/icons/braces';
	import IconCheck from '@tabler/icons-svelte-runes/icons/check';
	import {
		MAX_FILE_BYTES,
		MAX_FILES,
		bytes,
		looksLikeSecret,
		pathError
	} from '#lib/entries/bundle';
	import { CATEGORIES, KINDS, KIND_IDS, TARGETS, VISIBILITY } from '#lib/entries/catalog';
	import { extractVariables, slugify } from '#lib/entries/text';
	import type { Entry, EntryDraft, EntryFile, Kind, Visibility } from '#lib/entries/types';
	import EntryCard from './EntryCard.svelte';
	import FileBrowser from './FileBrowser.svelte';
	import TestBench from './TestBench.svelte';

	interface Props {
		initial: EntryDraft;
		mode: 'create' | 'edit';
		author: string;
		onsave: (draft: EntryDraft) => void;
		oncancel: () => void;
	}

	let { initial, mode, author, onsave, oncancel }: Props = $props();

	// The editor owns a working copy; the parent only hears about it on save.
	// svelte-ignore state_referenced_locally
	const start = $state.snapshot(initial) as EntryDraft;
	let kind = $state<Kind>(start.kind);
	let title = $state(start.title);
	let summary = $state(start.summary);
	let category = $state(start.category);
	let targets = $state<string[]>(start.targets);
	let tagsText = $state(start.tags.join(', '));
	let visibility = $state<Visibility>(start.visibility);
	let files = $state<EntryFile[]>(start.files.length ? start.files : [starter(start.kind)]);
	let tab = $state<'preview' | 'test'>('preview');
	let submitted = $state(false);
	let dragging = $state(false);
	let uploadError = $state('');
	let saving = false;

	/** The last starter we inserted, so switching kind only replaces untouched boilerplate. */
	// svelte-ignore state_referenced_locally
	let lastStarter = $state.snapshot(files) as EntryFile[];

	function starter(k: Kind): EntryFile {
		return KINDS[k].starter(slugify(title || 'mi-' + k));
	}

	function pickKind(next: Kind) {
		const untouched = JSON.stringify($state.snapshot(files)) === JSON.stringify(lastStarter);
		kind = next;
		if (mode === 'create' && untouched) {
			files = [starter(next)];
			lastStarter = $state.snapshot(files) as EntryFile[];
		}
	}

	const tags = $derived(
		[
			...new Set(
				tagsText
					.split(',')
					.map((t) => t.trim().toLowerCase())
					.filter(Boolean)
			)
		].slice(0, 8)
	);
	const fileErrors = $derived(
		files.map((f, i) => ({
			path: pathError(
				f.path,
				files.filter((_, j) => j !== i).map((o) => o.path)
			),
			content: !f.content.trim()
				? 'El archivo está vacío.'
				: bytes(f.content) > MAX_FILE_BYTES
					? 'Máximo 200 KB por archivo.'
					: looksLikeSecret(f.content)
						? 'Parece que hay una clave o token real. Sustitúyelo por un marcador, p. ej. TU_API_KEY.'
						: ''
		}))
	);
	const errors = $derived({
		title: title.trim().length < 4 ? 'Escribe un título de al menos 4 caracteres.' : '',
		targets: targets.length === 0 ? 'Elige al menos un modelo o herramienta.' : '',
		files: fileErrors.some((e) => e.path || e.content)
	});
	const valid = $derived(!errors.title && !errors.targets && !errors.files);
	const draft = $derived<EntryDraft>({
		kind,
		title: title.trim(),
		summary: summary.trim(),
		category,
		targets,
		tags,
		visibility,
		files
	});
	const baseline = JSON.stringify({
		kind: start.kind,
		title: start.title.trim(),
		summary: start.summary.trim(),
		category: start.category,
		targets: start.targets,
		tags: start.tags,
		visibility: start.visibility,
		files: lastStarter
	});
	const dirty = $derived(JSON.stringify(draft) !== baseline);
	const variables = $derived(extractVariables(files[0]?.content ?? ''));
	const preview = $derived<Entry>({
		...draft,
		title: draft.title || 'Sin título',
		summary: draft.summary || 'Sin descripción todavía.',
		slug: 'vista-previa',
		author,
		stars: 0,
		uses: 0,
		comments: [],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	});

	beforeNavigate(({ cancel, type }) => {
		if (saving || !dirty) return;
		if (type === 'leave') {
			cancel();
			return;
		}
		if (!confirm('Tienes cambios sin guardar. ¿Salir de todos modos?')) cancel();
	});

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		submitted = true;
		if (!valid) {
			await tick();
			document.querySelector<HTMLElement>('#editor-form [aria-invalid="true"]')?.focus();
			return;
		}
		saving = true;
		onsave($state.snapshot(draft) as EntryDraft);
	}

	function addFile() {
		if (files.length >= MAX_FILES) return;
		const base = kind === 'skill' ? files[0]?.path.split('/').slice(0, -1).join('/') : '';
		files.push({ path: base ? `${base}/nuevo.md` : `nuevo-${files.length}.md`, content: '' });
		tick().then(() => document.getElementById(`file-path-${files.length - 1}`)?.focus());
	}

	function removeFile(index: number) {
		if (files.length === 1) return;
		files.splice(index, 1);
	}

	async function addUploads(list: FileList | null) {
		uploadError = '';
		if (!list) return;
		for (const upload of list) {
			if (files.length >= MAX_FILES) {
				uploadError = `Máximo ${MAX_FILES} archivos por entrada.`;
				break;
			}
			if (upload.size > MAX_FILE_BYTES) {
				uploadError = `${upload.name} pesa más de 200 KB.`;
				continue;
			}
			const text = await upload.text();
			if (text.includes('\u0000')) {
				uploadError = `${upload.name} no parece un archivo de texto.`;
				continue;
			}
			// Keep folders from webkitRelativePath when a directory was picked.
			const path = (upload.webkitRelativePath || upload.name).replace(/[^\w./-]/g, '-');
			const empty = files.length === 1 && !files[0].content.trim();
			if (empty) files[0] = { path, content: text };
			else files.push({ path, content: text });
		}
	}

	function insertVariable(index: number) {
		const field = document.getElementById(`file-content-${index}`) as HTMLTextAreaElement | null;
		if (!field) return;
		const name = 'variable';
		const { selectionStart: s, selectionEnd: e } = field;
		const body = files[index].content;
		const selected = body.slice(s, e).trim();
		const token = `{{${selected ? selected.replace(/\s+/g, '_') : name}}}`;
		files[index].content = body.slice(0, s) + token + body.slice(e);
		requestAnimationFrame(() => {
			field.focus();
			if (selected) field.setSelectionRange(s + token.length, s + token.length);
			else field.setSelectionRange(s + 2, s + 2 + name.length);
		});
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
			event.preventDefault();
			(document.getElementById('editor-form') as HTMLFormElement | null)?.requestSubmit();
		}
	}
</script>

<svelte:window {onkeydown} />

<form
	id="editor-form"
	onsubmit={submit}
	novalidate
	class="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
>
	<div class="grid min-w-0 content-start gap-8">
		<fieldset>
			<legend class="eyebrow text-ink-faint">Qué vas a publicar</legend>
			<div class="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
				{#each KIND_IDS as k (k)}
					{@const info = KINDS[k]}
					<label
						class={[
							'relative flex flex-col gap-1 border border-t-4 bg-sheet px-4 pt-3 pb-3.5 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-dotted',
							kind === k ? [info.border, 'shadow-[3px_3px_0_var(--color-rule)]'] : 'border-rule'
						]}
					>
						<input
							type="radio"
							name="kind"
							value={k}
							checked={kind === k}
							onchange={() => pickKind(k)}
							class="sr-only"
						/>
						<span
							class={[
								'inline-flex items-center gap-1.5 font-sans text-[14px] font-bold',
								info.text
							]}
						>
							<info.icon size={18} aria-hidden="true" />
							{info.label}
							{#if kind === k}<IconCheck size={16} aria-hidden="true" class="ml-auto" />{/if}
						</span>
						<span class="text-[13px] leading-snug text-ink-soft">{info.hint}</span>
					</label>
				{/each}
			</div>
		</fieldset>

		<div>
			<label for="editor-title" class="eyebrow text-ink-faint">Título</label>
			<input
				id="editor-title"
				bind:value={title}
				maxlength="90"
				aria-invalid={submitted && !!errors.title}
				aria-describedby="editor-title-error"
				placeholder="Qué hace, en pocas palabras"
				class="mt-2 field font-serif text-[22px] font-bold"
			/>
			{#if submitted && errors.title}
				<p id="editor-title-error" class="mt-1.5 font-sans text-[13px] text-danger">
					{errors.title}
				</p>
			{/if}
		</div>

		<div>
			<label for="editor-summary" class="eyebrow text-ink-faint">Descripción breve</label>
			<textarea
				id="editor-summary"
				bind:value={summary}
				rows="2"
				maxlength="200"
				placeholder="Para qué sirve y qué lo hace distinto. Una o dos frases."
				class="mt-2 field resize-y"></textarea>
			<p class="mt-1 text-right font-sans text-[11px] text-ink-faint">{summary.length}/200</p>
		</div>

		<section aria-labelledby="files-title">
			<div class="flex flex-wrap items-end justify-between gap-3">
				<h2 id="files-title" class="eyebrow text-ink-faint">
					Archivos <span class="font-normal normal-case">({files.length}/{MAX_FILES})</span>
				</h2>
				<p class="font-sans text-[12px] text-ink-faint">
					El primero es el principal: es el que se copia con un clic.
				</p>
			</div>

			<ol class="mt-3 grid gap-4">
				{#each files as file, i (i)}
					{@const err = fileErrors[i]}
					<li class={['border bg-sheet', i === 0 ? KINDS[kind].border : 'border-rule']}>
						<div class="flex items-center gap-2 border-b border-rule px-3 py-2">
							<label for="file-path-{i}" class="sr-only">Ruta del archivo {i + 1}</label>
							<input
								id="file-path-{i}"
								bind:value={file.path}
								spellcheck="false"
								autocomplete="off"
								aria-invalid={submitted && !!err?.path}
								aria-describedby="file-path-error-{i}"
								placeholder="ruta/al/archivo.md"
								class="min-w-0 flex-1 bg-transparent py-1 font-mono text-[14px] font-bold text-ink outline-none placeholder:font-normal placeholder:text-ink-faint focus-visible:bg-paper-deep"
							/>
							{#if i === 0}
								<span class="shrink-0 font-sans text-[11px] text-ink-faint">principal</span>
							{/if}
							{#if kind === 'prompt' || file.content.includes('{{')}
								<button
									type="button"
									class="inline-flex shrink-0 items-center gap-1 font-sans text-[12px] text-link underline"
									onclick={() => insertVariable(i)}
									><IconBraces size={14} aria-hidden="true" /> Variable</button
								>
							{/if}
							{#if files.length > 1}
								<button
									type="button"
									class="shrink-0 p-1 text-ink-faint hover:text-danger"
									aria-label="Quitar {file.path || `archivo ${i + 1}`}"
									onclick={() => removeFile(i)}><IconTrash size={16} aria-hidden="true" /></button
								>
							{/if}
						</div>
						<label for="file-content-{i}" class="sr-only">Contenido de {file.path}</label>
						<textarea
							id="file-content-{i}"
							bind:value={file.content}
							rows={i === 0 ? 12 : 6}
							spellcheck="false"
							aria-invalid={submitted && !!err?.content}
							aria-describedby="file-path-error-{i}"
							class="block [field-sizing:content] min-h-36 w-full resize-y bg-transparent px-4 py-3 font-mono text-[14px] leading-[1.7] text-ink outline-none focus-visible:bg-paper"
						></textarea>
						{#if submitted && (err?.path || err?.content)}
							<p
								id="file-path-error-{i}"
								class="border-t border-rule px-3 py-1.5 font-sans text-[12px] text-danger"
							>
								{err.path || err.content}
							</p>
						{/if}
					</li>
				{/each}
			</ol>

			<div
				role="group"
				aria-label="Añadir archivos"
				ondragover={(e) => {
					e.preventDefault();
					dragging = true;
				}}
				ondragleave={() => (dragging = false)}
				ondrop={(e) => {
					e.preventDefault();
					dragging = false;
					addUploads(e.dataTransfer?.files ?? null);
				}}
				class={[
					'mt-3 flex flex-wrap items-center gap-3 border border-dashed px-4 py-4',
					dragging ? 'border-link bg-link/5' : 'border-ink-faint'
				]}
			>
				<button type="button" class="btn" onclick={addFile} disabled={files.length >= MAX_FILES}>
					<IconPlus size={16} aria-hidden="true" /> Archivo vacío
				</button>
				<label class="btn">
					<IconUpload size={16} aria-hidden="true" /> Subir archivos
					<input
						type="file"
						multiple
						class="sr-only"
						onchange={(e) => {
							addUploads(e.currentTarget.files);
							e.currentTarget.value = '';
						}}
					/>
				</label>
				<span class="font-sans text-[12px] text-ink-faint"
					>o arrástralos aquí · texto, máx. 200 KB cada uno</span
				>
				{#if uploadError}
					<p role="alert" class="w-full font-sans text-[13px] text-danger">{uploadError}</p>
				{/if}
			</div>
			{#if kind === 'prompt'}
				<p class="mt-2 font-sans text-[12px] text-ink-faint">
					Escribe <span class="bg-marker px-0.5 font-mono text-ink">{'{{nombre}}'}</span> para crear
					un hueco que se rellena al usarlo.
					{#if variables.length}Detectadas: {variables.join(', ')}.{/if}
				</p>
			{/if}
		</section>

		<div class="grid gap-7 sm:grid-cols-2">
			<div>
				<label for="editor-category" class="eyebrow text-ink-faint">Tema</label>
				<select id="editor-category" bind:value={category} class="mt-2 field font-sans text-[14px]">
					{#each CATEGORIES as c (c.id)}
						<option value={c.id}>{c.label}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="editor-tags" class="eyebrow text-ink-faint">Etiquetas</label>
				<input
					id="editor-tags"
					bind:value={tagsText}
					placeholder="separadas, por, comas"
					aria-describedby="editor-tags-help"
					class="mt-2 field font-sans text-[14px]"
				/>
				<p id="editor-tags-help" class="mt-1 font-sans text-[11px] text-ink-faint">Hasta 8.</p>
			</div>
		</div>

		<fieldset aria-describedby={submitted && errors.targets ? 'editor-targets-error' : undefined}>
			<legend class="eyebrow text-ink-faint">Funciona con</legend>
			<div class="mt-3 flex flex-wrap gap-2">
				{#each TARGETS as t (t)}
					<label
						class="inline-flex min-h-10 items-center gap-2 border border-rule bg-sheet px-3 font-sans text-[13px] has-checked:border-ink has-checked:bg-marker has-focus-visible:outline-2 has-focus-visible:outline-dotted"
					>
						<input type="checkbox" value={t} bind:group={targets} class="accent-link" />
						{t}
					</label>
				{/each}
			</div>
			{#if submitted && errors.targets}
				<p id="editor-targets-error" class="mt-1.5 font-sans text-[13px] text-danger">
					{errors.targets}
				</p>
			{/if}
		</fieldset>

		<fieldset>
			<legend class="eyebrow text-ink-faint">Quién puede verlo</legend>
			<div class="mt-3 grid gap-2">
				{#each Object.entries(VISIBILITY) as [value, info] (value)}
					<label
						class={[
							'flex items-start gap-3 border px-4 py-3 has-focus-visible:outline-2 has-focus-visible:outline-dotted',
							visibility === value
								? value === 'burn'
									? 'border-danger bg-danger-soft'
									: 'border-ink bg-sheet'
								: 'border-rule'
						]}
					>
						<input
							type="radio"
							name="visibility"
							{value}
							bind:group={visibility}
							class="mt-1.5 accent-link"
						/>
						<span>
							<span class="block font-sans text-[14px] font-bold">{info.label}</span>
							<span class="block text-[14px] text-ink-soft">{info.hint}</span>
						</span>
					</label>
				{/each}
			</div>
		</fieldset>

		<div class="flex flex-wrap items-center gap-3 border-t border-rule pt-6">
			<button type="submit" class="btn min-h-12 btn-primary px-6">
				{mode === 'create' ? 'Publicar' : 'Guardar cambios'}
			</button>
			<button type="button" class="btn min-h-12" onclick={oncancel}>Cancelar</button>
			<span class="font-sans text-[12px] text-ink-faint"><kbd>Ctrl</kbd> + <kbd>S</kbd></span>
			{#if submitted && !valid}
				<p role="alert" class="w-full font-sans text-[13px] text-danger">
					Revisa los campos marcados antes de guardar.
				</p>
			{/if}
		</div>
	</div>

	<aside aria-label="Vista previa" class="min-w-0 lg:sticky lg:top-6 lg:self-start">
		<div role="tablist" aria-label="Modo del panel" class="flex gap-6 border-b border-rule">
			<button
				type="button"
				role="tab"
				id="tab-preview"
				aria-selected={tab === 'preview'}
				aria-controls="panel-preview"
				onclick={() => (tab = 'preview')}
				class={[
					'-mb-px border-b-2 pb-2 font-sans text-[13px] font-bold',
					tab === 'preview'
						? 'border-link text-ink'
						: 'border-transparent text-ink-faint hover:text-ink'
				]}>Vista previa</button
			>
			{#if kind === 'prompt'}
				<button
					type="button"
					role="tab"
					id="tab-test"
					aria-selected={tab === 'test'}
					aria-controls="panel-test"
					onclick={() => (tab = 'test')}
					class={[
						'-mb-px border-b-2 pb-2 font-sans text-[13px] font-bold',
						tab === 'test'
							? 'border-link text-ink'
							: 'border-transparent text-ink-faint hover:text-ink'
					]}>Probar borrador</button
				>
			{/if}
		</div>

		{#if tab === 'test' && kind === 'prompt'}
			<div id="panel-test" role="tabpanel" aria-labelledby="tab-test" class="pt-6">
				<TestBench
					body={files[0]?.content ?? ''}
					{category}
					models={targets}
					idPrefix="draft"
					stacked
				/>
			</div>
		{:else}
			<div id="panel-preview" role="tabpanel" aria-labelledby="tab-preview" class="grid gap-6 pt-6">
				<div class="pointer-events-none" inert>
					<EntryCard entry={preview} />
				</div>
				<FileBrowser files={files.filter((f) => f.content.trim())} />
				{#if dirty}
					<p class="font-sans text-[12px] text-ink-faint">● Cambios sin guardar</p>
				{/if}
			</div>
		{/if}
	</aside>
</form>
