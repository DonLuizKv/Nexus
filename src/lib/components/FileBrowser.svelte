<script lang="ts">
	import IconCopy from '@tabler/icons-svelte-runes/icons/copy';
	import IconDownload from '@tabler/icons-svelte-runes/icons/download';
	import IconFile from '@tabler/icons-svelte-runes/icons/file-text';
	import IconFileCode from '@tabler/icons-svelte-runes/icons/file-code';
	import IconFolder from '@tabler/icons-svelte-runes/icons/folder-open';
	import { bytes, download, fileName, isProse, language } from '#lib/entries/bundle';
	import type { EntryFile } from '#lib/entries/types';
	import { copyText } from '#lib/notice.svelte';
	import PromptText from './PromptText.svelte';

	interface Props {
		files: EntryFile[];
		oncopy?: () => void;
	}

	let { files, oncopy }: Props = $props();

	let selected = $state(0);
	const file = $derived(files[Math.min(selected, files.length - 1)]);
	const prose = $derived(file ? isProse(file.path) : true);

	/** Group by directory so the list reads like a tree without a recursive component. */
	const groups = $derived.by(() => {
		const out: [string, { file: EntryFile; index: number }[]][] = [];
		files.forEach((f, index) => {
			const dir = f.path.split('/').slice(0, -1).join('/');
			const group = out.find(([d]) => d === dir);
			if (group) group[1].push({ file: f, index });
			else out.push([dir, [{ file: f, index }]]);
		});
		return out;
	});

	function onkeydown(event: KeyboardEvent) {
		if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
		event.preventDefault();
		const delta = event.key === 'ArrowDown' ? 1 : -1;
		selected = (selected + delta + files.length) % files.length;
		document.getElementById(`file-tab-${selected}`)?.focus();
	}
</script>

<div class={['grid gap-4', files.length > 1 && 'md:grid-cols-[230px_minmax(0,1fr)]']}>
	{#if files.length > 1}
		<div
			role="tablist"
			aria-label="Archivos"
			aria-orientation="vertical"
			tabindex="-1"
			class="self-start border border-rule bg-sheet py-2 font-mono text-[13px]"
			{onkeydown}
		>
			{#each groups as [dir, items] (dir)}
				{#if dir}
					<p class="flex items-center gap-1.5 px-3 pt-2 pb-1 text-ink-faint">
						<IconFolder size={14} aria-hidden="true" class="shrink-0" />
						<span class="truncate">{dir}/</span>
					</p>
				{/if}
				{#each items as item (item.index)}
					<button
						type="button"
						role="tab"
						id="file-tab-{item.index}"
						aria-selected={item.index === selected}
						aria-controls="file-panel"
						tabindex={item.index === selected ? 0 : -1}
						onclick={() => (selected = item.index)}
						class={[
							'flex w-full items-center gap-1.5 py-1.5 pr-3 text-left',
							dir ? 'pl-7' : 'pl-3',
							item.index === selected
								? 'bg-marker font-bold text-ink'
								: 'text-ink-soft hover:bg-paper-deep'
						]}
					>
						{#if isProse(item.file.path)}
							<IconFile size={14} aria-hidden="true" class="shrink-0" />
						{:else}
							<IconFileCode size={14} aria-hidden="true" class="shrink-0" />
						{/if}
						<span class="truncate">{fileName(item.file.path)}</span>
					</button>
				{/each}
			{/each}
		</div>
	{/if}

	{#if file}
		<div
			id="file-panel"
			role={files.length > 1 ? 'tabpanel' : undefined}
			aria-labelledby={files.length > 1 ? `file-tab-${selected}` : undefined}
			class="min-w-0"
		>
			<div
				class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border border-b-0 border-rule bg-sheet px-4 py-2"
			>
				<p class="min-w-0 font-mono text-[13px]">
					<span class="break-all text-ink">{file.path}</span>
					<span class="ml-2 font-sans text-[11px] text-ink-faint"
						>{language(file.path)} · {(bytes(file.content) / 1024).toFixed(1)} KB</span
					>
				</p>
				<div class="flex gap-3 font-sans text-[12px]">
					<button
						type="button"
						class="inline-flex items-center gap-1 text-link underline"
						onclick={() => {
							copyText(file.content, `${fileName(file.path)} copiado`);
							oncopy?.();
						}}><IconCopy size={14} aria-hidden="true" /> Copiar</button
					>
					<button
						type="button"
						class="inline-flex items-center gap-1 text-link underline"
						onclick={() => {
							download(fileName(file.path), file.content);
							oncopy?.();
						}}><IconDownload size={14} aria-hidden="true" /> Descargar</button
					>
				</div>
			</div>
			<PromptText body={file.content} label={file.path} variant={prose ? 'sheet' : 'code'} />
		</div>
	{/if}
</div>
