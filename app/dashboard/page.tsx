'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OportunidadCard } from "@/components/dashboard/OportunidadCard";
import { RefreshCcw, ShieldCheck, AlertTriangle, TrendingUp, Filter, Loader2, Sparkles, SlidersHorizontal, Info } from "lucide-react";
import type { Empresa, OportunidadCompatible } from "@/lib/types";
import { api } from "@/lib/api";
import { getEmpresa } from "@/lib/store/empresa";

export default function DashboardPage() {
  const router = useRouter();
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [oportunidades, setOportunidades] = useState<OportunidadCompatible[]>([]);
  const [filteredOportunidades, setFilteredOportunidades] = useState<OportunidadCompatible[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de los filtros
  const [filterRubro, setFilterRubro] = useState("Todos");
  const [filterMonto, setFilterMonto] = useState("Todos");
  const [filterUbicacion, setFilterUbicacion] = useState("Todos");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [sortBy, setSortBy] = useState("Compatibilidad");

  useEffect(() => {
    const e = getEmpresa();
    if (!e) {
      router.replace("/");
      return;
    }
    setEmpresa(e);
    
    api<OportunidadCompatible[]>("/api/match", {
      method: "POST",
      body: JSON.stringify({ empresa: e }),
    })
      .then((data) => {
        setOportunidades(data);
        setFilteredOportunidades(data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Error cargando oportunidades"))
      .finally(() => setLoading(false));
  }, [router]);

  // Aplicar filtros client-side
  useEffect(() => {
    let result = [...oportunidades];

    // Filtro por Rubro/Sector
    if (filterRubro !== "Todos") {
      result = result.filter(
        (o) => o.licitacion.rubro.toLowerCase() === filterRubro.toLowerCase()
      );
    }

    // Filtro por Monto
    if (filterMonto !== "Todos") {
      result = result.filter((o) => {
        const monto = o.licitacion.montoEstimado;
        if (filterMonto === "Menores a 100k") return monto < 100000;
        if (filterMonto === "100k - 300k") return monto >= 100000 && monto <= 300000;
        if (filterMonto === "Mayores a 300k") return monto > 300000;
        return true;
      });
    }

    // Filtro por Ubicación
    if (filterUbicacion !== "Todos") {
      result = result.filter(
        (o) => o.licitacion.ubicacion.toLowerCase() === filterUbicacion.toLowerCase()
      );
    }

    // Filtro por Estado
    if (filterEstado !== "Todos") {
      result = result.filter(
        (o) => o.licitacion.estado.toLowerCase() === filterEstado.toLowerCase()
      );
    }

    // Ordenar
    if (sortBy === "Compatibilidad") {
      result.sort((a, b) => b.match.compatibilidad - a.match.compatibilidad);
    } else if (sortBy === "Monto (Mayor)") {
      result.sort((a, b) => b.licitacion.montoEstimado - a.licitacion.montoEstimado);
    } else if (sortBy === "Fecha Límite") {
      result.sort(
        (a, b) =>
          new Date(a.licitacion.fechaLimite).getTime() -
          new Date(b.licitacion.fechaLimite).getTime()
      );
    }

    setFilteredOportunidades(result);
  }, [oportunidades, filterRubro, filterMonto, filterUbicacion, filterEstado, sortBy]);

  const handleClearFilters = () => {
    setFilterRubro("Todos");
    setFilterMonto("Todos");
    setFilterUbicacion("Todos");
    setFilterEstado("Todos");
    setSortBy("Compatibilidad");
  };

  if (!empresa) return null;

  // Calcular métricas dinámicas
  const totalMonto = filteredOportunidades.reduce((acc, o) => acc + o.licitacion.montoEstimado, 0);

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto w-full space-y-10">
      
      {/* Header Section */}
      <section className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="font-serif text-3xl md:text-4xl text-[#1e1b19] tracking-tight">
            Hola, {empresa.razonSocial}
          </h2>
          <p className="text-sm font-medium text-[#434653] mt-1">
            RUC {empresa.ruc} · <span className="text-emerald-700 font-bold">{empresa.estadoSunat}</span>
          </p>
        </div>
        <div className="flex items-center text-[#434653] text-xs font-semibold bg-white border border-[#c3c6d5] px-4 py-2.5 rounded-xl shadow-sm w-max shrink-0 hover:bg-[#faf2ee] transition-all">
          <RefreshCcw className="w-4 h-4 mr-2" />
          Sincronizado: Hace unos momentos
        </div>
      </section>

      {/* KPI Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Readiness Card */}
        <div className="bg-[#00327d] text-white p-6 rounded-xl flex flex-col justify-between shadow-sm hover:translate-y-[-2px] transition-all">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-90">
              Business Readiness
            </p>
            <ShieldCheck className="w-5 h-5 text-[#a5bdff]" />
          </div>
          <div className="mt-4">
            <h3 className="font-serif text-4xl font-bold">87/100</h3>
            <div className="flex flex-wrap gap-1 mt-2">
              <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-semibold">SUNAT Activo</span>
              <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-semibold">RNP Habilitado</span>
            </div>
            <p className="text-[10px] flex items-center opacity-85 mt-3 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 mr-1" />
              1 aviso menor pendiente
            </p>
          </div>
        </div>

        {/* KPI Card 1: Oportunidades */}
        <div className="bg-white border border-[#c3c6d5] p-6 rounded-xl flex flex-col justify-between shadow-sm hover:translate-y-[-2px] transition-all">
          <div>
            <p className="text-[10px] font-bold text-[#434653] uppercase tracking-widest">
              Oportunidades Compatibles
            </p>
            <h3 className="font-serif text-4xl font-bold text-[#00327d] mt-3">
              {filteredOportunidades.length}
            </h3>
          </div>
          <div className="mt-4 flex items-center text-emerald-700 text-xs font-semibold">
            <TrendingUp className="w-4 h-4 mr-1 shrink-0" />
            +2 nuevas hoy
          </div>
        </div>

        {/* KPI Card 2: Pipeline */}
        <div className="bg-white border border-[#c3c6d5] p-6 rounded-xl flex flex-col justify-between shadow-sm hover:translate-y-[-2px] transition-all">
          <div>
            <p className="text-[10px] font-bold text-[#434653] uppercase tracking-widest">
              Pipeline Potencial
            </p>
            <h3 className="font-serif text-4xl font-bold text-[#00327d] mt-3">
              S/ {(totalMonto / 1000000).toFixed(1)}M
            </h3>
          </div>
          <div className="mt-4 flex items-center text-emerald-700 text-xs font-semibold">
            <TrendingUp className="w-4 h-4 mr-1 shrink-0" />
            +12% esta semana
          </div>
        </div>

        {/* KPI Card 3: Cierres */}
        <div className="bg-white border border-[#c3c6d5] p-6 rounded-xl flex flex-col justify-between shadow-sm hover:translate-y-[-2px] transition-all">
          <div>
            <p className="text-[10px] font-bold text-[#434653] uppercase tracking-widest">
              Próximos Cierres
            </p>
            <h3 className="font-serif text-4xl font-bold text-[#00327d] mt-3">
              {filteredOportunidades.filter(o => {
                const diffTime = new Date(o.licitacion.fechaLimite).getTime() - new Date().getTime();
                return diffTime < 14 * 24 * 60 * 60 * 1000;
              }).length}
            </h3>
          </div>
          <div className="mt-4 flex items-center text-[#b26a00] text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 mr-1 shrink-0" />
            Vencimiento en 7-14 días
          </div>
        </div>
      </section>

      {/* Weekly Intelligence Banner */}
      <section className="bg-white border border-l-4 border-[#00327d] rounded-r-xl p-5 shadow-sm flex items-start space-x-4">
        <div className="bg-[#0047ab]/10 p-2 rounded-lg text-[#00327d] shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-[#00327d] uppercase tracking-widest">
            Inteligencia Semanal TenderAlert
          </h4>
          <p className="text-sm text-[#434653] leading-relaxed">
            Esta semana identificamos <span className="font-bold text-[#1e1b19]">{oportunidades.length} nuevas oportunidades</span> en el SEACE. De ellas, tienes <span className="font-bold text-[#00327d]">{oportunidades.filter(o => o.match.compatibilidad >= 80).length} con alta compatibilidad (Score &gt; 80%)</span> en tu especialidad, listos para auditoría de bases.
          </p>
        </div>
      </section>

      {/* Interactive Filter Bar */}
      <section className="bg-white border border-[#c3c6d5] p-4 rounded-xl shadow-sm space-y-4">
        <div className="flex items-center space-x-2 border-b border-[#c3c6d5]/30 pb-3">
          <SlidersHorizontal className="w-4 h-4 text-[#434653]" />
          <h4 className="text-xs font-bold text-[#1e1b19] uppercase tracking-widest">
            Filtros y Búsqueda Avanzada
          </h4>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Sector */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#434653] uppercase">Rubro / Sector</label>
            <select
              value={filterRubro}
              onChange={(e) => setFilterRubro(e.target.value)}
              className="w-full bg-[#faf2ee] border border-[#c3c6d5] rounded-lg px-2 py-1.5 text-xs text-[#1e1b19] focus:border-[#00327d] outline-none"
            >
              <option value="Todos">Todos los sectores</option>
              <option value="limpieza">Limpieza</option>
              <option value="seguridad">Seguridad</option>
              <option value="ti">TI / Software</option>
              <option value="alimentos">Alimentos</option>
              <option value="construccion">Construcción</option>
              <option value="mantenimiento">Mantenimiento</option>
            </select>
          </div>

          {/* Monto */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#434653] uppercase">Presupuesto</label>
            <select
              value={filterMonto}
              onChange={(e) => setFilterMonto(e.target.value)}
              className="w-full bg-[#faf2ee] border border-[#c3c6d5] rounded-lg px-2 py-1.5 text-xs text-[#1e1b19] focus:border-[#00327d] outline-none"
            >
              <option value="Todos">Todos los montos</option>
              <option value="Menores a 100k">Menores a S/ 100k</option>
              <option value="100k - 300k">S/ 100k - 300k</option>
              <option value="Mayores a 300k">Mayores a S/ 300k</option>
            </select>
          </div>

          {/* Ubicación */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#434653] uppercase">Ubicación</label>
            <select
              value={filterUbicacion}
              onChange={(e) => setFilterUbicacion(e.target.value)}
              className="w-full bg-[#faf2ee] border border-[#c3c6d5] rounded-lg px-2 py-1.5 text-xs text-[#1e1b19] focus:border-[#00327d] outline-none"
            >
              <option value="Todos">Todas las regiones</option>
              <option value="Lima">Lima</option>
              <option value="Junín">Junín</option>
            </select>
          </div>

          {/* Estado */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#434653] uppercase">Estado</label>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="w-full bg-[#faf2ee] border border-[#c3c6d5] rounded-lg px-2 py-1.5 text-xs text-[#1e1b19] focus:border-[#00327d] outline-none"
            >
              <option value="Todos">Todos los estados</option>
              <option value="vigente">Vigente</option>
              <option value="cerrada">Cerrada</option>
            </select>
          </div>

          {/* Orden */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#434653] uppercase">Ordenar por</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#faf2ee] border border-[#c3c6d5] rounded-lg px-2 py-1.5 text-xs text-[#1e1b19] focus:border-[#00327d] outline-none"
            >
              <option value="Compatibilidad">Compatibilidad</option>
              <option value="Monto (Mayor)">Monto (Mayor)</option>
              <option value="Fecha Límite">Fecha Límite</option>
            </select>
          </div>
        </div>

        {/* Clear filters trigger */}
        {(filterRubro !== "Todos" || filterMonto !== "Todos" || filterUbicacion !== "Todos" || filterEstado !== "Todos" || sortBy !== "Compatibilidad") && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleClearFilters}
              className="text-xs text-[#00327d] font-semibold hover:underline"
            >
              Limpiar todos los filtros
            </button>
          </div>
        )}
      </section>

      {/* Main Content Area: Recomendaciones */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl font-bold text-[#1e1b19]">
            Recomendaciones Prioritarias
          </h3>
          <span className="text-xs font-semibold text-[#434653]">
            Ordenado por Índice de Compatibilidad
          </span>
        </div>

        <div className="space-y-6">
          {loading && (
            <div className="bg-white border border-[#c3c6d5] rounded-xl p-12 flex flex-col items-center justify-center text-[#434653]">
              <Loader2 className="w-8 h-8 animate-spin text-[#00327d] mb-3" />
              <p className="text-sm font-semibold">Buscando y evaluando licitaciones compatibles con tu perfil...</p>
            </div>
          )}
          {!loading && error && (
            <div className="bg-white border border-[#ffdad6] rounded-xl p-12 text-center text-[#ba1a1a]">
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}
          {!loading && !error && filteredOportunidades.length === 0 && (
            <div className="bg-white border border-[#c3c6d5] rounded-xl p-12 text-center text-[#434653] space-y-2">
              <Info className="w-8 h-8 text-[#c3c6d5] mx-auto" />
              <p className="text-sm font-bold">No se encontraron licitaciones con los filtros seleccionados.</p>
              <button onClick={handleClearFilters} className="text-xs text-[#00327d] font-semibold hover:underline">
                Limpiar filtros para ver todo
              </button>
            </div>
          )}
          {!loading && !error &&
            filteredOportunidades.map((o, idx) => (
              <OportunidadCard key={o.licitacion.id} oportunidad={o} index={idx} />
            ))}
        </div>
      </section>
    </div>
  );
}
