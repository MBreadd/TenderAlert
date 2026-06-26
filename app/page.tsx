'use client';

import { ShieldCheck, Database, Search, FileCheck, ArrowRight, Lock, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Empresa } from "@/lib/types";
import { api } from "@/lib/api";
import { setEmpresa } from "@/lib/store/empresa";

export default function Home() {
  const router = useRouter();
  const [ruc, setRuc] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ruc.length < 11) return;

    setError(null);
    setIsVerifying(true);

    // Animación escalonada de "verificación" (puro UX).
    const timers = [
      setTimeout(() => setVerificationStep(1), 800),
      setTimeout(() => setVerificationStep(2), 1600),
      setTimeout(() => setVerificationStep(3), 2400),
    ];

    try {
      // Consulta real a SUNAT/OSCE vía /api/empresa, con un piso de tiempo
      // para que la animación alcance a verse en pantalla.
      const [empresa] = await Promise.all([
        api<Empresa>("/api/empresa", { method: "POST", body: JSON.stringify({ ruc }) }),
        new Promise((resolve) => setTimeout(resolve, 3000)),
      ]);
      setEmpresa(empresa);
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff8f5] text-[#1e1b19] font-['Hanken_Grotesk'] p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-[#c3c6d5] space-y-6">
          <div className="text-center space-y-2 mb-8">
            <h2 className="font-['Libre_Caslon_Text'] text-2xl font-bold text-[#00327d]">Verificando Identidad Corporativa</h2>
            <p className="text-[#434653] text-sm">Cruzando información en tiempo real con las entidades estatales peruanas.</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {verificationStep >= 1 ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Loader2 className="w-5 h-5 text-[#00327d] animate-spin" />}
              <div>
                <p className="font-semibold text-sm">Consultando SUNAT</p>
                <p className="text-xs text-[#434653]">RUC {ruc} verificado y activo</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {verificationStep >= 2 ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : (verificationStep >= 1 ? <Loader2 className="w-5 h-5 text-[#00327d] animate-spin" /> : <div className="w-5 h-5 rounded-full border-2 border-dashed border-[#c3c6d5]" />)}
              <div className={verificationStep < 1 ? "opacity-50" : ""}>
                <p className="font-semibold text-sm">Consultando OSCE</p>
                <p className="text-xs text-[#434653]">Verificando inhabilitaciones</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {verificationStep >= 3 ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : (verificationStep >= 2 ? <Loader2 className="w-5 h-5 text-[#00327d] animate-spin" /> : <div className="w-5 h-5 rounded-full border-2 border-dashed border-[#c3c6d5]" />)}
              <div className={verificationStep < 2 ? "opacity-50" : ""}>
                <p className="font-semibold text-sm">Verificando RNP</p>
                <p className="text-xs text-[#434653]">Validando vigencia y capacidad</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fff8f5] text-[#1e1b19] font-['Hanken_Grotesk'] overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#0047ab]/5 to-transparent pointer-events-none" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 py-20">
        
        {/* Header/Hero Section */}
        <div className="max-w-3xl mx-auto text-center space-y-8 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4ece8] border border-[#e9e1dd] text-[#434653] text-xs font-semibold uppercase tracking-widest mb-4">
            <span className="w-2 h-2 rounded-full bg-[#00327d] animate-pulse"></span>
            Enterprise Procurement Intelligence
          </div>
          
          <h1 className="font-['Libre_Caslon_Text'] text-5xl md:text-6xl text-[#00327d] leading-tight tracking-tight">
            Gana más licitaciones,<br />
            <span className="text-[#1e1b19]">con menos fricción.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#434653] max-w-2xl mx-auto leading-relaxed">
            El analista invisible que conecta a tu empresa con las mejores oportunidades del Estado. Evaluamos tu compatibilidad y auditamos tus documentos en segundos.
          </p>
          
          <form onSubmit={handleStart} className="pt-8 max-w-lg mx-auto flex flex-col gap-4">
            <div className="flex items-center bg-white p-2 rounded-xl border border-[#c3c6d5] focus-within:border-[#00327d] focus-within:ring-2 focus-within:ring-[#00327d]/10 transition-all">
              <span className="text-[#434653] font-bold px-4 border-r border-[#e9e1dd]">RUC</span>
              <input 
                type="text" 
                maxLength={11}
                placeholder="Ingresa tu RUC (ej. 20603498210)"
                className="flex-1 bg-transparent border-none focus:ring-0 px-4 text-[#1e1b19] placeholder:text-[#c3c6d5] outline-none"
                value={ruc}
                onChange={(e) => setRuc(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>
            <button 
              type="submit"
              disabled={ruc.length < 11}
              className="w-full flex items-center justify-center gap-3 bg-[#00327d] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#0047ab] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              Comenzar análisis gratis
              <ArrowRight className="w-5 h-5" />
            </button>
            {error && (
              <p className="text-sm text-[#ba1a1a] font-semibold text-center">{error}</p>
            )}
          </form>
        </div>

        {/* Value Proposition Cards */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4 mb-20">
          <div className="bg-white border border-[#c3c6d5] p-8 rounded-xl hover:border-[#00327d]/30 transition-colors">
            <div className="w-12 h-12 bg-[#0047ab]/10 rounded-lg flex items-center justify-center text-[#00327d] mb-6">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-['Libre_Caslon_Text'] text-xl font-bold mb-3">Encuentra licitaciones para tu rubro</h3>
            <p className="text-[#434653] text-sm leading-relaxed">
              Monitoreamos el mercado público 24/7 y filtramos el ruido para entregarte solo las oportunidades donde tienes ventajas competitivas.
            </p>
          </div>
          
          <div className="bg-white border border-[#c3c6d5] p-8 rounded-xl hover:border-[#00327d]/30 transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#00327d]/5 to-transparent rounded-bl-full pointer-events-none" />
            <div className="w-12 h-12 bg-[#0047ab]/10 rounded-lg flex items-center justify-center text-[#00327d] mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-['Libre_Caslon_Text'] text-xl font-bold mb-3">Sabe si estás listo para postular</h3>
            <p className="text-[#434653] text-sm leading-relaxed">
              Nuestro Readiness Score cruza los requisitos de las bases con tu perfil empresarial para calcular tu probabilidad real de éxito.
            </p>
          </div>

          <div className="bg-white border border-[#c3c6d5] p-8 rounded-xl hover:border-[#00327d]/30 transition-colors">
            <div className="w-12 h-12 bg-[#0047ab]/10 rounded-lg flex items-center justify-center text-[#00327d] mb-6">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="font-['Libre_Caslon_Text'] text-xl font-bold mb-3">Evita descalificaciones por documentación</h3>
            <p className="text-[#434653] text-sm leading-relaxed">
              Sube tus anexos y certificados. Nuestra IA audita la documentación requerida antes de que la envíes, previniendo errores fatales.
            </p>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="w-full max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 py-8 border-t border-[#c3c6d5]/50 text-[#434653]">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#737784]" />
            <span className="text-xs font-semibold tracking-wide">Datos oficiales SUNAT & OSCE</span>
          </div>
          <div className="hidden md:block w-1 h-1 rounded-full bg-[#c3c6d5]"></div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#737784]" />
            <span className="text-xs font-semibold tracking-wide">Protegido bajo Ley 29733</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#f4ece8] border-t border-[#e9e1dd] py-8 text-center">
        <p className="text-xs text-[#737784] font-semibold">
          © {new Date().getFullYear()} TenderAlert Enterprise Intelligence. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}
