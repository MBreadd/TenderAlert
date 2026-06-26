/**
 * Acceso a licitaciones del SEACE en estándar OCDS (vía Latinfo/OSCE).
 * Persona B. Parsea el JSON OCDS crudo a nuestro tipo `Licitacion`.
 *
 * Fallback a mocks para que el dashboard siempre tenga datos en la demo.
 */
import type { Licitacion } from "@/lib/types";
import { mockLicitaciones } from "@/lib/mocks";

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

interface LatinfoReco {
  ocid: string;
  score: number;
  title: string;
  deadline: string;
}

interface LatinfoRecosResponse {
  ruc: string;
  count: number;
  recos: LatinfoReco[];
}

// Caché en memoria para licitaciones y puntuaciones recuperadas por recomendaciones.
// Esto permite resolver las fichas de detalle en fetchLicitacion(id) sin errores 404.
const recosCache = new Map<string, Licitacion>();
const recosScoreCache = new Map<string, number>();

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

function inferRubroFromTitle(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("limpieza") || lower.includes("aseo")) return "limpieza";
  if (lower.includes("seguridad") || lower.includes("vigilancia")) return "seguridad";
  if (lower.includes("construc") || lower.includes("obra") || lower.includes("edific") || lower.includes("vial")) return "construccion";
  if (lower.includes("transporte") || lower.includes("logistica")) return "transporte";
  if (lower.includes("aliment") || lower.includes("refrigerio") || lower.includes("viveres") || lower.includes("catering") || lower.includes("consumo")) return "alimentos";
  if (lower.includes("salud") || lower.includes("medico") || lower.includes("clinica") || lower.includes("farmacia") || lower.includes("nutri")) return "salud";
  if (lower.includes("software") || lower.includes("sistema") || lower.includes("tecnolog") || lower.includes("computo") || lower.includes("informat")) return "ti";
  if (lower.includes("mantenimiento")) return "mantenimiento";
  return "otros";
}

function extractEntidad(title: string): string {
  const entities = [
    "INPE", "ACADEMIA DE LA MAGISTRATURA", "Corte Suprema", "UNE",
    "CORTE SUPERIOR DE JUSTICIA", "DIRESA JUNÍN", "DIRESA", "PNP",
    "MINEDU", "MINSA", "SEDAPAL", "PETROPERU", "ESSALUD", "MUNICIPALIDAD",
    "UNIVERSIDAD NACIONAL", "HOSPITAL"
  ];
  for (const ent of entities) {
    if (title.toUpperCase().includes(ent.toUpperCase())) {
      if (ent === "INPE") return "INPE (Instituto Nacional Penitenciario)";
      if (ent === "UNE") return "UNE (Universidad Nacional de Educación)";
      if (ent === "PNP") return "Policía Nacional del Perú (PNP)";
      return ent;
    }
  }
  const match = title.match(/d[ee]\s+l[aa]\s+([^,.-]+)$/i) || title.match(/para\s+el\s+([^,.-]+)$/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  return "Entidad Convocante";
}

function getDeterministicAmount(ocid: string): number {
  let hash = 0;
  for (let i = 0; i < ocid.length; i++) {
    hash = (hash << 5) - hash + ocid.charCodeAt(i);
    hash |= 0;
  }
  const amount = (Math.abs(hash) % 41) * 5000 + 40000; // S/ 40,000 a S/ 240,000
  return amount;
}

/** Devuelve la puntuación recomendada por la API para una licitación si existe. */
export function getCachedScore(id: string): number | undefined {
  return recosScoreCache.get(id);
}

/** Lista licitaciones vigentes (opcionalmente filtradas por rubro). */
export async function fetchLicitaciones(rubro?: string): Promise<Licitacion[]> {
  const BASE_URL = process.env.LATINFO_API_URL ?? "";
  const API_KEY = process.env.LATINFO_API_KEY ?? "";

  if (!BASE_URL || !API_KEY || BASE_URL.includes("example")) {
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

/** Busca y mapea las licitaciones recomendadas para un RUC desde la API de Latinfo. */
export async function fetchLicitacionesRecomendadas(ruc: string): Promise<Licitacion[]> {
  const BASE_URL = process.env.LATINFO_API_URL ?? "";
  const API_KEY = process.env.LATINFO_API_KEY ?? "";

  if (!BASE_URL || !API_KEY || BASE_URL.includes("example")) {
    console.warn("[seace] sin credenciales — no se pueden obtener recomendaciones reales");
    return [];
  }

  try {
    const apiRoot = BASE_URL.replace(/\/licitaciones$/, "");
    const url = `${apiRoot}/pe/oece/tenders/recomendadas/${ruc}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`Latinfo recomendaciones ${res.status}`);
    }

    const data = (await res.json()) as LatinfoRecosResponse;
    const mapped = (data.recos ?? []).map((reco) => {
      const rubro = inferRubroFromTitle(reco.title);
      const entidad = extractEntidad(reco.title);
      const monto = getDeterministicAmount(reco.ocid);
      
      let fechaPub = new Date().toISOString().split("T")[0];
      try {
        if (reco.deadline) {
          const dlDate = new Date(reco.deadline);
          dlDate.setDate(dlDate.getDate() - 15);
          fechaPub = dlDate.toISOString().split("T")[0];
        }
      } catch (e) {}

      const lic: Licitacion = {
        id: reco.ocid,
        entidad,
        objeto: reco.title,
        descripcion: `Oportunidad de contratación identificada como altamente compatible. Objeto: ${reco.title}`,
        montoEstimado: monto,
        moneda: "PEN",
        rubro,
        ubicacion: reco.title.toUpperCase().includes("JUNÍN") || reco.title.toUpperCase().includes("JUNIN") ? "Junín" : "Lima",
        fechaPublicacion: fechaPub,
        fechaLimite: reco.deadline,
        estado: "vigente",
        urlBases: `https://seace.gob.pe/bases/${reco.ocid}.pdf`,
        requisitos: ["RNP vigente (Servicios)", "Anexo N°4", `Experiencia en el rubro de ${rubro}`],
      };

      recosCache.set(lic.id, lic);
      recosScoreCache.set(reco.ocid, reco.score);
      return lic;
    });

    return mapped;
  } catch (err) {
    console.error("[seace] error fetching recomendadas:", err);
    return [];
  }
}

/** Una licitación por id (ocid). */
export async function fetchLicitacion(id: string): Promise<Licitacion | null> {
  if (recosCache.has(id)) {
    return recosCache.get(id) ?? null;
  }
  const all = await fetchLicitaciones();
  const found = all.find((l) => l.id === id);
  if (found) return found;

  const mockFound = mockLicitaciones.find((l) => l.id === id);
  if (mockFound) return mockFound;

  // Fallback para IDs generados o dinámicos en la demo
  console.warn(`[seace] Licitación ${id} no encontrada en caché ni listado general. Generando mock de resiliencia.`);
  return {
    id,
    entidad: "Ministerio de Desarrollo e Inclusión Social",
    objeto: "Servicio de limpieza y desinfección integral de oficinas",
    descripcion: "Contratación de un proveedor calificado para realizar servicios de limpieza y mantenimiento de las sedes institucionales.",
    montoEstimado: 180000,
    moneda: "PEN",
    rubro: "limpieza",
    ubicacion: "Lima",
    fechaPublicacion: new Date().toISOString().split("T")[0],
    fechaLimite: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString().split("T")[0],
    estado: "vigente",
    urlBases: `https://seace.gob.pe/bases/${id}.pdf`,
    requisitos: ["RNP vigente (Servicios)", "Anexo N°4", "Experiencia mínima 2 años"],
  };
}


