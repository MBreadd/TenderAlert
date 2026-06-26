'use client';

import { useState } from "react";
import Link from "next/link";
import { mockOportunidades } from "@/lib/mocks";
import {
  Search,
  Filter,
  ChevronDown,
  Calendar,
  MapPin,
  Building2,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

const SECTORS = ["Todos", "limpieza", "mantenimiento", "seguridad", "construcción", "tecnología"];
const BUDGET_RANGES = [
  { label: "Todos", min: 0, max: Infinity },
  { label: "Hasta S/ 100k", min: 0, max: 100000 },
  { label: "S/ 100k – 500k", min: 100000, max: 500000 },
  { label: "S/ 500k – 2M", min: 500000, max: 2000000 },
  { label: "Más de S/ 2M", min: 2000000, max: Infinity },
];
const READINESS_MIN = [0, 50, 70, 80, 90];

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function ReadinessBadge({ score }: { score: number }) {
  if (score >= 85) return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
      <CheckCircle2 className="w-3 h-3" /> {score}%
    </span>
  );
  if (score >= 60) return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
      {score}%
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#ffdad6] text-[#ba1a1a] border border-[#ba1a1a]/20">
      <AlertCircle className="w-3 h-3" /> {score}%
    </span>
  );
}

function DeadlineChip({ fechaLimite, isCerrada }: { fechaLimite: string; isCerrada: boolean }) {
  if (isCerrada) return (
    <span className="text-[10px] font-bold text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded-full">Cerrada</span>
  );
  const d = daysUntil(fechaLimite);
  if (d <= 7) return (
    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-0.5">
      <Clock className="w-2.5 h-2.5" /> {d}d
    </span>
  );
  return (
    <span className="text-[10px] font-semibold text-[#434653] bg-[#f4ece8] px-2 py-0.5 rounded-full">{d}d</span>
  );
}

