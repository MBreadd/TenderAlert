/**
 * Pantalla 1 — Onboarding instantáneo. 👤 Persona A (feat/frontend).
 *
 * Flujo: campo único de RUC → POST /api/empresa (autocompleta) → chat de 3
 * preguntas (POST /api/onboarding-chat) → redirige a /dashboard.
 *
 * STUB: reemplaza este contenido por la UI real (usa skills/stitch + componentes
 * de /components/onboarding). Los contratos están en @/lib/types y puedes
 * desarrollar contra @/lib/mocks sin esperar a backend/IA.
 */
export default function OnboardingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-6 p-8">
      <h1 className="text-3xl font-semibold">Empieza con tu RUC</h1>
      <p className="text-zinc-600">
        Ingresa tu RUC y autocompletamos tus datos oficiales de SUNAT/OSCE en un
        segundo. (Pantalla por construir — Persona A)
      </p>
      <input
        className="rounded-lg border px-4 py-3"
        placeholder="20512345678"
        inputMode="numeric"
        maxLength={11}
      />
      {/* TODO: <OnboardingChat /> y botón que llame a /api/empresa */}
    </main>
  );
}
