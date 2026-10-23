/** Only same-origin paths are allowed as post-login destinations (no open redirects). */
export function safeNext(value: string | null, fallback = '/'): string {
	if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\'))
		return fallback;
	return value;
}
