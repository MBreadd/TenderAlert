# `app/api/` — Route handlers (la costura B ↔ C)

Cada ruta es un archivo independiente, asignado a un dueño claro, para que B y C
**no toquen los mismos archivos** y eviten conflictos de merge.

| Ruta | Método | Dueño | Hace |
|---|---|---|---|
| `empresa/route.ts` | POST | 👤 B | RUC → datos oficiales (Latinfo) |
| `licitaciones/route.ts` | GET | 👤 B | Lista licitaciones OCDS |
| `onboarding-chat/route.ts` | POST | 👤 C | Chat de 3 preguntas (IA) |
| `match/route.ts` | POST | 👤 C | Oportunidades compatibles (scoring) |
| `ficha/[id]/route.ts` | POST | 👤 C | Ficha de recomendación (RAG) |

## Convención compartida (acordada por los 3)
- Todas responden con el envelope `ApiResponse<T>` de `@/lib/types`:
  `{ ok: true, data }` o `{ ok: false, error }`.
- El frontend (Persona A) consume estas rutas con `fetch` y nunca llama a Claude
  ni a Supabase directamente.
- API keys solo viven en el servidor (estos archivos). Nunca en componentes.
