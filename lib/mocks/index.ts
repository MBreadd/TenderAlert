/**
 * MOCKS COMPARTIDOS — datos falsos que cumplen los contratos de `lib/types`.
 *
 * Para qué sirven:
 *  - Persona A (frontend) construye TODAS las pantallas sin esperar a B ni C.
 *  - Persona B/C los usan como "salida esperada" mientras escriben la lógica real.
 *
 * Cuando la implementación real esté lista, las rutas /api dejan de devolver
 * estos mocks y devuelven datos reales: el frontend NO cambia (mismo contrato).
 *
 * Casos de prueba tomados de docs/mvp-scope.md (limpieza Miraflores S/80k,
 * seguridad Hospital Loayza S/120k).
 */
import type {
  Empresa,
  Licitacion,
  MatchResult,
  OportunidadCompatible,
  FichaRecomendacion,
} from "@/lib/types";

export const mockEmpresa: Empresa = {
  ruc: "20512345678",
  razonSocial: "Servicios Integrales Lima S.A.C.",
  estadoSunat: "ACTIVO",
  domicilioFiscal: "Av. Arequipa 1234, Lince, Lima",
  rnpVigente: true,
  capituloRnp: ["Servicios"],
  rubros: ["limpieza", "mantenimiento"],
  especialidad: "Limpieza de oficinas corporativas y lavado de alfombras a gran escala",
  ubicacion: "Lima",
  fuente: "mock",
};

export const mockLicitaciones: Licitacion[] = [
  {
    id: "ocds-pe-001",
    entidad: "Municipalidad de Miraflores",
    objeto: "Servicio de limpieza de locales municipales",
    descripcion:
      "Contratación del servicio de limpieza integral para los locales de la municipalidad por 12 meses.",
    montoEstimado: 80000,
    moneda: "PEN",
    rubro: "limpieza",
    ubicacion: "Lima",
    fechaPublicacion: "2026-06-20",
    fechaLimite: "2026-07-10",
    estado: "vigente",
    urlBases: "https://seace.gob.pe/bases/ocds-pe-001.pdf",
    requisitos: ["RNP vigente (Servicios)", "Anexo N°4", "Experiencia mínima 2 años"],
  },
  {
    id: "ocds-pe-002",
    entidad: "Hospital Nacional Arzobispo Loayza",
    objeto: "Servicio de seguridad y vigilancia",
    descripcion:
      "Servicio de seguridad y vigilancia privada para las instalaciones del hospital por 12 meses.",
    montoEstimado: 120000,
    moneda: "PEN",
    rubro: "seguridad",
    ubicacion: "Lima",
    fechaPublicacion: "2026-06-22",
    fechaLimite: "2026-07-05",
    estado: "vigente",
    urlBases: "https://seace.gob.pe/bases/ocds-pe-002.pdf",
    requisitos: ["RNP vigente (Servicios)", "Certificación SUCAMEC", "Anexo N°4"],
  },
];

export const mockMatches: Record<string, MatchResult> = {
  "ocds-pe-001": {
    licitacionId: "ocds-pe-001",
    compatibilidad: 92,
    motivos: ["Rubro limpieza coincide", "RNP de Servicios vigente", "Ubicación Lima"],
    alertas: ["Verificar Anexo N°4 actualizado"],
  },
  "ocds-pe-002": {
    licitacionId: "ocds-pe-002",
    compatibilidad: 41,
    motivos: ["Ubicación Lima", "Capítulo Servicios"],
    alertas: ["Rubro seguridad NO está en tu perfil", "Falta certificación SUCAMEC"],
  },
};

export const mockOportunidades: OportunidadCompatible[] = mockLicitaciones.map((lic) => ({
  licitacion: lic,
  match: mockMatches[lic.id],
}));

export const mockFichas: Record<string, FichaRecomendacion> = {
  "ocds-pe-001": {
    licitacionId: "ocds-pe-001",
    resumenEjecutivo:
      "La Municipalidad de Miraflores busca un servicio de limpieza de locales por S/ 80,000 (12 meses). Encaja con tu rubro y tu RNP de Servicios está vigente. Cierra el 10/07/2026.",
    compatibilidad: 92,
    planDeAccion: [
      { id: "c1", texto: "Confirmar RNP de Servicios vigente", obligatorio: true, cumplido: true },
      { id: "c2", texto: "Presentar Anexo N°4 firmado", obligatorio: true, cumplido: false },
      { id: "c3", texto: "Adjuntar 2 constancias de experiencia", obligatorio: true, cumplido: false, nota: "Mínimo 2 años" },
      { id: "c4", texto: "Descargar y revisar el pliego de bases", obligatorio: false, cumplido: false },
    ],
    generadoPor: "mock",
  },
};
