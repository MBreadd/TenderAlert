'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Landmark, Settings, Save, AlertCircle } from "lucide-react";
import type { Empresa } from "@/lib/types";
import { getEmpresa, setEmpresa } from "@/lib/store/empresa";

export default function ConfiguracionPage() {
  const router = useRouter();
  const [empresa, setEmpresaState] = useState<Empresa | null>(null);
  
  // Form fields
  const [especialidad, setEspecialidad] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [selectedRubros, setSelectedRubros] = useState<string[]>([]);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    const e = getEmpresa();
    if (!e) {
      router.replace("/");
      return;
    }
    setEmpresaState(e);
    setEspecialidad(e.especialidad || "");
    setUbicacion(e.ubicacion || "");
    setSelectedRubros(e.rubros || []);
  }, [router]);

  const handleRubroToggle = (rubro: string) => {
    if (selectedRubros.includes(rubro)) {
      setSelectedRubros(selectedRubros.filter((r) => r !== rubro));
    } else {
      setSelectedRubros([...selectedRubros, rubro]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empresa) return;

    const updatedEmpresa: Empresa = {
      ...empresa,
      especialidad,
      ubicacion,
      rubros: selectedRubros,
    };

    setEmpresa(updatedEmpresa);
    setEmpresaState(updatedEmpresa);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  if (!empresa) return null;

  const availableRubros = [
    { value: "limpieza", label: "Limpieza Industrial" },
    { value: "seguridad", label: "Seguridad y Vigilancia" },
    { value: "ti", label: "Tecnología / Software" },
    { value: "alimentos", label: "Alimentos / Catering" },
    { value: "construccion", label: "Construcción / Obras" },
    { value: "mantenimiento", label: "Mantenimiento General" },
  ];

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto w-full space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-serif text-3xl font-bold text-[#1e1b19] tracking-tight">
          Configuración del Perfil
        </h2>
        <p className="text-sm text-[#434653] mt-1">
          Ajusta la capacidad operativa de tu empresa y calibra las recomendaciones automáticas de la IA.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Official verified data - Read Only */}
        <section className="bg-white border border-[#c3c6d5] rounded-xl overflow-hidden shadow-sm">
          <div className="bg-[#f4ece8] px-6 py-4 border-b border-[#c3c6d5] flex justify-between items-center">
            <h3 className="text-xs text-[#1e1b19] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Landmark className="w-4 h-4" /> Datos de Identidad (SUNAT & OSCE)
            </h3>
            <span className="flex items-center gap-1 text-emerald-800 text-[10px] font-bold uppercase">
              <ShieldCheck className="w-4 h-4 text-emerald-700" /> Verificado
            </span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-bold text-[#434653] uppercase">Razón Social</label>
              <p className="text-sm font-semibold text-[#1e1b19] pt-1">{empresa.razonSocial}</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#434653] uppercase">RUC</label>
              <p className="text-sm font-semibold text-[#1e1b19] pt-1">{empresa.ruc}</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#434653] uppercase">RNP Vigente</label>
              <p className="text-sm font-semibold text-emerald-700 pt-1">
                {empresa.rnpVigente ? "Sí (Servicios)" : "No Vigente"}
              </p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#434653] uppercase">Condición SUNAT</label>
              <p className="text-sm font-semibold text-emerald-700 pt-1">{empresa.estadoSunat}</p>
            </div>
          </div>
          <div className="px-6 py-3.5 bg-[#faf2ee] border-t border-[#c3c6d5]/40 text-[11px] text-[#434653] flex items-center gap-1">
            <AlertCircle className="w-4 h-4 text-[#434653] shrink-0" />
            Los datos de identidad provienen de los registros oficiales del estado y no son editables.
          </div>
        </section>

        {/* Customizable search pitch */}
        <section className="bg-white border border-[#c3c6d5] p-6 rounded-xl shadow-sm space-y-6">
          <h3 className="text-xs text-[#1e1b19] font-bold uppercase tracking-widest pb-3 border-b border-[#c3c6d5]">
            Especialización y Ámbito de Búsqueda
          </h3>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#434653] uppercase">Foco de Licitación (Pitch para la IA)</label>
              <textarea
                rows={3}
                placeholder="Ej. Limpieza de oficinas corporativas y lavado de alfombras a gran escala para entidades del sector público..."
                className="w-full bg-[#faf2ee] border border-[#c3c6d5] rounded-xl px-4 py-3 text-sm focus:border-[#00327d] focus:ring-1 focus:ring-[#00327d] outline-none text-[#1e1b19] placeholder:text-[#737784]"
                value={especialidad}
                onChange={(e) => setEspecialidad(e.target.value)}
              />
              <p className="text-[10px] text-[#434653] leading-relaxed">
                Este texto libre afina la búsqueda semántica e influye en la redacción automática de tus borradores de propuestas.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#434653] uppercase">Ubicación de Interés</label>
              <select
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                className="w-full bg-[#faf2ee] border border-[#c3c6d5] rounded-xl px-3 py-2 text-sm focus:border-[#00327d] outline-none text-[#1e1b19]"
              >
                <option value="Lima">Lima</option>
                <option value="Callao">Callao</option>
                <option value="Arequipa">Arequipa</option>
                <option value="Junín">Junín</option>
                <option value="Cusco">Cusco</option>
              </select>
            </div>
          </div>
        </section>

        {/* Sectors check */}
        <section className="bg-white border border-[#c3c6d5] p-6 rounded-xl shadow-sm space-y-6">
          <h3 className="text-xs text-[#1e1b19] font-bold uppercase tracking-widest pb-3 border-b border-[#c3c6d5]">
            Rubros de Alertas Activas
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {availableRubros.map((rubro) => {
              const isChecked = selectedRubros.includes(rubro.value);
              return (
                <label 
                  key={rubro.value} 
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    isChecked 
                      ? "border-[#00327d] bg-[#0047ab]/5 font-semibold text-[#00327d]" 
                      : "border-[#c3c6d5] hover:bg-[#faf2ee]/50 text-[#434653]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleRubroToggle(rubro.value)}
                    className="rounded border-[#c3c6d5] text-[#00327d] focus:ring-[#00327d]"
                  />
                  <span className="text-xs">{rubro.label}</span>
                </label>
              );
            })}
          </div>
        </section>

        {/* Actions bar */}
        <div className="flex items-center justify-between">
          <div>
            {savedMessage && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-lg animate-fade-in">
                ¡Perfil guardado exitosamente!
              </span>
            )}
          </div>
          <button 
            type="submit"
            className="bg-[#00327d] text-white hover:bg-[#0047ab] px-8 py-3.5 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Guardar Cambios
          </button>
        </div>

      </form>
    </div>
  );
}
