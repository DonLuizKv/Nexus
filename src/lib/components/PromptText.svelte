<script lang="ts">
	import { segment } from '#lib/entries/text';

	interface Props {
		body: string;
		/** When provided, filled variables render their value instead of the placeholder. */
		values?: Record<string, string>;
		label?: string;
		/** `sheet` = ruled manuscript for prose; `code` = numbered listing for config/code. */
		variant?: 'sheet' | 'code';
	}

	let { body, values, label = 'Contenido', variant = 'sheet' }: Props = $props();

	const parts = $derived(segment(body));
	const lines = $derived(body.split('\n'));
</script>

{#if variant === 'sheet'}
	<!-- Ruled sheet: rule height (1.75em) equals the line-height so text sits on the lines.
	     <pre> keeps formatters from injecting whitespace into the rendered text. -->
	<figure
		aria-label={label}
		class="border border-rule shadow-[0_1px_0_#dcd2bf,0_3px_0_-1px_#fffdf8,0_4px_0_-1px_#dcd2bf]"
	>
		<pre
			class="overflow-x-auto ruled py-[1.75em] pr-5 pl-[3.25rem] font-mono text-[15px] leading-[1.75em] break-words whitespace-pre-wrap text-ink">{#each parts as part, i (i)}{#if part.kind === 'text'}{part.value}{:else if values?.[part.name]?.trim()}<mark
						class="bg-marker/70 px-0.5 text-ink underline decoration-ink-faint decoration-dotted"
						title="Variable {part.name}">{values[part.name]}</mark
					>{:else}<mark class="bg-marker px-0.5 font-bold text-ink" title="Variable para rellenar"
						>{`{{${part.name}}}`}</mark
					>{/if}{/each}</pre>
	</figure>
{:else}
	<!-- Numbered listing. Numbers are decorative (aria-hidden) so copying/reading gets the code only. -->
	<figure aria-label={label} class="overflow-hidden border border-rule bg-paper-deep">
		<div class="flex overflow-x-auto font-mono text-[14px] leading-[1.7]">
			<div
				aria-hidden="true"
				class="sticky left-0 shrink-0 border-r border-rule bg-paper-deep py-4 pr-3 pl-4 text-right text-ink-faint select-none"
			>
				{#each { length: lines.length }, i (i)}<div>{i + 1}</div>{/each}
			</div>
			<pre class="min-w-0 flex-1 py-4 pr-5 pl-4 text-ink">{body}</pre>
		</div>
	</figure>
{/if}
