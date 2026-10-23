<script lang="ts">
	interface Props {
		size?: 'sm' | 'lg';
	}

	let { size = 'sm' }: Props = $props();
</script>

<!-- Hard 2px drop shadow: the 1998 "WordArt on clouds" look, kept legible with a solid shadow. -->
<span
	class={[
		'inline-flex items-baseline gap-2 font-serif leading-none font-bold tracking-tight text-white italic',
		size === 'lg' ? 'text-[clamp(4rem,13vw,9.5rem)]' : 'text-[30px]'
	]}
	style="text-shadow: {size === 'lg' ? '4px 4px 0 #0f3a7d' : '2px 2px 0 #0f3a7d'}"
>
	Nexus<span
		aria-hidden="true"
		class={['not-italic', size === 'lg' ? 'text-[0.35em] text-marker' : 'text-[0.5em] text-marker']}
		>✦</span
	>
</span>
