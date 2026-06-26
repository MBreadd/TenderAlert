import { mockOportunidades, mockEmpresa } from "@/lib/mocks";
import { OportunidadCard } from "@/components/dashboard/OportunidadCard";
import {
  RefreshCcw,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Filter,
  ChevronDown,
  Sparkles,
  Calendar,
  Clock,
} from "lucide-react";

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function DashboardPage() {
  const empresa = mockEmpresa;
  const oportunidades = mockOportunidades;

  const urgentCount = oportunidades.filter(
    (o) => daysUntil(o.licitacion.fechaLimite) <= 7 && o.licitacion.estado === "vigente"
  ).length;

  const pipelineTotal = oportunidades
    .filter((o) => o.licitacion.estado === "vigente")
    .reduce((sum, o) => sum + o.licitacion.montoEstimado, 0);

  const avgReadiness = Math.round(
    oportunidades
      .filter((o) => o.licitacion.estado === "vigente")
      .reduce((sum, o) => sum + o.match.compatibilidad, 0) /
      oportunidades.filter((o) => o.licitacion.estado === "vigente").length
  );

  return (
    <main className="p-8 max-w-[1280px] mx-auto w-full">
      {/* ── Page header ───────────────────────────────────── */}
      <section className="mb-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h2
              className="text-4xl text-[#1e1b19] leading-tight"
              style={{ fontFamily: "'Libre Caslon Text', serif" }}
            >
              Buenos días, Alejandro
            </h2>
            <p className="text-base text-[#434653] mt-1">{empresa.razonSocial}</p>
          </div>
          <div className="flex items-center text-[#434653] text-xs font-semibold bg-white border border-[#c3c6d5] px-4 py-2 rounded-lg shrink-0">
            <RefreshCcw className="w-3.5 h-3.5 mr-2" />
            Última act.: Hoy, 8:30 AM
          </div>
        </div>
      </section>

      {/* ── Intelligence banner ────────────────────────────── */}
      <section className="mb-8">
        <div className="bg-[#00327d] text-white rounded-xl px-6 py-4 flex items-start gap-4">
          <div className="mt-0.5 shrink-0">
            <Sparkles className="w-5 h-5 opacity-80" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold mb-1 opacity-95">Resumen de esta semana</p>
            <p className="text-sm opacity-80 leading-relaxed">
              Encontramos{" "}
              <strong className="opacity-100">
                {oportunidades.filter((o) => o.licitacion.estado === "vigente").length} nuevas licitaciones
              </strong>{" "}
              compatibles con tu rubro de Limpieza y Mantenimiento. El valor agregado supera{" "}
              <strong className="opacity-100">
                S/{" "}
                {(pipelineTotal / 1000).toFixed(0)}k
              </strong>
              .{urgentCount > 0 && (
                <>
                  {" "}
                  <span className="inline-flex items-center gap-1 text-amber-300 font-bold">
                    <Clock className="w-3.5 h-3.5 inline" /> {urgentCount} cierra en menos de 7 días.
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── KPI strip ─────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {/* Readiness */}
        <div className="bg-[#00327d] text-white p-6 rounded-xl flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-[11px] font-bold uppercase tracking-widest opacity-90">Nivel de Preparación</p>
            <ShieldCheck className="w-5 h-5 opacity-70" />
          </div>
          <div className="mt-3">
            <h3 className="text-4xl font-light" style={{ fontFamily: "'Libre Caslon Text', serif" }}>87/100</h3>
            <div className="flex flex-wrap gap-1 mt-2">
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-medium">SUNAT Activo</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-medium">RNP Vigente</span>
            </div>
            <p className="text-[11px] flex items-center opacity-75 mt-2">
              <AlertTriangle className="w-3 h-3 mr-1.5" />
              Falta Declaración de Equipos
            </p>
          </div>
        </div>

        {/* Compatible */}
        <div className="bg-white border border-[#c3c6d5] p-6 rounded-xl flex flex-col justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#434653] uppercase tracking-widest">Oportunidades compatibles</p>
            <h3
              className="text-4xl text-[#00327d] mt-2"
              style={{ fontFamily: "'Libre Caslon Text', serif" }}
            >
              {oportunidades.filter((o) => o.licitacion.estado === "vigente").length}
            </h3>
          </div>
          <div className="flex items-center text-emerald-600 text-xs font-semibold mt-4">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            +2 desde ayer
          </div>
        </div>

        {/* Pipeline */}
        <div className="bg-white border border-[#c3c6d5] p-6 rounded-xl shadow-sm">
          <p className="text-[11px] font-bold text-[#434653] uppercase tracking-widest">Pipeline potencial</p>
          <h3
            className="text-4xl text-[#00327d] mt-2"
            style={{ fontFamily: "'Libre Caslon Text', serif" }}
          >
            S/ {(pipelineTotal / 1000000).toFixed(1)}M
          </h3>
          <div className="flex items-center text-emerald-600 text-xs font-semibold mt-4">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            +S/ 240k esta semana
          </div>
        </div>

        {/* Closing deadlines */}
        <div className="bg-white border border-[#c3c6d5] p-6 rounded-xl shadow-sm">
          <p className="text-[11px] font-bold text-[#434653] uppercase tracking-widest">Próximos cierres</p>
          <h3
            className="text-4xl text-[#00327d] mt-2"
            style={{ fontFamily: "'Libre Caslon Text', serif" }}
          >
            {oportunidades.filter((o) => {
              const d = daysUntil(o.licitacion.fechaLimite);
              return d > 0 && d <= 14;
            }).length}
          </h3>
          <div className="flex items-center text-amber-600 text-xs font-semibold mt-4">
            <Calendar className="w-3.5 h-3.5 mr-1" />
            Vencen esta semana
          </div>
        </div>
      </section>

      {/* ── Filter bar ────────────────────────────────────── */}
      <section className="mb-8 bg-white border border-[#c3c6d5] p-2 rounded-xl flex items-center gap-2 overflow-x-auto shadow-sm">
        <div className="flex items-center gap-1 ml-2 text-[#737784] shrink-0">
          <Filter className="w-4 h-4" />
          <span className="text-[11px] font-bold uppercase tracking-wider">Filtros</span>
        </div>
        <div className="w-px h-5 bg-[#c3c6d5] mx-1 shrink-0" />
        <div className="flex gap-1.5 flex-wrap">
          {["Sector", "Monto", "Entidad", "Readiness", "Fecha"].map((label) => (
            <button
              key={label}
              className="px-3 py-1.5 rounded-full border border-[#c3c6d5] text-[11px] font-bold text-[#434653] flex items-center hover:bg-[#eee7e3] hover:border-[#737784] transition-all duration-150"
            >
              {label}
              <ChevronDown className="w-3 h-3 ml-1" />
            </button>
          ))}
        </div>
        <div className="ml-auto pr-2 shrink-0">
          <button className="text-[#00327d] text-[11px] font-bold hover:underline whitespace-nowrap">
            Limpiar filtros
          </button>
        </div>
      </section>

      {/* ── Recommendations list ──────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h3
            className="text-2xl text-[#1e1b19]"
            style={{ fontFamily: "'Libre Caslon Text', serif" }}
          >
            Recomendaciones Prioritarias
          </h3>
          <span className="text-sm text-[#434653] hidden sm:flex items-center gap-1">
            <TrendingDown className="w-4 h-4" />
            Ordenado por Readiness Score
          </span>
        </div>
        <div className="space-y-5">
          {oportunidades.map((o, idx) => (
            <OportunidadCard key={o.licitacion.id} oportunidad={o} index={idx} />
          ))}
        </div>
      </section>
    </main>
  );
}
