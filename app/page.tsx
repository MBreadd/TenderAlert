/**
 * Landing. 👤 Persona A (feat/frontend).
 * STUB mínimo — rediséñalo con skills/stitch. CTA → /onboarding.
 */
import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight">TenderAlert</h1>
      <p className="text-lg text-zinc-600">
        El copiloto comercial con IA que conecta a las PYMEs peruanas con las
        compras del Estado en tiempo real.
      </p>
      <Link
        href="/onboarding"
        className="rounded-full bg-black px-6 py-3 font-medium text-white transition hover:bg-zinc-800"
      >
        Empezar con mi RUC
      </Link>
    </main>
  );
}
