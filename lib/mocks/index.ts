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
  {
    id: "ocds-pe-003",
    entidad: "Ministerio de Educación - MINEDU",
    objeto: "Servicio de limpieza integral de colegios emblemáticos",
    descripcion:
      "Servicio de limpieza y mantenimiento de áreas comunes, aulas y espacios administrativos en 12 colegios emblemáticos de Lima Metropolitana.",
    montoEstimado: 240000,
    moneda: "PEN",
    rubro: "limpieza",
    ubicacion: "Lima",
    fechaPublicacion: "2026-06-18",
    fechaLimite: "2026-07-18",
    estado: "vigente",
    urlBases: "https://seace.gob.pe/bases/ocds-pe-003.pdf",
    requisitos: ["RNP vigente (Servicios)", "Certificado ISO 9001", "Experiencia mínima 3 años", "Anexo N°4"],
  },
  {
    id: "ocds-pe-004",
    entidad: "Ministerio de Transportes y Comunicaciones",
    objeto: "Mantenimiento y limpieza de instalaciones administrativas",
    descripcion:
      "Servicio integral de mantenimiento, limpieza y pequeñas reparaciones para las instalaciones del ministerio en Lima y provincias.",
    montoEstimado: 450000,
    moneda: "PEN",
    rubro: "mantenimiento",
    ubicacion: "Lima",
    fechaPublicacion: "2026-06-15",
    fechaLimite: "2026-07-25",
    estado: "vigente",
    urlBases: "https://seace.gob.pe/bases/ocds-pe-004.pdf",
    requisitos: ["RNP vigente (Servicios y Bienes)", "Experiencia mínima 5 años", "Capacidad técnica acreditada"],
  },
  {
    id: "ocds-pe-005",
    entidad: "PNP - Dirección de Logística",
    objeto: "Servicio de limpieza y asepsia de instalaciones policiales",
    descripcion:
      "Limpieza, desinfección y mantenimiento de recintos policiales en Lima Norte, incluyendo comisarías y dependencias administrativas.",
    montoEstimado: 90000,
    moneda: "PEN",
    rubro: "limpieza",
    ubicacion: "Lima",
    fechaPublicacion: "2026-06-25",
    fechaLimite: "2026-07-08",
    estado: "vigente",
    urlBases: "https://seace.gob.pe/bases/ocds-pe-005.pdf",
    requisitos: ["RNP vigente (Servicios)", "Certificado de antecedentes del personal", "Anexo N°4"],
  },
  {
    id: "ocds-pe-006",
    entidad: "SUNAT - Intendencia Lima",
    objeto: "Limpieza y mantenimiento de sedes tributarias Lima",
    descripcion:
      "Servicios de limpieza profunda, mantenimiento preventivo y gestión de residuos para las sedes de SUNAT en Lima.",
    montoEstimado: 180000,
    moneda: "PEN",
    rubro: "limpieza",
    ubicacion: "Lima",
    fechaPublicacion: "2026-05-28",
    fechaLimite: "2026-06-20",
    estado: "cerrada",
    urlBases: "https://seace.gob.pe/bases/ocds-pe-006.pdf",
    requisitos: ["RNP vigente (Servicios)", "Experiencia mínima 3 años", "Anexo N°4"],
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
  "ocds-pe-003": {
    licitacionId: "ocds-pe-003",
    compatibilidad: 88,
    motivos: ["Rubro limpieza coincide perfectamente", "RNP vigente Servicios", "Experiencia acreditada Lima"],
    alertas: ["Obtener certificado ISO 9001 o equivalente"],
  },
  "ocds-pe-004": {
    licitacionId: "ocds-pe-004",
    compatibilidad: 75,
    motivos: ["Rubro mantenimiento en perfil", "RNP Servicios vigente", "Ubicación Lima"],
    alertas: ["Ampliar a capítulo Bienes en RNP", "Acreditar 5 años de experiencia"],
  },
  "ocds-pe-005": {
    licitacionId: "ocds-pe-005",
    compatibilidad: 82,
    motivos: ["Rubro limpieza coincide", "RNP vigente", "Lima Norte cubierto"],
    alertas: ["Gestionar antecedentes del personal con anticipación"],
  },
  "ocds-pe-006": {
    licitacionId: "ocds-pe-006",
    compatibilidad: 90,
    motivos: ["Rubro limpieza — match perfecto", "RNP vigente", "Experiencia corporativa relevante"],
    alertas: [],
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
      "La Municipalidad de Miraflores busca un servicio de limpieza de locales por S/ 80,000 (12 meses). Encaja con tu rubro y tu RNP de Servicios está vigente. El único riesgo identificado es el Anexo N°4, que debe estar actualizado. Cierra el 10/07/2026 — faltan 14 días.",
    compatibilidad: 92,
    planDeAccion: [
      { id: "c1", texto: "Confirmar RNP de Servicios vigente", obligatorio: true, cumplido: true },
      { id: "c2", texto: "Presentar Anexo N°4 firmado y notariado", obligatorio: true, cumplido: false },
      { id: "c3", texto: "Adjuntar 2 constancias de experiencia en limpieza corporativa", obligatorio: true, cumplido: false, nota: "Mínimo 2 años acumulados" },
      { id: "c4", texto: "Descargar y revisar el pliego de bases completo", obligatorio: false, cumplido: false },
    ],
    generadoPor: "mock",
  },
  "ocds-pe-003": {
    licitacionId: "ocds-pe-003",
    resumenEjecutivo:
      "MINEDU licita limpieza integral para 12 colegios emblemáticos en Lima Metropolitana por S/ 240,000. Alta compatibilidad con tu rubro. El factor diferenciador es el certificado ISO 9001 — considéralo prioritario. Cierra el 18/07/2026.",
    compatibilidad: 88,
    planDeAccion: [
      { id: "c1", texto: "Verificar RNP vigente para Servicios", obligatorio: true, cumplido: true },
      { id: "c2", texto: "Gestionar certificado ISO 9001 o equivalente DISO", obligatorio: true, cumplido: false, nota: "Plazo estimado 7 días hábiles" },
      { id: "c3", texto: "Preparar Anexo N°4 con declaración jurada", obligatorio: true, cumplido: false },
      { id: "c4", texto: "Acreditar experiencia mínima 3 años con contratos referenciados", obligatorio: true, cumplido: false },
    ],
    generadoPor: "mock",
  },
};

export type EstadoPostulacion = "guardado" | "en_revision" | "postulado" | "adjudicado" | "descalificado";

export interface MiLicitacion {
  oportunidad: OportunidadCompatible;
  estadoPostulacion: EstadoPostulacion;
  fechaGuardado: string;
  notas?: string;
}

export const mockMisLicitaciones: MiLicitacion[] = [
  {
    oportunidad: mockOportunidades[0],
    estadoPostulacion: "en_revision",
    fechaGuardado: "2026-06-21",
    notas: "Pendiente completar Anexo N°4 y constancias de experiencia.",
  },
  {
    oportunidad: mockOportunidades[2],
    estadoPostulacion: "postulado",
    fechaGuardado: "2026-06-22",
    notas: "Propuesta técnica entregada. En espera de evaluación.",
  },
  {
    oportunidad: mockOportunidades[3],
    estadoPostulacion: "guardado",
    fechaGuardado: "2026-06-24",
  },
  {
    oportunidad: mockOportunidades[5],
    estadoPostulacion: "adjudicado",
    fechaGuardado: "2026-05-30",
    notas: "Contrato firmado el 28/06/2026. Inicio de servicios: 01/07/2026.",
  },
];
