<script lang="ts">
	interface Props {
		handle: string;
		size?: 'sm' | 'md' | 'lg';
	}

	let { handle, size = 'sm' }: Props = $props();
</script>

<!-- A square cut from the sky wallpaper with the initial on top: one per person, no uploads. -->
<span
	aria-hidden="true"
	class={[
		'relative inline-flex shrink-0 items-center justify-center sky font-serif font-bold text-white italic',
		size === 'sm' && 'h-6 w-6 text-[13px]',
		size === 'md' && 'h-9 w-9 text-[18px]',
		size === 'lg' && 'h-24 w-24 text-[48px] shadow-[4px_4px_0_var(--color-sky-deep)]'
	]}
	style="text-shadow: 1px 1px 0 #0f3a7d; background-position: {(handle.length * 37) %
		400}px {(handle.charCodeAt(0) * 7) % 260}px">{handle.charAt(0).toUpperCase()}</span
>
