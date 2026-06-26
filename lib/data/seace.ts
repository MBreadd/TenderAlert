/**
 * Acceso a licitaciones del SEACE en estándar OCDS (vía Latinfo/OSCE).
 * Persona B. Parsea el JSON OCDS crudo a nuestro tipo `Licitacion`.
 *
 * Fallback a mocks para que el dashboard siempre tenga datos en la demo.
 */
import type { Licitacion } from "@/lib/types";
import { mockLicitaciones } from "@/lib/mocks";

const BASE_URL = process.env.LATINFO_API_URL ?? "";
const API_KEY = process.env.LATINFO_API_KEY ?? "";

/** Estructura OCDS mínima (un `release`). Ajustar a la respuesta real. */
interface OcdsRelease {
  ocid: string;
  tender?: {
    title?: string;
    description?: string;
    procuringEntity?: { name?: string };
    value?: { amount?: number; currency?: string };
    tenderPeriod?: { startDate?: string; endDate?: string };
    mainProcurementCategory?: string;
    status?: string;
  };
}

function mapRelease(r: OcdsRelease): Licitacion {
  const t = r.tender ?? {};
  return {
    id: r.ocid,
    entidad: t.procuringEntity?.name ?? "Entidad no especificada",
    objeto: t.title ?? "",
    descripcion: t.description ?? "",
    montoEstimado: t.value?.amount ?? 0,
    moneda: (t.value?.currency as "PEN" | "USD") ?? "PEN",
    rubro: t.mainProcurementCategory ?? "otros",
    ubicacion: "Lima", // OCDS no siempre lo trae; derivar de la entidad si aplica
    fechaPublicacion: t.tenderPeriod?.startDate ?? new Date().toISOString(),
    fechaLimite: t.tenderPeriod?.endDate ?? "",
    estado: t.status === "active" ? "vigente" : "cerrada",
  };
}

/** Lista licitaciones vigentes (opcionalmente filtradas por rubro). */
export async function fetchLicitaciones(rubro?: string): Promise<Licitacion[]> {
  if (!BASE_URL || !API_KEY) {
    console.warn("[seace] sin credenciales — usando mock");
    return rubro ? mockLicitaciones.filter((l) => l.rubro === rubro) : mockLicitaciones;
  }
  try {
    const url = new URL(`${BASE_URL}/ocds/releases`);
    if (rubro) url.searchParams.set("category", rubro);
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      next: { revalidate: 600 },
    });
    if (!res.ok) throw new Error(`SEACE ${res.status}`);
    const data = (await res.json()) as { releases?: OcdsRelease[] };
    return (data.releases ?? []).map(mapRelease);
  } catch (err) {
    console.error("[seace] fallo, usando mock:", err);
    return mockLicitaciones;
  }
}

/** Una licitación por id (ocid). */
export async function fetchLicitacion(id: string): Promise<Licitacion | null> {
  const all = await fetchLicitaciones();
  return all.find((l) => l.id === id) ?? null;
}
