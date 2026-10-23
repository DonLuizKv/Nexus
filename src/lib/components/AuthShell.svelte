<script lang="ts">
	import type { Snippet } from 'svelte';
	import { KINDS, KIND_IDS } from '#lib/entries/catalog';
	import Wordmark from './Wordmark.svelte';

	interface Props {
		title: string;
		children: Snippet;
	}

	let { title, children }: Props = $props();
</script>

<div class="mx-auto grid max-w-[1180px] gap-10 px-5 pt-12 sm:px-8 lg:grid-cols-[5fr_6fr] lg:gap-16">
	<!-- A postcard from the sky: brand on the left, the form on the right. -->
	<aside
		aria-hidden="true"
		class="relative isolate hidden min-h-[460px] overflow-hidden sky p-10 shadow-[8px_8px_0_rgb(15_58_125/0.25)] lg:flex lg:flex-col lg:justify-between"
	>
		<div class="absolute inset-0 -z-10 bg-[rgb(10_36_90/0.55)]"></div>
		<Wordmark />
		<div>
			<p
				class="max-w-[22ch] font-serif text-[30px] leading-tight text-white"
				style="text-shadow: 1px 1px 0 #0f3a7d"
			>
				Lo que afinaste, listo para que otros lo instalen.
			</p>
			<ul class="mt-6 flex flex-wrap gap-1.5">
				{#each KIND_IDS as k (k)}
					{@const info = KINDS[k]}
					<li
						class={[
							'inline-flex items-center gap-1 px-2 py-1 font-sans text-[11px] font-bold text-white',
							info.bg
						]}
					>
						<info.icon size={14} />
						{info.label}
					</li>
				{/each}
			</ul>
		</div>
	</aside>

	<section aria-labelledby="auth-title" class="max-w-[460px] py-4 lg:py-10">
		<h1 id="auth-title" class="font-serif text-[clamp(2.2rem,5vw,3rem)] leading-none font-bold">
			{title}
		</h1>
		{@render children()}
	</section>
</div>
