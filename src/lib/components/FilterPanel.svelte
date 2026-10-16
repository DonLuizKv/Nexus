<script lang="ts">
	const categories = [
		{ icon: '◈', label: 'SEO & Content', count: '4,812' },
		{ icon: '◎', label: 'Paid Ads & PPC', count: '1,904' },
		{ icon: '✉', label: 'Email & Lifecycle', count: '2,311' },
		{ icon: '✦', label: 'Social & Brand', count: '3,022' },
		{ icon: '⬣', label: 'CRO & Landing', count: '986' },
		{ icon: '▦', label: 'Analytics & Reports', count: '740' }
	];

	const models = [
		{ label: 'GPT-4o', note: 'best match' },
		{ label: 'Claude 3.5 Sonnet' },
		{ label: 'Gemini 1.5 Pro' },
		{ label: 'Llama 3.1' },
		{ label: 'Mistral Large' }
	];

	const useCases = [
		'Keyword clustering',
		'Briefs & outlines',
		'Meta titles',
		'Ad copy variants',
		'Newsletter drafts'
	];

	let selectedCategory = $state(0);
	let checkedModels = $state([true, true, false, false, false]);
	let activeUseCases = $state(['Keyword clustering', 'Briefs & outlines']);

	function toggleModel(index: number) {
		checkedModels[index] = !checkedModels[index];
	}

	function toggleUseCase(label: string) {
		activeUseCases = activeUseCases.includes(label)
			? activeUseCases.filter((c) => c !== label)
			: [...activeUseCases, label];
	}
</script>

<aside class="flex w-[264px] shrink-0 flex-col gap-4">
	<!-- Categories -->
	<div class="rounded-lg border border-border bg-surface p-4">
		<div class="mb-3 flex items-center justify-between">
			<div class="text-xs font-bold tracking-wider text-muted-foreground uppercase">Categories</div>
			<button type="button" class="text-[11px] font-medium text-primary">Reset</button>
		</div>
		<div class="flex flex-col gap-1">
			{#each categories as category, i (category.label)}
				<button
					type="button"
					onclick={() => (selectedCategory = i)}
					class={[
						'flex w-full items-center gap-2.5 rounded-md border px-2.5 py-2 text-left text-sm',
						selectedCategory === i
							? 'border-primary bg-accent-dim font-medium text-foreground'
							: 'border-transparent text-muted-foreground'
					]}
				>
					<span class={['w-5 text-center text-sm', selectedCategory === i ? 'text-primary' : '']}>
						{category.icon}
					</span>
					<span class="flex-1">{category.label}</span>
					<span class="font-mono text-[11px] opacity-70">{category.count}</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- Filters -->
	<div class="rounded-lg border border-border bg-surface p-4">
		<div class="mb-3 text-xs font-bold tracking-wider text-muted-foreground uppercase">
			AI model
		</div>
		<div class="flex flex-col gap-2">
			{#each models as model, i (model.label)}
				<button
					type="button"
					onclick={() => toggleModel(i)}
					class="flex w-full items-center gap-2.5 text-left text-sm"
				>
					<span
						class={[
							'flex h-4 w-4 items-center justify-center rounded-sm border text-[10px]',
							checkedModels[i]
								? 'border-primary bg-primary text-primary-foreground'
								: 'border-border text-transparent'
						]}>✓</span
					>
					<span
						class={[checkedModels[i] ? 'font-medium text-foreground' : 'text-muted-foreground']}
					>
						{model.label}
					</span>
					{#if model.note}
						<span class="ml-auto font-mono text-[10px] text-success">{model.note}</span>
					{/if}
				</button>
			{/each}
		</div>

		<div class="my-4 h-px bg-border"></div>

		<div class="mb-3 text-xs font-bold tracking-wider text-muted-foreground uppercase">
			Use case
		</div>
		<div class="flex flex-wrap gap-1.5">
			{#each useCases as useCase (useCase)}
				<button
					type="button"
					onclick={() => toggleUseCase(useCase)}
					class={[
						'rounded-full border px-2.5 py-1 text-xs font-medium',
						activeUseCases.includes(useCase)
							? 'border-primary bg-primary text-primary-foreground'
							: 'border-border bg-input text-muted-foreground'
					]}
				>
					{useCase}
				</button>
			{/each}
		</div>

		<div class="my-4 h-px bg-border"></div>

		<div class="mb-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
			Minimum rating
		</div>
		<div class="flex items-center gap-1 text-base">
			<span class="text-warning">★★★★</span>
			<span class="text-lg text-border">★</span>
			<span
				class="ml-1 rounded-sm border border-border bg-input px-1.5 py-0.5 text-xs text-muted-foreground"
				>4.0+</span
			>
		</div>
		<div class="mt-2 text-xs text-muted-foreground">Only prompts rated 4★ and above</div>
	</div>

	<!-- Curator pick -->
	<div class="relative overflow-hidden rounded-lg border border-primary bg-accent-dim p-4">
		<div
			class="absolute -top-8 -right-8 h-28 w-28 rounded-full opacity-30"
			style="background: radial-gradient(closest-side, #5b9cff, transparent);"
		></div>
		<div class="relative">
			<div class="text-[11px] font-bold tracking-wider text-primary uppercase">✦ Curator pick</div>
			<div class="mt-1 text-sm font-semibold text-foreground">Q4 SEO kit — 18 prompts</div>
			<div class="mt-1 text-[13px] leading-relaxed text-muted-foreground">
				Briefs, clustering, internal linking + refreshes. Vetted by @maya.k.
			</div>
			<div class="mt-2 flex -space-x-1.5">
				{#each ['S', 'M', 'C'] as letter (letter)}
					<div
						class="flex h-6 w-6 items-center justify-center rounded-full border border-primary bg-elevated text-[10px] font-bold text-accent"
					>
						{letter}
					</div>
				{/each}
				<span class="ml-2 self-center text-[11px] text-muted-foreground">+2.1k using</span>
			</div>
			<button
				type="button"
				class="mt-3 w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground"
			>
				Open collection
			</button>
		</div>
	</div>
</aside>
