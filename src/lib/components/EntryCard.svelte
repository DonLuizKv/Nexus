<script lang="ts">
	import { resolve } from '$app/paths';
	import IconStar from '@tabler/icons-svelte-runes/icons/star';
	import IconCopy from '@tabler/icons-svelte-runes/icons/copy';
	import IconFile from '@tabler/icons-svelte-runes/icons/file-text';
	import IconLock from '@tabler/icons-svelte-runes/icons/lock';
	import { KINDS, categoryLabel } from '#lib/entries/catalog';
	import { compact, highlight, relativeDate } from '#lib/entries/text';
	import type { Entry, Kind } from '#lib/entries/types';
	import Avatar from './Avatar.svelte';
	import KindBadge from './KindBadge.svelte';

	interface Props {
		entry: Entry;
		query?: string;
		/** Position in a ranking, shown as a large numeral. */
		rank?: number;
		index?: number;
	}

	let { entry, query = '', rank, index = 0 }: Props = $props();

	// Top edge only; literal strings so Tailwind generates them.
	const EDGE: Record<Kind, string> = {
		prompt: 'border-t-k-prompt',
		skill: 'border-t-k-skill',
		agent: 'border-t-k-agent',
		settings: 'border-t-k-settings',
		context: 'border-t-k-context'
	};

	const info = $derived(KINDS[entry.kind]);
	const title = $derived(highlight(entry.title, query));
	const summary = $derived(highlight(entry.summary, query));
	const main = $derived(entry.files[0]?.path ?? '');
	const extra = $derived(entry.files.length - 1);
</script>

<!-- A folder from the archive: colored tab = kind, the whole card is one link target. -->
<article
	class="group relative flex w-full flex-col pt-[26px] motion-safe:animate-rise"
	style="animation-delay: {Math.min(index, 9) * 40}ms"
>
	<div class="absolute top-0 left-0 flex items-end">
		<KindBadge kind={entry.kind} tone="solid" />
	</div>
	<p class="absolute top-1 right-0 font-sans text-[11px] text-ink-faint">
		{categoryLabel(entry.category)} · {relativeDate(entry.updatedAt)}
	</p>
	<div
		class={[
			'flex flex-1 flex-col border border-t-4 bg-sheet p-5 transition-[transform,box-shadow] duration-150 group-hover:-translate-y-0.5 group-has-focus-visible:-translate-y-0.5',
			'border-rule shadow-[0_1px_0_var(--color-rule)] group-hover:shadow-[5px_5px_0_var(--color-rule)]',
			EDGE[entry.kind]
		]}
	>
		<div class="flex items-start gap-3">
			{#if rank}
				<span
					aria-hidden="true"
					class={['font-serif text-[40px] leading-[0.85] font-bold italic', info.text]}>{rank}</span
				>
			{/if}
			<h3 class="font-serif text-[20px] leading-snug font-bold text-balance">
				<a
					href={resolve('/p/[slug]', { slug: entry.slug })}
					class="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
					>{#if rank}<span class="sr-only"
							>Puesto {rank}:
						</span>{/if}{#each title as part, i (i)}{#if part.hit}<mark
								class="bg-marker text-inherit">{part.value}</mark
							>{:else}{part.value}{/if}{/each}</a
				>
			</h3>
		</div>

		<p class="mt-2 line-clamp-3 text-[15px] leading-relaxed text-ink-soft">
			{#each summary as part, i (i)}{#if part.hit}<mark class="bg-marker text-ink"
						>{part.value}</mark
					>{:else}{part.value}{/if}{/each}
		</p>

		<p class="mt-4 mb-4 flex min-w-0 items-center gap-1.5 font-mono text-[12px] text-ink-soft">
			<IconFile size={14} aria-hidden="true" class="shrink-0" />
			<span class="truncate">{main}</span>
			{#if extra > 0}
				<span class="shrink-0 text-ink-faint">+{extra}</span>
			{/if}
		</p>

		<div
			class="mt-auto flex items-center gap-x-3 border-t border-dashed border-rule pt-3 font-sans text-[12px] text-ink-faint"
		>
			<span class="mr-auto inline-flex min-w-0 items-center gap-1.5">
				<Avatar handle={entry.author} />
				<span class="truncate text-ink-soft">{entry.author}</span>
			</span>
			<span class="inline-flex items-center gap-1" title="Estrellas">
				<IconStar size={14} aria-hidden="true" />
				{compact(entry.stars)}<span class="sr-only"> estrellas</span>
			</span>
			<span class="inline-flex items-center gap-1" title="Copias y descargas">
				<IconCopy size={14} aria-hidden="true" />
				{compact(entry.uses)}<span class="sr-only"> usos</span>
			</span>
			{#if entry.visibility !== 'public'}
				<span class="inline-flex items-center text-ink-soft" title="No listado">
					<IconLock size={14} aria-hidden="true" /><span class="sr-only">No listado</span>
				</span>
			{/if}
		</div>
	</div>
</article>
