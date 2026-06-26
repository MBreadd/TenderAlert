'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Database,
  Search,
  FileCheck,
  ArrowRight,
  Lock,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
  Mail,
  KeyRound,
  AlertCircle,
} from "lucide-react";

type Step = "form" | "verifying" | "register";

export default function Home() {
  const router = useRouter();
  const [ruc, setRuc] = useState("");
  const [step, setStep] = useState<Step>("form");
  const [verificationStep, setVerificationStep] = useState(0);

  // Registration form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (ruc.length < 11) return;

    setStep("verifying");
    setTimeout(() => setVerificationStep(1), 800);
    setTimeout(() => setVerificationStep(2), 1600);
    setTimeout(() => setVerificationStep(3), 2400);
    setTimeout(() => {
      setStep("register");
    }, 3200);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (password !== confirmPassword) {
      setAuthError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 8) {
      setAuthError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setIsRegistering(true);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseAnonKey) {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        await supabase.auth.signUp({ email, password });
      }
    } catch {
      // Supabase not configured — proceed anyway for demo
    } finally {
      setIsRegistering(false);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("ruc", ruc);
        sessionStorage.setItem("email", email);
      }
      router.push("/onboarding");
    }
  };

  // ── Verification screen ───────────────────────────────────────────────────
  if (step === "verifying") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff8f5] p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-[#c3c6d5] space-y-6">
          <div className="text-center space-y-2 mb-6">
            <h2
              className="text-2xl font-bold text-[#00327d]"
              style={{ fontFamily: "'Libre Caslon Text', serif" }}
            >
              Verificando identidad corporativa
            </h2>
            <p className="text-[#434653] text-sm">
              Cruzando RUC {ruc} con las entidades estatales peruanas.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { label: "Consultando SUNAT", sub: "RUC verificado y activo", done: verificationStep >= 1 },
              { label: "Consultando OSCE", sub: "Verificando inhabilitaciones", done: verificationStep >= 2 },
              { label: "Verificando RNP", sub: "Validando vigencia y capacidad", done: verificationStep >= 3 },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center gap-3">
                {item.done ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : verificationStep >= i ? (
                  <Loader2 className="w-5 h-5 text-[#00327d] animate-spin shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-dashed border-[#c3c6d5] shrink-0" />
                )}
                <div className={verificationStep < i ? "opacity-40" : ""}>
                  <p className="font-semibold text-sm text-[#1e1b19]">{item.label}</p>
                  <p className="text-xs text-[#434653]">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Registration step ─────────────────────────────────────────────────────
  if (step === "register") {
    return (
      <div className="min-h-screen bg-[#fff8f5] flex flex-col">
        {/* Header */}
        <header className="w-full flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-sm border-b border-[#c3c6d5]">
          <span className="text-xl font-bold text-[#00327d]" style={{ fontFamily: "'Libre Caslon Text', serif" }}>
            TenderAlert
          </span>
        </header>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-lg">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-8">
              {[1, 2].map((s) => (
                <div key={s} className={`flex items-center ${s < 2 ? "flex-1" : ""}`}>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      s === 1 ? "bg-emerald-100 text-emerald-700 border border-emerald-300" : "bg-[#00327d] text-white"
                    }`}
                  >
                    {s === 1 ? <CheckCircle2 className="w-4 h-4" /> : "2"}
                  </div>
                  {s < 2 && <div className="flex-1 h-px bg-[#00327d] mx-2" />}
                  <span className={`text-xs font-semibold ml-2 ${s === 2 ? "text-[#00327d]" : "text-[#434653]"}`}>
                    {s === 1 ? "RUC verificado" : "Crear cuenta"}
                  </span>
                </div>
              ))}
            </div>

            {/* Detected company banner */}
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-emerald-800">Empresa detectada</p>
                <p className="text-sm text-emerald-700 mt-0.5">
                  <span className="font-semibold">Servicios Integrales Lima S.A.C.</span> — RUC {ruc}
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  SUNAT Activo · RNP Vigente (Servicios) · Sin inhabilitaciones OSCE
                </p>
              </div>
            </div>

            {/* Form card */}
            <div className="bg-white border border-[#c3c6d5] rounded-2xl p-8 shadow-sm">
              <h2
                className="text-2xl font-bold text-[#1e1b19] mb-1"
                style={{ fontFamily: "'Libre Caslon Text', serif" }}
              >
                Crea tu cuenta
              </h2>
              <p className="text-sm text-[#434653] mb-6">
                Accede a tus oportunidades personalizadas de licitación.
              </p>

              {authError && (
                <div className="mb-4 flex items-center gap-2 p-3 bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-lg text-[#ba1a1a] text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {authError}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#434653] uppercase tracking-wider">
                    Correo corporativo
                  </label>
                  <div className="flex items-center bg-[#faf2ee] border border-[#c3c6d5] rounded-lg px-3 py-2.5 focus-within:border-[#00327d] focus-within:ring-2 focus-within:ring-[#00327d]/10 transition-all">
                    <Mail className="w-4 h-4 text-[#737784] mr-2 shrink-0" />
                    <input
                      type="email"
                      required
                      placeholder="contacto@empresa.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-sm placeholder:text-[#c3c6d5]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#434653] uppercase tracking-wider">
                    Contraseña
                  </label>
                  <div className="flex items-center bg-[#faf2ee] border border-[#c3c6d5] rounded-lg px-3 py-2.5 focus-within:border-[#00327d] focus-within:ring-2 focus-within:ring-[#00327d]/10 transition-all">
                    <KeyRound className="w-4 h-4 text-[#737784] mr-2 shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Mínimo 8 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-sm placeholder:text-[#c3c6d5]"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#737784] hover:text-[#434653] ml-1">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#434653] uppercase tracking-wider">
                    Confirmar contraseña
                  </label>
                  <div className="flex items-center bg-[#faf2ee] border border-[#c3c6d5] rounded-lg px-3 py-2.5 focus-within:border-[#00327d] focus-within:ring-2 focus-within:ring-[#00327d]/10 transition-all">
                    <KeyRound className="w-4 h-4 text-[#737784] mr-2 shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Repite tu contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-sm placeholder:text-[#c3c6d5]"
                    />
                  </div>
                </div>

                <p className="text-xs text-[#434653] leading-relaxed pt-1">
                  Al crear tu cuenta aceptas los{" "}
                  <a href="#" className="text-[#00327d] underline">Términos de Servicio</a>{" "}
                  y la{" "}
                  <a href="#" className="text-[#00327d] underline">Política de Privacidad</a>{" "}
                  bajo la Ley 29733.
                </p>

                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full flex items-center justify-center gap-2 bg-[#00327d] text-white px-6 py-3.5 rounded-xl font-bold hover:bg-[#0047ab] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 mt-2"
                >
                  {isRegistering ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Acceder a mi dashboard
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            <p className="text-center text-sm text-[#434653] mt-4">
              ¿Ya tienes cuenta?{" "}
              <button
                onClick={() => router.push("/dashboard")}
                className="text-[#00327d] font-semibold hover:underline"
              >
                Inicia sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Landing / main form ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-[#fff8f5] text-[#1e1b19]">
      {/* Background gradient */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#0047ab]/5 to-transparent pointer-events-none" />

      {/* ── Header ──────────────────────────────────────── */}
      <header className="w-full sticky top-0 z-20 flex items-center justify-between px-8 py-4 bg-[#fff8f5]/90 backdrop-blur-sm border-b border-[#c3c6d5]/60">
        <span
          className="text-xl font-bold text-[#00327d]"
          style={{ fontFamily: "'Libre Caslon Text', serif" }}
        >
          TenderAlert
        </span>
        <nav className="flex items-center gap-6">
          <a
            href="#"
            className="text-sm font-semibold text-[#434653] hover:text-[#00327d] transition-colors"
          >
            Cómo funciona
          </a>
          <a
            href="#"
            className="text-sm font-semibold text-[#434653] hover:text-[#00327d] transition-colors"
          >
            Precios
          </a>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm font-bold text-[#00327d] border border-[#00327d] px-4 py-1.5 rounded-lg hover:bg-[#00327d] hover:text-white transition-all duration-200"
          >
            Iniciar sesión
          </button>
        </nav>
      </header>

      {/* ── Hero ─────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-8 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4ece8] border border-[#e9e1dd] text-[#434653] text-xs font-semibold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[#00327d] animate-pulse" />
            Inteligencia de licitaciones públicas
          </div>

          <h1
            className="text-5xl md:text-6xl text-[#00327d] leading-tight tracking-tight"
            style={{ fontFamily: "'Libre Caslon Text', serif" }}
          >
            Gana más licitaciones,
            <br />
            <span className="text-[#1e1b19]">con menos fricción.</span>
          </h1>

          <p className="text-lg md:text-xl text-[#434653] max-w-2xl mx-auto leading-relaxed">
            Analizamos la compatibilidad de tu empresa con cada oportunidad del Estado peruano en segundos.
            RUC → perfil → oportunidades — sin trabajo manual.
          </p>

          <form onSubmit={handleStart} className="pt-4 max-w-lg mx-auto flex flex-col gap-3">
            <div className="flex items-center bg-white p-2 rounded-xl border border-[#c3c6d5] focus-within:border-[#00327d] focus-within:ring-2 focus-within:ring-[#00327d]/10 transition-all shadow-sm">
              <span className="text-[#434653] font-bold px-4 border-r border-[#e9e1dd] text-sm">RUC</span>
              <input
                type="text"
                maxLength={11}
                placeholder="Ingresa tu RUC (ej. 20603498210)"
                className="flex-1 bg-transparent border-none focus:ring-0 px-4 text-[#1e1b19] placeholder:text-[#c3c6d5] outline-none text-sm"
                value={ruc}
                onChange={(e) => setRuc(e.target.value.replace(/\D/g, ""))}
                required
              />
            </div>
            <button
              type="submit"
              disabled={ruc.length < 11}
              className="w-full flex items-center justify-center gap-3 bg-[#00327d] text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-[#0047ab] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm"
            >
              Analizar mi empresa gratis
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-xs text-center text-[#737784]">
              Sin tarjeta. Sin compromiso. Resultados en segundos.
            </p>
          </form>
        </div>

        {/* Value props */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 w-full px-4 mb-20">
          {[
            {
              icon: Search,
              title: "Encuentra licitaciones para tu rubro",
              body: "Monitoreamos SEACE 24/7 y filtramos el ruido. Solo ves las oportunidades donde tienes ventajas competitivas reales.",
            },
            {
              icon: ShieldCheck,
              title: "Sabe si estás listo para postular",
              body: "Nuestro Readiness Score cruza los requisitos del pliego con tu perfil empresarial. Conoces tu probabilidad antes de invertir tiempo.",
              featured: true,
            },
            {
              icon: FileCheck,
              title: "Evita descalificaciones documentarias",
              body: "Sube tus anexos y certificados. La IA audita la documentación requerida antes de que la envíes al SEACE.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className={`p-8 rounded-xl border transition-all ${
                card.featured
                  ? "bg-[#00327d] text-white border-[#00327d] shadow-lg shadow-[#00327d]/15"
                  : "bg-white border-[#c3c6d5] hover:border-[#00327d]/30"
              }`}
            >
              <div
                className={`w-11 h-11 rounded-lg flex items-center justify-center mb-5 ${
                  card.featured ? "bg-white/20" : "bg-[#0047ab]/10 text-[#00327d]"
                }`}
              >
                <card.icon className={`w-5 h-5 ${card.featured ? "text-white" : "text-[#00327d]"}`} />
              </div>
              <h3
                className={`text-lg font-bold mb-3 ${card.featured ? "text-white" : "text-[#1e1b19]"}`}
                style={{ fontFamily: "'Libre Caslon Text', serif" }}
              >
                {card.title}
              </h3>
              <p className={`text-sm leading-relaxed ${card.featured ? "text-white/80" : "text-[#434653]"}`}>
                {card.body}
              </p>
            </div>
          ))}
        </div>

        {/* Trust signals */}
        <div className="w-full max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 py-8 border-t border-[#c3c6d5]/50 text-[#434653]">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#737784]" />
            <span className="text-xs font-semibold tracking-wide">Datos oficiales SUNAT & OSCE</span>
          </div>
          <div className="hidden md:block w-1 h-1 rounded-full bg-[#c3c6d5]" />
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#737784]" />
            <span className="text-xs font-semibold tracking-wide">Protegido bajo Ley 29733</span>
          </div>
          <div className="hidden md:block w-1 h-1 rounded-full bg-[#c3c6d5]" />
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#737784]" />
            <span className="text-xs font-semibold tracking-wide">+1,200 empresas peruanas</span>
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
