import { browser } from '$app/env';

const STORAGE_KEY = 'nexus:auth:v1';

export interface Profile {
	handle: string;
	name: string;
	bio: string;
	joinedAt: string;
}

interface Account extends Profile {
	email: string;
	/** PBKDF2-SHA256, hex. Empty for seed authors, who can't sign in. */
	hash: string;
	salt: string;
}

type Result = { ok: true } | { ok: false; field: 'handle' | 'email' | 'password'; message: string };

const SEED_ACCOUNTS: Account[] = [
	['marta.dev', 'Marta Ruiz', 'Backend y revisiones de código. Escribo skills para mis agentes.'],
	['ops.tomas', 'Tomás Ortega', 'Seguridad y agentes. Subagentes que revisan antes que yo.'],
	['luiz', 'Luiz', 'Hago Nexus. Reglas y contexto para agentes que programan en SvelteKit.'],
	['lucia_escribe', 'Lucía Prado', 'Editora. Prompts para escribir como una persona.'],
	['data_ines', 'Inés Vidal', 'Datos y APIs. Contextos que ahorran explicaciones.'],
	['kiko.lumen', 'Kiko Lumen', 'Fotógrafo. Dirección de arte para modelos de imagen.'],
	['profe_andres', 'Andrés Gil', 'Profesor de matemáticas.'],
	['carla.b2b', 'Carla Benítez', 'Ventas B2B.']
].map(([handle, name, bio]) => ({
	handle,
	name,
	bio,
	joinedAt: '2026-05-01T00:00:00Z',
	email: '',
	hash: '',
	salt: ''
}));

const HANDLE = /^[a-z0-9._-]{3,20}$/;

async function derive(password: string, salt: string): Promise<string> {
	const key = await crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(password),
		'PBKDF2',
		false,
		['deriveBits']
	);
	const bits = await crypto.subtle.deriveBits(
		{ name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(salt), iterations: 120_000 },
		key,
		256
	);
	return [...new Uint8Array(bits)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Local, demo-only accounts kept in localStorage. Same public surface the real API-backed
 * session will expose (user, register, login, logout, profile).
 */
class Auth {
	#accounts = $state<Account[]>(SEED_ACCOUNTS);
	#session = $state<string | null>(null);
	ready = $state(false);

	load() {
		if (!browser || this.ready) return;
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const saved = JSON.parse(raw) as { accounts: Account[]; session: string | null };
				const extra = saved.accounts.filter(
					(a) => !SEED_ACCOUNTS.some((s) => s.handle === a.handle)
				);
				this.#accounts = [...SEED_ACCOUNTS, ...extra];
				this.#session = saved.session;
			}
		} catch {
			// Ignore corrupt storage.
		}
		this.ready = true;
	}

	#persist() {
		if (!browser) return;
		const accounts = this.#accounts.filter((a) => a.hash);
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ accounts, session: this.#session }));
	}

	get user(): Profile | undefined {
		const account = this.#accounts.find((a) => a.handle === this.#session);
		if (!account) return;
		const { handle, name, bio, joinedAt } = account;
		return { handle, name, bio, joinedAt };
	}

	profile(handle: string): Profile | undefined {
		const account = this.#accounts.find((a) => a.handle === handle);
		if (!account) return;
		const { name, bio, joinedAt } = account;
		return { handle, name, bio, joinedAt };
	}

	async register(input: {
		name: string;
		handle: string;
		email: string;
		password: string;
	}): Promise<Result> {
		const handle = input.handle.trim().toLowerCase();
		const email = input.email.trim().toLowerCase();
		if (!HANDLE.test(handle))
			return {
				ok: false,
				field: 'handle',
				message: 'Entre 3 y 20 caracteres: minúsculas, números, punto, guion o guion bajo.'
			};
		if (this.#accounts.some((a) => a.handle === handle))
			return { ok: false, field: 'handle', message: 'Ese nombre de usuario ya existe.' };
		if (this.#accounts.some((a) => a.email && a.email === email))
			return { ok: false, field: 'email', message: 'Ya hay una cuenta con ese correo.' };
		if (input.password.length < 8)
			return { ok: false, field: 'password', message: 'Usa al menos 8 caracteres.' };

		const salt = crypto.randomUUID();
		this.#accounts.push({
			handle,
			email,
			name: input.name.trim() || handle,
			bio: '',
			joinedAt: new Date().toISOString(),
			salt,
			hash: await derive(input.password, salt)
		});
		this.#session = handle;
		this.#persist();
		return { ok: true };
	}

	async login(identifier: string, password: string): Promise<Result> {
		const id = identifier.trim().toLowerCase();
		const account = this.#accounts.find((a) => a.hash && (a.handle === id || a.email === id));
		// Same message for unknown user and wrong password: don't reveal which accounts exist.
		const fail: Result = {
			ok: false,
			field: 'password',
			message: 'Usuario o contraseña incorrectos.'
		};
		if (!account) return fail;
		if ((await derive(password, account.salt)) !== account.hash) return fail;
		this.#session = account.handle;
		this.#persist();
		return { ok: true };
	}

	/** One-click demo account so visitors can try creating and editing. */
	async guest(): Promise<void> {
		const handle = 'invitado';
		if (!this.#accounts.some((a) => a.handle === handle)) {
			const salt = crypto.randomUUID();
			this.#accounts.push({
				handle,
				email: '',
				name: 'Invitado',
				bio: 'Cuenta de demostración.',
				joinedAt: new Date().toISOString(),
				salt,
				hash: await derive(crypto.randomUUID(), salt)
			});
		}
		this.#session = handle;
		this.#persist();
	}

	updateBio(bio: string) {
		const account = this.#accounts.find((a) => a.handle === this.#session);
		if (!account) return;
		account.bio = bio.trim().slice(0, 160);
		this.#persist();
	}

	logout() {
		this.#session = null;
		this.#persist();
	}
}

export const auth = new Auth();
