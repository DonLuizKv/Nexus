<script lang="ts">
	let { beta = false }: { beta?: boolean } = $props();
</script>

<div class="flex items-center gap-2">
	<div class="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
		<div
			class="h-4 w-4 rounded-sm border-2 border-primary-foreground"
			style="border-left-color: transparent; border-bottom-color: transparent; transform: rotate(45deg);"
		></div>
	</div>
	<span class="font-headings text-lg font-bold tracking-tight text-foreground">Nexus</span>
	{#if beta}
		<span
			class="rounded-sm border border-border bg-input px-1.5 py-0.5 font-mono text-xs text-muted-foreground"
			>beta</span
		>
	{/if}
</div>
