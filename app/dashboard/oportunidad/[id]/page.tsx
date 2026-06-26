/**
 * Pantalla 3 — Ficha de recomendación accionable. 👤 Persona A.
 *
 * Detalle de una licitación: resumen IA, % compatibilidad, descarga de bases y
 * checklist interactivo (POST /api/ficha/[id]).
 *
 * Nota Next 16: en páginas dinámicas, `params` es una Promise → await.
 * STUB: usa mockFichas mientras /api/ficha no esté listo.
 */
import { mockFichas, mockLicitaciones } from "@/lib/mocks";

export default async function FichaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const licitacion = mockLicitaciones.find((l) => l.id === id) ?? mockLicitaciones[0];
  const ficha = mockFichas[licitacion.id];

  return (
    <main className="mx-auto max-w-2xl p-8">
      <p className="text-sm text-zinc-500">{licitacion.entidad}</p>
      <h1 className="mb-4 text-2xl font-semibold">{licitacion.objeto}</h1>

      {ficha ? (
        <>
          <p className="mb-6 rounded-lg bg-zinc-50 p-4 text-zinc-700">{ficha.resumenEjecutivo}</p>
          <h2 className="mb-2 font-medium">Plan de acción ({ficha.compatibilidad}% compatible)</h2>
          <ul className="space-y-2">
            {ficha.planDeAccion.map((item) => (
              <li key={item.id} className="flex gap-2">
                <input type="checkbox" defaultChecked={item.cumplido} />
                <span>{item.texto}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-zinc-500">Ficha por generar — Persona A conecta /api/ficha aquí.</p>
      )}
    </main>
  );
}
