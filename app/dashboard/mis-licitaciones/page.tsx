'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, Tag, ArrowRight, CheckCircle2, Loader2, Sparkles, Clock, CheckSquare } from "lucide-react";
import type { Empresa, LicitacionPostulada } from "@/lib/types";
import { getEmpresa } from "@/lib/store/empresa";
import { mockLicitacionesPostuladas } from "@/lib/mocks";

export default function MisLicitacionesPage() {
  const router = useRouter();
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [postuladas, setPostuladas] = useState<LicitacionPostulada[]>([]);

  useEffect(() => {
    const e = getEmpresa();
    if (!e) {
      router.replace("/");
      return;
    }
    setEmpresa(e);
    setPostuladas(mockLicitacionesPostuladas);
  }, [router]);

  if (!empresa) return null;

  const getStatusBadge = (status: string) => {
    if (status === "en_progreso") {
      return (
        <span className="flex items-center gap-1 text-xs font-bold text-[#b26a00] bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full w-max">
          <Clock className="w-3.5 h-3.5" /> En Progreso
        </span>
      );
    }
    if (status === "presentada") {
      return (
        <span className="flex items-center gap-1 text-xs font-bold text-[#00327d] bg-[#0047ab]/10 border border-[#00327d]/20 px-2.5 py-1 rounded-full w-max">
          <CheckSquare className="w-3.5 h-3.5" /> Presentada
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-full w-max">
        <CheckCircle2 className="w-3.5 h-3.5" /> Adjudicada
      </span>
    );
  };

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-serif text-3xl font-bold text-[#1e1b19] tracking-tight">
          Mis Licitaciones
        </h2>
        <p className="text-sm text-[#434653] mt-1">
          Seguimiento y control de las propuestas en preparación y presentadas ante el SEACE.
        </p>
      </div>

      {/* Board Layout Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1: En Progreso (Drafting/Preparing) */}
        <div className="space-y-4 bg-white/40 border border-[#c3c6d5] p-5 rounded-xl">
          <div className="flex justify-between items-center border-b border-[#c3c6d5]/40 pb-2">
            <h3 className="text-xs font-bold text-[#1e1b19] uppercase tracking-widest flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#b26a00]"></span>
              En Preparación ({postuladas.filter(p => p.estadoPostulacion === "en_progreso").length})
            </h3>
          </div>

          <div className="space-y-4">
            {postuladas.filter(p => p.estadoPostulacion === "en_progreso").map((p) => (
              <div key={p.licitacion.id} className="bg-white border border-[#c3c6d5] rounded-xl p-5 shadow-sm space-y-4 hover:border-[#00327d] transition-all">
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-[#434653] uppercase tracking-wider bg-[#faf2ee] px-2 py-0.5 rounded border border-[#c3c6d5]/40">
                    {p.licitacion.entidad}
                  </span>
                  <h4 className="font-serif text-sm font-bold text-[#1e1b19] line-clamp-2">
                    {p.licitacion.objeto}
                  </h4>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-semibold text-[#434653]">
                    <span>Progreso Checklist</span>
                    <span>{p.progresoChecklist}%</span>
                  </div>
                  <div className="w-full bg-[#e9e1dd] h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#00327d] h-full"
                      style={{ width: `${p.progresoChecklist}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-[#c3c6d5]/30">
                  <span className="text-[10px] font-bold text-[#00327d]">
                    S/ {p.licitacion.montoEstimado.toLocaleString("es-PE")}
                  </span>
                  <Link href={`/dashboard/oportunidad/${p.licitacion.id}`} className="text-[10px] font-bold text-[#00327d] hover:underline flex items-center gap-0.5">
                    Completar <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Presentadas / Enviadas */}
        <div className="space-y-4 bg-white/40 border border-[#c3c6d5] p-5 rounded-xl">
          <div className="flex justify-between items-center border-b border-[#c3c6d5]/40 pb-2">
            <h3 className="text-xs font-bold text-[#1e1b19] uppercase tracking-widest flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00327d]"></span>
              Presentadas ({postuladas.filter(p => p.estadoPostulacion === "presentada").length})
            </h3>
          </div>

          <div className="space-y-4">
            {postuladas.filter(p => p.estadoPostulacion === "presentada").map((p) => (
              <div key={p.licitacion.id} className="bg-white border border-[#c3c6d5] rounded-xl p-5 shadow-sm space-y-4 hover:border-[#00327d] transition-all">
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-[#434653] uppercase tracking-wider bg-[#faf2ee] px-2 py-0.5 rounded border border-[#c3c6d5]/40">
                    {p.licitacion.entidad}
                  </span>
                  <h4 className="font-serif text-sm font-bold text-[#1e1b19] line-clamp-2">
                    {p.licitacion.objeto}
                  </h4>
                </div>

                <div className="space-y-1.5 text-xs text-[#434653]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#00327d] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    Propuesta Cargada
                  </p>
                  <p className="text-[10px]">
                    Presentado: <span className="font-semibold text-[#1e1b19]">{p.fechaPresentacion}</span>
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-[#c3c6d5]/30">
                  <span className="text-[10px] font-bold text-[#00327d]">
                    S/ {p.licitacion.montoEstimado.toLocaleString("es-PE")}
                  </span>
                  <Link href={`/dashboard/oportunidad/${p.licitacion.id}`} className="text-[10px] font-bold text-[#00327d] hover:underline flex items-center gap-0.5">
                    Ver Ficha <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Adjudicadas (Won) */}
        <div className="space-y-4 bg-white/40 border border-[#c3c6d5] p-5 rounded-xl">
          <div className="flex justify-between items-center border-b border-[#c3c6d5]/40 pb-2">
            <h3 className="text-xs font-bold text-[#1e1b19] uppercase tracking-widest flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              Adjudicadas ({postuladas.filter(p => p.estadoPostulacion === "adjudicada").length})
            </h3>
          </div>

          <div className="space-y-4">
            {postuladas.filter(p => p.estadoPostulacion === "adjudicada").length === 0 ? (
              <div className="bg-white border border-[#c3c6d5] border-dashed rounded-xl p-8 text-center text-[#434653] text-xs">
                <p>No tienes licitaciones adjudicadas en esta temporada.</p>
              </div>
            ) : null}
          </div>
        </div>
        
      </div>
    </div>
  );
}
