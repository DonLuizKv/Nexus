<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import IconUserPlus from '@tabler/icons-svelte-runes/icons/user-plus';
	import IconCheck from '@tabler/icons-svelte-runes/icons/check';
	import AuthShell from '#lib/components/AuthShell.svelte';
	import { auth } from '#lib/auth.svelte';
	import { safeNext } from '#lib/next';
	import { notice } from '#lib/notice.svelte';

	const next = $derived(safeNext(page.url.searchParams.get('next'), ''));

	let name = $state('');
	let handle = $state('');
	let email = $state('');
	let password = $state('');
	let busy = $state(false);
	let errors = $state<Partial<Record<'handle' | 'email' | 'password', string>>>({});

	const checks = $derived([
		{ ok: password.length >= 8, label: 'Al menos 8 caracteres' },
		{ ok: /\d/.test(password) && /\D/.test(password), label: 'Letras y números' }
	]);
	const emailOk = $derived(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()));

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		errors = {};
		if (!emailOk) errors = { email: 'Escribe un correo válido.' };
		if (errors.email) {
			document.getElementById('reg-email')?.focus();
			return;
		}
		busy = true;
		const result = await auth.register({ name, handle, email, password });
		busy = false;
		if (!result.ok) {
			errors = { [result.field]: result.message };
			document.getElementById(`reg-${result.field}`)?.focus();
			return;
		}
		notice.show('Cuenta creada');
		const home = resolve('/u/[handle]', { handle: auth.user?.handle ?? handle });
		await goto(next ? resolve(next as '/') : home);
	}
</script>

<svelte:head>
	<title>Crear cuenta · Nexus</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<AuthShell title="Crear cuenta">
	<p class="mt-3 text-[17px] text-ink-soft">
		¿Ya tienes una? <a href={resolve(`/entrar?next=${encodeURIComponent(next || '/')}`)}>Entra</a>.
	</p>

	<form onsubmit={submit} class="mt-8 grid gap-6" novalidate>
		<div>
			<label for="reg-name" class="eyebrow text-ink-faint">Nombre</label>
			<input
				id="reg-name"
				bind:value={name}
				autocomplete="name"
				maxlength="40"
				class="mt-2 field font-sans"
			/>
		</div>
		<div>
			<label for="reg-handle" class="eyebrow text-ink-faint">Nombre de usuario</label>
			<div class="mt-2 flex items-stretch">
				<span
					class="flex items-center border border-r-0 border-ink-faint bg-paper-deep px-3 font-mono text-[14px] text-ink-faint"
					>nexus.app/u/</span
				>
				<input
					id="reg-handle"
					bind:value={handle}
					autocomplete="username"
					autocapitalize="none"
					spellcheck="false"
					maxlength="20"
					required
					aria-invalid={!!errors.handle}
					aria-describedby="reg-handle-help"
					class="field font-mono"
				/>
			</div>
			<p
				id="reg-handle-help"
				class={['mt-1.5 font-sans text-[12px]', errors.handle ? 'text-danger' : 'text-ink-faint']}
			>
				{errors.handle ?? 'Minúsculas, números, punto, guion o guion bajo. Será tu dirección.'}
			</p>
		</div>
		<div>
			<label for="reg-email" class="eyebrow text-ink-faint">Correo</label>
			<input
				id="reg-email"
				type="email"
				bind:value={email}
				autocomplete="email"
				required
				aria-invalid={!!errors.email}
				aria-describedby="reg-email-error"
				class="mt-2 field font-sans"
			/>
			{#if errors.email}
				<p id="reg-email-error" class="mt-1.5 font-sans text-[12px] text-danger">{errors.email}</p>
			{/if}
		</div>
		<div>
			<label for="reg-password" class="eyebrow text-ink-faint">Contraseña</label>
			<input
				id="reg-password"
				type="password"
				bind:value={password}
				autocomplete="new-password"
				required
				aria-invalid={!!errors.password}
				aria-describedby="reg-password-checks"
				class="mt-2 field font-sans"
			/>
			<ul id="reg-password-checks" class="mt-2 grid gap-1 font-sans text-[12px]">
				{#each checks as c (c.label)}
					<li class={['flex items-center gap-1.5', c.ok ? 'text-ok' : 'text-ink-faint']}>
						<IconCheck size={14} aria-hidden="true" class={c.ok ? '' : 'opacity-30'} />
						{c.label}<span class="sr-only">{c.ok ? ': cumplido' : ': pendiente'}</span>
					</li>
				{/each}
			</ul>
			{#if errors.password}
				<p class="mt-1.5 font-sans text-[12px] text-danger">{errors.password}</p>
			{/if}
		</div>
		<button
			type="submit"
			class="btn min-h-12 btn-primary"
			disabled={busy || !handle.trim() || !email.trim() || !password}
		>
			<IconUserPlus size={18} aria-hidden="true" />
			{busy ? 'Creando…' : 'Crear cuenta'}
		</button>
		<p class="font-sans text-[12px] text-ink-faint">
			Modo demostración: la cuenta se guarda solo en este navegador y la contraseña se almacena
			derivada con PBKDF2, nunca en claro.
		</p>
	</form>
</AuthShell>
