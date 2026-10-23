<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import IconLogin from '@tabler/icons-svelte-runes/icons/login';
	import IconUserPlus from '@tabler/icons-svelte-runes/icons/user-plus';

	interface Props {
		title: string;
		reason: string;
	}

	let { title, reason }: Props = $props();

	const next = $derived(encodeURIComponent(page.url.pathname));
</script>

<div class="mx-auto max-w-[560px] py-20 text-center">
	<h1 class="font-serif text-[36px] leading-tight font-bold">{title}</h1>
	<p class="mt-3 text-[17px] text-ink-soft">{reason}</p>
	<div class="mt-8 flex flex-wrap justify-center gap-2">
		<a href={resolve(`/entrar?next=${next}`)} class="btn min-h-12 btn-primary px-6">
			<IconLogin size={18} aria-hidden="true" /> Entrar
		</a>
		<a href={resolve(`/registro?next=${next}`)} class="btn min-h-12">
			<IconUserPlus size={18} aria-hidden="true" /> Crear cuenta
		</a>
	</div>
</div>
