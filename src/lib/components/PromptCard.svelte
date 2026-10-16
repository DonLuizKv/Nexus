<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		featured?: boolean;
		version: string;
		rating: string;
		copies: string;
		title: string;
		description: string;
		tags: string[];
		models: string[];
		initials: string;
		handle: string;
		time: string;
		stars: string;
		forks: string;
		output: Snippet;
	}

	let {
		featured = false,
		version,
		rating,
		copies,
		title,
		description,
		tags,
		models,
		initials,
		handle,
		time,
		stars,
		forks,
		output
	}: Props = $props();
</script>

<article
	class={[
		'flex flex-col gap-3 rounded-lg border bg-card p-4',
		featured ? 'border-primary' : 'border-border'
	]}
>
	{@render output()}

	<div class="flex flex-wrap items-center gap-1.5">
		{#if featured}
			<span
				class="rounded-sm bg-primary px-1.5 py-0.5 text-[11px] font-bold tracking-wider text-primary-foreground uppercase"
				>Featured</span
			>
		{/if}
		<span class="rounded-sm bg-accent-dim px-1.5 py-0.5 font-mono text-[11px] text-accent"
			>{version}</span
		>
		<span class="text-[11px] font-medium text-warning">★ {rating}</span>
		<span class="ml-auto font-mono text-[11px] text-muted-foreground">⧉ {copies}</span>
	</div>

	<div>
		<div class="font-headings text-[15px] leading-snug font-semibold text-foreground">{title}</div>
		<div class="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{description}</div>
	</div>

	<div class="flex flex-wrap gap-1.5">
		{#each tags as tag (tag)}
			<span
				class="rounded-sm bg-secondary px-1.5 py-0.5 font-mono text-[11px] text-secondary-foreground"
				>#{tag}</span
			>
		{/each}
		{#each models as model (model)}
			<span class="rounded-sm border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground"
				>{model}</span
			>
		{/each}
	</div>

	<div class="mt-auto flex items-center gap-2 border-t border-border pt-3">
		<div
			class="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-elevated text-[10px] font-bold text-accent"
		>
			{initials}
		</div>
		<span class="text-xs text-muted-foreground">@{handle} · {time}</span>
		<span class="ml-auto font-mono text-[11px] text-muted-foreground">☆ {stars} · ⑂ {forks}</span>
	</div>

	<div class="flex gap-2">
		<button
			type="button"
			class="flex-1 rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground"
		>
			Copy prompt
		</button>
		<button
			type="button"
			class="rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground"
		>
			Fork
		</button>
	</div>
</article>
