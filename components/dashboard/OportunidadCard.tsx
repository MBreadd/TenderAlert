/**
 * Tarjeta de oportunidad compatible. 👤 Persona A.
 * Componente de EJEMPLO que muestra el patrón: consume el contrato de @/lib/types,
 * sin lógica de datos ni IA. Diséñalo bonito con skills/stitch + Tailwind.
 */
import Link from "next/link";
import type { OportunidadCompatible } from "@/lib/types";

export function OportunidadCard({ oportunidad }: { oportunidad: OportunidadCompatible }) {
  const { licitacion: lic, match } = oportunidad;
  return (
    <Link
      href={`/dashboard/oportunidad/${lic.id}`}
      className="block rounded-xl border p-5 transition hover:border-zinc-400 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">{lic.entidad}</p>
          <h3 className="font-medium">{lic.objeto}</h3>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
          {match.compatibilidad}%
        </span>
      </div>
      <p className="mt-2 text-sm text-zinc-600">
        S/ {lic.montoEstimado.toLocaleString("es-PE")} · cierra {lic.fechaLimite}
      </p>
    </Link>
  );
}
