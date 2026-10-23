import type { CategoryId } from './types';

/**
 * Local stand-in for a model call, used until the backend exposes a run endpoint.
 * Yields the reply in small chunks so the UI can stream it.
 */
export async function* simulateRun(
	filled: string,
	category: CategoryId,
	model: string,
	signal: AbortSignal
): AsyncGenerator<string> {
	const reply = composeReply(filled, category, model);
	const words = reply.split(/(\s+)/);
	for (const word of words) {
		if (signal.aborted) return;
		await new Promise((r) => setTimeout(r, word.trim() ? 18 + Math.random() * 40 : 0));
		yield word;
	}
}

function firstLine(text: string, max = 80): string {
	const line = text.split('\n').find((l) => l.trim()) ?? '';
	return line.length > max ? `${line.slice(0, max)}…` : line;
}

function composeReply(filled: string, category: CategoryId, model: string): string {
	const unresolved = filled.match(/\{\{[^}]+\}\}/g);
	const warning = unresolved?.length
		? `Nota: faltan valores para ${[...new Set(unresolved)].join(', ')}. Los dejé tal cual.\n\n`
		: '';
	const head = `[${model}] Instrucción recibida: "${firstLine(filled)}"\n\n`;
	const bodies: Record<CategoryId, string> = {
		codigo: `1. Bug (alta): la función no valida entradas vacías; devuelve undefined en lugar de lanzar un error claro.
   Corrección: añade una comprobación al inicio y lanza un TypeError con el nombre del parámetro.
2. Diseño (media): la lógica de red y la de formato están mezcladas. Sepáralas en dos funciones puras.
3. Estilo (baja): renombra "tmp" a algo que diga qué guarda.`,
		escritura: `Aquí va la versión reescrita, más directa y con frases cortas.

"Hemos revisado tu propuesta y nos gusta. Antes de firmar, necesitamos dos cosas: el calendario por fases y el coste del soporte."

Cambios principales:
- Quité dos frases de relleno del inicio.
- Convertí la voz pasiva en activa.
- Agrupé las peticiones en una sola frase.`,
		imagen: `Objetivo 35 mm a f/2, hora dorada, luz lateral cálida desde una ventana, paleta ámbar y verde petróleo, grano fino de película 400 ISO, composición en regla de tercios con el sujeto a la izquierda y aire hacia la derecha.`,
		datos: `{
  "proveedor": "Papelería Martínez S.L.",
  "fecha": "2026-10-03",
  "total": 248.6,
  "moneda": "EUR",
  "impuestos": [{ "tipo": "IVA 21%", "importe": 43.15 }]
}`,
		aprendizaje: `Buena pregunta para empezar. Antes de resolver nada:

¿Qué crees que representa el número de abajo en una fracción? Intenta explicarlo con un ejemplo de algo que se reparte.`,
		negocio: `Asunto: ¿Seguimos con la prueba?

Hola, gracias otra vez por la llamada del martes. Preparé el resumen con los tres puntos que comentamos y una propuesta de calendario.

¿Te va bien que lo revisemos 15 minutos el jueves?`
	};
	return warning + head + bodies[category];
}