export default function OportunidadesPage() {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("Todos");
  const [budgetIdx, setBudgetIdx] = useState(0);
  const [minReadiness, setMinReadiness] = useState(0);
  const [showSectorMenu, setShowSectorMenu] = useState(false);
  const [showBudgetMenu, setShowBudgetMenu] = useState(false);

  const filtered = mockOportunidades.filter((o) => {
    const lic = o.licitacion;
    const matchQuery =
      !query ||
      lic.objeto.toLowerCase().includes(query.toLowerCase()) ||
      lic.entidad.toLowerCase().includes(query.toLowerCase()) ||
      lic.id.toLowerCase().includes(query.toLowerCase());
    const matchSector = sector === "Todos" || lic.rubro === sector;
    const budget = BUDGET_RANGES[budgetIdx];
    const matchBudget = lic.montoEstimado >= budget.min && lic.montoEstimado <= budget.max;
    const matchReadiness = o.match.compatibilidad >= minReadiness;
    return matchQuery && matchSector && matchBudget && matchReadiness;
  });

  const activeCount = filtered.filter((o) => o.licitacion.estado === "vigente").length;
  const hasFilters = query || sector !== "Todos" || budgetIdx !== 0 || minReadiness !== 0;

  return (
    <main className="p-8 max-w-[1280px] mx-auto w-full">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h2
            className="text-4xl text-[#1e1b19]"
            style={{ fontFamily: "'Libre Caslon Text', serif" }}
          >
            Explorador de Oportunidades
          </h2>
          <p className="text-[#434653] mt-1">
            Todas las licitaciones activas del mercado público peruano.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#434653] bg-white border border-[#c3c6d5] px-4 py-2 rounded-lg shrink-0">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">{activeCount} activas</span>
          <span className="text-[#c3c6d5]">·</span>
          <span>{filtered.length} en total</span>
        </div>
      </div>

      {/* Search + filters */}
      <section className="mb-6 space-y-3">
        {/* Search bar */}
        <div className="flex items-center bg-white border border-[#c3c6d5] rounded-xl px-4 py-3 focus-within:border-[#00327d] focus-within:ring-2 focus-within:ring-[#00327d]/10 transition-all shadow-sm">
          <Search className="w-4 h-4 text-[#737784] mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por objeto, entidad o ID de licitación..."
            className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-sm placeholder:text-[#737784]"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-[#737784] hover:text-[#434653] ml-2">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 text-[#737784]">
            <Filter className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Filtros</span>
          </div>

          {/* Sector */}
          <div className="relative">
            <button
              onClick={() => { setShowSectorMenu(!showSectorMenu); setShowBudgetMenu(false); }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-[11px] font-bold transition-all ${
                sector !== "Todos"
                  ? "bg-[#00327d] text-white border-[#00327d]"
                  : "bg-white text-[#434653] border-[#c3c6d5] hover:bg-[#eee7e3]"
              }`}
            >
              Sector: {sector}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showSectorMenu && (
              <div className="absolute top-full mt-1 left-0 z-20 bg-white border border-[#c3c6d5] rounded-xl shadow-lg py-1 min-w-[160px]">
                {SECTORS.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setSector(s); setShowSectorMenu(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-[#f4ece8] transition-colors ${s === sector ? "font-bold text-[#00327d]" : "text-[#434653]"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Budget */}
          <div className="relative">
            <button
              onClick={() => { setShowBudgetMenu(!showBudgetMenu); setShowSectorMenu(false); }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-[11px] font-bold transition-all ${
                budgetIdx !== 0
                  ? "bg-[#00327d] text-white border-[#00327d]"
                  : "bg-white text-[#434653] border-[#c3c6d5] hover:bg-[#eee7e3]"
              }`}
            >
              Monto: {BUDGET_RANGES[budgetIdx].label}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showBudgetMenu && (
              <div className="absolute top-full mt-1 left-0 z-20 bg-white border border-[#c3c6d5] rounded-xl shadow-lg py-1 min-w-[200px]">
                {BUDGET_RANGES.map((r, i) => (
                  <button
                    key={r.label}
                    onClick={() => { setBudgetIdx(i); setShowBudgetMenu(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-[#f4ece8] transition-colors ${i === budgetIdx ? "font-bold text-[#00327d]" : "text-[#434653]"}`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Readiness */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#434653]">Readiness mín:</span>
            {READINESS_MIN.map((v) => (
              <button
                key={v}
                onClick={() => setMinReadiness(v)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
                  minReadiness === v
                    ? "bg-[#00327d] text-white border-[#00327d]"
                    : "bg-white text-[#434653] border-[#c3c6d5] hover:bg-[#eee7e3]"
                }`}
              >
                {v === 0 ? "Todos" : `${v}%+`}
              </button>
            ))}
          </div>

          {hasFilters && (
            <button
              onClick={() => { setQuery(""); setSector("Todos"); setBudgetIdx(0); setMinReadiness(0); }}
              className="ml-auto text-[#00327d] text-[11px] font-bold hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Limpiar
            </button>
          )}
        </div>
      </section>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#c3c6d5] rounded-xl">
          <Search className="w-10 h-10 text-[#c3c6d5] mx-auto mb-4" />
          <h3 className="text-lg font-bold text-[#1e1b19]" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
            Sin resultados
          </h3>
          <p className="text-[#434653] text-sm mt-2">Prueba ajustando los filtros o la búsqueda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => {
            const lic = o.licitacion;
            const isCerrada = lic.estado === "cerrada";
            return (
              <Link
                key={lic.id}
                href={`/dashboard/oportunidad/${lic.id}`}
                className={`block bg-white border rounded-xl p-5 hover:border-[#00327d] hover:shadow-sm transition-all duration-150 group ${
                  isCerrada ? "opacity-70 border-[#c3c6d5]" : "border-[#c3c6d5]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#faf2ee] border border-[#e9e1dd] flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-[#00327d]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-[#434653] uppercase tracking-wider mb-1">{lic.entidad}</p>
                        <h4
                          className="text-base font-bold text-[#1e1b19] group-hover:text-[#00327d] transition-colors leading-snug"
                          style={{ fontFamily: "'Libre Caslon Text', serif" }}
                        >
                          {lic.objeto}
                        </h4>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-lg font-bold text-[#00327d]" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
                          S/ {lic.montoEstimado.toLocaleString("es-PE")}
                        </p>
                        <p className="text-[10px] text-[#737784] uppercase tracking-wider">Monto estimado</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      <ReadinessBadge score={o.match.compatibilidad} />
                      <DeadlineChip fechaLimite={lic.fechaLimite} isCerrada={isCerrada} />
                      <span className="flex items-center gap-1 text-[11px] text-[#434653]">
                        <MapPin className="w-3 h-3" /> {lic.ubicacion}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-[#434653]">
                        <Calendar className="w-3 h-3" /> {lic.fechaLimite}
                      </span>
                      <span className="ml-auto text-[#00327d] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px] font-bold">
                        Ver análisis <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
