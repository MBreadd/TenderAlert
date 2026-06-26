/**
 * Cliente de la API corporativa de Latinfo → datos oficiales SUNAT/OSCE por RUC.
 * Persona B. SOLO server-side (usa LATINFO_API_KEY).
 *
 * Endpoint real (KYB): GET {BASE_URL}/pe/kyb/{ruc}  con  Authorization: Bearer {KEY}.
 *
 * Estrategia anti-caída para la demo: si la API real falla o no hay credenciales,
 * cae a un mock realista para que el "wow moment" nunca dependa de un tercero.
 */
import type { Empresa, EstadoSunat } from "@/lib/types";
import { mockEmpresa } from "@/lib/mocks";

/** Forma cruda real de Latinfo KYB (subset que usamos). */
interface LatinfoKyb {
  ruc?: string;
  identity?: {
    ruc?: string;
    razon_social?: string;
    estado?: string;
    condicion?: string;
    ubigeo?: string;
    tipo_via?: string;
    nombre_via?: string;
    numero?: string;
    tipo_zona?: string;
  } | null;
  sanctions?: { osce_sanctioned?: unknown } | null;
}

/** Departamento a partir de los 2 primeros dígitos del ubigeo (los más comunes). */
const DEPARTAMENTOS: Record<string, string> = {
  "15": "Lima", "07": "Callao", "04": "Arequipa", "08": "Cusco",
  "13": "La Libertad", "14": "Lambayeque", "20": "Piura", "12": "Junín",
  "21": "Puno", "06": "Cajamarca", "02": "Áncash", "11": "Ica",
};

/** Rubro inferido del nombre de la empresa (fallback mientras no hay chat de onboarding). */
const RUBRO_KEYWORDS: [RegExp, string][] = [
  [/limpieza/i, "limpieza"],
  [/seguridad|vigilancia|sucamec/i, "seguridad"],
  [/construc|ingenier|obras|edificaci/i, "construccion"],
  [/transporte|log[ií]stic/i, "transporte"],
  [/aliment|catering|restaurant|concesionari/i, "alimentos"],
  [/salud|cl[ií]nic|farmac|m[eé]dic/i, "salud"],
  [/software|sistemas|tecnolog|inform[aá]tic|consultor[ií]a/i, "ti"],
  [/mantenimiento/i, "mantenimiento"],
];

function inferRubros(razonSocial: string): string[] {
  const rubros = RUBRO_KEYWORDS.filter(([re]) => re.test(razonSocial)).map(([, r]) => r);
  return [...new Set(rubros)];
}

function buildDomicilio(i: NonNullable<LatinfoKyb["identity"]>): string | undefined {
  const partes = [i.tipo_via, i.nombre_via, i.numero, i.tipo_zona]
    .filter((p) => p && p !== "-" && p.trim() !== "");
  return partes.length ? partes.join(" ") : undefined;
}

function mapToEmpresa(raw: LatinfoKyb, ruc: string): Empresa {
  const i = raw.identity ?? {};
  const razonSocial = i.razon_social ?? "Empresa sin razón social";
  const estado = (i.estado?.toUpperCase() as EstadoSunat) || "ACTIVO";
  // RNP vigente: aproximación honesta sin endpoint dedicado de RNP →
  // activa + habida + sin sanción OSCE.
  const rnpVigente =
    estado === "ACTIVO" &&
    (i.condicion?.toUpperCase() === "HABIDO" || !i.condicion) &&
    !raw.sanctions?.osce_sanctioned;

  return {
    ruc: i.ruc ?? raw.ruc ?? ruc,
    razonSocial,
    estadoSunat: estado,
    domicilioFiscal: buildDomicilio(i),
    rnpVigente,
    rubros: inferRubros(razonSocial), // se refinan con el chat de onboarding (Persona C)
    ubicacion: DEPARTAMENTOS[i.ubigeo?.slice(0, 2) ?? ""] ?? undefined,
    fuente: "latinfo",
  };
}

/** Busca una empresa por RUC. Devuelve datos reales; mock como fallback. */
export async function lookupEmpresaByRuc(ruc: string): Promise<Empresa> {
  // Leídas en tiempo de request (no a nivel de módulo) para que Next no las
  // hornee vacías en build-time.
  const BASE_URL = process.env.LATINFO_API_URL ?? "";
  const API_KEY = process.env.LATINFO_API_KEY ?? "";

  if (!BASE_URL || !API_KEY || BASE_URL.includes("example")) {
    console.warn("[latinfo] sin credenciales reales — usando mock");
    return { ...mockEmpresa, ruc };
  }
  try {
    const res = await fetch(`${BASE_URL}/pe/kyb/${ruc}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      // datos oficiales cambian poco: cachea unos minutos
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`Latinfo ${res.status}`);
    return mapToEmpresa((await res.json()) as LatinfoKyb, ruc);
  } catch (err) {
    console.error("[latinfo] fallo, usando mock:", err);
    return { ...mockEmpresa, ruc };
  }
}
