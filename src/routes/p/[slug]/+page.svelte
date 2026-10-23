<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import IconCopy from '@tabler/icons-svelte-runes/icons/copy';
	import IconStar from '@tabler/icons-svelte-runes/icons/star';
	import IconStarFilled from '@tabler/icons-svelte-runes/icons/star-filled';
	import IconEdit from '@tabler/icons-svelte-runes/icons/edit';
	import IconShare from '@tabler/icons-svelte-runes/icons/share-2';
	import IconZip from '@tabler/icons-svelte-runes/icons/file-zip';
	import IconTrash from '@tabler/icons-svelte-runes/icons/trash';
	import IconLock from '@tabler/icons-svelte-runes/icons/lock';
	import IconBomb from '@tabler/icons-svelte-runes/icons/bomb';
	import IconChevronLeft from '@tabler/icons-svelte-runes/icons/chevron-left';
	import IconChevronRight from '@tabler/icons-svelte-runes/icons/chevron-right';
	import IconMessage from '@tabler/icons-svelte-runes/icons/message-circle';
	import Avatar from '#lib/components/Avatar.svelte';
	import FileBrowser from '#lib/components/FileBrowser.svelte';
	import InstallPanel from '#lib/components/InstallPanel.svelte';
	import KindBadge from '#lib/components/KindBadge.svelte';
	import ShareDialog from '#lib/components/ShareDialog.svelte';
	import TestBench from '#lib/components/TestBench.svelte';
	import { auth } from '#lib/auth.svelte';
	import { download, toZip } from '#lib/entries/bundle';
	import { KINDS, VISIBILITY, categoryLabel } from '#lib/entries/catalog';
	import { library } from '#lib/entries/library.svelte';
	import { compact, extractVariables, formatDate, plural, relativeDate } from '#lib/entries/text';
	import type { Entry } from '#lib/entries/types';
	import { copyText, notice } from '#lib/notice.svelte';

	const slug = $derived(page.params.slug ?? '');

	/** Set when a burn-after-reading entry is opened: it's deleted and only this copy remains. */
	let burned = $state<Entry>();
	const stored = $derived(library.get(slug));
	const entry = $derived(burned?.slug === slug ? burned : stored);
	const isBurned = $derived(!!burned && burned.slug === slug);
	const needsConsent = $derived(entry?.visibility === 'burn' && !isBurned);

	let shareOpen = $state(false);
	let message = $state('');

	const user = $derived(auth.user);
	const isOwner = $derived(!!user && entry?.author === user.handle);
	const info = $derived(entry ? KINDS[entry.kind] : undefined);
	const main = $derived(entry?.files[0]);
	const variables = $derived(extractVariables(main?.content ?? ''));
	const ring = $derived(entry ? library.neighbours(entry.slug) : {});
	const starred = $derived(entry ? library.isStarred(entry.slug, user?.handle) : false);
	const shareUrl = $derived(`${page.url.origin}${page.url.pathname}`);
	const multi = $derived((entry?.files.length ?? 0) > 1);
	const authorProfile = $derived(entry ? auth.profile(entry.author) : undefined);

	function reveal() {
		if (!entry) return;
		burned = $state.snapshot(entry) as Entry;
		library.remove(entry.slug);
	}

	function used() {
		if (entry && !isBurned) library.recordUse(entry.slug);
	}

	function copyMain() {
		if (!main) return;
		copyText(main.content, `${main.path} copiado`);
		used();
	}

	function zip() {
		if (!entry) return;
		download(`${entry.slug}.zip`, toZip(entry.files));
		used();
	}

	function star() {
		if (!entry) return;
		if (!user) {
			goto(resolve(`/entrar?next=${encodeURIComponent(page.url.pathname)}`));
			return;
		}
		library.toggleStar(entry.slug, user.handle);
	}

	function remove() {
		if (!entry || !user) return;
		if (!confirm(`¿Eliminar «${entry.title}»? Esto no se puede deshacer.`)) return;
		library.remove(entry.slug, user.handle);
		notice.show('Entrada eliminada');
		goto(resolve('/u/[handle]', { handle: user.handle }));
	}

	function sign(event: SubmitEvent) {
		event.preventDefault();
		if (!entry || !user || !message.trim()) return;
		library.comment(entry.slug, user.handle, message);
		message = '';
		notice.show('Gracias por firmar');
	}
