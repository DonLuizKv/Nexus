<script lang="ts">
	import { KINDS } from '#lib/entries/catalog';
	import type { Kind } from '#lib/entries/types';

	interface Props {
		kind: Kind;
		/** `solid` for the folder tab on cards, `soft` inline in text. */
		tone?: 'solid' | 'soft';
	}

	let { kind, tone = 'soft' }: Props = $props();

	const info = $derived(KINDS[kind]);
</script>

<span
	class={[
		'inline-flex items-center gap-1.5 font-sans text-[11px] font-bold tracking-[0.08em] uppercase',
		tone === 'solid' ? [info.bg, 'px-2.5 py-1 text-white'] : [info.soft, info.text, 'px-2 py-0.5']
	]}
>
	<info.icon size={14} stroke={2} aria-hidden="true" />
	{info.label}
</span>
