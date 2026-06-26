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
    entidad: "OSITRAN",
    objeto: "Desarrollo e Implementación de Mesa de Partes Digital",
    descripcion:
      "Servicios de consultoría y desarrollo de software para la digitalización y automatización de la mesa de partes física de la entidad.",
    montoEstimado: 150000,
    moneda: "PEN",
    rubro: "ti",
    ubicacion: "Lima",
    fechaPublicacion: "2026-06-23",
    fechaLimite: "2026-07-15",
    estado: "vigente",
    urlBases: "https://seace.gob.pe/bases/ocds-pe-003.pdf",
    requisitos: ["RNP vigente (Servicios)", "Experiencia en desarrollo web React/Node", "Arquitectura en la nube"],
  },
  {
    id: "ocds-pe-004",
    entidad: "Hospital Nacional Arzobispo Loayza",
    objeto: "Suministro de Raciones Alimenticias para Pacientes",
    descripcion:
      "Adquisición e insumos alimenticios y preparación de raciones preparadas para el área de hospitalización por 6 meses.",
    montoEstimado: 240000,
    moneda: "PEN",
    rubro: "alimentos",
    ubicacion: "Lima",
    fechaPublicacion: "2026-06-24",
    fechaLimite: "2026-07-20",
    estado: "vigente",
    urlBases: "https://seace.gob.pe/bases/ocds-pe-004.pdf",
    requisitos: ["RNP vigente (Bienes)", "Certificaciones sanitarias DIGESA", "Constancias de cadena de frío"],
  },
  {
    id: "ocds-pe-005",
    entidad: "Gobierno Regional de Lima",
    objeto: "Ejecución de Mantenimiento de Infraestructura Vial",
    descripcion:
      "Mantenimiento preventivo y correctivo de pistas, veredas e infraestructura peatonal en la provincia de Huaral.",
    montoEstimado: 450000,
    moneda: "PEN",
    rubro: "construccion",
    ubicacion: "Lima",
    fechaPublicacion: "2026-06-21",
    fechaLimite: "2026-07-18",
    estado: "vigente",
    urlBases: "https://seace.gob.pe/bases/ocds-pe-005.pdf",
    requisitos: ["RNP vigente (Ejecutor de Obras)", "Ingeniero civil residente colegiado", "Equipo pesado propio"],
  },
  {
    id: "ocds-pe-006",
    entidad: "Banco de la Nación",
    objeto: "Mantenimiento Preventivo de Equipos de Climatización",
    descripcion:
      "Servicio de diagnóstico y mantenimiento para el sistema de aire acondicionado central y extractores de aire de las agencias bancarias.",
    montoEstimado: 65000,
    moneda: "PEN",
    rubro: "mantenimiento",
    ubicacion: "Lima",
    fechaPublicacion: "2026-06-25",
    fechaLimite: "2026-07-09",
    estado: "vigente",
    urlBases: "https://seace.gob.pe/bases/ocds-pe-006.pdf",
    requisitos: ["RNP vigente (Servicios)", "Técnicos certificados en refrigeración", "Plan de contingencia ambiental"],
  },
];

export const mockMatches: Record<string, MatchResult> = {
  "ocds-pe-001": {
    licitacionId: "ocds-pe-001",
    compatibilidad: 92,
    motivos: ["Rubro limpieza coincide con tu perfil", "RNP de Servicios vigente", "Ubicación Lima"],
    alertas: ["Verificar Anexo N°4 actualizado"],
  },
  "ocds-pe-002": {
    licitacionId: "ocds-pe-002",
    compatibilidad: 41,
    motivos: ["Ubicación Lima", "Capítulo Servicios"],
    alertas: ["Rubro seguridad no está en tu perfil", "Falta certificación SUCAMEC"],
  },
  "ocds-pe-003": {
    licitacionId: "ocds-pe-003",
    compatibilidad: 88,
    motivos: ["Rubro de TI coincide parcialmente", "RNP de Servicios vigente", "Monto dentro de capacidad"],
    alertas: ["Requiere experiencia en desarrollo web React/Node"],
  },
  "ocds-pe-004": {
    licitacionId: "ocds-pe-004",
    compatibilidad: 58,
    motivos: ["Ubicación Lima", "Capítulo Servicios/Bienes"],
    alertas: ["Rubro alimentos no está en tu perfil", "Requiere certificaciones sanitarias DIGESA"],
  },
  "ocds-pe-005": {
    licitacionId: "ocds-pe-005",
    compatibilidad: 95,
    motivos: ["Rubro construcción coincide", "Gran capacidad operativa", "Ubicación Lima"],
    alertas: ["Requiere Ingeniero residente colegiado"],
  },
  "ocds-pe-006": {
    licitacionId: "ocds-pe-006",
    compatibilidad: 83,
    motivos: ["Rubro mantenimiento coincide", "Monto ideal para tu escala", "RNP de Servicios vigente"],
    alertas: ["Requiere técnicos con certificación ambiental"],
  },
};

export const mockOportunidades: OportunidadCompatible[] = mockLicitaciones.map((lic) => ({
  licitacion: lic,
  match: mockMatches[lic.id] || { licitacionId: lic.id, compatibilidad: 50, motivos: [], alertas: [] },
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
      "OSITRAN convoca el desarrollo de su mesa de partes digital por S/ 150,000. Alta afinidad técnica. Cierra el 15/07/2026.",
    compatibilidad: 88,
    planDeAccion: [
      { id: "c1", texto: "Confirmar RNP de Servicios vigente", obligatorio: true, cumplido: true },
      { id: "c2", texto: "Acreditar experiencia de programadores en React", obligatorio: true, cumplido: true },
      { id: "c3", texto: "Presentar arquitectura en la nube", obligatorio: true, cumplido: false },
    ],
    generadoPor: "mock",
  },
  "ocds-pe-005": {
    licitacionId: "ocds-pe-005",
    resumenEjecutivo:
      "Gobierno Regional de Lima solicita mantenimiento vial en Huaral por S/ 450,000. Excelente oportunidad con alta compatibilidad y gran margen. Cierra el 18/07/2026.",
    compatibilidad: 95,
    planDeAccion: [
      { id: "c1", texto: "Acreditar Ingeniero residente colegiado", obligatorio: true, cumplido: false },
      { id: "c2", texto: "Adjuntar títulos de propiedad de maquinaria", obligatorio: true, cumplido: true },
      { id: "c3", texto: "Presentar RNP de Ejecutor de Obras", obligatorio: true, cumplido: true },
    ],
    generadoPor: "mock",
  },
};

// Mocks para la sección de "Mis Licitaciones" (Applied/Saved)
import type { LicitacionPostulada } from "@/lib/types";

export const mockLicitacionesPostuladas: LicitacionPostulada[] = [
  {
    licitacion: mockLicitaciones[0], // Miraflores limpieza
    estadoPostulacion: "en_progreso",
    progresoChecklist: 65,
  },
  {
    licitacion: mockLicitaciones[2], // OSITRAN TI
    estadoPostulacion: "presentada",
    fechaPresentacion: "2026-06-25",
    progresoChecklist: 100,
  },
];
