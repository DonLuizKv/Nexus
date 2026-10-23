<script lang="ts">
	import IconX from '@tabler/icons-svelte-runes/icons/x';
	import IconCopy from '@tabler/icons-svelte-runes/icons/copy';
	import IconMarkdown from '@tabler/icons-svelte-runes/icons/markdown';
	import IconWorld from '@tabler/icons-svelte-runes/icons/world';
	import IconLock from '@tabler/icons-svelte-runes/icons/lock';
	import IconBomb from '@tabler/icons-svelte-runes/icons/bomb';
	import { copyText } from '#lib/notice.svelte';
	import { toMarkdown } from '#lib/entries/bundle';
	import { VISIBILITY } from '#lib/entries/catalog';
	import type { Entry } from '#lib/entries/types';

	interface Props {
		entry: Entry;
		url: string;
		open: boolean;
	}

	let { entry, url, open = $bindable() }: Props = $props();

	let dialog = $state<HTMLDialogElement>();

	$effect(() => {
		if (!dialog) return;
		if (open && !dialog.open) dialog.showModal();
		if (!open && dialog.open) dialog.close();
	});

	const VisibilityIcon = $derived(
		entry.visibility === 'public'
			? IconWorld
			: entry.visibility === 'unlisted'
				? IconLock
				: IconBomb
	);
	const badge = $derived(
		`[![${entry.title} en Nexus](https://img.shields.io/badge/Nexus-${encodeURIComponent(entry.kind)}-2f6fc2)](${url})`
	);
</script>

<dialog
	bind:this={dialog}
	onclose={() => (open = false)}
	onclick={(e) => e.target === dialog && dialog?.close()}
	aria-labelledby="share-title"
	class="m-auto w-[min(560px,calc(100vw-2rem))] border border-ink bg-paper p-0 text-ink shadow-[8px_8px_0_rgb(15_58_125/0.35)] backdrop:bg-sky-deep/50"
>
	<div class="h-2 sky" aria-hidden="true"></div>
	<div class="p-6 sm:p-8">
		<div class="flex items-start justify-between gap-4">
			<div>
				<h2 id="share-title" class="font-serif text-[26px] leading-tight font-bold">Compartir</h2>
				<p class="mt-1 text-[15px] text-ink-soft">{entry.title}</p>
			</div>
			<button
				type="button"
				class="-mt-1 -mr-2 p-2 text-ink-soft hover:text-ink"
				aria-label="Cerrar"
				onclick={() => (open = false)}><IconX size={20} aria-hidden="true" /></button
			>
		</div>

		<label for="share-url" class="mt-6 block eyebrow text-ink-faint">Enlace</label>
		<div class="mt-2 flex gap-2">
			<input
				id="share-url"
				readonly
				value={url}
				class="field font-mono text-[14px]"
				onfocus={(e) => e.currentTarget.select()}
			/>
			<button type="button" class="btn btn-primary" onclick={() => copyText(url, 'Enlace copiado')}>
				<IconCopy size={16} aria-hidden="true" /> Copiar
			</button>
		</div>

		<p class="mt-4 flex items-start gap-2 font-sans text-[13px] text-ink-soft">
			<VisibilityIcon size={16} aria-hidden="true" class="mt-0.5 shrink-0" />
			<span
				><strong>{VISIBILITY[entry.visibility].label}.</strong>
				{VISIBILITY[entry.visibility].hint}</span
			>
		</p>

		<div class="mt-6 flex flex-wrap gap-2">
			<button
				type="button"
				class="btn"
				onclick={() => copyText(toMarkdown(entry, url), 'Copiado como Markdown')}
			>
				<IconMarkdown size={16} aria-hidden="true" /> Copiar todo como Markdown
			</button>
			<button type="button" class="btn" onclick={() => copyText(badge, 'Insignia copiada')}>
				Insignia para README
			</button>
		</div>
	</div>
</dialog>
