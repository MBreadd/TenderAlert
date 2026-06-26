import { mockFichas, mockLicitaciones } from "@/lib/mocks";
import { DocumentReview } from "@/components/dashboard/DocumentReview";
import { ActionPlanItem } from "@/components/dashboard/ActionPlanItem";
import Link from "next/link";
import {
  ChevronRight,
  FileCheck,
  Share2,
  Landmark,
  Clock,
  CheckCircle2,
  Circle,
  TrendingUp,
  Sparkles,
} from "lucide-react";

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function DeadlineChip({ fechaLimite, isCerrada }: { fechaLimite: string; isCerrada: boolean }) {
  if (isCerrada) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#ffdad6] text-[#ba1a1a] border border-[#ba1a1a]/20">
        <Circle className="w-2.5 h-2.5 fill-current" />
        Licitación cerrada
      </span>
    );
  }

  const days = daysUntil(fechaLimite);
  if (days <= 3) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 animate-pulse">
        <Clock className="w-3 h-3" />
        Faltan {days} día{days !== 1 ? 's' : ''}
      </span>
    );
  }
  if (days <= 7) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="w-3 h-3" />
        Faltan {days} días
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
      <Clock className="w-3 h-3" />
      Faltan {days} días
    </span>
  );
}

export default async function FichaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const licitacion = mockLicitaciones.find((l) => l.id === id) ?? mockLicitaciones[0];
  const ficha = mockFichas[licitacion.id];
  const isCerrada = new Date(licitacion.fechaLimite) < new Date();

  const completedItems = ficha?.planDeAccion.filter((i) => i.cumplido).length ?? 0;
  const totalItems = ficha?.planDeAccion.length ?? 0;
  const completionPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const verdictPositive = ficha ? ficha.compatibilidad >= 70 : false;

  return (
    <main className="p-8 max-w-[1280px] mx-auto w-full">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 mb-6 text-[#434653] text-xs font-semibold">
        <Link className="hover:text-[#00327d] transition-colors" href="/dashboard">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#c3c6d5]" />
        <Link className="hover:text-[#00327d] transition-colors" href="/dashboard/oportunidades">
          Oportunidades
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#c3c6d5]" />
        <span className="text-[#1e1b19] font-bold truncate max-w-[200px]">{licitacion.entidad}</span>
      </nav>

      <div className="grid grid-cols-12 gap-8">
        {/* ── Primary column ───────────────────────────────── */}
        <div className="col-span-12 lg:col-span-8 space-y-8">

          {/* Title section */}
          <section>
            {/* Verdict chip */}
            {ficha && (
              <div className="mb-4">
                {verdictPositive ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Recomendación: Participar
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    Recomendación: Evaluar con precaución
                  </span>
                )}
              </div>
            )}

            <h2
              className="text-3xl md:text-4xl text-[#00327d] leading-tight mb-5"
              style={{ fontFamily: "'Libre Caslon Text', serif" }}
            >
              {licitacion.objeto}
              <span className="block text-[#434653] text-xl mt-1">{licitacion.entidad}</span>
            </h2>

            <div className="flex flex-wrap items-center gap-3 py-4 border-y border-[#c3c6d5]">
              {/* Readiness badge */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-[#0047ab] flex items-center justify-center shrink-0">
                  <span
                    className="text-white text-xl font-bold"
                    style={{ fontFamily: "'Libre Caslon Text', serif" }}
                  >
                    {ficha ? ficha.compatibilidad : "—"}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-[#434653] uppercase tracking-widest font-semibold">Readiness Score</p>
                  <p className="text-base font-bold text-[#00327d]" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
                    {isCerrada ? "Cerrada" : ficha && ficha.compatibilidad >= 80 ? "Alta Compatibilidad" : "Compatibilidad Media"}
                  </p>
                </div>
              </div>

              <div className="h-8 w-px bg-[#c3c6d5] hidden md:block" />

              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1.5 bg-[#e9e1dd] text-[#1e1b19] text-xs font-bold rounded-full border border-[#c3c6d5]">
                  Prioridad: Alta
                </span>
                {!isCerrada && (
                  <span className="px-3 py-1.5 bg-[#0047ab]/10 text-[#00327d] text-xs font-bold rounded-full border border-[#00327d]/20">
                    Activa
                  </span>
                )}
                <DeadlineChip fechaLimite={licitacion.fechaLimite} isCerrada={isCerrada} />
              </div>
            </div>
          </section>

          {ficha ? (
            <>
              {/* Executive summary */}
              <section className="bg-white border border-[#c3c6d5] rounded-xl overflow-hidden">
                <div className="bg-[#f4ece8] px-6 py-4 border-b border-[#c3c6d5] flex justify-between items-center">
                  <h3 className="text-xs font-bold text-[#1e1b19] uppercase tracking-widest">Resumen ejecutivo</h3>
                  <span className="flex items-center gap-1.5 text-[#00327d] text-[11px] font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    Generado por IA
                  </span>
                </div>
                <div className="m-6 p-5 border-l-4 border-[#0047ab] bg-[#faf2ee] rounded-r-lg">
                  <p className="text-base text-[#434653] leading-relaxed">{ficha.resumenEjecutivo}</p>
                </div>
              </section>

              {/* Action plan */}
              <section className="bg-white border border-[#c3c6d5] rounded-xl overflow-hidden">
                <div className="bg-[#f4ece8] px-6 py-4 border-b border-[#c3c6d5]">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-[#1e1b19] uppercase tracking-widest">Plan de Acción</h3>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-[11px] font-bold text-[#434653]">
                          {completedItems}/{totalItems} completados
                        </p>
                        <p className="text-[10px] text-[#434653]">
                          Probabilidad estimada:{" "}
                          <span className={completionPct >= 50 ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                            {Math.min(95, Math.round(ficha.compatibilidad * 0.6 + completionPct * 0.4))}%
                          </span>
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full border-2 border-[#c3c6d5] flex items-center justify-center">
                        <span
                          className="text-xs font-bold text-[#00327d]"
                          style={{ fontFamily: "'Libre Caslon Text', serif" }}
                        >
                          {completionPct}%
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 h-1.5 w-full bg-[#e9e1dd] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00327d] rounded-full transition-all duration-700"
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                </div>

                <div className="divide-y divide-[#c3c6d5]">
                  {[
                    { label: "Elegibilidad del Negocio", filter: "c1" },
                    { label: "Documentación Legal", filter: "c2" },
                    { label: "Capacidad Técnica", filter: "c3" },
                    { label: "Presentación Final", filter: "c4" },
                  ].map((group) => {
                    const items = ficha.planDeAccion.filter((i) => i.id === group.filter);
                    if (items.length === 0) return null;
                    return (
                      <div key={group.filter}>
                        <div className="px-6 py-3 bg-[#fff8f5]">
                          <h4 className="text-[#00327d] font-bold text-[11px] uppercase tracking-wider">{group.label}</h4>
                        </div>
                        {items.map((item) => (
                          <ActionPlanItem key={item.id} item={item} />
                        ))}
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          ) : (
            <div className="bg-white border border-[#c3c6d5] rounded-xl p-12 text-center">
              <Sparkles className="w-8 h-8 text-[#00327d]/30 mx-auto mb-3" />
              <p className="text-[#434653] font-semibold">Generando análisis con IA...</p>
              <p className="text-sm text-[#737784] mt-1">Conecta /api/ficha para obtener la ficha en tiempo real.</p>
            </div>
          )}

          {/* Document Review */}
          <DocumentReview disabled={isCerrada} />
        </div>

        {/* ── Right sticky sidebar ─────────────────────────── */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white border border-[#c3c6d5] rounded-xl p-6 sticky top-[76px] space-y-6">
            {/* Primary CTA */}
            <div className="space-y-2">
              <button
                disabled={isCerrada}
                className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                  isCerrada
                    ? "bg-[#e9e1dd] text-[#737784] cursor-not-allowed"
                    : "bg-[#00327d] text-white hover:bg-[#0047ab] shadow-[#00327d]/20"
                }`}
              >
                <FileCheck className="w-4 h-4" />
                Generar Borrador
              </button>
              {!isCerrada && (
                <p className="text-[10px] text-center text-[#737784]">
                  Borrador listo en ~2 min · Basado en tu perfil documentario
                </p>
              )}
              <button className="w-full py-3 bg-white text-[#00327d] border border-[#00327d] text-sm font-bold rounded-xl hover:bg-[#0047ab]/5 transition-all flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />
                Compartir análisis
              </button>
            </div>

            <div className="h-px bg-[#c3c6d5]" />

            {/* Key facts */}
            <h3 className="text-[11px] font-bold text-[#1e1b19] uppercase tracking-widest">Datos Clave</h3>

            <div className="space-y-5">
              <div>
                <p className="text-[10px] text-[#434653] uppercase tracking-widest font-semibold mb-1.5">
                  Presupuesto Estimado
                </p>
                <p
                  className="text-2xl text-[#00327d] font-bold"
                  style={{ fontFamily: "'Libre Caslon Text', serif" }}
                >
                  S/ {licitacion.montoEstimado.toLocaleString("es-PE")}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-[#434653] uppercase tracking-widest font-semibold mb-1.5">
                  Entidad Convocante
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border border-[#c3c6d5] flex items-center justify-center bg-[#faf2ee]">
                    <Landmark className="w-5 h-5 text-[#00327d]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1e1b19]">{licitacion.entidad}</p>
                    <p className="text-[11px] text-[#434653]">Sede Central, Lima</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-[#434653] uppercase tracking-widest font-semibold mb-1.5">
                    Fecha Límite
                  </p>
                  <p className="text-sm font-bold text-[#1e1b19]">{licitacion.fechaLimite}</p>
                  <DeadlineChip fechaLimite={licitacion.fechaLimite} isCerrada={isCerrada} />
                </div>
                <div>
                  <p className="text-[10px] text-[#434653] uppercase tracking-widest font-semibold mb-1.5">
                    Probabilidad
                  </p>
                  <p className="text-sm font-bold text-emerald-700 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {ficha ? ficha.compatibilidad : 0}%
                  </p>
                  <p className="text-[11px] text-[#434653]">Alta compatibilidad</p>
                </div>
              </div>

              {licitacion.requisitos && licitacion.requisitos.length > 0 && (
                <div>
                  <p className="text-[10px] text-[#434653] uppercase tracking-widest font-semibold mb-2">
                    Requisitos clave
                  </p>
                  <ul className="space-y-1.5">
                    {licitacion.requisitos.map((req) => (
                      <li key={req} className="flex items-start gap-2 text-xs text-[#434653]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00327d] mt-1 shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {licitacion.urlBases && (
              <>
                <div className="h-px bg-[#c3c6d5]" />
                <a
                  href={licitacion.urlBases}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 text-[#00327d] border border-[#c3c6d5] text-xs font-bold rounded-lg hover:bg-[#faf2ee] transition-all flex items-center justify-center gap-1.5"
                >
                  Descargar Bases Completas
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
