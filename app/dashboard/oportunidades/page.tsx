'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Filter, Calendar, MapPin, Tag, ArrowRight, ShieldAlert, Sparkles, LayoutGrid, List } from "lucide-react";
import type { Empresa, OportunidadCompatible } from "@/lib/types";
import { api } from "@/lib/api";
import { getEmpresa } from "@/lib/store/empresa";
import { mockOportunidades } from "@/lib/mocks";

export default function OportunidadesPage() {
  const router = useRouter();
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [oportunidades, setOportunidades] = useState<OportunidadCompatible[]>([]);
  const [filtered, setFiltered] = useState<OportunidadCompatible[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  
  // Filtros
  const [rubro, setRubro] = useState("Todos");
  const [monto, setMonto] = useState("Todos");
  const [región, setRegión] = useState("Todos");

  useEffect(() => {
    const e = getEmpresa();
    if (!e) {
      router.replace("/");
      return;
    }
    setEmpresa(e);
    
    // Usamos los mocks enriquecidos en primer plano
    setOportunidades(mockOportunidades);
    setFiltered(mockOportunidades);
  }, [router]);

  useEffect(() => {
    let res = [...oportunidades];
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      res = res.filter(o => 
        o.licitacion.objeto.toLowerCase().includes(q) || 
        o.licitacion.entidad.toLowerCase().includes(q)
      );
    }
    
    if (rubro !== "Todos") {
      res = res.filter(o => o.licitacion.rubro.toLowerCase() === rubro.toLowerCase());
    }
    
    if (monto !== "Todos") {
      res = res.filter(o => {
        const value = o.licitacion.montoEstimado;
        if (monto === "Bajo") return value < 100000;
        if (monto === "Medio") return value >= 100000 && value <= 300000;
        if (monto === "Alto") return value > 300000;
        return true;
      });
    }
    
    if (región !== "Todos") {
      res = res.filter(o => o.licitacion.ubicacion.toLowerCase() === región.toLowerCase());
    }
    
    setFiltered(res);
  }, [oportunidades, searchQuery, rubro, monto, región]);

  if (!empresa) return null;

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-[#1e1b19] tracking-tight">
            Explorador de Oportunidades SEACE
          </h2>
          <p className="text-sm text-[#434653] mt-1">
            Explora y audita de forma proactiva todos los procesos activos a nivel nacional.
          </p>
        </div>
        <div className="flex bg-white border border-[#c3c6d5] p-1 rounded-lg shrink-0">
          <button 
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded transition-all ${viewMode === "list" ? "bg-[#00327d] text-white" : "text-[#434653] hover:bg-[#eee7e3]/60"}`}
          >
            <List className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded transition-all ${viewMode === "grid" ? "bg-[#00327d] text-white" : "text-[#434653] hover:bg-[#eee7e3]/60"}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <section className="bg-white border border-[#c3c6d5] p-5 rounded-xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#434653]" />
            <input 
              type="text"
              placeholder="Buscar por objeto, entidad o RUC..."
              className="w-full bg-[#faf2ee] border border-[#c3c6d5] rounded-lg pl-10 pr-4 py-2 text-xs focus:border-[#00327d] outline-none text-[#1e1b19] placeholder:text-[#737784]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <select
              value={rubro}
              onChange={(e) => setRubro(e.target.value)}
              className="bg-[#faf2ee] border border-[#c3c6d5] rounded-lg px-3 py-2 text-xs font-semibold text-[#1e1b19] outline-none"
            >
              <option value="Todos">Todos los Rubros</option>
              <option value="limpieza">Limpieza</option>
              <option value="seguridad">Seguridad</option>
              <option value="ti">TI / Sistemas</option>
              <option value="alimentos">Alimentos</option>
              <option value="construccion">Construcción</option>
              <option value="mantenimiento">Mantenimiento</option>
            </select>

            <select
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="bg-[#faf2ee] border border-[#c3c6d5] rounded-lg px-3 py-2 text-xs font-semibold text-[#1e1b19] outline-none"
            >
              <option value="Todos">Presupuesto</option>
              <option value="Bajo">Menos de S/ 100k</option>
              <option value="Medio">S/ 100k - S/ 300k</option>
              <option value="Alto">Más de S/ 300k</option>
            </select>

            <select
              value={región}
              onChange={(e) => setRegión(e.target.value)}
              className="bg-[#faf2ee] border border-[#c3c6d5] rounded-lg px-3 py-2 text-xs font-semibold text-[#1e1b19] outline-none"
            >
              <option value="Todos">Ubicación</option>
              <option value="Lima">Lima</option>
              <option value="Junín">Junín</option>
            </select>
          </div>
        </div>
      </section>

      {/* Grid or List View */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#c3c6d5] rounded-xl p-12 text-center text-[#434653] space-y-2">
          <ShieldAlert className="w-8 h-8 mx-auto text-[#434653]/60" />
          <p className="text-sm font-bold">No se encontraron resultados para los filtros actuales.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((o) => (
            <div key={o.licitacion.id} className="bg-white border border-[#c3c6d5] rounded-xl p-6 flex flex-col justify-between hover:border-[#00327d] hover:shadow-md transition-all duration-200">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-[#434653] uppercase tracking-wider bg-[#faf2ee] px-2.5 py-1 rounded-full border border-[#c3c6d5]/40 truncate max-w-[200px]">
                    {o.licitacion.entidad}
                  </span>
                  <span className="bg-[#0047ab]/10 text-[#00327d] px-2.5 py-1 text-[10px] font-bold rounded-full">
                    {o.match.compatibilidad}% Match
                  </span>
                </div>
                <h4 className="font-serif text-base font-bold text-[#1e1b19] line-clamp-2">
                  {o.licitacion.objeto}
                </h4>
                <p className="text-xs text-[#434653] line-clamp-2 leading-relaxed">
                  {o.licitacion.descripcion}
                </p>
                <div className="flex flex-wrap gap-4 pt-1 text-[10px] font-bold text-[#434653] uppercase">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {o.licitacion.fechaLimite}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {o.licitacion.ubicacion}</span>
                  <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> S/ {o.licitacion.montoEstimado.toLocaleString("es-PE")}</span>
                </div>
              </div>
              <div className="pt-6 border-t border-[#c3c6d5]/40 mt-6 flex justify-end">
                <Link href={`/dashboard/oportunidad/${o.licitacion.id}`} className="text-xs font-bold text-[#00327d] hover:underline flex items-center gap-1">
                  Ver Análisis <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List Mode - Information Dense */
        <div className="bg-white border border-[#c3c6d5] rounded-xl overflow-hidden shadow-sm">
          <div className="divide-y divide-[#c3c6d5]">
            {filtered.map((o) => (
              <div key={o.licitacion.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#faf2ee]/20 transition-all">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-[#00327d] bg-[#0047ab]/10 px-2 py-0.5 rounded-full">
                      {o.match.compatibilidad}% Match
                    </span>
                    <span className="text-[10px] text-[#434653] font-bold uppercase truncate max-w-[200px]">
                      {o.licitacion.entidad}
                    </span>
                    <span className="text-[#c3c6d5] hidden sm:inline">•</span>
                    <span className="text-[10px] text-[#434653] font-medium uppercase">
                      {o.licitacion.rubro}
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-[#1e1b19] truncate">
                    {o.licitacion.objeto}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-[11px] text-[#434653]">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {o.licitacion.ubicacion}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Cierre: {o.licitacion.fechaLimite}</span>
                    <span className="font-bold text-[#00327d]">S/ {o.licitacion.montoEstimado.toLocaleString("es-PE")}</span>
                  </div>
                </div>
                <div className="shrink-0">
                  <Link href={`/dashboard/oportunidad/${o.licitacion.id}`} className="bg-[#00327d] text-white hover:bg-[#0047ab] px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all inline-flex items-center gap-1.5">
                    Auditar Licitación <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
