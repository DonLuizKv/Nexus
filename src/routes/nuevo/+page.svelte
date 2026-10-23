<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import AuthGate from '#lib/components/AuthGate.svelte';
	import EntryEditor from '#lib/components/EntryEditor.svelte';
	import { auth } from '#lib/auth.svelte';
	import { library } from '#lib/entries/library.svelte';
	import type { EntryDraft } from '#lib/entries/types';
	import { notice } from '#lib/notice.svelte';

	const blank: EntryDraft = {
		kind: 'prompt',
		title: '',
		summary: '',
		category: 'codigo',
		tags: [],
		targets: ['ChatGPT', 'Claude'],
		visibility: 'public',
		files: []
	};

	const user = $derived(auth.user);

	function save(draft: EntryDraft) {
		if (!user) return;
		const entry = library.create(draft, user.handle);
		notice.show('Publicado');
		goto(resolve('/p/[slug]', { slug: entry.slug }));
	}
</script>

<svelte:head>
	<title>Publicar · Nexus</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="mx-auto max-w-[1180px] px-5 sm:px-8">
	{#if !auth.ready}
		<p class="py-24 text-center font-sans text-[14px] text-ink-faint">Cargando…</p>
	{:else if !user}
		<AuthGate
			title="Publicar en Nexus"
			reason="Necesitas una cuenta para publicar: así podrás editar y borrar lo tuyo cuando quieras."
		/>
	{:else}
		<header class="border-b-2 border-ink pt-12 pb-6">
			<h1 class="font-serif text-[clamp(2.2rem,5vw,3.2rem)] leading-none font-bold">Publicar</h1>
			<p class="mt-3 max-w-[64ch] text-[17px] text-ink-soft">
				Un prompt o un conjunto de archivos para agentes. Indica la ruta de cada archivo y quien lo
				instale lo tendrá en su sitio con un comando.
			</p>
		</header>
		<div class="pt-10">
			<EntryEditor
				initial={blank}
				mode="create"
				author={user.handle}
				onsave={save}
				oncancel={() => goto(resolve('/'))}
			/>
		</div>
	{/if}
</div>
