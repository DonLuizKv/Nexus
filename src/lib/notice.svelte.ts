/** One-line status message announced through the layout's aria-live region. */
class Notice {
	message = $state('');
	#timer: ReturnType<typeof setTimeout> | undefined;

	show(message: string, ms = 2600) {
		clearTimeout(this.#timer);
		// Reset first so repeating the same message is announced again.
		this.message = '';
		queueMicrotask(() => (this.message = message));
		this.#timer = setTimeout(() => (this.message = ''), ms);
	}
}

export const notice = new Notice();

export async function copyText(text: string, label = 'Copiado al portapapeles'): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		notice.show(label);
		return true;
	} catch {
		notice.show('No se pudo copiar. Selecciona el texto y usa Ctrl+C.');
		return false;
	}
}
