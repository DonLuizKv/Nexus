<script lang="ts">
	import IconTerminal from '@tabler/icons-svelte-runes/icons/terminal-2';
	import IconWindows from '@tabler/icons-svelte-runes/icons/brand-windows';
	import IconMarkdown from '@tabler/icons-svelte-runes/icons/markdown';
	import IconZip from '@tabler/icons-svelte-runes/icons/file-zip';
	import IconCopy from '@tabler/icons-svelte-runes/icons/copy';
	import { download, toBash, toMarkdown, toPowerShell, toZip } from '#lib/entries/bundle';
	import type { Entry } from '#lib/entries/types';
	import { copyText } from '#lib/notice.svelte';

	interface Props {
		entry: Entry;
		url: string;
		onuse?: () => void;
	}

	let { entry, url, onuse }: Props = $props();

	type Method = 'bash' | 'powershell' | 'agent';
	let method = $state<Method>('bash');

	const METHODS = [
		{ id: 'bash', label: 'macOS / Linux', icon: IconTerminal },
		{ id: 'powershell', label: 'Windows', icon: IconWindows },
		{ id: 'agent', label: 'Pegar en tu agente', icon: IconMarkdown }
	] as const;

	const script = $derived(
		method === 'bash'
			? toBash(entry)
			: method === 'powershell'
				? toPowerShell(entry)
				: toMarkdown(entry, url)
	);
	const hint = $derived(
		method === 'agent'
			? 'Pégalo en Claude Code, Cursor, Kiro o Codex: el agente creará los archivos por ti.'
			: 'Ejecútalo en la raíz de tu proyecto. Crea las carpetas y escribe los archivos tal cual.'
	);

	function zip() {
		download(`${entry.slug}.zip`, toZip(entry.files));
		onuse?.();
	}
</script>

<div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
	<div class="min-w-0">
		<div
			role="tablist"
			aria-label="Método de instalación"
			class="flex flex-wrap gap-x-6 border-b border-rule"
		>
			{#each METHODS as m (m.id)}
				<button
					type="button"
					role="tab"
					id="install-{m.id}"
					aria-selected={method === m.id}
					aria-controls="install-panel"
					onclick={() => (method = m.id)}
					class={[
						'-mb-px inline-flex items-center gap-1.5 border-b-2 pb-2 font-sans text-[13px] font-bold',
						method === m.id
							? 'border-link text-ink'
							: 'border-transparent text-ink-faint hover:text-ink'
					]}
				>
					<m.icon size={16} aria-hidden="true" />
					{m.label}
				</button>
			{/each}
		</div>
		<div id="install-panel" role="tabpanel" aria-labelledby="install-{method}" class="pt-4">
			<p class="mb-3 text-[15px] text-ink-soft">{hint}</p>
			<div class="relative">
				<pre
					class="max-h-80 overflow-auto border border-ink bg-ink p-5 pr-28 font-mono text-[13px] leading-relaxed text-[#f4efe1]">{script}</pre>
				<button
					type="button"
					class="absolute top-3 right-3 btn min-h-8 py-1 text-[12px]"
					onclick={() => {
						copyText(script, method === 'agent' ? 'Instrucciones copiadas' : 'Script copiado');
						onuse?.();
					}}><IconCopy size={14} aria-hidden="true" /> Copiar</button
				>
			</div>
		</div>
	</div>

	<div class="self-start border border-rule bg-sheet p-5">
		<p class="eyebrow text-ink-faint">O descárgalo</p>
		<p class="mt-2 text-[15px] text-ink-soft">
			{entry.files.length === 1 ? 'Un archivo' : `${entry.files.length} archivos`} con su estructura de
			carpetas.
		</p>
		<button type="button" class="mt-4 btn w-full btn-primary" onclick={zip}>
			<IconZip size={18} aria-hidden="true" /> Descargar .zip
		</button>
		<ul class="mt-4 space-y-1 font-mono text-[12px] text-ink-faint">
			{#each entry.files as f (f.path)}
				<li class="break-all">{f.path}</li>
			{/each}
		</ul>
	</div>
</div>
