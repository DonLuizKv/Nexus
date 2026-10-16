<script lang="ts">
	import TopNav from '#lib/components/TopNav.svelte';
	import HeroBanner from '#lib/components/HeroBanner.svelte';
	import FilterPanel from '#lib/components/FilterPanel.svelte';
	import PromptCard from '#lib/components/PromptCard.svelte';
	import Footer from '#lib/components/Footer.svelte';

	const tabs = ['Trending', 'Newest', 'Top rated', 'Recently updated'];

	const collections = [
		{ title: 'Q4 SEO kit', meta: '18 prompts · @maya.k', color: '#5b9cff' },
		{ title: 'Launch-week PPC', meta: '12 prompts · @paid.pete', color: '#3dd598' },
		{ title: 'Newsletter engine', meta: '9 prompts · @lifecycle.lena', color: '#fbbf24' }
	];

	const authors = [
		{ initials: 'MK', handle: 'maya.k', meta: '42 prompts · 96k copies' },
		{ initials: 'DD', handle: 'demanddan', meta: '18 prompts · 51k copies' },
		{ initials: 'CC', handle: 'ctr.carmen', meta: '27 prompts · 44k copies' }
	];

	const stats = [
		{ value: '0.8s', label: 'avg. preview' },
		{ value: '48.2k', label: 'copies today' },
		{ value: '3,914', label: 'forks / week' }
	];

	let activeTab = $state(0);
</script>

<TopNav />
<HeroBanner />

