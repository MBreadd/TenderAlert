/**
 * Tarjeta de oportunidad compatible. 👤 Persona A.
 * Componente de EJEMPLO que muestra el patrón: consume el contrato de @/lib/types,
 * sin lógica de datos ni IA. Diséñalo bonito con skills/stitch + Tailwind.
 */
import Link from "next/link";
import { CheckCircle, Info, AlertTriangle, Calendar, MapPin, Tag, Lock, Download, History } from "lucide-react";
import type { OportunidadCompatible } from "@/lib/types";

export function OportunidadCard({ 
  oportunidad,
  index 
}: { 
  oportunidad: OportunidadCompatible;
  index: number;
}) {
  const { licitacion: lic, match } = oportunidad;
  const isLocked = index > 0; // First item is free, others locked
  
  // Determinamos el color y texto basado en la compatibilidad (mockeado)
  let readinessColor = "text-[#ba1a1a] bg-[#ffdad6]"; // Low
  let readinessText = "No Recomendado Aún";
  let StatusIcon = AlertTriangle;
  
  if (match.compatibilidad >= 90) {
    readinessColor = "text-[#00327d] bg-[#0047ab]/10";
    readinessText = "Listo para Postular";
    StatusIcon = CheckCircle;
  } else if (match.compatibilidad >= 70) {
    readinessColor = "text-[#5c5f5e] bg-[#5c5f5e]/10";
    readinessText = "Casi Listo";
    StatusIcon = Info;
  }

  return (
    <div className="bg-white border border-[#c3c6d5] rounded-xl overflow-hidden group hover:border-[#00327d] transition-colors mb-6">
      <div className="bg-[#faf2ee] px-6 py-2 border-b border-[#c3c6d5] flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <span className="font-['Hanken_Grotesk'] text-xs text-[#434653] uppercase tracking-wider font-semibold">
          {lic.entidad}
        </span>
        <div className={`${readinessColor} px-4 py-1 rounded-full font-['Hanken_Grotesk'] text-xs font-semibold flex items-center`}>
          {match.compatibilidad >= 90 && (
            <StatusIcon className="w-4 h-4 mr-1" />
          )}
          Readiness Score: {match.compatibilidad}/100 — {readinessText}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-4 gap-4">
          <h4 className="font-['Libre_Caslon_Text'] text-lg font-semibold text-[#1e1b19] max-w-2xl">
            {lic.objeto}
          </h4>
          <div className="text-left lg:text-right shrink-0">
            <p className="font-['Libre_Caslon_Text'] text-lg font-semibold text-[#00327d]">
              S/ {lic.montoEstimado.toLocaleString("es-PE")}
            </p>
            <p className="text-[11px] font-['Hanken_Grotesk'] text-[#434653] font-medium tracking-wider">
              VALOR ESTIMADO
            </p>
          </div>
        </div>

        {/* Lock overlay wrapper for freemium */}
        <div className="relative mb-6">
          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 ${isLocked ? 'blur-sm select-none' : ''}`}>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-[#f4ece8] flex items-center justify-center text-[#00327d]">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-['Hanken_Grotesk'] text-[#434653] font-medium tracking-wider">
                  FECHA LÍMITE
                </p>
                <p className="font-['Hanken_Grotesk'] text-xs font-semibold text-[#1e1b19]">
                  {lic.fechaLimite}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-[#f4ece8] flex items-center justify-center text-[#00327d]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-['Hanken_Grotesk'] text-[#434653] font-medium tracking-wider">
                  REGIÓN
                </p>
                <p className="font-['Hanken_Grotesk'] text-xs font-semibold text-[#1e1b19]">
                  Lima, Perú
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-[#f4ece8] flex items-center justify-center text-[#00327d]">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-['Hanken_Grotesk'] text-[#434653] font-medium tracking-wider">
                  RUBRO
                </p>
                <p className="font-['Hanken_Grotesk'] text-xs font-semibold text-[#1e1b19]">
                  Obras Civiles / Vial
                </p>
              </div>
            </div>
          </div>

          <div className={`border-l-[3px] border-[#00327d] bg-[#faf2ee] p-4 rounded-r-lg ${isLocked ? 'blur-sm select-none' : 'mb-6'}`}>
            <p className="font-['Hanken_Grotesk'] text-xs font-semibold text-[#00327d] mb-1">
              ANÁLISIS DE READINESS
            </p>
            <p className="font-['Hanken_Grotesk'] text-sm text-[#434653] italic">
              "Alta afinidad técnica detectada. Su empresa cumple con los
              requisitos de experiencia previa."
            </p>
          </div>

          {/* Paywall Overlay */}
          {isLocked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 rounded-lg z-10 backdrop-blur-[2px]">
              <Lock className="w-6 h-6 text-[#00327d] mb-1" />
              <p className="text-[11px] font-['Hanken_Grotesk'] text-[#00327d] font-bold text-center px-4">
                Actualiza a Pro para desbloquear el Análisis de Readiness completo.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#c3c6d5] pt-6 gap-4">
          <div className="flex space-x-6">
            <button className="text-[#00327d] font-['Hanken_Grotesk'] text-xs font-semibold flex items-center hover:underline">
              <Download className="w-4 h-4 mr-1" />
              Descargar bases
            </button>
            <button className="text-[#434653] font-['Hanken_Grotesk'] text-xs font-semibold flex items-center hover:text-[#00327d] transition-colors">
              <History className="w-4 h-4 mr-1" />
              Historial entidad
            </button>
          </div>
          
          {isLocked ? (
            <button className="bg-[#f4ece8] text-[#434653] px-6 py-3 rounded-lg font-['Hanken_Grotesk'] text-xs font-semibold flex items-center cursor-not-allowed">
              <Lock className="w-4 h-4 mr-2" />
              Desbloquear con Pro
            </button>
          ) : (
            <Link
              href={`/dashboard/oportunidad/${lic.id}`}
              className="bg-[#00327d] text-white px-8 py-3 rounded-lg font-['Hanken_Grotesk'] text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Ver análisis completo
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
