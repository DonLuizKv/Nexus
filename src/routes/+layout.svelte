<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import { asset } from '$app/paths';
	import { page } from '$app/state';
	import Masthead from '#lib/components/Masthead.svelte';
	import SiteFooter from '#lib/components/SiteFooter.svelte';
	import { notice } from '#lib/notice.svelte';
	import { auth } from '#lib/auth.svelte';
	import { library } from '#lib/entries/library.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	onMount(() => {
		library.load();
		auth.load();
	});
</script>

<svelte:head>
	<!-- static/ files are served as-is; importing them as modules breaks hydration in dev. -->
	<link rel="icon" href={asset('images/favicon.svg')} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="theme-color" content="#2f6fc2" />
</svelte:head>

<a
	href="#contenido"
	class="sr-only z-50 bg-marker px-4 py-2 font-sans text-[14px] font-bold text-ink focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
	>Saltar al contenido</a
>

<Masthead hero={page.route.id === '/'} />

<main id="contenido" tabindex="-1" class="outline-none">
	{@render children()}
</main>

<SiteFooter />

<!-- Global status line, e.g. "Copiado al portapapeles". -->
<div
	role="status"
	aria-live="polite"
	class={[
		'pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4 transition-[opacity,transform] duration-200',
		notice.message ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
	]}
>
	{#if notice.message}
		<p
			class="border border-ink bg-ink px-4 py-2 font-sans text-[13px] font-bold text-paper shadow-[4px_4px_0_rgb(15_58_125/0.35)]"
		>
			✓ {notice.message}
		</p>
	{/if}
</div>
