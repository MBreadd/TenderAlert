'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ExternalLink, BarChart2, Brain, CheckCircle2 } from 'lucide-react';
import { mockEmpresa } from '@/lib/mocks';

const CAPACITY_LABELS = [
  { range: 'Hasta S/ 500k', sub: 'Micro y pequeña empresa' },
  { range: 'S/ 500k – 2M', sub: 'Empresa en crecimiento' },
  { range: 'S/ 2M – 10M', sub: 'Mediana empresa' },
  { range: 'S/ 10M+', sub: 'Gran empresa' },
];

const STEPS = ['RUC verificado', 'Perfil detectado', 'Configuración', 'Dashboard'];

export default function OnboardingPage() {
  const router = useRouter();
  const [capacity, setCapacity] = useState(1);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConfirm = () => {
    router.push('/dashboard');
  };

  const empresa = mockEmpresa;

  return (
    <div className="min-h-screen bg-[#f8f9f8] flex flex-col">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-8 py-4 bg-[#fff8f5] border-b border-[#c3c6d5] sticky top-0 z-10">
        <Link href="/">
          <span className="text-xl font-bold text-[#00327d]" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
            TenderAlert
          </span>
        </Link>

        {/* Step indicator */}
        <div className="hidden md:flex items-center gap-1">
          {STEPS.map((label, i) => {
            const step = i + 1;
            const isActive = step === 2;
            const isDone = step < 2;
            return (
              <div key={label} className="flex items-center">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-700'
                        : isActive
                        ? 'bg-[#00327d] text-white'
                        : 'bg-[#e9e1dd] text-[#737784]'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : step}
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      isActive ? 'text-[#00327d]' : isDone ? 'text-emerald-700' : 'text-[#737784]'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 h-px mx-2 ${isDone ? 'bg-emerald-300' : isActive ? 'bg-[#00327d]/30' : 'bg-[#c3c6d5]'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile step */}
        <div className="md:hidden flex items-center gap-2">
          <div className="h-1.5 w-24 bg-[#e9e1dd] rounded-full overflow-hidden">
            <div className="h-full w-1/4 bg-[#00327d] transition-all duration-700" />
          </div>
          <span className="text-xs text-[#434653] font-semibold">Paso 2 de 4</span>
        </div>
      </header>

      {/* Main content */}
      <main
        className={`w-full max-w-[1280px] mx-auto flex-1 px-6 py-12 flex flex-col lg:flex-row gap-12 items-start justify-center transition-all duration-700 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Left: detected profile */}
        <div className="w-full lg:w-3/5 space-y-6">
          <div>
            <span className="text-xs font-semibold text-[#00327d] uppercase tracking-widest">
              Paso 2 — Perfil detectado
            </span>
            <h1
              className="text-4xl text-[#1e1b19] mt-2"
              style={{ fontFamily: "'Libre Caslon Text', serif" }}
            >
              Encontramos tu empresa
            </h1>
            <p className="text-[#434653] mt-1 text-sm">
              Verificamos tus datos en SUNAT, OSCE y RNP en tiempo real.
            </p>
          </div>

          {/* Company card */}
          <div className="border border-[#c3c6d5] bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="bg-[#f4ece8] px-6 py-4 border-b border-[#c3c6d5] flex justify-between items-center">
              <span className="text-xs font-bold text-[#434653] uppercase tracking-wider">
                Ficha Técnica Empresarial
              </span>
              <ShieldCheck className="w-5 h-5 text-[#00327d]" />
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-[#434653] uppercase tracking-wider">Razón Social</p>
                <p className="text-lg font-bold text-[#1e1b19]" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
                  {empresa.razonSocial}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-[#434653] uppercase tracking-wider">RUC</p>
                <p className="text-lg font-semibold text-[#1e1b19] tracking-tight">{empresa.ruc}</p>
              </div>
              <div className="md:col-span-2 h-px bg-[#c3c6d5] opacity-40" />
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-[#434653] uppercase tracking-wider">Estado SUNAT</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <p className="text-sm font-semibold text-[#1e1b19]">{empresa.estadoSunat}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-[#434653] uppercase tracking-wider">Estado RNP</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <p className="text-sm font-semibold text-[#1e1b19]">
                    {empresa.rnpVigente ? 'Vigente' : 'No vigente'}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-[#434653] uppercase tracking-wider">Capítulo RNP</p>
                <p className="text-sm text-[#1e1b19]">{empresa.capituloRnp?.join(', ') ?? '—'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-[#434653] uppercase tracking-wider">Domicilio Fiscal</p>
                <p className="text-sm text-[#1e1b19]">{empresa.domicilioFiscal ?? '—'}</p>
              </div>
              <div className="md:col-span-2 space-y-1">
                <p className="text-[11px] font-semibold text-[#434653] uppercase tracking-wider">Rubros detectados</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {empresa.rubros.map((r) => (
                    <span key={r} className="px-2.5 py-1 bg-[#0047ab]/10 text-[#00327d] text-xs font-semibold rounded-full border border-[#00327d]/15">
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-[#faf2ee] border-t border-[#c3c6d5] flex items-center justify-between">
              <p className="text-sm text-[#434653]">Datos sincronizados con SUNAT y OSCE</p>
              <button className="text-[#00327d] text-xs font-semibold flex items-center gap-1 hover:underline">
                ¿No es tu empresa?
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Historical processes */}
          <div className="h-44 rounded-xl border border-[#c3c6d5] bg-white relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(#00327d 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-8">
                <BarChart2 className="w-9 h-9 text-[#00327d]/40 mb-2.5 mx-auto" />
                <p className="text-sm text-[#434653] italic leading-relaxed">
                  El sistema identificó <span className="font-bold text-[#00327d] not-italic">124 procesos históricos</span> vinculados a tu actividad económica en los últimos 3 años.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: configuration */}
        <div className="w-full lg:w-2/5 sticky top-24">
          <div className="bg-white border border-[#c3c6d5] rounded-xl shadow-sm overflow-hidden">
            <div className="border-l-[3px] border-[#00327d] px-6 py-5 border-b border-[#c3c6d5] flex items-start gap-3">
              <div className="bg-[#0047ab]/10 p-2 rounded-lg shrink-0">
                <Brain className="w-5 h-5 text-[#00327d]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1e1b19]" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
                  Configuración de alertas
                </h2>
                <p className="text-sm text-[#434653] mt-1 leading-relaxed">
                  Define tu capacidad operativa para calibrar las oportunidades que te mostraremos.
                </p>
              </div>
            </div>

            <div className="px-6 py-6 space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#434653] uppercase tracking-wider block">
                  Capacidad máxima de contratación
                </label>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="1"
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#00327d] bg-[#e9e1dd]"
                />
                <div className="flex justify-between px-0.5">
                  {CAPACITY_LABELS.map((l, i) => (
                    <div key={l.range} className={`text-center ${i === capacity ? 'text-[#00327d]' : 'text-[#737784]'}`}>
                      <p className={`text-[10px] font-bold ${i === capacity ? '' : 'font-medium'}`}>{l.range}</p>
                    </div>
                  ))}
                </div>

                {/* Selected capacity badge */}
                <div className="mt-2 p-3 bg-[#0047ab]/5 border border-[#00327d]/10 rounded-lg">
                  <p className="text-xs font-bold text-[#00327d]">{CAPACITY_LABELS[capacity].range}</p>
                  <p className="text-xs text-[#434653]">{CAPACITY_LABELS[capacity].sub}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2">
                <input
                  id="privacy-check"
                  type="checkbox"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-[#c3c6d5] text-[#00327d] focus:ring-[#00327d] shrink-0"
                />
                <label htmlFor="privacy-check" className="text-sm text-[#434653] leading-snug cursor-pointer">
                  Acepto el tratamiento de mis datos bajo la{' '}
                  <a href="#" className="text-[#00327d] underline">Ley Peruana 29733</a>.
                </label>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={handleConfirm}
                  disabled={!privacyAccepted}
                  className={`w-full py-3.5 bg-[#00327d] text-white rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${
                    !privacyAccepted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#0047ab] shadow-md'
                  }`}
                >
                  Confirmar y ver mi dashboard
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full py-2 text-[#434653] text-xs font-semibold uppercase tracking-widest hover:text-[#1e1b19] transition-colors"
                >
                  Omitir configuración
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-[1280px] mx-auto px-6 py-5 border-t border-[#c3c6d5]/30 flex justify-between items-center">
        <p className="text-[11px] text-[#434653]">
          © 2026 TenderAlert Enterprise Procurement. Seguridad ISO 27001.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-[11px] text-[#434653] hover:text-[#00327d] transition-colors">Términos</a>
          <a href="#" className="text-[11px] text-[#434653] hover:text-[#00327d] transition-colors">Privacidad</a>
        </div>
      </footer>
    </div>
  );
}
