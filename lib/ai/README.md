# `lib/ai/` — Motor de IA (RAG, prompts, matching) · 👤 Persona C (`feat/ai-prompts`)

Toda la inteligencia de TenderAlert vive acá. **Solo se ejecuta en el servidor**
(rutas `/api`), nunca en el cliente: aquí está la API key de Claude.

## Qué hace cada archivo
| Archivo | Responsabilidad |
|---|---|
| `client.ts` | Cliente Anthropic (singleton) + helper `askClaudeJson` con structured outputs. |
| `prompts/onboarding.ts` | System/user prompts + schema del chat de 3 preguntas. |
| `prompts/ficha.ts` | Prompts + schema del RAG que genera resumen + checklist. |
| `matching.ts` | Scoring de compatibilidad empresa↔licitación (heurístico + IA). |
| `rag.ts` | Orquesta: toma licitación(es) + perfil y produce `FichaRecomendacion`. |

## Tu contrato (lo que produces)
Consumes `Empresa` y `Licitacion`, devuelves `MatchResult`, `OportunidadCompatible`
y `FichaRecomendacion` (todos en `@/lib/types`). Mientras desarrollas, compara tu
salida contra `lib/mocks` (`mockFichas`, `mockMatches`).

## Dónde te conectas
Tus funciones se llaman desde las rutas que tú posees:
`app/api/onboarding-chat`, `app/api/match`, `app/api/ficha/[id]`.

## Reglas
- **Nunca** importes este módulo desde un componente cliente.
- Modelo por defecto `claude-opus-4-8` (`MODEL` en `client.ts`). El equipo puede
  bajar a `claude-sonnet-4-6`/`haiku` por costo/velocidad — decisión consciente.
- Antes de añadir vector DB o embeddings: aplica `skills/ponytail`. Para el MVP el
  RAG = inyectar el JSON OCDS directo al contexto de Claude. **No lo compliques hoy.**
- No inventes requisitos ni alteres montos/fechas en la ficha.
