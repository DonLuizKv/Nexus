<script lang="ts">
	const popular = ['seo brief', 'meta titles', 'ad angles', 'newsletter', 'keyword cluster'];

	const activity = [
		{ handle: '@demanddan', action: 'forked Meta Title Foundry → v23' },
		{ handle: '@ctr.carmen', action: 'copied Ad Angle Remix (312× today)' },
		{ handle: '@lifecycle.lena', action: 'published Newsletter Voice Lock v8' },
		{
			handle: '@maya.k',
			action: 'restored SEO Brief Architect v12 → v14',
			wide: true
		}
	];
</script>

<div class="relative overflow-hidden border-b border-border bg-surface">
	<div class="pointer-events-none absolute inset-0">
		<div
			class="absolute -top-32 left-1/4 h-[320px] w-[640px] rounded-full opacity-25"
			style="background: radial-gradient(closest-side, #5b9cff, transparent);"
		></div>
		<div
			class="absolute inset-0 opacity-[0.35]"
			style="
				background-image:
					linear-gradient(#232a35 1px, transparent 1px),
					linear-gradient(90deg, #232a35 1px, transparent 1px);
				background-size: 36px 36px;
				mask-image: radial-gradient(ellipse 90% 100% at 30% 0%, black 40%, transparent 100%);
			"
		></div>
	</div>

	<div
		class="relative mx-auto grid max-w-[1440px] grid-cols-[1.05fr_0.95fr] items-center gap-10 px-6 py-10"
	>
		<!-- Left column -->
		<div>
			<div class="flex flex-wrap items-center gap-2">
				<span class="font-mono text-xs text-muted-foreground">nexus.sh / explore</span>
				<span
					class="inline-flex items-center gap-1.5 rounded-full border border-border bg-input px-2.5 py-1 text-xs text-muted-foreground"
				>
					<span class="h-1.5 w-1.5 rounded-full bg-success"></span>
					<span>2,418 marketers online now</span>
				</span>
			</div>

			<h1
				class="mt-4 font-headings text-4xl leading-[1.08] font-bold tracking-tight text-foreground"
			>
				Find the prompt that
				<span class="text-primary">already works.</span>
			</h1>

			<p class="mt-3 max-w-[520px] text-base leading-relaxed text-muted-foreground">
				Watch what each prompt actually produces before you copy it. Real outputs, real copy counts,
				versioned and forkable.
			</p>

			<div
				class="mt-5 flex max-w-[560px] items-center gap-2 rounded-lg border border-border bg-input px-4 py-3"
			>
				<span class="text-base text-muted-foreground">⌕</span>
				<input
					type="text"
					class="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground"
					placeholder="Try “seo brief for oat milk”…"
				/>
				<span
					class="rounded-sm border border-border px-1.5 py-0.5 font-mono text-xs text-muted-foreground"
					>⌘K</span
				>
				<button
					type="button"
					class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
				>
					Search
				</button>
			</div>

			<div class="mt-3 flex flex-wrap items-center gap-2">
				<span class="text-xs text-muted-foreground">Popular:</span>
				{#each popular as tag (tag)}
					<span
						class="rounded-full border border-border bg-secondary px-3 py-1 text-[13px] text-secondary-foreground"
					>
						{tag}
					</span>
				{/each}
			</div>

			<div class="mt-6 flex items-center gap-4">
				<div class="flex -space-x-2">
					{#each ['MK', 'DD', 'CC', 'LL'] as initials (initials)}
						<div
							class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-elevated text-[11px] font-bold text-accent"
						>
							{initials}
						</div>
					{/each}
					<div
						class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-primary text-[11px] font-bold text-primary-foreground"
					>
						+
					</div>
				</div>
				<div class="text-[13px] leading-tight text-muted-foreground">
					<div class="flex items-center gap-1">
						<span class="text-xs text-warning">★★★★★</span>
						<span class="font-semibold text-foreground">4.9</span>
					</div>
					<div>Loved by 8,412 marketers · 48.2k copies today</div>
				</div>
			</div>
		</div>

		<!-- Right column: prompt preview card -->
		<div class="overflow-hidden rounded-xl border border-border bg-card">
			<div class="flex items-center justify-between border-b border-border bg-elevated px-4 py-3">
				<div class="flex items-center gap-2">
					<div
						class="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground"
					>
						S
					</div>
					<div>
						<div class="text-[13px] leading-none font-semibold text-foreground">
							SEO Brief Architect · v14
						</div>
						<div class="mt-0.5 text-xs text-muted-foreground">by @maya.k · ☆ 1,842 · ⧉ 12.4k</div>
					</div>
				</div>
				<span
					class="rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] text-success"
					>● live output</span
				>
			</div>

			<div class="p-4">
				<div class="flex items-center gap-2 rounded-md border border-border bg-input px-3 py-2.5">
					<span class="font-mono text-xs text-primary">keyword:</span>
					<span class="text-sm font-medium text-foreground">“best oat milk for latte art”</span>
					<span class="ml-auto font-mono text-[11px] text-muted-foreground">1800 words</span>
				</div>

				<div class="mt-3 rounded-md border border-border bg-surface p-3">
					<div class="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
						Generated brief — 0.8s
					</div>
					<div class="mt-2 flex flex-col gap-1.5 text-[13px]">
						<div class="flex items-start gap-2">
							<span class="font-mono text-success">✓</span>
							<span class="text-foreground">
								<span class="font-semibold">Intent:</span>
								<span class="text-muted-foreground">commercial · comparison + how-to</span>
							</span>
						</div>
						<div class="flex items-start gap-2">
							<span class="font-mono text-success">✓</span>
							<span class="text-foreground">
								<span class="font-semibold">H2s:</span>
								<span class="text-muted-foreground"
									>foam test · 5 brands ranked · steaming guide</span
								>
							</span>
						</div>
						<div class="flex items-start gap-2">
							<span class="font-mono text-success">✓</span>
							<span class="text-foreground">
								<span class="font-semibold">Entities:</span>
								<span class="text-muted-foreground">barista milk · beta-glucans · microfoam</span>
							</span>
						</div>
					</div>

					<div class="mt-3 rounded-md border border-border bg-elevated p-2.5">
						<div class="flex items-center justify-between">
							<span class="font-mono text-xs text-muted-foreground">SERP preview</span>
							<span class="text-[11px] font-medium text-success">CTR score 8.6</span>
						</div>
						<div class="mt-1 text-[13px] text-accent">
							Oat Milk for Latte Art: 5 Barista Picks (2026 Test)
						</div>
						<div class="text-xs text-muted-foreground">
							nexus.sh › guides › oat-milk-latte · 6 min read
						</div>
						<div class="mt-2 flex h-1.5 overflow-hidden rounded-full bg-input">
							<div class="w-[86%] rounded-full bg-primary"></div>
						</div>
					</div>
				</div>

				<div class="mt-3 flex gap-2">
					<button
						type="button"
						class="flex-1 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground"
					>
						⧉ Copy this prompt
					</button>
					<button
						type="button"
						class="rounded-md border border-border bg-elevated px-4 py-2.5 text-sm font-medium text-foreground"
					>
						Fork
					</button>
					<button
						type="button"
						class="rounded-md border border-border px-3 py-2.5 text-sm font-medium text-muted-foreground"
					>
						Diff
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Activity ticker -->
	<div class="relative border-t border-border bg-background">
		<div
			class="mx-auto flex max-w-[1440px] items-center gap-6 overflow-hidden px-6 py-2.5 text-xs whitespace-nowrap text-muted-foreground"
		>
			<span class="shrink-0 font-mono text-success">● live</span>
			{#each activity as item (item.handle)}
				<span class={item.wide ? 'hidden xl:inline' : ''}>
					<span class="font-medium text-foreground">{item.handle}</span>
					{item.action}
				</span>
			{/each}
		</div>
	</div>
</div>
