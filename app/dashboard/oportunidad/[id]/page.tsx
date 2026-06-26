'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DocumentReview } from "@/components/dashboard/DocumentReview";
import { ActionPlanItem } from "@/components/dashboard/ActionPlanItem";
import Link from "next/link";
import { LayoutDashboard, Telescope, FileCheck, Search, ChevronRight, Sparkles, Landmark, Share2, Loader2 } from "lucide-react";
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

  useEffect(() => {
    const empresa = getEmpresa();
    if (!empresa) {
      router.replace("/");
      return;
    }
    // La licitación (datos del proceso) viene de la lista; la ficha (RAG) se
    // genera con el perfil de la empresa. Las pedimos en paralelo.
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9f8] text-[#434653] font-['Hanken_Grotesk'] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#00327d]" />
        <p className="text-sm">Generando tu ficha de recomendación con IA…</p>
      </div>
    );
  }

  if (error || !licitacion) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9f8] text-[#ba1a1a] font-['Hanken_Grotesk'] gap-3 px-6 text-center">
        <p className="text-sm font-semibold">{error ?? "No encontramos esta licitación."}</p>
        <Link href="/dashboard" className="text-[#00327d] text-xs font-semibold hover:underline">
          ← Volver al dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8f9f8] text-[#1e1b19] font-['Hanken_Grotesk']">
      {/* SideNavBar Anchor */}
      <aside className="h-screen w-64 fixed left-0 top-0 flex flex-col py-12 bg-[#fff8f5] border-r border-[#c3c6d5] z-50 overflow-y-auto hidden md:flex">
        <div className="px-6 mb-12">
          <h1 className="font-['Libre_Caslon_Text'] text-2xl font-bold text-[#00327d]">TenderAlert</h1>
          <p className="font-['Hanken_Grotesk'] text-[11px] text-[#434653] tracking-wider uppercase mt-1">Enterprise Procurement</p>
        </div>
        <nav className="flex-1 px-2 space-y-1">
          <Link href="/dashboard" className="flex items-center px-4 py-2 rounded-lg text-[#434653] hover:bg-[#eee7e3] transition-colors font-['Hanken_Grotesk'] text-xs font-semibold group">
            <LayoutDashboard className="w-5 h-5 mr-4" />
            <span>Dashboard</span>
          </Link>
          <a className="flex items-center px-4 py-2 rounded-lg text-[#00327d] font-bold border-l-4 border-[#00327d] bg-[#0047ab]/10 font-['Hanken_Grotesk'] text-xs" href="#">
            <Telescope className="w-5 h-5 mr-4" />
            <span>Opportunities</span>
          </a>
          <a className="flex items-center px-4 py-2 rounded-lg text-[#434653] hover:bg-[#eee7e3] transition-colors font-['Hanken_Grotesk'] text-xs font-semibold" href="#">
            <FileCheck className="w-5 h-5 mr-4" />
            <span>My Tenders</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        <header className="flex justify-between items-center w-full px-12 py-4 sticky top-0 bg-[#fff8f5] border-b border-[#c3c6d5] z-40">
          <div className="flex items-center gap-12 flex-1">
            <div className="relative w-full max-w-md focus-within:ring-2 focus-within:ring-[#00327d]/10 rounded-lg">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#434653]" />
              <input className="w-full bg-[#faf2ee] border-[#c3c6d5] rounded-lg pl-12 pr-4 py-2 text-sm focus:border-[#00327d] focus:ring-0" placeholder="Search opportunities, entities, or keywords..." type="text"/>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 pl-6 border-l border-[#c3c6d5]">
              <div className="text-right">
                <p className="font-['Hanken_Grotesk'] text-xs font-semibold text-[#1e1b19]">M. Arrieta</p>
                <p className="font-['Hanken_Grotesk'] text-[11px] text-[#434653]">Procurement Director</p>
              </div>
              <img className="w-10 h-10 rounded-full border border-[#c3c6d5] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEXCqANHAiyqs_OPxech0KUu9XinFtLFlpxxRrLJwe_H11LcHKFDiNy7jbNMqY6dW_sqob8-sLI6jzY09n7rf6HBalP4CJU2D57qvWO5AwFuSw00dZtDpq2ep04Du1KXFzmu_Jc2BNwTr-mvCFbBG3bUxDgGOWoeMuIrn2uJyx_hf0fKRaAfcc9i3-8EPzZH4q-73meYxnQwguQ8QqsWQ6g55Jnxoqa6JEbmFmTKf2fFBXGCD5YQv-LQU1SksNNaUNI9ltPFk9c8ie" alt="Profile" />
            </div>
          </div>
        </header>

        <main className="p-12 max-w-7xl mx-auto w-full">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-6 text-[#434653] font-['Hanken_Grotesk'] text-xs font-semibold">
            <Link className="hover:text-[#00327d]" href="/dashboard">Explorer</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#00327d] font-bold">Opportunity Detail</span>
          </nav>

          <div className="grid grid-cols-12 gap-12">
            {/* Primary Column */}
            <div className="col-span-12 lg:col-span-8 space-y-12">
              <section>
                <h2 className="font-['Libre_Caslon_Text'] text-4xl text-[#00327d] mb-4 leading-tight">
                  {licitacion.objeto} - {licitacion.entidad}
                </h2>
                <div className="flex flex-wrap items-center gap-6 py-4 border-y border-[#c3c6d5]">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-[#0047ab] flex items-center justify-center text-[#a5bdff]">
                      <span className="font-['Libre_Caslon_Text'] text-2xl font-bold">{ficha ? ficha.compatibilidad : '0'}</span>
                    </div>
                    <div>
                      <p className="font-['Hanken_Grotesk'] text-[11px] text-[#434653] uppercase tracking-widest">Readiness Score</p>
                      <p className="font-['Libre_Caslon_Text'] text-lg font-semibold text-[#00327d]">
                        {ficha && ficha.compatibilidad >= 90 ? 'Alta Afinidad' : 'Evaluación'}
                      </p>
                    </div>
                  </div>
                  <div className="h-10 w-px bg-[#c3c6d5] hidden md:block"></div>
                  <div className="flex gap-2">
                    <span className="px-4 py-2 bg-[#e9e1dd] text-[#1e1b19] font-['Hanken_Grotesk'] text-xs font-semibold rounded-full border border-[#c3c6d5]">Priority: High</span>
                    <span className="px-4 py-2 bg-[#0047ab]/10 text-[#00327d] font-['Hanken_Grotesk'] text-xs font-semibold rounded-full border border-[#00327d]/20">Analysis: Verified</span>
                  </div>
                </div>
              </section>

              {ficha ? (
                <>
                  <section className="bg-white border border-[#c3c6d5] rounded-xl overflow-hidden">
                    <div className="bg-[#f4ece8] px-6 py-4 border-b border-[#c3c6d5] flex justify-between items-center">
                      <h3 className="font-['Hanken_Grotesk'] text-xs text-[#1e1b19] font-bold uppercase tracking-widest">Executive Summary</h3>
                      <span className="flex items-center gap-1 text-[#00327d] font-['Hanken_Grotesk'] text-[11px]">
                        <Sparkles className="w-4 h-4" />
                        AI-Synthesized Insight
                      </span>
                    </div>
                    <div className="p-6 border-l-[4px] border-[#0047ab] m-6 bg-[#ffffff]">
                      <p className="font-['Hanken_Grotesk'] text-base text-[#434653]">
                        {ficha.resumenEjecutivo}
                      </p>
                    </div>
                  </section>

                  {/* Checklist */}
                  <section className="bg-white border border-[#c3c6d5] rounded-xl">
                    <div className="bg-[#f4ece8] px-6 py-4 border-b border-[#c3c6d5] flex justify-between items-center">
                      <h3 className="font-['Hanken_Grotesk'] text-xs text-[#1e1b19] font-bold uppercase tracking-widest">Requirement Checklist & Action Plan</h3>
                    </div>
                    <div className="divide-y divide-[#c3c6d5]">
                      {ficha.planDeAccion.map((item) => (
                        <ActionPlanItem key={item.id} item={item} />
                      ))}
                    </div>
                  </section>
                </>
              ) : (
                <div className="bg-white border border-[#c3c6d5] rounded-xl p-12 text-center text-[#434653]">
                  <p>Ficha por generar — Persona A conecta /api/ficha aquí.</p>
                </div>
              )}

              {/* Document Review Component */}
              <DocumentReview />
            </div>

            {/* Right Sidebar (Quick Facts) */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="bg-white border border-[#c3c6d5] rounded-xl p-6 sticky top-[100px]">
                <h3 className="font-['Hanken_Grotesk'] text-xs text-[#1e1b19] font-bold uppercase tracking-widest mb-6 pb-4 border-b border-[#c3c6d5]">Quick Facts</h3>
                <div className="space-y-12">
                  <div>
                    <p className="font-['Hanken_Grotesk'] text-[11px] text-[#434653] uppercase tracking-widest mb-2">Estimated Budget</p>
                    <p className="font-['Libre_Caslon_Text'] text-2xl text-[#00327d] font-bold">
                      S/ {licitacion.montoEstimado.toLocaleString("es-PE")}
                    </p>
                  </div>
                  <div>
                    <p className="font-['Hanken_Grotesk'] text-[11px] text-[#434653] uppercase tracking-widest mb-2">Contracting Entity</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded border border-[#c3c6d5] flex items-center justify-center bg-white overflow-hidden">
                        <Landmark className="w-6 h-6 text-[#00327d]" />
                      </div>
                      <div>
                        <p className="font-['Hanken_Grotesk'] text-sm font-bold">{licitacion.entidad}</p>
                        <p className="font-['Hanken_Grotesk'] text-[11px] text-[#434653]">Sede Central, Lima</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="font-['Hanken_Grotesk'] text-[11px] text-[#434653] uppercase tracking-widest mb-2">Deadline</p>
                      <p className="font-['Hanken_Grotesk'] text-base font-bold">{licitacion.fechaLimite}</p>
                      <p className="font-['Hanken_Grotesk'] text-[11px] text-[#ba1a1a]">Urgent</p>
                    </div>
                    <div>
                      <p className="font-['Hanken_Grotesk'] text-[11px] text-[#434653] uppercase tracking-widest mb-2">Confidence</p>
                      <p className="font-['Hanken_Grotesk'] text-base font-bold text-green-700">{ficha ? ficha.compatibilidad : '0'}%</p>
                      <p className="font-['Hanken_Grotesk'] text-[11px] text-[#434653]">High Win Prob.</p>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-[#c3c6d5] space-y-2">
                    <button className="w-full py-4 bg-[#00327d] text-white font-['Hanken_Grotesk'] text-xs rounded-lg font-bold shadow-sm hover:brightness-110 transition-all flex items-center justify-center gap-2">
                      <FileCheck className="w-5 h-5" />
                      Generate Proposal Draft
                    </button>
                    <button className="w-full py-4 bg-white text-[#00327d] border border-[#00327d] font-['Hanken_Grotesk'] text-xs rounded-lg font-bold hover:bg-[#0047ab]/5 transition-all flex items-center justify-center gap-2">
                      <Share2 className="w-5 h-5" />
                      Share with Team
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
