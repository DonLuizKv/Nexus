<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import IconLogout from '@tabler/icons-svelte-runes/icons/logout';
	import IconPlus from '@tabler/icons-svelte-runes/icons/plus';
	import IconEdit from '@tabler/icons-svelte-runes/icons/edit';
	import IconCalendar from '@tabler/icons-svelte-runes/icons/calendar';
	import Avatar from '#lib/components/Avatar.svelte';
	import EntryCard from '#lib/components/EntryCard.svelte';
	import { auth } from '#lib/auth.svelte';
	import { KINDS, KIND_IDS } from '#lib/entries/catalog';
	import { library } from '#lib/entries/library.svelte';
	import { compact, formatDate, plural } from '#lib/entries/text';
	import { notice } from '#lib/notice.svelte';

	const handle = $derived(page.params.handle ?? '');
	const profile = $derived(auth.profile(handle));
	const isMe = $derived(auth.user?.handle === handle);

	// UI state is scoped to the profile it was set on, so it resets when moving between users.
	let ui = $state({ for: '', tab: 'published' as 'published' | 'starred', editingBio: false });
	const tab = $derived(ui.for === handle ? ui.tab : 'published');
	const editingBio = $derived(ui.for === handle && ui.editingBio);
	let bio = $state('');

	function setUi(patch: Partial<Omit<typeof ui, 'for'>>) {
		ui = {
			...ui,
			...(ui.for === handle ? {} : { tab: 'published', editingBio: false }),
			...patch,
			for: handle
		};
	}

	const published = $derived(library.byAuthor(handle, isMe));
	const starred = $derived(isMe ? library.starredBy(handle) : []);
	const shown = $derived(tab === 'starred' ? starred : published);
	const stats = $derived({
		stars: published.reduce((s, e) => s + e.stars, 0),
		uses: published.reduce((s, e) => s + e.uses, 0)
	});
	const mix = $derived(
		KIND_IDS.map((k) => ({ kind: k, n: published.filter((e) => e.kind === k).length })).filter(
			(m) => m.n > 0
		)
	);

	function saveBio(event: SubmitEvent) {
		event.preventDefault();
		auth.updateBio(bio);
		setUi({ editingBio: false });
		notice.show('Perfil actualizado');
	}

	function logout() {
		auth.logout();
		notice.show('Has cerrado sesión');
		goto(resolve('/'));
	}
</script>

<svelte:head>
	<title>{profile?.name ?? handle} · Nexus</title>
</svelte:head>