<main class="mx-auto max-w-[1440px] px-6 py-6">
	<div class="mb-4 flex items-end justify-between">
		<div>
			<div class="text-xs font-bold tracking-wider text-primary uppercase">
				✦ Hand-picked for Marketing + SEO
			</div>
			<h2 class="mt-1 font-headings text-2xl font-bold tracking-tight text-foreground">
				Start from something that works
			</h2>
			<p class="mt-1 text-sm text-muted-foreground">
				Every card shows a real output preview — no blind copying.
			</p>
		</div>
		<div class="flex items-center gap-2">
			<span class="text-xs text-muted-foreground">Sort:</span>
			<button
				type="button"
				class="rounded-md border border-border bg-input px-2.5 py-1.5 text-xs font-medium text-foreground"
			>
				Most copied ▾
			</button>
		</div>
	</div>

	<div class="mb-5 flex items-center gap-1 border-b border-border">
		{#each tabs as tab, i (tab)}
			<button
				type="button"
				onclick={() => (activeTab = i)}
				class={[
					'-mb-px border-b-2 px-4 py-2.5 text-sm font-medium',
					activeTab === i
						? 'border-primary text-foreground'
						: 'border-transparent text-muted-foreground'
				]}
			>
				{tab}
			</button>
		{/each}
		<span class="ml-auto pb-2 text-xs text-muted-foreground">4,812 prompts · updated 2 min ago</span
		>
	</div>

	<div class="flex items-start gap-6">
		<FilterPanel />

		<div class="min-w-0 flex-1">
			<div class="grid grid-cols-2 gap-4">
				<PromptCard
					featured
					version="v14"
					rating="4.9"
					copies="12.4k"
					title="SEO Brief Architect — E-E-A-T content briefs"
					description="Paste keyword + top-3 SERP URLs. Get intent, H2 outline, entities and FAQ schema."
					tags={['seo-brief', 'content']}
					models={['GPT-4o', 'Claude 3.5']}
					initials="MK"
					handle="maya.k"
					time="2h ago"
					stars="1,842"
					forks="316"
				>
					{#snippet output()}
						<div class="rounded-md border border-border bg-input p-3">
							<div class="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
								Output · writer brief
							</div>
							<div class="mt-2 rounded-sm border border-border bg-surface p-2">
								<div class="text-[13px] text-accent">
									Oat Milk for Latte Art: 5 Barista Picks (2026)
								</div>
								<div class="mt-0.5 text-[11px] text-muted-foreground">
									H2 · H2 · H2 · FAQ schema + 4 internal links
								</div>
								<div class="mt-2 flex gap-1">
									{#each ['intent ✓', 'entities ✓', 'outline ✓'] as badge (badge)}
										<span
											class="rounded-sm bg-accent-dim px-1.5 py-0.5 font-mono text-[10px] text-accent"
											>{badge}</span
										>
									{/each}
								</div>
							</div>
						</div>
					{/snippet}
				</PromptCard>

				<PromptCard
					version="v22"
					rating="4.8"
					copies="21.7k"
					title="Meta Title Foundry — 12 CTR variants"
					description="12 SERP-ready titles under 60 chars with intent scores and an A/B slate."
					tags={['meta-titles', 'ctr']}
					models={['Claude 3.5', 'GPT-4o']}
					initials="CC"
					handle="ctr.carmen"
					time="1d ago"
					stars="2,310"
					forks="402"
				>
					{#snippet output()}
						<div class="flex flex-col gap-1.5 rounded-md border border-border bg-input p-3">
							<div class="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
								Output · 12 titles
							</div>
							{#each [['7 Oat Milk SEO Briefs That Actually Rank', '8.9'], ['Latte-Art Milk Test: 5 Brands, 1 Winner', '8.6'], ['Stop Writing Thin Briefs — Do This Instead', '8.2']] as [title, score] (title)}
								<div
									class="flex items-center gap-2 rounded-sm border border-border bg-surface px-2 py-1.5"
								>
									<span class="flex-1 truncate text-[13px] text-foreground">{title}</span>
									<span class="shrink-0 font-mono text-[11px] text-success">{score}</span>
								</div>
							{/each}
							<div class="mt-1 flex h-1.5 overflow-hidden rounded-full bg-surface">
								<div class="w-[74%] rounded-full bg-success"></div>
							</div>
						</div>
					{/snippet}
				</PromptCard>

				<PromptCard
					version="v11"
					rating="4.7"
					copies="8.1k"
					title="SERP Cluster Mapper — cannibalization fix"
					description="Groups 500+ keywords into intent clusters and maps each to one canonical URL."
					tags={['clustering', 'serp']}
					models={['GPT-4o', 'Gemini 1.5']}
					initials="DD"
					handle="demanddan"
					time="5h ago"
					stars="1,204"
					forks="208"
				>
					{#snippet output()}
						<div class="rounded-md border border-border bg-input p-3">
							<div class="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
								Output · 6 clusters
							</div>
							<div class="mt-2 flex h-[64px] items-end gap-1.5">
								{#each [70, 45, 90, 55, 80, 38] as height, i (height)}
									<div
										class="flex-1 rounded-sm"
										style="height: {height}%; background: {i === 2 ? '#5b9cff' : '#2b3546'}"
									></div>
								{/each}
							</div>
							<div class="mt-1.5 font-mono text-[11px] text-muted-foreground">
								2 cannibalization risks fixed
							</div>
						</div>
					{/snippet}
				</PromptCard>

				<PromptCard
					version="v9"
					rating="4.8"
					copies="6.9k"
					title="Ad Angle Remix — 5 hooks from 1 offer"
					description="One landing URL in, five PPC angles out — RSAs formatted for import."
					tags={['ppc', 'ad-copy']}
					models={['GPT-4o']}
					initials="PP"
					handle="paid.pete"
					time="3h ago"
					stars="986"
					forks="174"
				>
					{#snippet output()}
						<div class="rounded-md border border-border bg-input p-3">
							<div class="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
								Output · 5 ad angles
							</div>
							<div class="mt-2 grid grid-cols-2 gap-1.5">
								{#each [{ color: '#5b9cff', name: 'Barista angle' }, { color: '#3dd598', name: 'Budget angle' }, { color: '#fbbf24', name: 'Eco angle' }, { color: 'transparent', name: '+2 more' }] as angle (angle.name)}
									<div class="rounded-sm border border-border bg-surface px-2 py-2">
										<div
											class="mb-1.5 h-1.5 w-6 rounded-full"
											style="background: {angle.color}"
										></div>
										<div class="text-[12px] font-medium text-foreground">{angle.name}</div>
										<div class="font-mono text-[11px] text-muted-foreground">RSA ready</div>
									</div>
								{/each}
							</div>
						</div>
					{/snippet}
				</PromptCard>

				<PromptCard
					version="v8"
					rating="4.6"
					copies="4.3k"
					title="Newsletter Voice Lock — brand-safe drafts"
					description="Locks tone from 3 past issues, then drafts subjects + body with tokens."
					tags={['newsletter', 'tone']}
					models={['Claude 3.5']}
					initials="LL"
					handle="lifecycle.lena"
					time="2d ago"
					stars="742"
					forks="98"
				>
					{#snippet output()}
						<div class="rounded-md border border-border bg-input p-3">
							<div class="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
								Output · newsletter draft
							</div>
							<div class="mt-2 rounded-sm border border-border bg-surface p-2">
								<div class="text-[13px] font-semibold text-foreground">
									Subject: Your October SEO wins, mapped
								</div>
								<div class="mt-1.5 flex flex-col gap-1">
									<div class="h-1.5 w-full rounded-full bg-elevated"></div>
									<div class="h-1.5 w-[85%] rounded-full bg-elevated"></div>
									<div class="h-1.5 w-[60%] rounded-full bg-elevated"></div>
								</div>
								<div class="mt-2 flex items-center gap-1.5">
									<span
										class="rounded-sm border border-border bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
										>&#123;&#123;first_name&#125;&#125;</span
									>
									<span class="text-[11px] text-success">tone locked ✓</span>
								</div>
							</div>
						</div>
					{/snippet}
				</PromptCard>

				<PromptCard
					version="v17"
					rating="4.9"
					copies="9.8k"
					title="Content Refresh Auditor — decay finder"
					description="Scores posts by decay and drift. Keep / merge / rewrite verdicts included."
					tags={['refresh', 'audit']}
					models={['GPT-4o', 'Llama 3.1']}
					initials="MK"
					handle="maya.k"
					time="4d ago"
					stars="1,120"
					forks="245"
				>
					{#snippet output()}
						<div class="rounded-md border border-border bg-input p-3">
							<div class="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
								Output · refresh verdicts
							</div>
							<div class="mt-2 flex flex-col gap-1.5">
								{#each [{ color: '#3dd598', verdict: 'Keep — /oat-milk-guide' }, { color: '#fbbf24', verdict: 'Rewrite — /best-milk-2023' }, { color: '#5b9cff', verdict: 'Merge — 2 thin posts' }] as item (item.verdict)}
									<div
										class="flex items-center gap-2 rounded-sm border border-border bg-surface px-2 py-1.5 text-[12px] text-foreground"
									>
										<span class="h-2 w-2 shrink-0 rounded-full" style="background: {item.color}"
										></span>
										<span>{item.verdict}</span>
									</div>
								{/each}
							</div>
						</div>
					{/snippet}
				</PromptCard>
			</div>

			<!-- Value prop bar -->
			<div class="mt-4 flex items-center gap-6 rounded-lg border border-border bg-surface p-4">
				<div class="flex flex-1 items-center gap-3">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-lg border border-primary bg-accent-dim text-lg"
					>
						⧉
					</div>
					<div>
						<div class="text-sm font-semibold text-foreground">Preview → Copy → Fork</div>
						<div class="text-[13px] text-muted-foreground">
							See the output first. Make it yours in one click.
						</div>
					</div>
				</div>
				<div class="hidden items-center gap-5 text-center md:flex">
					{#each stats as stat (stat.label)}
						<div>
							<div class="font-mono text-base font-bold text-foreground">{stat.value}</div>
							<div class="text-[11px] text-muted-foreground">{stat.label}</div>
						</div>
					{/each}
				</div>
				<button
					type="button"
					class="shrink-0 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
				>
					Try a prompt
				</button>
			</div>

			<button
				type="button"
				class="mt-4 w-full rounded-md border border-border bg-surface py-3 text-sm font-medium text-muted-foreground"
			>
				Show more — 4,806 remaining
			</button>
		</div>

		<!-- Right rail -->
		<div class="hidden w-[280px] shrink-0 flex-col gap-4 2xl:flex">
			<div class="rounded-lg border border-border bg-surface p-4">
				<div class="mb-3 text-xs font-bold tracking-wider text-muted-foreground uppercase">
					Collections to get lost in
				</div>
				<div class="flex flex-col gap-3">
					{#each collections as collection (collection.title)}
						<div class="flex items-center gap-3">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-md border border-border"
								style="background: {collection.color}22"
							>
								<div class="h-5 w-5 rounded-sm" style="background: {collection.color}"></div>
							</div>
							<div>
								<div class="text-sm font-medium text-foreground">{collection.title}</div>
								<div class="text-xs text-muted-foreground">{collection.meta}</div>
							</div>
						</div>
					{/each}
				</div>
				<button
					type="button"
					class="mt-3 w-full rounded-md border border-border bg-input py-2 text-[13px] font-medium text-foreground"
				>
					Browse all 240
				</button>
			</div>

			<div class="rounded-lg border border-border bg-surface p-4">
				<div class="mb-3 text-xs font-bold tracking-wider text-muted-foreground uppercase">
					Top authors · SEO
				</div>
				<div class="flex flex-col gap-3">
					{#each authors as author (author.handle)}
						<div class="flex items-center gap-2.5">
							<div
								class="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-accent-dim text-xs font-bold text-accent"
							>
								{author.initials}
							</div>
							<div>
								<div class="text-sm font-medium text-foreground">@{author.handle}</div>
								<div class="text-xs text-muted-foreground">{author.meta}</div>
							</div>
							<button
								type="button"
								class="ml-auto rounded-md border border-border px-2 py-1 text-xs font-medium text-foreground"
							>
								Follow
							</button>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</main>

<Footer />
