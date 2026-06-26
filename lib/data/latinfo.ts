/**
 * Cliente de la API corporativa de Latinfo → datos oficiales SUNAT/OSCE por RUC.
 * Persona B. SOLO server-side (usa LATINFO_API_KEY).
 *
 * Estrategia anti-caída para la demo: si la API real falla o no hay credenciales,
 * cae a un mock realista para que el "wow moment" nunca dependa de un tercero.
 */
import type { Empresa, EstadoSunat } from "@/lib/types";
import { mockEmpresa } from "@/lib/mocks";

const BASE_URL = process.env.LATINFO_API_URL ?? "";
const API_KEY = process.env.LATINFO_API_KEY ?? "";

/** Forma cruda esperada de Latinfo (ajustar a la respuesta real al integrar). */
interface LatinfoResponse {
  ruc: string;
  razon_social: string;
  estado: string;
  domicilio_fiscal?: string;
  rnp?: { vigente: boolean; capitulos?: string[] };
}

function mapToEmpresa(raw: LatinfoResponse): Empresa {
  return {
    ruc: raw.ruc,
    razonSocial: raw.razon_social,
    estadoSunat: (raw.estado?.toUpperCase() as EstadoSunat) ?? "ACTIVO",
    domicilioFiscal: raw.domicilio_fiscal,
    rnpVigente: raw.rnp?.vigente ?? false,
    capituloRnp: raw.rnp?.capitulos,
    rubros: [], // se completan con el chat de onboarding (Persona C)
    fuente: "latinfo",
  };
}

/** Busca una empresa por RUC. Devuelve datos reales; mock como fallback. */
export async function lookupEmpresaByRuc(ruc: string): Promise<Empresa> {
  if (!BASE_URL || !API_KEY) {
    console.warn("[latinfo] sin credenciales — usando mock");
    return { ...mockEmpresa, ruc };
  }
  try {
    const res = await fetch(`${BASE_URL}/empresas/${ruc}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      // datos oficiales cambian poco: cachea unos minutos
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`Latinfo ${res.status}`);
    return mapToEmpresa((await res.json()) as LatinfoResponse);
  } catch (err) {
    console.error("[latinfo] fallo, usando mock:", err);
    return { ...mockEmpresa, ruc };
  }
}
