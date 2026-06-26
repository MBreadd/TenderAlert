# `components/` — UI · 👤 Persona A (`feat/frontend`)

Componentes React (PascalCase). **Solo presentación**: reciben datos por props
(tipados con `@/lib/types`), no llaman a Claude ni a Supabase. Los datos llegan
desde las páginas (`app/`) vía `fetch` a `/api/*`.

## Estructura sugerida (crea subcarpetas según haga falta)
```
components/
├── ui/            # primitivos reutilizables (Button, Input, Card, Badge)
├── onboarding/    # campo RUC, OnboardingChat, burbujas de chat
├── dashboard/     # OportunidadCard (ejemplo incluido), FiltroRubro, PerfilHeader
└── ficha/         # ResumenIA, ChecklistItem, BotonDescargaBases, MedidorCompat
```

## Cómo trabajas sin bloquearte
- Renderiza contra `@/lib/mocks` (`mockOportunidades`, `mockEmpresa`, `mockFichas`).
  Las pantallas en `app/` ya lo hacen — cuando B y C terminen sus rutas, solo
  cambias el origen de datos por `fetch('/api/...')`; el contrato no cambia.
- Usa las skills de diseño: `skills/stitch/*`, `skills/ui-ux-pro-max.md`,
  `skills/frontend-design.md`, `skills/web-design-guidelines.md`.

## Tus pantallas (en `app/`, también las posees tú)
`app/page.tsx` (landing), `app/onboarding/`, `app/dashboard/`,
`app/dashboard/oportunidad/[id]/`.

## Regla
- Antes de crear un componente nuevo, aplica `skills/ponytail`: ¿hace falta hoy?
- Componentes "tontos" y reutilizables; la lógica de fetch vive en las páginas.
