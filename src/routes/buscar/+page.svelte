<script lang="ts">
	import { afterNavigate, goto, replaceState } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import IconSearch from '@tabler/icons-svelte-runes/icons/search';
	import IconX from '@tabler/icons-svelte-runes/icons/x';
	import IconPlus from '@tabler/icons-svelte-runes/icons/plus';
	import EntryCard from '#lib/components/EntryCard.svelte';
	import { CATEGORIES, KINDS, KIND_IDS, TARGETS, categoryLabel } from '#lib/entries/catalog';
	import { library, type SortKey } from '#lib/entries/library.svelte';
	import type { CategoryId, Kind } from '#lib/entries/types';

	const SORTS: { id: SortKey; label: string }[] = [
		{ id: 'relevance', label: 'Relevancia' },
		{ id: 'recent', label: 'Más recientes' },
		{ id: 'stars', label: 'Más estrellas' },
		{ id: 'uses', label: 'Más usados' }
	];

	function fromUrl(url: { searchParams: Pick<URLSearchParams, 'get'> }) {
		const p = url.searchParams;
		const tipo = p.get('tipo') ?? '';
		const tema = p.get('tema') ?? '';
		const para = p.get('para') ?? '';
		const orden = p.get('orden') as SortKey | null;
		return {
			query: p.get('q') ?? '',
			kind: (KIND_IDS.includes(tipo as Kind) ? tipo : '') as Kind | '',
			category: (CATEGORIES.some((c) => c.id === tema) ? tema : '') as CategoryId | '',
			target: TARGETS.includes(para) ? para : '',
			sort: SORTS.some((s) => s.id === orden) ? (orden as SortKey) : 'relevance'
		};
	}

	const initial = fromUrl(page.url);
	let query = $state(initial.query);
	let kind = $state<Kind | ''>(initial.kind);
	let category = $state<CategoryId | ''>(initial.category);
	let target = $state(initial.target);
	let sort = $state<SortKey>(initial.sort);
	let mounted = false;

	const results = $derived(library.search({ query, kind, category, target, sort }));
	const hasFilters = $derived(!!(query || kind || category || target));

	// Real navigations (e.g. clicking a kind link in the header) reset the controls from the URL.
	afterNavigate(({ type }) => {
		mounted = true;
		if (type === 'enter') return;
		({ query, kind, category, target, sort } = fromUrl(page.url));
	});

	// Keep the address bar shareable without adding history entries per keystroke.
	$effect(() => {
		const pairs: [string, string][] = [
			['q', query.trim()],
			['tipo', kind],
			['tema', category],
			['para', target],
			['orden', sort === 'relevance' ? '' : sort]
		];
		const search = pairs
			.filter(([, value]) => value)
			.map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
			.join('&');
		if (!mounted) return;
		const timer = setTimeout(() => {
			if (search) replaceState(resolve(`/buscar?${search}`), {});
			else replaceState(resolve('/buscar'), {});
		}, 250);
		return () => clearTimeout(timer);
	});

	function clear() {
		query = '';
		kind = '';
		category = '';
		target = '';
		sort = 'relevance';
		document.getElementById('search-q')?.focus();
	}

	function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		const first = results[0];
		// Enter on a query with a single hit opens it directly.
		if (results.length === 1 && first) goto(resolve('/p/[slug]', { slug: first.slug }));
	}
</script>

<svelte:head>
	<title>{query ? `${query} · ` : ''}Explorar · Nexus</title>
</svelte:head>

