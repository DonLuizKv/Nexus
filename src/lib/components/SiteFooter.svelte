<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import IconDice from '@tabler/icons-svelte-runes/icons/arrows-shuffle';
	import { library } from '#lib/entries/library.svelte';
	import { formatDate } from '#lib/entries/text';

	const uses = $derived(library.entries.reduce((sum, e) => sum + e.uses, 0));
	const digits = $derived(String(uses).padStart(7, '0').split(''));
	const lastUpdate = $derived(
		library.entries.reduce((max, e) => (e.updatedAt > max ? e.updatedAt : max), '')
	);

	function random() {
		const pick = library.random();
		if (pick) goto(resolve('/p/[slug]', { slug: pick.slug }));
	}
</script>

<footer class="mt-24 border-t border-rule bg-paper-deep">
	<div class="mx-auto grid max-w-[1180px] gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
		<section aria-labelledby="ring-title">
			<h2 id="ring-title" class="eyebrow text-ink-faint">Webring</h2>
			<p class="mt-3 max-w-[36ch] text-[15px] text-ink-soft">
				Cada entrada pública está enlazada con la anterior y la siguiente. Recorre el anillo o salta
				a una al azar.
			</p>
			<button type="button" class="mt-4 btn" onclick={random}>
				<IconDice size={16} aria-hidden="true" /> Entrada al azar
			</button>
		</section>

		<section aria-labelledby="count-title">
			<h2 id="count-title" class="eyebrow text-ink-faint">Copias y descargas</h2>
			<p class="mt-3 inline-flex gap-[2px] bg-ink p-1" aria-label="{uses} copias y descargas">
				{#each digits as digit, i (i)}
					<span
						aria-hidden="true"
						class="w-[1.15em] bg-[#20201c] py-0.5 text-center font-mono text-[22px] leading-tight font-bold text-marker tabular-nums"
						>{digit}</span
					>
				{/each}
			</p>
			{#if lastUpdate}
				<p class="mt-3 font-sans text-[12px] text-ink-faint">
					Última actualización: {formatDate(lastUpdate)}
				</p>
			{/if}
		</section>

		<section aria-labelledby="links-title">
			<h2 id="links-title" class="eyebrow text-ink-faint">Mapa del sitio</h2>
			<ul class="mt-3 space-y-1.5 text-[15px]">
				<li><a href={resolve('/')}>Inicio</a></li>
				<li><a href={resolve('/buscar')}>Explorar</a></li>
				<li><a href={resolve('/nuevo')}>Publicar</a></li>
				<li>
					<a href={resolve('/entrar')}>Entrar</a> · <a href={resolve('/registro')}>Crear cuenta</a>
				</li>
			</ul>
		</section>
	</div>
	<div class="border-t border-rule">
		<p class="mx-auto max-w-[1180px] px-5 py-4 font-sans text-[12px] text-ink-faint sm:px-8">
			Se ve bien con cualquier navegador, a cualquier tamaño y con teclado. Hecho a mano.
		</p>
	</div>
	<div aria-hidden="true" class="h-3 sky"></div>
</footer>
