<script lang="ts">
	import Logo from './Logo.svelte';

	const columns = [
		{
			title: 'Discover',
			links: ['Explore prompts', 'Collections', 'Top authors', 'Changelog']
		},
		{
			title: 'Create',
			links: ['New prompt', 'Import from URL', 'Versioning guide', 'Fork etiquette']
		},
		{
			title: 'Developers',
			links: ['npx nexus pull', 'API docs', 'CLI reference', 'Status'],
			monoFirst: true
		}
	];

	const legal = ['Privacy', 'Terms', 'Security'];
</script>

<footer class="mt-8 border-t border-border bg-surface">
	<div class="mx-auto max-w-[1440px] px-6 pt-10 pb-6">
		<div class="grid grid-cols-[1.3fr_1fr_1fr_1fr_1.2fr] gap-8">
			<div>
				<Logo />
				<p class="mt-3 max-w-[260px] text-[13px] leading-relaxed text-muted-foreground">
					The home for prompts that rank, convert and ship. Versioned, forkable, paste-ready.
				</p>
				<div
					class="mt-4 flex w-fit items-center gap-1.5 rounded-full border border-border bg-input px-3 py-1.5 text-xs text-muted-foreground"
				>
					<span class="h-1.5 w-1.5 rounded-full bg-success"></span>
					<span>All systems operational</span>
				</div>
			</div>

			{#each columns as column (column.title)}
				<div>
					<div class="mb-3 text-xs font-bold tracking-wider text-muted-foreground uppercase">
						{column.title}
					</div>
					<div class="flex flex-col gap-2 text-sm text-muted-foreground">
						{#each column.links as link, i (link)}
							<button
								type="button"
								class={['text-left', column.monoFirst && i === 0 ? 'font-mono text-[13px]' : '']}
							>
								{link}
							</button>
						{/each}
					</div>
				</div>
			{/each}

			<div class="h-fit rounded-lg border border-border bg-card p-4">
				<div class="text-sm font-semibold text-foreground">Get the Sunday prompt drop</div>
				<div class="mt-1 text-[13px] text-muted-foreground">
					5 top prompts in your inbox. No spam, unsubscribe anytime.
				</div>
				<div class="mt-3 flex gap-2">
					<input
						type="email"
						class="min-w-0 flex-1 rounded-md border border-border bg-input px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground"
						placeholder="you@studio.co"
					/>
					<button
						type="button"
						class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
					>
						Join
					</button>
				</div>
				<div class="mt-2 text-[11px] text-muted-foreground">
					Join 12,400 marketers already reading.
				</div>
			</div>
		</div>

		<div
			class="mt-8 flex items-center gap-5 border-t border-border pt-5 text-[13px] text-muted-foreground"
		>
			<span>© 2026 Nexus Labs</span>
			{#each legal as item (item)}
				<button type="button">{item}</button>
			{/each}
			<span class="ml-auto font-mono text-xs">v2.14.0 · fra-02 · 38ms</span>
		</div>
	</div>
</footer>