<div class="mx-auto max-w-[1180px] px-5 sm:px-8">
	<form role="search" class="border-b-2 border-ink pt-12 pb-8" {onsubmit}>
		<label for="search-q" class="font-serif text-[32px] leading-none font-bold sm:text-[40px]"
			>Explorar</label
		>
		<div class="mt-5 flex flex-col gap-2 sm:flex-row">
			<input
				id="search-q"
				name="q"
				type="search"
				bind:value={query}
				autocomplete="off"
				placeholder="Título, etiqueta, autor, ruta de archivo o cualquier palabra"
				aria-describedby="search-help"
				class="field min-h-12 flex-1 border-ink text-[18px]"
			/>
			<button type="submit" class="btn min-h-12 btn-primary px-6">
				<IconSearch size={18} aria-hidden="true" /> Buscar
			</button>
		</div>
		<p id="search-help" class="mt-2 font-sans text-[12px] text-ink-faint">
			Busca también dentro de los archivos. Los resultados se actualizan mientras escribes.
		</p>

		<fieldset class="mt-6">
			<legend class="sr-only">Tipo</legend>
			<div class="flex flex-wrap gap-2">
				<label
					class="inline-flex min-h-9 items-center gap-1.5 border border-rule bg-sheet px-3 font-sans text-[13px] font-bold has-checked:border-ink has-checked:bg-ink has-checked:text-paper has-focus-visible:outline-2 has-focus-visible:outline-dotted"
				>
					<input type="radio" name="tipo" value="" bind:group={kind} class="sr-only" />
					Todo
				</label>
				{#each KIND_IDS as k (k)}
					{@const info = KINDS[k]}
					<label
						class={[
							'inline-flex min-h-9 items-center gap-1.5 border px-3 font-sans text-[13px] font-bold has-focus-visible:outline-2 has-focus-visible:outline-dotted',
							kind === k
								? [info.bg, info.border, 'text-white']
								: ['border-rule bg-sheet', info.text]
						]}
					>
						<input type="radio" name="tipo" value={k} bind:group={kind} class="sr-only" />
						<info.icon size={16} aria-hidden="true" />
						{info.plural}
						<span class={kind === k ? 'font-normal text-white/80' : 'font-normal text-ink-faint'}
							>{library.count({ kind: k })}</span
						>
					</label>
				{/each}
			</div>
		</fieldset>
	</form>

	<div class="grid gap-10 pt-8 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-12">
		<aside aria-label="Filtros" class="lg:sticky lg:top-6 lg:self-start">
			<fieldset>
				<legend class="eyebrow text-ink-faint">Tema</legend>
				<ul class="mt-3 flex flex-wrap gap-x-4 gap-y-1 lg:block lg:space-y-1">
					<li>
						<label class="inline-flex min-h-8 items-center gap-2 text-[15px]">
							<input type="radio" name="tema" value="" bind:group={category} class="accent-link" />
							Todos
						</label>
					</li>
					{#each CATEGORIES as c (c.id)}
						<li>
							<label class="inline-flex min-h-8 items-center gap-2 text-[15px]">
								<input
									type="radio"
									name="tema"
									value={c.id}
									bind:group={category}
									class="accent-link"
								/>
								{c.label}
								<span class="font-sans text-[12px] text-ink-faint"
									>({library.count({ category: c.id })})</span
								>
							</label>
						</li>
					{/each}
				</ul>
			</fieldset>

			<div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
				<div>
					<label for="filter-target" class="eyebrow text-ink-faint">Funciona con</label>
					<select id="filter-target" bind:value={target} class="mt-2 field font-sans text-[14px]">
						<option value="">Cualquiera</option>
						{#each TARGETS as t (t)}
							<option value={t}>{t}</option>
						{/each}
					</select>
				</div>
				<div>
					<label for="filter-sort" class="eyebrow text-ink-faint">Ordenar por</label>
					<select id="filter-sort" bind:value={sort} class="mt-2 field font-sans text-[14px]">
						{#each SORTS as s (s.id)}
							<option value={s.id}>{s.label}</option>
						{/each}
					</select>
				</div>
			</div>

			{#if hasFilters}
				<button type="button" class="mt-6 btn w-full" onclick={clear}>
					<IconX size={16} aria-hidden="true" /> Limpiar filtros
				</button>
			{/if}
		</aside>

		<section aria-labelledby="results-title">
			<h2 id="results-title" aria-live="polite" class="font-sans text-[13px] text-ink-faint">
				<strong class="text-ink">{results.length}</strong>
				{results.length === 1 ? 'resultado' : 'resultados'}{#if kind}
					· {KINDS[kind].plural}{/if}{#if query.trim()}
					para «<span class="text-ink">{query.trim()}</span>»{/if}{#if category}
					en {categoryLabel(category)}{/if}{#if target}
					· {target}{/if}
			</h2>

			{#if results.length}
				<div class="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
					{#each results as entry, i (entry.slug)}
						<EntryCard {entry} {query} index={i} />
					{/each}
				</div>
			{:else}
				<div class="mt-8 border border-dashed border-ink-faint p-10 text-center">
					<p class="font-serif text-[24px] font-bold">Nada por aquí todavía.</p>
					<p class="mx-auto mt-2 max-w-[44ch] text-[16px] text-ink-soft">
						Prueba con menos palabras o quita algún filtro. Si nadie lo ha publicado, quizá te toque
						a ti.
					</p>
					<div class="mt-6 flex flex-wrap justify-center gap-2">
						<button type="button" class="btn" onclick={clear}>Limpiar filtros</button>
						<a href={resolve('/nuevo')} class="btn btn-primary">
							<IconPlus size={16} aria-hidden="true" /> Publicarlo
						</a>
					</div>
				</div>
			{/if}
		</section>
	</div>
</div>
