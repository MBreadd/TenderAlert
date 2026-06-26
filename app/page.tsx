'use client';

import { ShieldCheck, Database, Search, FileCheck, ArrowRight, Lock, Loader2, CheckCircle2, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Empresa } from "@/lib/types";
import { api } from "@/lib/api";
import { setEmpresa } from "@/lib/store/empresa";

export default function Home() {
  const router = useRouter();
  const [ruc, setRuc] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [step, setStep] = useState(1); // 1: RUC, 2: Credentials
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (ruc.length < 11) {
      setError("El RUC debe tener 11 dígitos");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ruc.length < 11 || !email || !password) return;

    setError(null);
    setIsVerifying(true);

    // Animación escalonada de "verificación" (SUNAT -> OSCE -> RNP)
    const timers = [
      setTimeout(() => setVerificationStep(1), 800),
      setTimeout(() => setVerificationStep(2), 1600),
      setTimeout(() => setVerificationStep(3), 2400),
    ];

    try {
      // Consulta real a SUNAT/OSCE vía /api/empresa
      const [empresa] = await Promise.all([
        api<Empresa>("/api/empresa", { method: "POST", body: JSON.stringify({ ruc }) }),
        new Promise((resolve) => setTimeout(resolve, 3200)),
      ]);
      
      // Guardar sesión simulada y empresa
      setEmpresa(empresa);
      localStorage.setItem("user_session", JSON.stringify({ email, ruc }));
      
      router.push("/onboarding");
    } catch (err) {
      timers.forEach(clearTimeout);
      setVerificationStep(0);
      setIsVerifying(false);
      setError(err instanceof Error ? err.message : "No pudimos verificar el RUC. Intenta de nuevo.");
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff8f5] text-[#1e1b19] font-sans p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-[#c3c6d5] space-y-6">
          <div className="text-center space-y-2 mb-8">
            <h2 className="font-serif text-2xl font-bold text-[#00327d]">Verificando Identidad Corporativa</h2>
            <p className="text-[#434653] text-sm leading-relaxed">Cruzando información en tiempo real con las entidades estatales peruanas.</p>
          </div>
          
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              {verificationStep >= 1 ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <Loader2 className="w-5 h-5 text-[#00327d] animate-spin shrink-0" />}
              <div>
                <p className="font-semibold text-sm text-[#1e1b19]">Consultando SUNAT</p>
                <p className="text-xs text-[#434653]">RUC {ruc} verificado y activo</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {verificationStep >= 2 ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : (verificationStep >= 1 ? <Loader2 className="w-5 h-5 text-[#00327d] animate-spin shrink-0" /> : <div className="w-5 h-5 rounded-full border-2 border-dashed border-[#c3c6d5] shrink-0" />)}
              <div className={verificationStep < 1 ? "opacity-50" : ""}>
                <p className="font-semibold text-sm text-[#1e1b19]">Consultando OSCE</p>
                <p className="text-xs text-[#434653]">Verificando inhabilitaciones y multas</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {verificationStep >= 3 ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : (verificationStep >= 2 ? <Loader2 className="w-5 h-5 text-[#00327d] animate-spin shrink-0" /> : <div className="w-5 h-5 rounded-full border-2 border-dashed border-[#c3c6d5] shrink-0" />)}
              <div className={verificationStep < 2 ? "opacity-50" : ""}>
                <p className="font-semibold text-sm text-[#1e1b19]">Verificando RNP</p>
                <p className="text-xs text-[#434653]">Validando vigencia, capacidad y capítulos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fff8f5] text-[#1e1b19] font-sans overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#0047ab]/5 to-transparent pointer-events-none" />

      {/* Header Area */}
      <header className="w-full bg-[#fff8f5] border-b border-[#c3c6d5] sticky top-0 z-30 flex justify-between items-center px-6 md:px-12 py-4">
        <h1 className="font-serif text-2xl font-bold text-[#00327d]">
          TenderAlert
        </h1>
        <nav className="flex items-center space-x-6">
          <a href="#features" className="text-xs font-semibold text-[#434653] hover:text-[#00327d] transition-colors hidden sm:block">
            Cómo funciona
          </a>
          <button onClick={() => { setRuc("20100128056"); setStep(1); }} className="text-xs font-semibold text-[#434653] hover:text-[#00327d] transition-colors">
            Demo RUC
          </button>
          <a
            href="#"
            className="bg-[#00327d] text-white px-4 py-2 rounded-lg font-semibold text-xs hover:opacity-90 transition-opacity"
          >
            Registrarse
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center relative z-10 px-6 py-12 md:py-20">
        
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4ece8] border border-[#e9e1dd] text-[#434653] text-xs font-semibold uppercase tracking-widest mb-2 select-none">
            <span className="w-2 h-2 rounded-full bg-[#00327d] animate-pulse"></span>
            Enterprise Procurement Intelligence
          </div>
          
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#00327d] leading-tight tracking-tight">
            Gana más licitaciones del Estado,<br />
            <span className="text-[#1e1b19]">con auditoría documental instantánea.</span>
          </h1>
          
          <p className="text-base sm:text-lg text-[#434653] max-w-2xl mx-auto leading-relaxed">
            TenderAlert es el analista inteligente que monitorea el SEACE 24/7. Evaluamos el perfil oficial de tu empresa en SUNAT y OSCE, cruzamos requisitos y auditamos tus documentos antes de que postules para evitar descalificaciones.
          </p>
          
          {/* Multi-step signup form */}
          <div className="pt-4 max-w-md mx-auto w-full">
            <div className="bg-white p-6 rounded-2xl border border-[#c3c6d5] shadow-sm text-left space-y-4">
              <h2 className="font-serif text-lg font-bold text-[#00327d]">
                {step === 1 ? "Comienza tu análisis gratis" : "Crea tu cuenta de acceso"}
              </h2>
              <p className="text-xs text-[#434653] leading-relaxed">
                {step === 1 
                  ? "Ingresa el RUC de tu empresa. Cruzaremos datos oficiales con SUNAT, OSCE y RNP en tiempo real." 
                  : "Completa tus credenciales de acceso para guardar tu perfil y ver tu recomendación."}
              </p>

              {step === 1 ? (
                <form onSubmit={handleNextStep} className="space-y-3">
                  <div className="flex items-center bg-[#faf2ee] p-2.5 rounded-xl border border-[#c3c6d5] focus-within:border-[#00327d] focus-within:ring-2 focus-within:ring-[#00327d]/10 transition-all">
                    <span className="text-[#434653] font-bold px-3 border-r border-[#e9e1dd] text-sm">RUC</span>
                    <input 
                      type="text" 
                      maxLength={11}
                      placeholder="Ingresa el RUC de tu empresa (11 dígitos)"
                      className="flex-1 bg-transparent border-none focus:ring-0 px-3 text-[#1e1b19] placeholder:text-[#737784] outline-none text-sm"
                      value={ruc}
                      onChange={(e) => setRuc(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={ruc.length < 11}
                    className="w-full flex items-center justify-center gap-2 bg-[#00327d] text-white px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-[#0047ab] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Verificar RUC y Continuar
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleStart} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#434653] uppercase">RUC de Empresa</label>
                    <input 
                      type="text"
                      disabled
                      value={ruc}
                      className="w-full bg-[#faf2ee]/60 border border-[#c3c6d5] rounded-xl px-3 py-2 text-[#434653] text-sm font-semibold cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#434653] uppercase">Correo Corporativo</label>
                    <input 
                      type="email" 
                      placeholder="correo@empresa.com"
                      className="w-full bg-white border border-[#c3c6d5] rounded-xl px-3 py-2 text-[#1e1b19] text-sm focus:border-[#00327d] focus:ring-1 focus:ring-[#00327d] outline-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#434653] uppercase">Contraseña</label>
                    <input 
                      type="password" 
                      placeholder="Min. 6 caracteres"
                      className="w-full bg-white border border-[#c3c6d5] rounded-xl px-3 py-2 text-[#1e1b19] text-sm focus:border-[#00327d] focus:ring-1 focus:ring-[#00327d] outline-none"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 py-3 border border-[#c3c6d5] text-[#434653] rounded-xl font-semibold text-xs hover:bg-[#eee7e3] transition-colors"
                    >
                      Atrás
                    </button>
                    <button 
                      type="submit"
                      className="w-2/3 flex items-center justify-center gap-2 bg-[#00327d] text-white py-3 rounded-xl font-semibold text-xs hover:bg-[#0047ab] transition-colors"
                    >
                      Registrar y Analizar
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
              {error && (
                <p className="text-xs text-[#ba1a1a] font-semibold text-center mt-2">{error}</p>
              )}
            </div>
          </div>
        </div>

        {/* Value Proposition Cards */}
        <div id="features" className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4 mb-16 scroll-mt-24">
          <div className="bg-white border border-[#c3c6d5] p-8 rounded-xl hover:border-[#00327d]/40 transition-all duration-300 shadow-sm">
            <div className="w-12 h-12 bg-[#0047ab]/10 rounded-lg flex items-center justify-center text-[#00327d] mb-6">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold mb-3 text-[#1e1b19]">Filtro de Licitaciones</h3>
            <p className="text-[#434653] text-sm leading-relaxed">
              Monitoreamos diariamente el SEACE y estructuramos las convocatorias en formato legible para presentarte solo las ofertas que encajan con tu rubro.
            </p>
          </div>
          
          <div className="bg-white border border-[#c3c6d5] p-8 rounded-xl hover:border-[#00327d]/40 transition-all duration-300 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#00327d]/5 to-transparent rounded-bl-full pointer-events-none" />
            <div className="w-12 h-12 bg-[#0047ab]/10 rounded-lg flex items-center justify-center text-[#00327d] mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold mb-3 text-[#1e1b19]">Cálculo de Readiness</h3>
            <p className="text-[#434653] text-sm leading-relaxed">
              Algoritmo de scoring que cruza requisitos de las bases con tus inhabilitaciones, multas, vigencia en el RNP y experiencia previa.
            </p>
          </div>

          <div className="bg-white border border-[#c3c6d5] p-8 rounded-xl hover:border-[#00327d]/40 transition-all duration-300 shadow-sm">
            <div className="w-12 h-12 bg-[#0047ab]/10 rounded-lg flex items-center justify-center text-[#00327d] mb-6">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold mb-3 text-[#1e1b19]">Auditoría de Documentos</h3>
            <p className="text-[#434653] text-sm leading-relaxed">
              Analizador de bases con IA. Sube tus anexos y constancias para comprobar que cumplen con lo requerido antes de enviar tu propuesta.
            </p>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="w-full max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 py-6 border-t border-[#c3c6d5]/50 text-[#434653]">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#737784]" />
            <span className="text-xs font-semibold tracking-wide">Búsqueda integrada en SUNAT & OSCE</span>
          </div>
          <div className="hidden md:block w-1 h-1 bg-[#c3c6d5] rounded-full"></div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#737784]" />
            <span className="text-xs font-semibold tracking-wide">Cumple con la Ley 29733 de Datos Personales</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#f4ece8] border-t border-[#e9e1dd] py-6 text-center">
        <p className="text-xs text-[#737784] font-semibold">
          © {new Date().getFullYear()} TenderAlert Enterprise Intelligence. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}

