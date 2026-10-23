<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import IconLogin from '@tabler/icons-svelte-runes/icons/login';
	import IconUser from '@tabler/icons-svelte-runes/icons/user';
	import IconEye from '@tabler/icons-svelte-runes/icons/eye';
	import IconEyeOff from '@tabler/icons-svelte-runes/icons/eye-off';
	import AuthShell from '#lib/components/AuthShell.svelte';
	import { auth } from '#lib/auth.svelte';
	import { safeNext } from '#lib/next';
	import { notice } from '#lib/notice.svelte';

	const next = $derived(safeNext(page.url.searchParams.get('next')));

	let identifier = $state('');
	let password = $state('');
	let reveal = $state(false);
	let error = $state('');
	let busy = $state(false);

	async function finish() {
		notice.show(`Hola, ${auth.user?.name ?? ''}`);
		await goto(resolve(next as '/'));
	}

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		error = '';
		busy = true;
		const result = await auth.login(identifier, password);
		busy = false;
		if (!result.ok) {
			error = result.message;
			document.getElementById('login-password')?.focus();
			return;
		}
		await finish();
	}

	async function guest() {
		busy = true;
		await auth.guest();
		busy = false;
		await finish();
	}
</script>

<svelte:head>
	<title>Entrar · Nexus</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<AuthShell title="Entrar">
	{#if auth.user}
		<p class="mt-6 text-[17px] text-ink-soft">
			Ya has entrado como <strong>{auth.user.handle}</strong>.
			<a href={resolve('/u/[handle]', { handle: auth.user.handle })}>Ir a tu página</a>.
		</p>
	{:else}
		<p class="mt-3 text-[17px] text-ink-soft">
			¿No tienes cuenta? <a href={resolve(`/registro?next=${encodeURIComponent(next)}`)}
				>Crea una en un minuto</a
			>.
		</p>

		<form onsubmit={submit} class="mt-8 grid gap-6" novalidate>
			<div>
				<label for="login-id" class="eyebrow text-ink-faint">Usuario o correo</label>
				<input
					id="login-id"
					bind:value={identifier}
					autocomplete="username"
					autocapitalize="none"
					spellcheck="false"
					required
					class="mt-2 field font-sans"
				/>
			</div>
			<div>
				<label for="login-password" class="eyebrow text-ink-faint">Contraseña</label>
				<div class="relative mt-2">
					<input
						id="login-password"
						type={reveal ? 'text' : 'password'}
						bind:value={password}
						autocomplete="current-password"
						required
						aria-invalid={!!error}
						aria-describedby="login-error"
						class="field pr-12 font-sans"
					/>
					<button
						type="button"
						class="absolute inset-y-0 right-0 px-3 text-ink-soft hover:text-ink"
						aria-label={reveal ? 'Ocultar contraseña' : 'Mostrar contraseña'}
						aria-pressed={reveal}
						onclick={() => (reveal = !reveal)}
					>
						{#if reveal}<IconEyeOff size={18} aria-hidden="true" />{:else}<IconEye
								size={18}
								aria-hidden="true"
							/>{/if}
					</button>
				</div>
				{#if error}
					<p id="login-error" role="alert" class="mt-2 font-sans text-[13px] text-danger">
						{error}
					</p>
				{/if}
			</div>
			<button
				type="submit"
				class="btn min-h-12 btn-primary"
				disabled={busy || !identifier.trim() || !password}
			>
				<IconLogin size={18} aria-hidden="true" />
				{busy ? 'Entrando…' : 'Entrar'}
			</button>
		</form>

		<div class="mt-10 border-t border-dashed border-rule pt-6">
			<p class="text-[15px] text-ink-soft">¿Solo quieres echar un vistazo?</p>
			<button type="button" class="mt-3 btn" onclick={guest} disabled={busy}>
				<IconUser size={16} aria-hidden="true" /> Entrar como invitado
			</button>
			<p class="mt-3 font-sans text-[12px] text-ink-faint">
				Modo demostración: las cuentas se guardan solo en este navegador.
			</p>
		</div>
	{/if}
</AuthShell>
