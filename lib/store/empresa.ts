/**
 * Persistencia del perfil Empresa en el cliente (localStorage).
 * Es la "costura" que hace viajar el perfil entre pantallas:
 *   landing → onboarding → dashboard → ficha.
 *
 * Decisión de equipo (hackathon): sin sesión server ni Supabase todavía.
 * El día que se quiera persistencia real, se cambia esto por lib/data/empresaRepo.
 */
import type { Empresa } from "@/lib/types";

const KEY = "tenderalert:empresa";

export function setEmpresa(empresa: Empresa): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(empresa));
}

export function getEmpresa(): Empresa | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Empresa;
  } catch {
    return null;
  }
}

export function clearEmpresa(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
