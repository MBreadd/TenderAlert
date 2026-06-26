/**
 * Repositorio del perfil de empresa. Persona B.
 * Abstrae la persistencia: si Supabase está configurado lo usa; si no, memoria.
 * El resto del código solo conoce estas funciones, no sabe si hay DB real.
 */
import type { Empresa } from "@/lib/types";
import { getSupabase } from "./supabase";

const memoria = new Map<string, Empresa>();

export async function guardarEmpresa(empresa: Empresa): Promise<Empresa> {
  const db = getSupabase();
  if (!db) {
    memoria.set(empresa.ruc, empresa);
    return empresa;
  }
  const { error } = await db.from("empresas").upsert(empresa, { onConflict: "ruc" });
  if (error) throw new Error(`Supabase upsert: ${error.message}`);
  return empresa;
}

export async function obtenerEmpresa(ruc: string): Promise<Empresa | null> {
  const db = getSupabase();
  if (!db) return memoria.get(ruc) ?? null;
  const { data, error } = await db.from("empresas").select("*").eq("ruc", ruc).single();
  if (error) return null;
  return data as Empresa;
}
