<script lang="ts">
	import { resolve } from '$app/paths';
	import IconArrowRight from '@tabler/icons-svelte-runes/icons/arrow-right';
	import IconPlayerPause from '@tabler/icons-svelte-runes/icons/player-pause';
	import IconPlayerPlay from '@tabler/icons-svelte-runes/icons/player-play';
	import IconPlus from '@tabler/icons-svelte-runes/icons/plus';
	import EntryCard from '#lib/components/EntryCard.svelte';
	import { KINDS, KIND_IDS } from '#lib/entries/catalog';
	import { library } from '#lib/entries/library.svelte';
	import { relativeDate } from '#lib/entries/text';

	const recent = $derived(library.search({ sort: 'recent' }).slice(0, 6));
	const top = $derived(library.search({ sort: 'uses' }).slice(0, 4));
	const activity = $derived(
		library
			.search({ sort: 'recent' })
			.slice(0, 8)
			.map((e) => ({
				slug: e.slug,
				text: `${e.author} publicó ${KINDS[e.kind].label.toLowerCase()} «${e.title}»`,
				when: relativeDate(e.updatedAt)
			}))
	);

	let paused = $state(false);
</script>

<svelte:head>
	<title>Nexus · Almanaque de prompts, skills y agentes de IA</title>
	<meta
		name="description"
		content="Comparte e instala prompts, skills, subagentes, ajustes y contextos para tu IA."
	/>
</svelte:head>

<!-- Activity ticker: an old-web marquee, pausable (WCAG 2.2.2) and static under reduced motion. -->
<section aria-label="Actividad reciente" class="border-b border-rule bg-paper-deep">
	<div class="mx-auto flex max-w-[1180px] items-center gap-4 px-5 sm:px-8">
		<p class="shrink-0 py-3 eyebrow text-ok">● Ahora</p>
		<div
			class="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_4%,#000_96%,transparent)] py-3"
		>
			<ul
				class={[
					'flex w-max gap-10 font-sans text-[13px] text-ink-soft focus-within:[animation-play-state:paused] hover:[animation-play-state:paused] motion-safe:animate-marquee',
					paused && '[animation-play-state:paused]'
				]}
			>
				{#each [0, 1] as copy (copy)}
					{#each activity as item (item.slug)}
						<li class="whitespace-nowrap" aria-hidden={copy === 1 ? 'true' : undefined}>
							<a
								href={resolve('/p/[slug]', { slug: item.slug })}
								tabindex={copy === 1 ? -1 : undefined}
								class="text-ink-soft visited:text-ink-soft">{item.text}</a
							>
							<span class="text-ink-faint">· {item.when}</span>
						</li>
					{/each}
				{/each}
			</ul>
		</div>
		<button
			type="button"
			class="inline-flex shrink-0 items-center gap-1 py-3 font-sans text-[12px] text-link underline motion-reduce:hidden"
			aria-pressed={paused}
			onclick={() => (paused = !paused)}
		>
			{#if paused}
				<IconPlayerPlay size={14} aria-hidden="true" /> Reanudar
			{:else}
				<IconPlayerPause size={14} aria-hidden="true" /> Pausar
			{/if}
		</button>
	</div>
</section>

<div class="mx-auto max-w-[1180px] px-5 sm:px-8">
	<section aria-labelledby="recent-title" class="pt-16">
		<div class="flex items-baseline justify-between gap-4 border-b-2 border-ink pb-3">
			<h2 id="recent-title" class="font-serif text-[32px] leading-none font-bold">
				Recién publicados
			</h2>
			<a
				href={resolve('/buscar?orden=recent')}
				class="inline-flex items-center gap-1 font-sans text-[13px]"
				>Ver todo <IconArrowRight size={14} aria-hidden="true" /></a
			>
		</div>
		<div class="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
			{#each recent as entry, i (entry.slug)}
				<EntryCard {entry} index={i} />
			{/each}
		</div>
	</section>

	<section aria-labelledby="kinds-title" class="pt-24">
		<div class="grid gap-3 border-b-2 border-ink pb-3 sm:grid-cols-[1fr_auto] sm:items-baseline">
			<h2 id="kinds-title" class="font-serif text-[32px] leading-none font-bold">
				Más que texto para pegar
			</h2>
			<p class="font-sans text-[13px] text-ink-faint">Cada color es un tipo de entrada</p>
		</div>
		<ul class="grid sm:grid-cols-2 lg:grid-cols-3">
			{#each KIND_IDS as kind, i (kind)}
				{@const info = KINDS[kind]}
				<li
					class={[
						'border-b border-rule py-7 sm:pr-8',
						i % 3 !== 0 && 'lg:border-l lg:pl-8',
						i % 2 === 1 && 'sm:max-lg:border-l sm:max-lg:pl-8'
					]}
				>
					<a
						href={resolve(`/buscar?tipo=${kind}`)}
						class={['group inline-flex items-center gap-2.5 no-underline', info.text]}
					>
						<span class={['inline-flex h-10 w-10 items-center justify-center text-white', info.bg]}>
							<info.icon size={22} aria-hidden="true" />
						</span>
						<span
							class="font-serif text-[22px] font-bold underline decoration-1 underline-offset-2 group-hover:decoration-2"
							>{info.plural}</span
						>
						<span class="font-sans text-[13px] text-ink-faint">({library.count({ kind })})</span>
					</a>
					<p class="mt-2 text-[15px] text-ink-soft">{info.hint}</p>
				</li>
			{/each}
		</ul>
	</section>

	<section aria-labelledby="top-title" class="pt-24">
		<div class="border-b-2 border-ink pb-3">
			<h2 id="top-title" class="font-serif text-[32px] leading-none font-bold">Lo más usado</h2>
		</div>
		<ol class="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
			{#each top as entry, i (entry.slug)}
				<li class="flex"><EntryCard {entry} rank={i + 1} index={i} /></li>
			{/each}
		</ol>
	</section>

	<section
		aria-labelledby="publish-title"
		class="mt-24 grid gap-6 border border-ink bg-sheet p-8 shadow-[6px_6px_0_rgb(15_58_125/0.25)] sm:grid-cols-[1fr_auto] sm:items-center sm:p-10"
	>
		<div>
			<h2 id="publish-title" class="font-serif text-[28px] leading-tight font-bold">
				¿Tienes algo que funciona?
			</h2>
			<p class="mt-2 max-w-[56ch] text-[16px] text-ink-soft">
				Un prompt, una skill, el AGENTS.md de tu equipo o el subagente que revisa por ti. Súbelo con
				sus archivos y cualquiera podrá instalarlo en un paso.
			</p>
		</div>
		<a href={resolve('/nuevo')} class="btn min-h-12 btn-primary px-6">
			<IconPlus size={18} aria-hidden="true" /> Publicar
		</a>
	</section>
</div>
