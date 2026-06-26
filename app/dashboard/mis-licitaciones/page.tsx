import { mockMisLicitaciones, type EstadoPostulacion } from "@/lib/mocks";
import Link from "next/link";
import {
  Bookmark,
  FileCheck,
  Send,
  Trophy,
  XCircle,
  Building2,
  ArrowRight,
  CheckCircle2,
  Clock,
} from "lucide-react";

const STATUS_CONFIG: Record<
  EstadoPostulacion,
  { label: string; color: string; bg: string; border: string; icon: React.ElementType }
> = {
  guardado: {
    label: "Guardado",
    color: "text-[#434653]",
    bg: "bg-[#f4ece8]",
    border: "border-[#e9e1dd]",
    icon: Bookmark,
  },
  en_revision: {
    label: "En Revisión",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: FileCheck,
  },
  postulado: {
    label: "Postulado",
    color: "text-[#00327d]",
    bg: "bg-[#0047ab]/10",
    border: "border-[#00327d]/20",
    icon: Send,
  },
  adjudicado: {
    label: "Adjudicado",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: Trophy,
  },
  descalificado: {
    label: "Descalificado",
    color: "text-[#ba1a1a]",
    bg: "bg-[#ffdad6]",
    border: "border-[#ba1a1a]/20",
    icon: XCircle,
  },
};

const COLUMNS: { key: EstadoPostulacion; label: string; icon: React.ElementType }[] = [
  { key: "guardado", label: "Guardados", icon: Bookmark },
  { key: "en_revision", label: "En Revisión", icon: FileCheck },
  { key: "postulado", label: "Postulados", icon: Send },
  { key: "adjudicado", label: "Adjudicados", icon: Trophy },
];

function StatusChip({ status }: { status: EstadoPostulacion }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

export default function MisLicitacionesPage() {
  const byStatus = (status: EstadoPostulacion) =>
    mockMisLicitaciones.filter((ml) => ml.estadoPostulacion === status);

  const totalValue = mockMisLicitaciones.reduce(
    (sum, ml) => sum + ml.oportunidad.licitacion.montoEstimado,
    0
  );

  const adjudicados = byStatus("adjudicado");
  const adjudicadoValue = adjudicados.reduce(
    (sum, ml) => sum + ml.oportunidad.licitacion.montoEstimado,
    0
  );

  return (
    <main className="p-8 max-w-[1280px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h2
            className="text-4xl text-[#1e1b19]"
            style={{ fontFamily: "'Libre Caslon Text', serif" }}
          >
            Mis Licitaciones
          </h2>
          <p className="text-[#434653] mt-1">
            Seguimiento de tus procesos guardados, en revisión y postulados.
          </p>
        </div>
        <div className="flex gap-4 shrink-0">
          <div className="text-center bg-white border border-[#c3c6d5] px-4 py-3 rounded-xl shadow-sm">
            <p className="text-xl font-bold text-[#00327d]" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
              {mockMisLicitaciones.length}
            </p>
            <p className="text-[10px] font-bold text-[#434653] uppercase tracking-wider">Total tracked</p>
          </div>
          <div className="text-center bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl">
            <p className="text-xl font-bold text-emerald-700" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
              S/ {(adjudicadoValue / 1000).toFixed(0)}k
            </p>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Adjudicado</p>
          </div>
        </div>
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {COLUMNS.map((col) => {
          const items = byStatus(col.key);
          const ColIcon = col.icon;
          const cfg = STATUS_CONFIG[col.key];
          return (
            <div key={col.key} className="flex flex-col gap-3">
              {/* Column header */}
              <div className={`flex items-center justify-between px-4 py-2.5 rounded-xl border ${cfg.bg} ${cfg.border}`}>
                <div className="flex items-center gap-2">
                  <ColIcon className={`w-4 h-4 ${cfg.color}`} />
                  <span className={`text-xs font-bold ${cfg.color}`}>{col.label}</span>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/60 ${cfg.color}`}>
                  {items.length}
                </span>
              </div>

              {/* Cards */}
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-[#c3c6d5] rounded-xl text-[#737784]">
                  <ColIcon className="w-6 h-6 mb-2 opacity-40" />
                  <p className="text-xs font-semibold">Sin licitaciones</p>
                  <p className="text-[11px] mt-0.5 opacity-70">en esta etapa</p>
                </div>
              ) : (
                items.map((ml) => {
                  const lic = ml.oportunidad.licitacion;
                  const match = ml.oportunidad.match;
                  const isCerrada = lic.estado === "cerrada";
                  const days = Math.ceil((new Date(lic.fechaLimite).getTime() - Date.now()) / 86400000);
                  return (
                    <Link
                      key={lic.id}
                      href={`/dashboard/oportunidad/${lic.id}`}
                      className="block bg-white border border-[#c3c6d5] rounded-xl p-4 hover:border-[#00327d] hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-start gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-[#faf2ee] border border-[#e9e1dd] flex items-center justify-center shrink-0">
                          <Building2 className="w-4 h-4 text-[#00327d]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-[#434653] uppercase tracking-wider truncate">
                            {lic.entidad}
                          </p>
                          <h4
                            className="text-sm font-bold text-[#1e1b19] group-hover:text-[#00327d] transition-colors leading-snug mt-0.5"
                            style={{ fontFamily: "'Libre Caslon Text', serif" }}
                          >
                            {lic.objeto}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-[#00327d]">
                          S/ {(lic.montoEstimado / 1000).toFixed(0)}k
                        </p>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            match.compatibilidad >= 80 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {match.compatibilidad}%
                          </span>
                        </div>
                      </div>

                      {ml.notas && (
                        <p className="text-[11px] text-[#434653] mt-2 pt-2 border-t border-[#f4ece8] leading-snug italic">
                          {ml.notas}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#f4ece8]">
                        {isCerrada ? (
                          <span className="text-[10px] text-[#ba1a1a] font-bold">Cerrada</span>
                        ) : days > 0 ? (
                          <span className={`flex items-center gap-0.5 text-[10px] font-semibold ${days <= 7 ? "text-amber-600" : "text-[#434653]"}`}>
                            <Clock className="w-2.5 h-2.5" />
                            {days}d restantes
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#ba1a1a] font-bold">Vencida</span>
                        )}
                        <ArrowRight className="w-3.5 h-3.5 text-[#c3c6d5] group-hover:text-[#00327d] transition-colors" />
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          );
        })}
      </div>

      {/* Adjudicados full row */}
      {byStatus("adjudicado").length > 0 && (
        <div className="mt-8">
          <h3
            className="text-xl text-[#1e1b19] mb-4"
            style={{ fontFamily: "'Libre Caslon Text', serif" }}
          >
            Contratos Adjudicados
          </h3>
          <div className="space-y-3">
            {byStatus("adjudicado").map((ml) => {
              const lic = ml.oportunidad.licitacion;
              return (
                <div key={lic.id} className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">{lic.entidad}</p>
                    <p className="text-base font-bold text-emerald-900" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
                      {lic.objeto}
                    </p>
                    {ml.notas && <p className="text-xs text-emerald-700 mt-0.5">{ml.notas}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-bold text-emerald-700" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
                      S/ {lic.montoEstimado.toLocaleString("es-PE")}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-semibold">Contrato adjudicado</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
