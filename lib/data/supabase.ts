/**
 * Cliente Supabase (server-side). Persona B.
 * Persiste el perfil de empresa tras el onboarding.
 *
 * Variables (ver .env.example):
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (server) o anon (cliente).
 *
 * Si Supabase no está configurado todavía, las funciones de repositorio caen a
 * memoria (Map) para no bloquear al resto del equipo.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null; // aún no configurado → repos usan memoria
  if (!_client) _client = createClient(url, key);
  return _client;
}
