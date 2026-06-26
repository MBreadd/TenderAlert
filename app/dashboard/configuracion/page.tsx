'use client';

import { useState } from "react";
import { mockEmpresa } from "@/lib/mocks";
import {
  Building2,
  ShieldCheck,
  Bell,
  CreditCard,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Save,
  Users,
  Lock,
  Zap,
} from "lucide-react";

const CAPACITY_LABELS = [
  { range: "Hasta S/ 500k", sub: "Micro y pequeña empresa" },
  { range: "S/ 500k – 2M", sub: "Empresa en crecimiento" },
  { range: "S/ 2M – 10M", sub: "Mediana empresa" },
  { range: "S/ 10M+", sub: "Gran empresa" },
];

type Tab = "perfil" | "alertas" | "plan" | "equipo";

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "perfil", label: "Perfil Empresarial", icon: Building2 },
  { key: "alertas", label: "Alertas y Notificaciones", icon: Bell },
  { key: "plan", label: "Plan y Facturación", icon: CreditCard },
  { key: "equipo", label: "Equipo", icon: Users },
];

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState<Tab>("perfil");
  const [capacity, setCapacity] = useState(1);
  const [saved, setSaved] = useState(false);
  const empresa = mockEmpresa;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <main className="p-8 max-w-[1280px] mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h2
          className="text-4xl text-[#1e1b19]"
          style={{ fontFamily: "'Libre Caslon Text', serif" }}
        >
          Configuración
        </h2>
        <p className="text-[#434653] mt-1">Gestiona tu perfil, alertas y plan de suscripción.</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar nav */}
        <aside className="w-56 shrink-0">
          <nav className="space-y-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-left transition-all ${
                    activeTab === tab.key
                      ? "bg-[#0047ab]/10 text-[#00327d] border-l-[3px] border-[#00327d] pl-[9px]"
                      : "text-[#434653] hover:bg-[#eee7e3]"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content panel */}
        <div className="flex-1 min-w-0">

          {/* ── Perfil ──────────────────────────────────── */}
          {activeTab === "perfil" && (
            <div className="space-y-6">
              <div className="bg-white border border-[#c3c6d5] rounded-xl overflow-hidden">
                <div className="bg-[#f4ece8] px-6 py-4 border-b border-[#c3c6d5] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#00327d]" />
                    <h3 className="text-xs font-bold text-[#1e1b19] uppercase tracking-widest">Datos Empresariales</h3>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verificado
                  </div>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "Razón Social", value: empresa.razonSocial, readonly: true },
                    { label: "RUC", value: empresa.ruc, readonly: true },
                    { label: "Domicilio Fiscal", value: empresa.domicilioFiscal ?? "", readonly: true },
                    { label: "Ubicación", value: empresa.ubicacion ?? "", readonly: false },
                  ].map((field) => (
                    <div key={field.label} className="space-y-1">
                      <label className="text-[11px] font-bold text-[#434653] uppercase tracking-wider block">
                        {field.label}
                        {field.readonly && (
                          <span className="ml-2 text-[9px] bg-[#e9e1dd] text-[#737784] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
                            SUNAT
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        defaultValue={field.value}
                        readOnly={field.readonly}
                        className={`w-full border rounded-lg px-3 py-2.5 text-sm transition-all ${
                          field.readonly
                            ? "bg-[#faf2ee] border-[#e9e1dd] text-[#434653] cursor-not-allowed"
                            : "bg-white border-[#c3c6d5] text-[#1e1b19] focus:border-[#00327d] focus:ring-2 focus:ring-[#00327d]/10 outline-none"
                        }`}
                      />
                    </div>
                  ))}

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[11px] font-bold text-[#434653] uppercase tracking-wider block">
                      Especialidad (texto libre para la IA)
                    </label>
                    <textarea
                      defaultValue={empresa.especialidad}
                      rows={3}
                      className="w-full border border-[#c3c6d5] rounded-lg px-3 py-2.5 text-sm bg-white text-[#1e1b19] focus:border-[#00327d] focus:ring-2 focus:ring-[#00327d]/10 outline-none resize-none"
                    />
                    <p className="text-[11px] text-[#737784]">Este texto calibra el motor de match de licitaciones.</p>
                  </div>
                </div>
              </div>

              {/* RNP/OSCE status */}
              <div className="bg-white border border-[#c3c6d5] rounded-xl overflow-hidden">
                <div className="bg-[#f4ece8] px-6 py-4 border-b border-[#c3c6d5] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#00327d]" />
                  <h3 className="text-xs font-bold text-[#1e1b19] uppercase tracking-widest">Estado de Habilitación</h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: "SUNAT", status: empresa.estadoSunat, ok: empresa.estadoSunat === "ACTIVO" },
                    { label: "RNP", status: empresa.rnpVigente ? "Vigente" : "No vigente", ok: empresa.rnpVigente },
                    { label: "OSCE", status: "Sin inhabilitaciones", ok: true },
                  ].map((item) => (
                    <div key={item.label} className={`flex items-center gap-3 p-4 rounded-xl border ${item.ok ? "bg-emerald-50 border-emerald-200" : "bg-[#ffdad6] border-[#ba1a1a]/20"}`}>
                      {item.ok ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-[#ba1a1a] shrink-0" />
                      )}
                      <div>
                        <p className={`text-xs font-bold ${item.ok ? "text-emerald-800" : "text-[#ba1a1a]"}`}>{item.label}</p>
                        <p className={`text-[11px] ${item.ok ? "text-emerald-600" : "text-[#ba1a1a]"}`}>{item.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Capacity */}
              <div className="bg-white border border-[#c3c6d5] rounded-xl overflow-hidden">
                <div className="bg-[#f4ece8] px-6 py-4 border-b border-[#c3c6d5]">
                  <h3 className="text-xs font-bold text-[#1e1b19] uppercase tracking-widest">Capacidad de Contratación</h3>
                </div>
                <div className="p-6 space-y-4">
                  <input
                    type="range" min="0" max="3" step="1"
                    value={capacity}
                    onChange={(e) => setCapacity(parseInt(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#00327d] bg-[#e9e1dd]"
                  />
                  <div className="flex justify-between px-0.5">
                    {CAPACITY_LABELS.map((l, i) => (
                      <div key={l.range} className={`text-center ${i === capacity ? "text-[#00327d]" : "text-[#737784]"}`}>
                        <p className={`text-[10px] font-bold`}>{l.range}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-[#0047ab]/5 border border-[#00327d]/10 rounded-lg">
                    <p className="text-xs font-bold text-[#00327d]">{CAPACITY_LABELS[capacity].range}</p>
                    <p className="text-xs text-[#434653]">{CAPACITY_LABELS[capacity].sub}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                    saved
                      ? "bg-emerald-600 text-white"
                      : "bg-[#00327d] text-white hover:bg-[#0047ab]"
                  }`}
                >
                  {saved ? (
                    <><CheckCircle2 className="w-4 h-4" /> Guardado</>
                  ) : (
                    <><Save className="w-4 h-4" /> Guardar cambios</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── Alertas ───────────────────────────────────── */}
          {activeTab === "alertas" && (
            <div className="space-y-4">
              <div className="bg-white border border-[#c3c6d5] rounded-xl overflow-hidden">
                <div className="bg-[#f4ece8] px-6 py-4 border-b border-[#c3c6d5] flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#00327d]" />
                  <h3 className="text-xs font-bold text-[#1e1b19] uppercase tracking-widest">Notificaciones</h3>
                </div>
                <div className="divide-y divide-[#c3c6d5]">
                  {[
                    { label: "Nuevas licitaciones compatibles", sub: "Cuando se publique una oportunidad con readiness >70%", enabled: true },
                    { label: "Alertas de cierre", sub: "7 días y 24 horas antes del vencimiento", enabled: true },
                    { label: "Cambios en el estado RNP", sub: "Si tu RNP es suspendido o revocado", enabled: true },
                    { label: "Resumen semanal", sub: "Digest con las mejores oportunidades de la semana", enabled: false },
                    { label: "Actualizaciones de plataforma", sub: "Nuevas funcionalidades y mejoras", enabled: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-[#1e1b19]">{item.label}</p>
                        <p className="text-xs text-[#434653] mt-0.5">{item.sub}</p>
                      </div>
                      <button
                        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${item.enabled ? "bg-[#00327d]" : "bg-[#c3c6d5]"}`}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${item.enabled ? "left-5" : "left-0.5"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-[#00327d] text-white rounded-xl font-bold text-sm hover:bg-[#0047ab] transition-all">
                  <Save className="w-4 h-4" /> Guardar cambios
                </button>
              </div>
            </div>
          )}

          {/* ── Plan ──────────────────────────────────────── */}
          {activeTab === "plan" && (
            <div className="space-y-5">
              {/* Current plan */}
              <div className="bg-[#00327d] text-white rounded-xl p-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold opacity-70 uppercase tracking-widest mb-1">Plan Actual</p>
                  <h3 className="text-3xl font-bold" style={{ fontFamily: "'Libre Caslon Text', serif" }}>Starter</h3>
                  <p className="text-sm opacity-80 mt-1">Hasta 10 licitaciones monitoreadas / mes</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-3xl font-bold" style={{ fontFamily: "'Libre Caslon Text', serif" }}>Gratis</p>
                  <p className="text-[11px] opacity-70">durante el beta</p>
                </div>
              </div>

              {/* Plan comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: "Pro",
                    price: "S/ 299",
                    period: "/mes",
                    features: [
                      "Hasta 50 licitaciones monitoreadas",
                      "Análisis IA ilimitados",
                      "Alertas en tiempo real",
                      "Exportación a Excel/PDF",
                      "1 usuario",
                    ],
                    cta: "Actualizar a Pro",
                    highlight: true,
                  },
                  {
                    name: "Enterprise",
                    price: "A consultar",
                    period: "",
                    features: [
                      "Licitaciones ilimitadas",
                      "API de integración",
                      "Soporte dedicado",
                      "Usuarios ilimitados",
                      "SLA garantizado",
                    ],
                    cta: "Contactar ventas",
                    highlight: false,
                  },
                ].map((plan) => (
                  <div
                    key={plan.name}
                    className={`rounded-xl border p-6 ${
                      plan.highlight
                        ? "border-[#00327d] shadow-md shadow-[#00327d]/10"
                        : "border-[#c3c6d5]"
                    }`}
                  >
                    {plan.highlight && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#0047ab]/10 text-[#00327d] border border-[#00327d]/20 mb-3">
                        <Zap className="w-3 h-3" /> Recomendado
                      </span>
                    )}
                    <h4 className="text-xl font-bold text-[#1e1b19]" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
                      {plan.name}
                    </h4>
                    <p className="text-2xl font-bold text-[#00327d] mt-1" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
                      {plan.price}<span className="text-sm font-medium text-[#434653]">{plan.period}</span>
                    </p>
                    <ul className="mt-4 space-y-2">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-[#434653]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      className={`w-full mt-5 py-3 rounded-xl font-bold text-sm transition-all ${
                        plan.highlight
                          ? "bg-[#00327d] text-white hover:bg-[#0047ab]"
                          : "border border-[#00327d] text-[#00327d] hover:bg-[#0047ab]/5"
                      }`}
                    >
                      {plan.cta} <ChevronRight className="w-4 h-4 inline" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Equipo ────────────────────────────────────── */}
          {activeTab === "equipo" && (
            <div className="space-y-4">
              <div className="bg-white border border-[#c3c6d5] rounded-xl overflow-hidden">
                <div className="bg-[#f4ece8] px-6 py-4 border-b border-[#c3c6d5] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#00327d]" />
                    <h3 className="text-xs font-bold text-[#1e1b19] uppercase tracking-widest">Miembros del Equipo</h3>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] text-[#737784] bg-[#e9e1dd] px-2 py-1 rounded-full">
                    <Lock className="w-3 h-3" /> Plan Pro requerido
                  </span>
                </div>
                <div className="p-8 text-center text-[#434653]">
                  <Users className="w-10 h-10 text-[#c3c6d5] mx-auto mb-3" />
                  <p className="font-bold text-[#1e1b19]" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
                    Gestión de equipo disponible en Pro
                  </p>
                  <p className="text-sm mt-1.5 max-w-xs mx-auto text-[#434653]">
                    Invita a tus colegas de procurement para colaborar en el análisis de licitaciones.
                  </p>
                  <button
                    onClick={() => setActiveTab("plan")}
                    className="mt-5 px-5 py-2.5 bg-[#00327d] text-white rounded-xl font-bold text-sm hover:bg-[#0047ab] transition-all"
                  >
                    Ver planes <ChevronRight className="w-4 h-4 inline" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
