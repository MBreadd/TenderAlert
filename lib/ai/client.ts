/**
 * Cliente de Claude (Anthropic SDK oficial) — SOLO server-side.
 * NUNCA importar este archivo desde un componente cliente: expondría la API key.
 *
 * Requiere ANTHROPIC_API_KEY en el entorno (ver .env.example).
 */
import Anthropic from "@anthropic-ai/sdk";

/** Modelo por defecto. Para abaratar/acelerar la demo puedes cambiar a
 *  "claude-sonnet-4-6" o "claude-haiku-4-5" (decisión del equipo, no por defecto). */
export const MODEL = "claude-opus-4-8";

let _client: Anthropic | null = null;

/** Singleton perezoso del cliente. Lanza error claro si falta la API key. */
export function getClaude(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("Falta ANTHROPIC_API_KEY en el entorno (revisa .env.local)");
  }
  if (!_client) _client = new Anthropic();
  return _client;
}

/**
 * Helper genérico: pide a Claude una respuesta JSON que cumpla un schema.
 * Usa structured outputs (output_config.format) para garantizar JSON parseable.
 */
export async function askClaudeJson<T>(args: {
  system: string;
  user: string;
  schema: Record<string, unknown>;
  maxTokens?: number;
}): Promise<T> {
  const client = getClaude();
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: args.maxTokens ?? 2048,
    thinking: { type: "adaptive" },
    output_config: { format: { type: "json_schema", schema: args.schema } },
    system: args.system,
    messages: [{ role: "user", content: args.user }],
  });

  const block = res.content.find((b) => b.type === "text");
  if (!block || block.type !== "text") {
    throw new Error("Claude no devolvió texto (posible refusal). stop=" + res.stop_reason);
  }
  return JSON.parse(block.text) as T;
}