</script>

<svelte:head>
	{#if entry}
		<title>{entry.title} · Nexus</title>
		<meta name="description" content={entry.summary} />
		{#if entry.visibility !== 'public'}
			<meta name="robots" content="noindex" />
		{/if}
	{:else}
		<title>No encontrado · Nexus</title>
		<meta name="robots" content="noindex" />
	{/if}
</svelte:head>

{#if !entry || !info}
	<div class="mx-auto max-w-[720px] px-5 py-24 text-center sm:px-8">
		{#if !library.ready}
			<p class="font-sans text-[14px] text-ink-faint" aria-live="polite">Buscando…</p>
		{:else}
			<p class="font-mono text-[14px] text-ink-faint">Error 404</p>
			<h1 class="mt-3 font-serif text-[40px] leading-tight font-bold">
				Esta entrada no existe, o ya se autodestruyó.
			</h1>
			<p class="mt-4 text-[17px] text-ink-soft">
				Puede que el enlace sea antiguo o que fuera de un solo uso.
			</p>
			<div class="mt-8 flex flex-wrap justify-center gap-2">
				<a href={resolve('/buscar')} class="btn btn-primary">Explorar</a>
				<a href={resolve('/')} class="btn">Volver al inicio</a>
			</div>
		{/if}
	</div>
{:else if needsConsent}
	<!-- Interstitial before consuming a burn-after-reading link. -->
	<div class="mx-auto max-w-[640px] px-5 py-20 sm:px-8">
		<div
			role="alertdialog"
			aria-labelledby="burn-title"
			aria-describedby="burn-desc"
			class="border-2 border-danger bg-sheet shadow-[8px_8px_0_rgb(179_38_30/0.2)]"
		>
			<p
				class="flex items-center gap-2 bg-danger px-6 py-2 font-sans text-[12px] font-bold tracking-[0.14em] text-white uppercase"
			>
				<IconBomb size={16} aria-hidden="true" /> Enlace de un solo uso
			</p>
			<div class="p-6 sm:p-8">
				<h1 id="burn-title" class="font-serif text-[30px] leading-tight font-bold">
					Esta entrada se autodestruye al abrirla.
				</h1>
				<p id="burn-desc" class="mt-3 text-[17px] text-ink-soft">
					Podrás leerla, copiarla y descargarla mientras sigas en esta página. Después, el enlace
					dejará de funcionar para siempre.
				</p>
				<div class="mt-8 flex flex-wrap gap-2">
					<button type="button" class="btn min-h-12 btn-danger px-6" onclick={reveal}
						>Abrir y destruir</button
					>
					<a href={resolve('/')} class="btn min-h-12">Ahora no</a>
				</div>
			</div>
		</div>
	</div>
{:else}
	<article aria-labelledby="entry-title">
		<!-- Kind-colored rule: the first thing that tells you what this is. -->
		<div aria-hidden="true" class={['h-1.5', info.bg]}></div>
		<div class="mx-auto max-w-[1180px] px-5 sm:px-8">
			{#if isBurned}
				<p
					role="alert"
					class="mt-8 border-l-4 border-danger bg-danger-soft px-5 py-3 font-sans text-[14px] text-danger-ink"
				>
					<strong>Destruida.</strong> Es la única vez que verás esta entrada: cópiala o descárgala antes
					de salir.
				</p>
			{/if}

			<nav aria-label="Ruta" class="pt-10 font-sans text-[13px] text-ink-faint">
				<a href={resolve('/')}>Inicio</a>
				<span aria-hidden="true" class="mx-1.5">›</span>
				<a href={resolve(`/buscar?tipo=${entry.kind}`)}>{info.plural}</a>
				<span aria-hidden="true" class="mx-1.5">›</span>
				<span aria-current="page">{entry.title}</span>
			</nav>

			<header class="max-w-[880px] pt-6">
				<KindBadge kind={entry.kind} tone="solid" />
				<h1
					id="entry-title"
					class="mt-4 font-serif text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.05] font-bold tracking-tight text-balance motion-safe:animate-rise"
				>
					{entry.title}
				</h1>
				<p
					class="mt-4 max-w-[60ch] text-[19px] leading-relaxed text-ink-soft motion-safe:animate-rise"
					style="animation-delay: 60ms"
				>
					{entry.summary}
				</p>
				<p
					class="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 font-sans text-[13px] text-ink-faint"
				>
					<a
						href={resolve('/u/[handle]', { handle: entry.author })}
						class="inline-flex items-center gap-2 text-ink-soft visited:text-ink-soft"
					>
						<Avatar handle={entry.author} />
						<strong>{authorProfile?.name ?? entry.author}</strong>
					</a>
					<span aria-hidden="true">·</span>
					<span>actualizado {relativeDate(entry.updatedAt)}</span>
					<span aria-hidden="true">·</span>
					<span class="inline-flex items-center gap-1"
						><IconStar size={14} aria-hidden="true" />
						{compact(entry.stars)}
						<span class="sr-only">estrellas</span></span
					>
					<span aria-hidden="true">·</span>
					<span>{compact(entry.uses)} usos</span>
					{#if entry.visibility !== 'public'}
						<span aria-hidden="true">·</span>
						<span class="inline-flex items-center gap-1 text-ink-soft">
							{#if entry.visibility === 'unlisted'}<IconLock
									size={14}
									aria-hidden="true"
								/>{:else}<IconBomb size={14} aria-hidden="true" />{/if}
							{VISIBILITY[entry.visibility].label}
						</span>
					{/if}
				</p>
			</header>

			<div class="mt-8 flex flex-wrap gap-2" role="toolbar" aria-label="Acciones">
				<button type="button" class="btn btn-primary" onclick={copyMain}>
					<IconCopy size={16} aria-hidden="true" />
					{entry.kind === 'prompt' ? 'Copiar prompt' : `Copiar ${main?.path.split('/').at(-1)}`}
				</button>
				{#if multi || entry.kind !== 'prompt'}
					<button type="button" class="btn" onclick={zip}>
						<IconZip size={16} aria-hidden="true" /> Descargar .zip
					</button>
				{/if}
				{#if !isBurned}
					<button type="button" class="btn" aria-pressed={starred} onclick={star}>
						{#if starred}
							<IconStarFilled size={16} aria-hidden="true" class="text-[#c99400]" /> Con estrella
						{:else}
							<IconStar size={16} aria-hidden="true" /> Dar estrella
						{/if}
					</button>
					<button type="button" class="btn" onclick={() => (shareOpen = true)}>
						<IconShare size={16} aria-hidden="true" /> Compartir
					</button>
					{#if isOwner}
						<a href={resolve('/p/[slug]/editar', { slug: entry.slug })} class="btn">
							<IconEdit size={16} aria-hidden="true" /> Editar
						</a>
					{/if}
				{/if}
			</div>

			<nav
				aria-label="En esta página"
				class="mt-10 flex flex-wrap gap-x-5 gap-y-1 border-y border-rule py-3 font-sans text-[13px]"
			>
				<span class="text-ink-faint">En esta página:</span>
				<a href="#archivos">{multi ? `Archivos (${entry.files.length})` : 'Contenido'}</a>
				{#if entry.kind === 'prompt'}<a href="#probar">Probar</a>{/if}
				<a href="#instalar">Instalar</a>
				<a href="#libro">Libro de visitas ({entry.comments.length})</a>
			</nav>

			<div class="grid gap-14 pt-12 lg:grid-cols-[minmax(0,1fr)_290px]">
				<section id="archivos" aria-labelledby="files-heading" class="min-w-0 scroll-mt-6">
					<div class="mb-4 flex flex-wrap items-baseline justify-between gap-3">
						<h2 id="files-heading" class="eyebrow text-ink-faint">
							{multi ? plural(entry.files.length, 'archivo', 'archivos') : 'Contenido'}
						</h2>
						{#if variables.length}
							<p class="font-sans text-[12px] text-ink-faint">
								{plural(variables.length, 'variable', 'variables')} para rellenar
							</p>
						{/if}
					</div>
					<FileBrowser files={entry.files} oncopy={used} />
				</section>

				<aside aria-labelledby="card-title" class="lg:pt-[2.15rem]">
					<!-- Library index card. -->
					<div class="border border-rule bg-sheet">
						<h2
							id="card-title"
							class="border-b-2 border-[rgb(200_60_60/0.35)] px-5 pt-4 pb-2 eyebrow text-ink-faint"
						>
							Ficha
						</h2>
						<dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 px-5 py-4 text-[15px]">
							<dt class="font-sans text-[12px] text-ink-faint">Tipo</dt>
							<dd class={['font-bold', info.text]}>{info.label}</dd>
							<dt class="font-sans text-[12px] text-ink-faint">Tema</dt>
							<dd>
								<a href={resolve(`/buscar?tema=${entry.category}`)}
									>{categoryLabel(entry.category)}</a
								>
							</dd>
							<dt class="font-sans text-[12px] text-ink-faint">Para</dt>
							<dd>
								<ul class="flex flex-wrap gap-x-3 gap-y-0.5">
									{#each entry.targets as t (t)}
										<li><a href={resolve(`/buscar?para=${encodeURIComponent(t)}`)}>{t}</a></li>
									{/each}
								</ul>
							</dd>
							<dt class="font-sans text-[12px] text-ink-faint">Archivos</dt>
							<dd>{entry.files.length}</dd>
							<dt class="font-sans text-[12px] text-ink-faint">Creado</dt>
							<dd>{formatDate(entry.createdAt)}</dd>
							<dt class="font-sans text-[12px] text-ink-faint">Visible</dt>
							<dd>{VISIBILITY[entry.visibility].label}</dd>
						</dl>
						{#if entry.tags.length}
							<p
								class="flex flex-wrap gap-x-3 gap-y-1 border-t border-rule px-5 py-3 font-sans text-[13px]"
							>
								{#each entry.tags as tag (tag)}
									<a href={resolve(`/buscar?q=${encodeURIComponent(tag)}`)}>#{tag}</a>
								{/each}
							</p>
						{/if}
					</div>
					{#if isOwner && !isBurned}
						<button
							type="button"
							class="mt-4 inline-flex items-center gap-1.5 font-sans text-[13px] text-danger underline"
							onclick={remove}
							><IconTrash size={14} aria-hidden="true" /> Eliminar esta entrada</button
						>
					{/if}
				</aside>
			</div>
		</div>

		{#if entry.kind === 'prompt' && main}
			<section
				id="probar"
				aria-labelledby="test-title"
				class="mt-20 scroll-mt-6 border-y border-rule bg-paper-deep py-14"
			>
				<div class="mx-auto max-w-[1180px] px-5 sm:px-8">
					<h2 id="test-title" class="font-serif text-[32px] leading-none font-bold">Probar</h2>
					<p class="mt-2 mb-8 text-[16px] text-ink-soft">
						Rellena las variables y mira cómo responde antes de copiarlo.
					</p>
					{#key entry.slug}
						<TestBench
							body={main.content}
							category={entry.category}
							models={entry.targets.filter((t) =>
								['ChatGPT', 'Claude', 'Gemini', 'Llama', 'Midjourney'].includes(t)
							)}
							idPrefix="run"
						/>
					{/key}
				</div>
			</section>
		{/if}

		<section
			id="instalar"
			aria-labelledby="install-title"
			class={[
				'scroll-mt-6',
				entry.kind === 'prompt' ? 'pt-20' : 'mt-20 border-y border-rule bg-paper-deep py-14'
			]}
		>
			<div class="mx-auto max-w-[1180px] px-5 sm:px-8">
				<h2 id="install-title" class="font-serif text-[32px] leading-none font-bold">
					Instalar en tu proyecto
				</h2>
				<p class="mt-2 mb-8 max-w-[64ch] text-[16px] text-ink-soft">
					Para agentes y editores de código: crea {entry.files.length === 1
						? 'el archivo'
						: 'los archivos'} en su ruta con un comando, o pásaselos a tu agente.
				</p>
				<InstallPanel {entry} url={shareUrl} onuse={used} />
			</div>
		</section>

		<div class="mx-auto max-w-[1180px] px-5 pt-20 sm:px-8">
			<section id="libro" aria-labelledby="guest-title" class="max-w-[760px] scroll-mt-6">
				<h2
					id="guest-title"
					class="flex items-center gap-2 border-b-2 border-ink pb-3 font-serif text-[28px] leading-none font-bold"
				>
					<IconMessage size={26} aria-hidden="true" /> Libro de visitas
				</h2>
				{#if isBurned}
					<!-- Nothing to sign: the entry no longer exists. -->
				{:else if user}
					<form onsubmit={sign} class="mt-6 grid gap-3">
						<label for="guest-msg" class="flex items-center gap-2 eyebrow text-ink-faint">
							<Avatar handle={user.handle} /> Firmar como {user.handle}
						</label>
						<textarea
							id="guest-msg"
							bind:value={message}
							rows="3"
							maxlength="500"
							required
							placeholder="¿Cómo te funcionó? ¿Algún truco?"
							class="field resize-y text-[15px]"></textarea>
						<div>
							<button type="submit" class="btn" disabled={!message.trim()}>Firmar el libro</button>
						</div>
					</form>
				{:else}
					<p class="mt-6 text-[15px] text-ink-soft">
						<a href={resolve(`/entrar?next=${encodeURIComponent(page.url.pathname)}`)}>Entra</a>
						o <a href={resolve('/registro')}>crea una cuenta</a> para firmar el libro.
					</p>
				{/if}
				{#if entry.comments.length}
					<ul class="mt-4">
						{#each entry.comments as c (c.id)}
							<li class="grid grid-cols-[auto_1fr] gap-3 border-b border-rule py-4">
								<Avatar handle={c.author} size="md" />
								<div>
									<p class="text-[16px]">“{c.message}”</p>
									<p class="mt-1 font-sans text-[12px] text-ink-faint">
										— <a href={resolve('/u/[handle]', { handle: c.author })} class="text-ink-soft"
											>{c.author}</a
										>, {relativeDate(c.createdAt)}
									</p>
								</div>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="mt-6 text-[15px] text-ink-faint">Nadie ha firmado todavía.</p>
				{/if}
			</section>
		</div>

		{#if ring.prev && ring.next && !isBurned && entry.visibility === 'public'}
			<nav
				aria-label="Webring"
				class="mx-auto mt-20 grid max-w-[1180px] gap-4 px-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:px-8"
			>
				<a
					href={resolve('/p/[slug]', { slug: ring.prev.slug })}
					class="border-t-2 border-ink pt-3 no-underline"
				>
					<span class="inline-flex items-center gap-1 eyebrow text-ink-faint"
						><IconChevronLeft size={14} aria-hidden="true" /> Anterior</span
					>
					<span class="mt-1 block font-serif text-[18px] font-bold underline"
						>{ring.prev.title}</span
					>
				</a>
				<p class="text-center eyebrow text-ink-faint">✦ Webring ✦</p>
				<a
					href={resolve('/p/[slug]', { slug: ring.next.slug })}
					class="border-t-2 border-ink pt-3 text-right no-underline"
				>
					<span class="inline-flex items-center gap-1 eyebrow text-ink-faint"
						>Siguiente <IconChevronRight size={14} aria-hidden="true" /></span
					>
					<span class="mt-1 block font-serif text-[18px] font-bold underline"
						>{ring.next.title}</span
					>
				</a>
			</nav>
		{/if}
	</article>

	{#if !isBurned}
		<ShareDialog {entry} url={shareUrl} bind:open={shareOpen} />
	{/if}
{/if}
