'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ExternalLink, BarChart2, Brain } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [capacity, setCapacity] = useState(0);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConfirm = () => {
    // In a real flow, you would POST this to an API. 
    // We navigate to dashboard as requested.
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8F9F8] flex flex-col items-center">
      {/* Top Navigation */}
      <header className="w-full flex justify-between items-center px-12 py-4 bg-[#fff8f5] border-b border-[#c3c6d5]">
        <div className="flex items-center gap-2">
          <span className="font-['Libre_Caslon_Text'] text-2xl font-bold text-[#00327d]">
            TenderAlert
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-1.5 w-32 bg-[#e9e1dd] rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-[#00327d] transition-all duration-700"></div>
          </div>
          <span className="font-['Hanken_Grotesk'] text-xs text-[#434653] uppercase tracking-widest font-semibold">
            Paso 2 de 4
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main
        className={`w-full max-w-[1280px] flex-1 px-6 py-12 flex flex-col lg:flex-row gap-12 items-start justify-center transition-all duration-700 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Left Column: Executive Summary Card */}
        <div className="w-full lg:w-3/5 space-y-4">
          <div className="space-y-1">
            <span className="font-['Hanken_Grotesk'] text-xs font-semibold text-[#00327d] uppercase tracking-widest">
              Validación de Identidad
            </span>
            <h1 className="font-['Libre_Caslon_Text'] text-4xl text-[#1e1b19] mb-6">
              Perfil Detectado
            </h1>
          </div>

          <div className="border border-[#E7E5E4] bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="bg-[#F1F0EE] px-6 py-4 border-b border-[#c3c6d5] flex justify-between items-center">
              <span className="font-['Hanken_Grotesk'] text-xs font-semibold text-[#434653] uppercase tracking-wider">
                Ficha Técnica Empresarial
              </span>
              <ShieldCheck className="w-5 h-5 text-[#00327d]" />
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div className="space-y-1">
                <p className="font-['Hanken_Grotesk'] text-[11px] font-medium text-[#434653] uppercase">
                  Razón Social
                </p>
                <p className="font-['Libre_Caslon_Text'] text-lg font-semibold text-[#1e1b19]">
                  Infrastructura Global S.A.C.
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-['Hanken_Grotesk'] text-[11px] font-medium text-[#434653] uppercase">
                  RUC
                </p>
                <p className="font-['Hanken_Grotesk'] text-lg font-semibold text-[#1e1b19] tracking-tight">
                  20603498210
                </p>
              </div>
              <div className="md:col-span-2 h-px bg-[#c3c6d5] opacity-30"></div>
              <div className="space-y-1">
                <p className="font-['Hanken_Grotesk'] text-[11px] font-medium text-[#434653] uppercase">
                  Estado RNP
                </p>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <p className="font-['Hanken_Grotesk'] text-base font-medium text-[#1e1b19]">
                    Vigente
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-['Hanken_Grotesk'] text-[11px] font-medium text-[#434653] uppercase">
                  Representante Legal
                </p>
                <p className="font-['Hanken_Grotesk'] text-base text-[#1e1b19]">
                  Carlos Mendoza
                </p>
              </div>
              <div className="md:col-span-2 space-y-1">
                <p className="font-['Hanken_Grotesk'] text-[11px] font-medium text-[#434653] uppercase">
                  Actividad Económica Principal
                </p>
                <p className="font-['Hanken_Grotesk'] text-base text-[#1e1b19]">
                  Construcción de edificios y obras de ingeniería civil
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-[#faf2ee] border-t border-[#c3c6d5] flex items-center justify-between">
              <p className="font-['Hanken_Grotesk'] text-sm text-[#434653]">
                Datos sincronizados con SUNAT y OSCE
              </p>
              <button className="text-[#00327d] font-['Hanken_Grotesk'] text-xs font-semibold flex items-center gap-1 hover:underline">
                ¿No es su empresa?{' '}
                <ExternalLink className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          <div className="h-48 rounded-xl border border-[#c3c6d5] bg-white relative overflow-hidden group">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage:
                    'radial-gradient(#00327d 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              ></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-6">
                <BarChart2 className="w-10 h-10 text-[#00327d]/40 mb-2 mx-auto" />
                <p className="font-['Hanken_Grotesk'] text-sm text-[#434653] italic">
                  El sistema ha identificado 124 procesos históricos vinculados a
                  su actividad económica.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Setup */}
        <div className="w-full lg:w-2/5 sticky top-12">
          <div className="border-l-[3px] border-[#00327d] bg-white p-6 border border-l-0 border-[#E7E5E4] rounded-r-xl shadow-sm space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-[#0047ab]/10 p-2 rounded-lg">
                <Brain className="w-6 h-6 text-[#00327d]" />
              </div>
              <div className="space-y-2">
                <h2 className="font-['Libre_Caslon_Text'] text-lg font-semibold text-[#1e1b19]">
                  Asistente de Configuración
                </h2>
                <p className="font-['Hanken_Grotesk'] text-base text-[#434653] leading-relaxed">
                  Para refinar su motor de búsqueda y priorizar oportunidades
                  relevantes, necesitamos entender su capacidad operativa.
                </p>
              </div>
            </div>
            
            <div className="h-px bg-[#c3c6d5]"></div>
            
            <div className="space-y-4">
              <p className="font-['Libre_Caslon_Text'] text-lg font-semibold text-[#1e1b19] italic">
                Defina el rango de su capacidad de contratación para ajustar las
                alertas de licitaciones.
              </p>
              <div className="grid grid-cols-1 gap-2">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="font-['Hanken_Grotesk'] text-xs font-semibold text-[#434653] uppercase tracking-wider">
                      Máxima Capacidad de Contratación (S/)
                    </label>
                    <div className="relative pt-1">
                      <input
                        className="w-full h-2 bg-[#e9e1dd] rounded-lg appearance-none cursor-pointer accent-[#00327d]"
                        type="range"
                        min="0"
                        max="3"
                        step="1"
                        value={capacity}
                        onChange={(e) => setCapacity(parseInt(e.target.value))}
                      />
                      <div className="flex justify-between mt-2 px-1">
                        <span className="font-['Hanken_Grotesk'] text-[11px] font-medium text-[#434653]">
                          Hasta 500k
                        </span>
                        <span className="font-['Hanken_Grotesk'] text-[11px] font-medium text-[#434653]">
                          500k - 2M
                        </span>
                        <span className="font-['Hanken_Grotesk'] text-[11px] font-medium text-[#434653]">
                          2M - 10M
                        </span>
                        <span className="font-['Hanken_Grotesk'] text-[11px] font-medium text-[#434653]">
                          10M+
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 pt-4">
                    <input
                      id="privacy-check"
                      type="checkbox"
                      className="mt-1 rounded border-[#c3c6d5] text-[#00327d] focus:ring-[#00327d]"
                      checked={privacyAccepted}
                      onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    />
                    <label
                      htmlFor="privacy-check"
                      className="font-['Hanken_Grotesk'] text-sm text-[#434653] leading-tight"
                    >
                      Acepto el tratamiento de mis datos personales y de la empresa
                      de acuerdo con la Ley Peruana 29733.
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-6 flex flex-col gap-2">
              <button
                onClick={handleConfirm}
                disabled={!privacyAccepted}
                className={`w-full py-4 bg-[#00327d] text-white rounded-lg font-['Hanken_Grotesk'] text-xs font-semibold uppercase tracking-widest transition-all ${
                  !privacyAccepted
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-[#0047ab] shadow-lg scale-[1.02]'
                }`}
              >
                Confirmar y Continuar
              </button>
              <button className="w-full py-2 text-[#434653] font-['Hanken_Grotesk'] text-xs font-semibold uppercase tracking-widest hover:text-[#1e1b19] transition-colors">
                Omitir paso
              </button>
            </div>
          </div>
          
          <div className="mt-6 rounded-xl overflow-hidden aspect-video relative">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAgYUJVgdeB7agSGc_zsU6bNBoaBGkgAnjyjKF1PfKnqAwJ0pLk5OB2GC5P1moJ54JF5caEDvOG0HG56eV8P43lMLk52w1jW5SD8b46_gndP1DVJ4l0-SuVGuiuMFU5TtUzNb1dpI4LmQqYMOATLf57WSYPNlppHrMM1SQkbc3l9yh1nHYK6bV8SOQWQIiGNifS3t4mqKpcvd5VJUcoEKBcue5RiEoE_bDhft9_7eJ8KI1SPBEy7LmB8Qj8hurm2rtjQM721N74KnN"
              alt="Context"
              className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#F8F9F8] to-transparent pointer-events-none"></div>
          </div>
        </div>
      </main>

      {/* Footer Meta */}
      <footer className="w-full max-w-[1280px] px-6 py-6 mt-12 border-t border-[#c3c6d5]/30 flex justify-between items-center">
        <p className="font-['Hanken_Grotesk'] text-[11px] font-medium text-[#434653]">
          © 2024 TenderAlert Enterprise Procurement. Seguridad certificada ISO 27001.
        </p>
        <div className="flex gap-6">
          <a
            href="#"
            className="font-['Hanken_Grotesk'] text-[11px] font-medium text-[#434653] hover:text-[#00327d] transition-colors"
          >
            Términos de Servicio
          </a>
          <a
            href="#"
            className="font-['Hanken_Grotesk'] text-[11px] font-medium text-[#434653] hover:text-[#00327d] transition-colors"
          >
            Política de Privacidad
          </a>
        </div>
      </footer>
    </div>
  );
}
