<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>Error {page.status} · Nexus</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="mx-auto max-w-[720px] px-5 py-24 text-center sm:px-8">
	<p class="font-mono text-[14px] text-ink-faint">Error {page.status}</p>
	<h1 class="mt-3 font-serif text-[40px] leading-tight font-bold">
		{page.status === 404 ? 'Esta página no existe.' : 'Algo se rompió por aquí.'}
	</h1>
	{#if page.error?.message && page.status !== 404}
		<p class="mt-4 text-[17px] text-ink-soft">{page.error.message}</p>
	{/if}
	<div class="mt-8 flex flex-wrap justify-center gap-2">
		<a href={resolve('/buscar')} class="btn btn-primary">Buscar prompts</a>
		<a href={resolve('/')} class="btn">Volver al inicio</a>
	</div>
</div>
