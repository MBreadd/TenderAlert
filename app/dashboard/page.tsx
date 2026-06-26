/**
 * Pantalla 2 — Dashboard / Panel de oportunidades compatibles. 👤 Persona A.
 *
 * Muestra el perfil activo + lista de OportunidadCompatible (POST /api/match).
 * Incluye el "Simulador de Match": al cambiar el rubro, refresca las ofertas.
 *
 * STUB: render con mocks para no bloquearte. Cambia a fetch real cuando
 * /api/match esté listo. El contrato no cambia.
 */
import { mockOportunidades, mockEmpresa } from "@/lib/mocks";
import { OportunidadCard } from "@/components/dashboard/OportunidadCard";

export default function DashboardPage() {
  const empresa = mockEmpresa;
  const oportunidades = mockOportunidades;

  return (
    <main className="mx-auto max-w-4xl p-8">
      <header className="mb-8">
        <p className="text-sm text-zinc-500">{empresa.razonSocial}</p>
        <h1 className="text-2xl font-semibold">Oportunidades compatibles</h1>
      </header>
      <div className="grid gap-4">
        {oportunidades.map((o) => (
          <OportunidadCard key={o.licitacion.id} oportunidad={o} />
        ))}
      </div>
    </main>
  );
}
