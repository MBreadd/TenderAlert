'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DocumentReview } from "@/components/dashboard/DocumentReview";
import { ActionPlanItem } from "@/components/dashboard/ActionPlanItem";
import Link from "next/link";
import { ChevronRight, Sparkles, Landmark, Share2, Loader2, Calendar, ShieldCheck, AlertTriangle, FileText, CheckCircle2, ArrowLeft } from "lucide-react";
import type { Licitacion, FichaRecomendacion } from "@/lib/types";
import { api } from "@/lib/api";
import { getEmpresa } from "@/lib/store/empresa";

export default function FichaPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [licitacion, setLicitacion] = useState<Licitacion | null>(null);
  const [ficha, setFicha] = useState<FichaRecomendacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para simular la generación de propuesta
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [draftGenerated, setDraftGenerated] = useState(false);

  useEffect(() => {
    const empresa = getEmpresa();
    if (!empresa) {
      router.replace("/");
      return;
    }
    
    Promise.all([
      api<Licitacion[]>("/api/licitaciones"),
      api<FichaRecomendacion>(`/api/ficha/${id}`, {
        method: "POST",
        body: JSON.stringify({ empresa }),
      }),
    ])
      .then(([lics, f]) => {
        setLicitacion(lics.find((l) => l.id === id) ?? null);
        setFicha(f);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Error generando la ficha"))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleGenerateDraft = () => {
    setGeneratingDraft(true);
    setTimeout(() => {
      setGeneratingDraft(false);
      setDraftGenerated(true);
    }, 2500);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-[#434653] font-sans gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#00327d]" />
        <p className="text-sm font-semibold">Generando tu ficha de recomendación con IA y RAG corporativo...</p>
      </div>
    );
  }

  if (error || !licitacion) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-[#ba1a1a] font-sans gap-3 px-6 text-center">
        <AlertTriangle className="w-10 h-10 text-[#ba1a1a] mb-2" />
        <p className="text-sm font-semibold">{error ?? "No encontramos esta licitación."}</p>
        <Link href="/dashboard" className="text-[#00327d] text-xs font-semibold hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Volver al dashboard
        </Link>
      </div>
    );
  }

  // Cálculos dinámicos de días restantes
  let daysLeft = 0;
  let urgencyText = "Fecha por confirmar";
  let urgencyColor = "text-[#5c5f5e] bg-[#5c5f5e]/10 border-[#5c5f5e]/20";
  
  if (licitacion.fechaLimite) {
    const limit = new Date(licitacion.fechaLimite).getTime();
    const now = new Date().getTime();
    daysLeft = Math.ceil((limit - now) / (1000 * 3600 * 24));
    
    if (daysLeft < 0) {
      urgencyText = "Convocatoria Cerrada";
      urgencyColor = "text-[#ba1a1a] bg-[#ffdad6] border-[#ba1a1a]/20";
    } else if (daysLeft <= 7) {
      urgencyText = `Urgente: Faltan ${daysLeft} días`;
      urgencyColor = "text-[#ba1a1a] bg-[#ffdad6] border-[#ba1a1a]/20 animate-pulse";
    } else if (daysLeft <= 14) {
      urgencyText = `Atención: Faltan ${daysLeft} días`;
      urgencyColor = "text-[#b26a00] bg-[#faf2ee] border-[#b26a00]/20";
    } else {
      urgencyText = `Vigente: Faltan ${daysLeft} días`;
      urgencyColor = "text-emerald-700 bg-emerald-50 border-emerald-600/20";
    }
  }

  // Cálculos de checklist
  const totalSteps = ficha?.planDeAccion.length ?? 0;
  const completedSteps = ficha?.planDeAccion.filter(item => item.cumplido).length ?? 0;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  
  // Probabilidad de éxito ponderada
  const winProbability = ficha 
    ? Math.round(ficha.compatibilidad * 0.7 + (completedSteps / (totalSteps || 1)) * 30) 
    : 0;

  // Veredicto
  const isRecommended = (ficha?.compatibilidad ?? 0) >= 80;

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto w-full space-y-8">
      {/* Breadcrumb & Navigation */}
      <nav className="flex items-center justify-between text-[#434653] text-xs font-semibold">
        <div className="flex items-center gap-2">
          <Link className="hover:text-[#00327d] transition-colors" href="/dashboard">Explorador</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#00327d] font-bold">Análisis de Oportunidad</span>
        </div>
        <Link className="text-[#434653] hover:text-[#00327d] transition-colors flex items-center gap-1.5" href="/dashboard">
          <ArrowLeft className="w-3.5 h-3.5" /> Volver al Explorador
        </Link>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Left Primary Column */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          {/* Header Title Section */}
          <section className="bg-white border border-[#c3c6d5] p-6 rounded-xl shadow-sm space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 text-xs font-bold rounded-full border ${urgencyColor}`}>
                {urgencyText}
              </span>
              <span className="px-3 py-1 bg-[#0047ab]/10 text-[#00327d] text-xs font-bold rounded-full border border-[#00327d]/20 uppercase">
                Rubro: {licitacion.rubro}
              </span>
            </div>

            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1e1b19] leading-tight">
              {licitacion.objeto}
            </h2>

            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-[#00327d]/10 flex items-center justify-center text-[#00327d] shrink-0">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1e1b19]">{licitacion.entidad}</p>
                <p className="text-[10px] text-[#434653] uppercase">Entidad del Estado Convocante · {licitacion.ubicacion}</p>
              </div>
            </div>
          </section>

          {/* AI Verdict & Executive Summary */}
          {ficha && (
            <section className="bg-white border border-[#c3c6d5] rounded-xl overflow-hidden shadow-sm">
              <div className="bg-[#f4ece8] px-6 py-4 border-b border-[#c3c6d5] flex justify-between items-center">
                <h3 className="text-xs text-[#1e1b19] font-bold uppercase tracking-widest">Análisis de Viabilidad de IA</h3>
                <span className="flex items-center gap-1 text-[#00327d] text-[11px] font-bold">
                  <Sparkles className="w-4 h-4" />
                  RAG Corporativo
                </span>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Recommendation verdict chip */}
                <div className="flex items-center gap-2">
                  {isRecommended ? (
                    <div className="flex items-center gap-2 bg-emerald-100 border border-emerald-300 text-emerald-800 px-4 py-2 rounded-xl text-xs font-bold">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                      Veredicto: Recomendación Alta de Participar ({ficha.compatibilidad}%)
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-amber-100 border border-amber-300 text-amber-800 px-4 py-2 rounded-xl text-xs font-bold">
                      <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                      Veredicto: Evaluar con precaución ({ficha.compatibilidad}%)
                    </div>
                  )}
                </div>

                <div className="border-l-4 border-[#00327d] pl-4 py-1.5 bg-[#f8f9f8] rounded-r-lg">
                  <p className="text-sm text-[#434653] italic leading-relaxed">
                    "{ficha.resumenEjecutivo}"
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Action Plan Progress & Checklist */}
          {ficha && (
            <section className="bg-white border border-[#c3c6d5] rounded-xl shadow-sm overflow-hidden">
              <div className="bg-[#f4ece8] px-6 py-4 border-b border-[#c3c6d5] flex justify-between items-center">
                <h3 className="text-xs text-[#1e1b19] font-bold uppercase tracking-widest">Plan de Acción y Requisitos</h3>
                <span className="text-[11px] font-bold text-[#00327d]">
                  Completado {completedSteps}/{totalSteps} pasos
                </span>
              </div>

              {/* Visual Progress Bar */}
              <div className="p-6 border-b border-[#c3c6d5]/50 bg-[#faf2ee]/30 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#434653]">Progreso de Requisitos Obligatorios</span>
                  <span className="font-bold text-[#1e1b19]">{progressPercent}%</span>
                </div>
                <div className="w-full bg-[#e9e1dd] h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#00327d] h-full transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-[#434653] flex items-center justify-between">
                  <span>Capacidad Operativa: Apta</span>
                  <span className="font-semibold text-[#00327d]">Probabilidad de éxito estimada: {winProbability}%</span>
                </div>
              </div>

              {/* Flat checklist */}
              <div className="divide-y divide-[#c3c6d5]">
                {ficha.planDeAccion.map((item) => (
                  <ActionPlanItem key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}

          {/* Document Review Component */}
          <DocumentReview />
        </div>

        {/* Right Sticky Facts Sidebar */}
        <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div className="bg-white border border-[#c3c6d5] rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="text-xs text-[#1e1b19] font-bold uppercase tracking-widest pb-3 border-b border-[#c3c6d5]">
              Ficha Resumen
            </h3>
            
            <div className="space-y-5">
              <div>
                <p className="text-[10px] text-[#434653] font-bold uppercase tracking-wider mb-1">Presupuesto Estimado</p>
                <p className="font-serif text-3xl font-bold text-[#00327d]">
                  S/ {licitacion.montoEstimado.toLocaleString("es-PE")}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-[#434653] font-bold uppercase tracking-wider mb-1">Fecha Límite SEACE</p>
                <p className="text-sm font-bold text-[#1e1b19] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#434653] shrink-0" />
                  {licitacion.fechaLimite}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <p className="text-[10px] text-[#434653] font-bold uppercase tracking-wider mb-1">Moneda</p>
                  <p className="text-xs font-bold text-[#1e1b19]">{licitacion.moneda === "PEN" ? "Soles (PEN)" : "Dólares (USD)"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#434653] font-bold uppercase tracking-wider mb-1">Ubicación</p>
                  <p className="text-xs font-bold text-[#1e1b19]">{licitacion.ubicacion}</p>
                </div>
              </div>

              <div className="h-px bg-[#c3c6d5]/60 my-4"></div>

              {/* Main Prominent Call-to-Action */}
              <div className="space-y-3">
                {draftGenerated ? (
                  <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl space-y-3 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                      ¡Propuesta Generada!
                    </div>
                    <p className="text-[11px] leading-relaxed text-emerald-900">
                      El borrador inicial de la propuesta técnica y el anexo Nº4 han sido redactados usando la IA y tus credenciales previas de RNP.
                    </p>
                    <button className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      Descargar Borrador (Word)
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleGenerateDraft}
                    disabled={generatingDraft}
                    className="w-full py-4 bg-[#00327d] text-white hover:bg-[#0047ab] font-sans text-xs rounded-xl font-bold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transform"
                  >
                    {generatingDraft ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Redactando propuesta...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generar Borrador con IA
                      </>
                    )}
                  </button>
                )}

                <button className="w-full py-3.5 bg-white text-[#00327d] border border-[#00327d] hover:bg-[#0047ab]/5 font-sans text-xs rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Compartir Licitación
                </button>
              </div>

              {/* Dynamic bases download links */}
              {licitacion.urlBases && (
                <div className="text-center pt-2">
                  <a 
                    href={licitacion.urlBases}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-[#434653] font-semibold hover:text-[#00327d] hover:underline"
                  >
                    Descargar Bases Originales (SEACE)
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