<div class="mx-auto max-w-[1180px] px-5 sm:px-8">
	{#if !auth.ready || !library.ready}
		<p class="py-24 text-center font-sans text-[14px] text-ink-faint">Cargando…</p>
	{:else if !profile}
		<div class="py-24 text-center">
			<p class="font-mono text-[14px] text-ink-faint">Error 404</p>
			<h1 class="mt-3 font-serif text-[36px] font-bold">No hay nadie llamado «{handle}».</h1>
			<p class="mt-6"><a href={resolve('/buscar')} class="btn btn-primary">Explorar</a></p>
		</div>
	{:else}
		<header
			class="grid gap-8 border-b-2 border-ink pt-14 pb-10 md:grid-cols-[auto_1fr_auto] md:items-end"
		>
			<Avatar handle={profile.handle} size="lg" />
			<div class="min-w-0">
				<p class="font-mono text-[14px] text-ink-faint">nexus.app/u/{profile.handle}</p>
				<h1 class="mt-1 font-serif text-[clamp(2.2rem,5vw,3.4rem)] leading-none font-bold">
					{profile.name}
				</h1>
				{#if editingBio}
					<form onsubmit={saveBio} class="mt-4 flex max-w-[560px] flex-col gap-2 sm:flex-row">
						<label for="bio" class="sr-only">Biografía</label>
						<input id="bio" bind:value={bio} maxlength="160" class="field font-sans text-[14px]" />
						<button type="submit" class="btn btn-primary">Guardar</button>
						<button type="button" class="btn" onclick={() => setUi({ editingBio: false })}
							>Cancelar</button
						>
					</form>
				{:else}
					<p class="mt-3 max-w-[60ch] text-[17px] text-ink-soft">
						{profile.bio || (isMe ? 'Todavía no has escrito nada sobre ti.' : '')}
						{#if isMe}
							<button
								type="button"
								class="ml-1 inline-flex items-center gap-1 font-sans text-[12px] text-link underline"
								onclick={() => {
									bio = profile.bio;
									setUi({ editingBio: true });
								}}><IconEdit size={14} aria-hidden="true" /> Editar</button
							>
						{/if}
					</p>
				{/if}
				<p class="mt-3 inline-flex items-center gap-1.5 font-sans text-[12px] text-ink-faint">
					<IconCalendar size={14} aria-hidden="true" /> En Nexus desde {formatDate(
						profile.joinedAt
					)}
				</p>
			</div>
			{#if isMe}
				<div class="flex flex-wrap gap-2">
					<a href={resolve('/nuevo')} class="btn btn-primary">
						<IconPlus size={16} aria-hidden="true" /> Publicar
					</a>
					<button type="button" class="btn" onclick={logout}>
						<IconLogout size={16} aria-hidden="true" /> Salir
					</button>
				</div>
			{/if}
		</header>

		<!-- Stats as a ledger row; the bar shows what kind of things this person shares. -->
		<section
			aria-label="Resumen"
			class="grid gap-6 border-b border-rule py-6 sm:grid-cols-[auto_auto_auto_1fr] sm:gap-12"
		>
			<p>
				<span class="block font-serif text-[32px] leading-none font-bold">{published.length}</span>
				<span class="font-sans text-[12px] text-ink-faint">entradas</span>
			</p>
			<p>
				<span class="block font-serif text-[32px] leading-none font-bold"
					>{compact(stats.stars)}</span
				>
				<span class="font-sans text-[12px] text-ink-faint">estrellas recibidas</span>
			</p>
			<p>
				<span class="block font-serif text-[32px] leading-none font-bold"
					>{compact(stats.uses)}</span
				>
				<span class="font-sans text-[12px] text-ink-faint">copias y descargas</span>
			</p>
			{#if mix.length}
				<div class="self-center">
					<div class="flex h-3 overflow-hidden border border-rule" aria-hidden="true">
						{#each mix as m (m.kind)}
							<span class={KINDS[m.kind].bg} style="flex: {m.n}"></span>
						{/each}
					</div>
					<ul class="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-sans text-[12px] text-ink-soft">
						{#each mix as m (m.kind)}
							<li class="inline-flex items-center gap-1.5">
								<span aria-hidden="true" class={['h-2.5 w-2.5', KINDS[m.kind].bg]}></span>
								{plural(m.n, KINDS[m.kind].label.toLowerCase(), KINDS[m.kind].plural.toLowerCase())}
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</section>

		{#if isMe}
			<div role="tablist" aria-label="Colecciones" class="mt-8 flex gap-6 border-b border-rule">
				{#each [{ id: 'published', label: 'Publicado', n: published.length }, { id: 'starred', label: 'Con estrella', n: starred.length }] as t (t.id)}
					<button
						type="button"
						role="tab"
						id="tab-{t.id}"
						aria-selected={tab === t.id}
						aria-controls="collection"
						onclick={() => setUi({ tab: t.id as typeof tab })}
						class={[
							'-mb-px border-b-2 pb-2 font-sans text-[13px] font-bold',
							tab === t.id
								? 'border-link text-ink'
								: 'border-transparent text-ink-faint hover:text-ink'
						]}>{t.label} <span class="font-normal text-ink-faint">{t.n}</span></button
					>
				{/each}
			</div>
		{:else}
			<h2 class="mt-10 font-serif text-[28px] leading-none font-bold">Publicado</h2>
		{/if}

		<section
			id="collection"
			role={isMe ? 'tabpanel' : undefined}
			aria-labelledby={isMe ? `tab-${tab}` : undefined}
			aria-label={isMe ? undefined : 'Publicado'}
		>
			{#if shown.length}
				<div class="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
					{#each shown as entry, i (entry.slug)}
						<EntryCard {entry} index={i} />
					{/each}
				</div>
			{:else}
				<div class="mt-8 border border-dashed border-ink-faint p-10 text-center">
					<p class="font-serif text-[22px] font-bold">
						{tab === 'starred'
							? 'Aún no has dado ninguna estrella.'
							: isMe
								? 'Todavía no has publicado nada.'
								: `${profile.name} todavía no ha publicado nada.`}
					</p>
					{#if isMe}
						<p class="mt-6">
							{#if tab === 'starred'}
								<a href={resolve('/buscar')} class="btn">Explorar</a>
							{:else}
								<a href={resolve('/nuevo')} class="btn btn-primary"
									><IconPlus size={16} aria-hidden="true" /> Publicar lo primero</a
								>
							{/if}
						</p>
					{/if}
				</div>
			{/if}
		</section>
	{/if}
</div>
