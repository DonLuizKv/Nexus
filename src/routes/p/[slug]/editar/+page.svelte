<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import IconChevronLeft from '@tabler/icons-svelte-runes/icons/chevron-left';
	import AuthGate from '#lib/components/AuthGate.svelte';
	import EntryEditor from '#lib/components/EntryEditor.svelte';
	import { auth } from '#lib/auth.svelte';
	import { library, toDraft } from '#lib/entries/library.svelte';
	import type { EntryDraft } from '#lib/entries/types';
	import { notice } from '#lib/notice.svelte';

	const slug = $derived(page.params.slug ?? '');
	const entry = $derived(library.get(slug));
	const user = $derived(auth.user);
	const detail = $derived(resolve('/p/[slug]', { slug }));

	function save(draft: EntryDraft) {
		if (!user || !library.update(slug, draft, user.handle)) {
			notice.show('No tienes permiso para editar esto');
			return;
		}
		notice.show('Cambios guardados');
		goto(detail);
	}
</script>

<svelte:head>
	<title>Editar {entry?.title ?? ''} · Nexus</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="mx-auto max-w-[1180px] px-5 sm:px-8">
	{#if !library.ready || !auth.ready}
		<p class="py-24 text-center font-sans text-[14px] text-ink-faint">Cargando…</p>
	{:else if !entry}
		<div class="py-24 text-center">
			<h1 class="font-serif text-[36px] font-bold">No encontramos esa entrada.</h1>
			<p class="mt-6"><a href={resolve('/buscar')} class="btn btn-primary">Explorar</a></p>
		</div>
	{:else if !user}
		<AuthGate title="Editar «{entry.title}»" reason="Entra con la cuenta que la publicó." />
	{:else if entry.author !== user.handle}
		<div class="mx-auto max-w-[560px] py-20 text-center">
			<h1 class="font-serif text-[36px] leading-tight font-bold">Esta entrada no es tuya.</h1>
			<p class="mt-3 text-[17px] text-ink-soft">
				Solo {entry.author} puede editarla. Puedes descargarla y publicar tu propia versión.
			</p>
			<p class="mt-8"><a href={detail} class="btn btn-primary">Volver a la entrada</a></p>
		</div>
	{:else}
		<header class="border-b-2 border-ink pt-12 pb-6">
			<nav aria-label="Ruta" class="font-sans text-[13px]">
				<a href={detail} class="inline-flex items-center gap-1"
					><IconChevronLeft size={14} aria-hidden="true" /> {entry.title}</a
				>
			</nav>
			<h1 class="mt-3 font-serif text-[clamp(2.2rem,5vw,3.2rem)] leading-none font-bold">Editar</h1>
		</header>
		<div class="pt-10">
			{#key slug}
				<EntryEditor
					initial={toDraft(entry)}
					mode="edit"
					author={user.handle}
					onsave={save}
					oncancel={() => goto(detail)}
				/>
			{/key}
		</div>
	{/if}
</div>
