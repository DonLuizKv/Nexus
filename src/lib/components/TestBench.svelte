<script lang="ts">
	import IconPlay from '@tabler/icons-svelte-runes/icons/player-play';
	import IconStop from '@tabler/icons-svelte-runes/icons/player-stop';
	import IconCopy from '@tabler/icons-svelte-runes/icons/copy';
	import { TARGETS } from '#lib/entries/catalog';
	import { simulateRun } from '#lib/entries/simulate';
	import { extractVariables, fill } from '#lib/entries/text';
	import type { CategoryId } from '#lib/entries/types';
	import { copyText } from '#lib/notice.svelte';
	import PromptText from './PromptText.svelte';

	interface Props {
		body: string;
		category: CategoryId;
		models: string[];
		/** Unique prefix for form control ids when several benches share a page. */
		idPrefix?: string;
		/** Single column, for narrow containers. */
		stacked?: boolean;
		oncopy?: () => void;
	}

	let { body, category, models, idPrefix = 'bench', stacked = false, oncopy }: Props = $props();

	const variables = $derived(extractVariables(body));
	const modelOptions = $derived(models.length ? models : TARGETS.slice(0, 4));

	let values = $state<Record<string, string>>({});
	// Starts empty; the select falls back to the first option until the user picks one.
	let picked = $state('');
	const model = $derived(modelOptions.includes(picked) ? picked : modelOptions[0]);
	let output = $state('');
	let running = $state(false);
	let controller: AbortController | undefined;

	const filled = $derived(fill(body, values));
	const missing = $derived(variables.filter((v) => !values[v]?.trim()));

	async function run() {
		controller?.abort();
		controller = new AbortController();
		output = '';
		running = true;
		try {
			for await (const chunk of simulateRun(filled, category, model, controller.signal)) {
				output += chunk;
			}
		} finally {
			running = false;
		}
	}

	function stop() {
		controller?.abort();
		running = false;
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
			event.preventDefault();
			run();
		}
	}

	$effect(() => () => controller?.abort());
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class={['grid gap-8', !stacked && 'lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]']} {onkeydown}>
	<div>
		<fieldset>
			<legend class="eyebrow text-ink-faint">1 · Rellena las variables</legend>
			{#if variables.length}
				<div class="mt-4 grid gap-4">
					{#each variables as name (name)}
						<div>
							<label for="{idPrefix}-{name}" class="font-mono text-[14px] font-bold">
								<span class="bg-marker px-0.5">{`{{${name}}}`}</span>
							</label>
							<textarea
								id="{idPrefix}-{name}"
								rows="2"
								bind:value={values[name]}
								class="mt-1.5 field resize-y font-serif"
								placeholder="Valor para {name}"></textarea>
						</div>
					{/each}
				</div>
			{:else}
				<p class="mt-3 text-[15px] text-ink-soft">
					Este prompt no tiene variables. Se envía tal cual.
				</p>
			{/if}
		</fieldset>

		<div class="mt-6">
			<label for="{idPrefix}-model" class="eyebrow text-ink-faint">2 · Elige el modelo</label>
			<select
				id="{idPrefix}-model"
				value={model}
				onchange={(e) => (picked = e.currentTarget.value)}
				class="mt-2 field font-sans text-[14px]"
			>
				{#each modelOptions as option (option)}
					<option value={option}>{option}</option>
				{/each}
			</select>
		</div>

		<div class="mt-6 flex flex-wrap items-center gap-3">
			{#if running}
				<button type="button" class="btn" onclick={stop}>
					<IconStop size={16} aria-hidden="true" /> Detener
				</button>
			{:else}
				<button type="button" class="btn btn-primary" onclick={run}>
					<IconPlay size={16} aria-hidden="true" /> Ejecutar
				</button>
			{/if}
			<span class="font-sans text-[12px] text-ink-faint"><kbd>Ctrl</kbd> + <kbd>Enter</kbd></span>
		</div>
		{#if missing.length}
			<p class="mt-3 font-sans text-[12px] text-ink-faint">
				Faltan {missing.length} de {variables.length} variables. Puedes ejecutar igualmente.
			</p>
		{/if}
	</div>

	<div class="grid content-start gap-6">
		<div>
			<p class="mb-2 eyebrow text-ink-faint">Así se enviará</p>
			<PromptText {body} {values} label="Prompt con variables rellenadas" />
		</div>

		<div>
			<div class="mb-2 flex items-center justify-between gap-3">
				<p class="eyebrow text-ink-faint">
					Respuesta
					{#if running}<span class="ml-2 text-ok normal-case">● escribiendo…</span>{/if}
				</p>
				{#if output && !running}
					<button
						type="button"
						class="inline-flex items-center gap-1 font-sans text-[12px] text-link underline"
						onclick={() => {
							copyText(output, 'Respuesta copiada');
							oncopy?.();
						}}><IconCopy size={14} aria-hidden="true" /> Copiar respuesta</button
					>
				{/if}
			</div>
			<div
				aria-live="polite"
				aria-busy={running}
				class="min-h-40 border border-ink bg-ink p-5 font-mono text-[14px] leading-relaxed text-[#f4efe1]"
			>
				{#if output}
					<pre class="font-mono break-words whitespace-pre-wrap">{output}{#if running}<span
								aria-hidden="true"
								class="ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-marker motion-safe:animate-caret"
							></span>{/if}</pre>
				{:else}
					<p class="text-[#a8a291]">La respuesta aparecerá aquí.</p>
				{/if}
			</div>
			<p class="mt-2 font-sans text-[11px] text-ink-faint">
				Modo demostración: la respuesta es simulada en tu navegador. No se envía nada a ningún
				servidor.
			</p>
		</div>
	</div>
</div>
