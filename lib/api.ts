/**
 * Cliente fetch para las rutas /api. Desempaqueta el envelope ApiResponse<T>
 * acordado en lib/types: si `ok:false`, lanza con el mensaje de error.
 * Así las pantallas trabajan con `T` directo y un try/catch.
 */
import type { ApiResponse } from "@/lib/types";

export async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const json = (await res.json()) as ApiResponse<T>;
  if (!json.ok) throw new Error(json.error);
  return json.data;
}
