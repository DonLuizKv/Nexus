<script lang="ts">
	import Logo from './Logo.svelte';

	const links = ['Explore', 'Collections', 'Docs', 'Changelog'];

	let active = $state('Explore');
</script>

<header class="border-b border-border bg-background">
	<div class="flex h-16 items-center gap-6 px-6">
		<div class="flex shrink-0 items-center gap-2.5">
			<Logo beta />
		</div>

		<nav class="hidden items-center gap-1 text-sm font-medium lg:flex">
			{#each links as link (link)}
				<button
					type="button"
					onclick={() => (active = link)}
					class={[
						'rounded-md px-3 py-2',
						active === link ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground'
					]}
				>
					{link}
				</button>
			{/each}
		</nav>

		<div class="flex flex-1 justify-center">
			<label
				class="flex w-full max-w-[440px] items-center gap-2 rounded-md border border-border bg-input px-3 py-2"
			>
				<span class="flex items-center text-sm text-muted-foreground">
					<span class="font-mono text-xs">⌕</span>
				</span>
				<input
					type="text"
					class="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground"
					placeholder="Search 24,180 prompts, tags, authors…"
				/>
				<span
					class="rounded-sm border border-border px-1.5 py-0.5 font-mono text-xs text-muted-foreground"
					>⌘K</span
				>
			</label>
		</div>

		<div class="flex shrink-0 items-center gap-3">
			<button
				type="button"
				class="hidden items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-muted-foreground md:flex"
			>
				<span class="text-xs">⌘</span>
				<span>Paste prompt</span>
			</button>
			<button
				type="button"
				class="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
			>
				<span class="text-base leading-none">+</span>
				<span>New prompt</span>
			</button>
			<div
				class="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-accent-dim text-xs font-bold text-accent"
			>
				MK
			</div>
		</div>
	</div>
</header>
