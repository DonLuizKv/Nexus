<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import IconSearch from '@tabler/icons-svelte-runes/icons/search';
	import IconPlus from '@tabler/icons-svelte-runes/icons/plus';
	import IconDice from '@tabler/icons-svelte-runes/icons/arrows-shuffle';
	import IconLogin from '@tabler/icons-svelte-runes/icons/login';
	import { auth } from '#lib/auth.svelte';
	import { KINDS, KIND_IDS } from '#lib/entries/catalog';
	import { library } from '#lib/entries/library.svelte';
	import { compact } from '#lib/entries/text';
	import Avatar from './Avatar.svelte';
	import Wordmark from './Wordmark.svelte';

	interface Props {
		hero?: boolean;
	}

	let { hero = false }: Props = $props();

	let searchInput = $state<HTMLInputElement>();

	const onSearchPage = $derived(page.route.id === '/buscar');
	const total = $derived(library.publicEntries.length);
	const uses = $derived(library.entries.reduce((sum, e) => sum + e.uses, 0));
	const user = $derived(auth.user);

	const links = [
		{ href: resolve('/'), label: 'Inicio', id: '/' },
		{ href: resolve('/buscar'), label: 'Explorar', id: '/buscar' }
	];

	function lucky() {
		const pick = library.random();
		if (pick) goto(resolve('/p/[slug]', { slug: pick.slug }));
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return;
		const target = event.target as HTMLElement | null;
		if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
		const field =
			searchInput ?? document.querySelector<HTMLInputElement>('input[type="search"][name="q"]');
		if (!field) return;
		event.preventDefault();
		field.focus();
		field.select();
	}
</script>

<svelte:window {onkeydown} />

<header class={['relative isolate overflow-hidden sky', hero && 'motion-safe:animate-drift']}>
	<!-- Navy wash keeps white text readable over bright clouds. -->
	<div
		aria-hidden="true"
		class="absolute inset-0 -z-10"
		style="background: {hero
			? 'linear-gradient(100deg, rgb(10 36 90 / 0.8) 0%, rgb(10 36 90 / 0.52) 45%, rgb(10 36 90 / 0.18) 100%)'
			: 'rgb(10 36 90 / 0.64)'}"
	></div>

	<div class="mx-auto max-w-[1180px] px-5 sm:px-8">
		<nav
			aria-label="Principal"
			class="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4"
		>
			{#if hero}
				<span class="font-sans text-[12px] font-bold tracking-[0.14em] text-white/85 uppercase">
					Almanaque de IA · desde 2026
				</span>
			{:else}
				<a href={resolve('/')} class="no-underline" aria-label="Nexus, ir al inicio">
					<Wordmark />
				</a>
			{/if}

			<ul class="flex flex-wrap items-center gap-x-1 gap-y-2 font-sans text-[13px]">
				{#each links as link (link.id)}
					{@const current = page.route.id === link.id}
					<li class="flex items-center">
						<a
							href={link.href}
							aria-current={current ? 'page' : undefined}
							class={[
								'px-2 py-2 text-white visited:text-white',
								current ? 'font-bold no-underline' : 'decoration-white/50'
							]}>{link.label}</a
						>
						<span aria-hidden="true" class="text-white/40">·</span>
					</li>
				{/each}
				<li class="flex items-center">
					{#if user}
						<a
							href={resolve('/u/[handle]', { handle: user.handle })}
							class="inline-flex items-center gap-2 px-2 py-1.5 text-white visited:text-white"
							aria-current={page.params.handle === user.handle ? 'page' : undefined}
						>
							<Avatar handle={user.handle} />
							<span>{user.handle}</span>
						</a>
					{:else if auth.ready}
						<a
							href={resolve('/entrar')}
							class="inline-flex items-center gap-1.5 px-2 py-2 text-white visited:text-white"
						>
							<IconLogin size={16} aria-hidden="true" /> Entrar
						</a>
					{/if}
				</li>
				<li class="ml-2">
					<a href={resolve('/nuevo')} class="btn min-h-9 py-1.5">
						<IconPlus size={16} stroke={2.25} aria-hidden="true" /> Publicar
					</a>
				</li>
			</ul>
		</nav>

		{#if hero}
			<div class="pt-10 pb-14 sm:pt-14 sm:pb-20">
				<h1 class="motion-safe:animate-rise">
					<Wordmark size="lg" />
					<span class="sr-only">: almanaque de prompts, skills y agentes de IA</span>
				</h1>
				<p
					class="mt-5 max-w-[34ch] font-serif text-[clamp(1.25rem,2.4vw,1.6rem)] leading-snug text-white motion-safe:animate-rise"
					style="animation-delay: 80ms; text-shadow: 1px 1px 0 #0f3a7d"
				>
					Prompts, skills, subagentes, ajustes y contextos que alguien ya afinó. Cópialos o
					instálalos en tu proyecto.
				</p>

				<form
					action={resolve('/buscar')}
					method="GET"
					role="search"
					class="mt-9 max-w-[660px] motion-safe:animate-rise"
					style="animation-delay: 160ms"
				>
					<label for="hero-q" class="eyebrow text-white">Buscar en {total} entradas</label>
					<div class="mt-2 flex flex-col gap-2 sm:flex-row">
						<input
							bind:this={searchInput}
							id="hero-q"
							name="q"
							type="search"
							autocomplete="off"
							placeholder="p. ej. code review, AGENTS.md, tests, JSON…"
							class="field min-h-12 flex-1 border-ink text-[17px]"
						/>
						<button type="submit" class="btn min-h-12 btn-primary px-6">
							<IconSearch size={18} aria-hidden="true" /> Buscar
						</button>
						<button type="button" class="btn min-h-12" onclick={lucky}>
							<IconDice size={18} aria-hidden="true" /> Voy a tener suerte
						</button>
					</div>
					<p class="mt-3 font-sans text-[12px] text-white/85">
						Pulsa <kbd class="border-white/70 text-white">/</kbd> desde cualquier página para buscar
						· {compact(uses)} copias y descargas
					</p>
				</form>

				<ul
					aria-label="Explorar por tipo"
					class="mt-8 flex flex-wrap gap-2 motion-safe:animate-rise"
					style="animation-delay: 220ms"
				>
					{#each KIND_IDS as kind (kind)}
						{@const info = KINDS[kind]}
						<li>
							<a
								href={resolve(`/buscar?tipo=${kind}`)}
								class={[
									'inline-flex min-h-9 items-center gap-1.5 px-3 font-sans text-[12px] font-bold text-white no-underline visited:text-white hover:brightness-110',
									info.bg
								]}
							>
								<info.icon size={16} aria-hidden="true" />
								{info.plural}
								<span class="font-normal text-white/80">{library.count({ kind })}</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{:else if !onSearchPage}
			<form action={resolve('/buscar')} method="GET" role="search" class="pb-4">
				<label for="bar-q" class="sr-only">Buscar</label>
				<div class="flex max-w-[520px] gap-2">
					<input
						bind:this={searchInput}
						id="bar-q"
						name="q"
						type="search"
						autocomplete="off"
						placeholder="Buscar prompts, skills, agentes…  ( / )"
						class="field min-h-10 flex-1 border-ink py-1.5 text-[15px]"
					/>
					<button type="submit" class="btn min-h-10 btn-primary" aria-label="Buscar">
						<IconSearch size={18} aria-hidden="true" />
					</button>
				</div>
			</form>
		{/if}
	</div>
</header>
