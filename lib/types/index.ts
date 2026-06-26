/**
 * CONTRATOS COMPARTIDOS — la "costura" entre las 3 personas.
 *
 * REGLA DE ORO: este archivo se edita SOLO en consenso (los 3 juntos, al inicio).
 * Si necesitas un campo nuevo, avisa en el grupo antes de tocarlo: es la fuente
 * de verdad que usan frontend (A), backend (B) y IA (C) a la vez.
 *
 * Mientras backend/IA construyen la lógica real, el frontend consume `lib/mocks`
 * que cumplen EXACTAMENTE estas mismas interfaces. Así nadie se bloquea.
 */

// ---------------------------------------------------------------------------
// Empresa (perfil del proveedor PYME)
// ---------------------------------------------------------------------------
export type EstadoSunat = "ACTIVO" | "BAJA" | "SUSPENDIDO";

export interface Empresa {
  ruc: string;
  razonSocial: string;
  estadoSunat: EstadoSunat;
  domicilioFiscal?: string;
  /** Registro Nacional de Proveedores (OSCE) vigente */
  rnpVigente: boolean;
  /** Capítulos del RNP, ej: ["Servicios", "Bienes"] */
  capituloRnp?: string[];
  /** Rubros normalizados tras el chat de onboarding, ej: ["limpieza", "seguridad"] */
  rubros: string[];
  /** Texto libre afinado por la IA, ej: "limpieza de oficinas corporativas a gran escala" */
  especialidad?: string;
  /** Departamento/provincia de interés comercial */
  ubicacion?: string;
  /** De dónde salieron los datos */
  fuente: "latinfo" | "mock";
}

// ---------------------------------------------------------------------------
// Licitación (oportunidad del SEACE — estándar OCDS)
// ---------------------------------------------------------------------------
export type EstadoLicitacion = "vigente" | "cerrada";

export interface Licitacion {
  /** ocid (Open Contracting ID) o id interno */
  id: string;
  /** Entidad convocante, ej: "Municipalidad de Miraflores" */
  entidad: string;
  /** Objeto de contratación */
  objeto: string;
  descripcion: string;
  /** Monto estimado en la moneda indicada */
  montoEstimado: number;
  moneda: "PEN" | "USD";
  /** Categoría/rubro principal */
  rubro: string;
  ubicacion: string;
  /** ISO date */
  fechaPublicacion: string;
  /** ISO date */
  fechaLimite: string;
  estado: EstadoLicitacion;
  urlBases?: string;
  /** Requisitos clave extraídos del pliego de bases */
  requisitos?: string[];
}

// ---------------------------------------------------------------------------
// Match / scoring de compatibilidad (Persona C)
// ---------------------------------------------------------------------------
export interface MatchResult {
  licitacionId: string;
  /** 0–100 */
  compatibilidad: number;
  /** Por qué hace match con la empresa */
  motivos: string[];
  /** Requisitos faltantes o riesgos detectados */
  alertas: string[];
}

/** Lo que pinta el dashboard: licitación + su score */
export interface OportunidadCompatible {
  licitacion: Licitacion;
  match: MatchResult;
}

// ---------------------------------------------------------------------------
// Ficha de recomendación accionable (salida del RAG — Persona C)
// ---------------------------------------------------------------------------
export interface ChecklistItem {
  id: string;
  /** Acción concreta, ej: "Presentar Anexo N°4 firmado" */
  texto: string;
  obligatorio: boolean;
  /** Si el sistema detecta que la empresa ya lo cumple */
  cumplido: boolean;
  nota?: string;
}

export interface FichaRecomendacion {
  licitacionId: string;
  /** Resumen ejecutivo de ~3 líneas generado por IA */
  resumenEjecutivo: string;
  /** 0–100 */
  compatibilidad: number;
  planDeAccion: ChecklistItem[];
  generadoPor: "claude" | "mock";
}

// ---------------------------------------------------------------------------
// Chat de onboarding (3 preguntas — Persona C)
// ---------------------------------------------------------------------------
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface OnboardingChatResponse {
  reply: string;
  /** true cuando terminaron las preguntas y el perfil está listo */
  done: boolean;
  /** Datos del perfil inferidos durante la conversación */
  perfilParcial?: Partial<Empresa>;
}

// ---------------------------------------------------------------------------
// Envelope estándar de TODAS las rutas /api (acordado por los 3)
// ---------------------------------------------------------------------------
export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// ---------------------------------------------------------------------------
// Licitaciones Postuladas / Guardadas (Mis Licitaciones)
// ---------------------------------------------------------------------------
export type EstadoPostulacion = "en_progreso" | "presentada" | "adjudicada" | "no_adjudicada";

export interface LicitacionPostulada {
  licitacion: Licitacion;
  estadoPostulacion: EstadoPostulacion;
  fechaPresentacion?: string;
  progresoChecklist: number; // 0-100%
}

