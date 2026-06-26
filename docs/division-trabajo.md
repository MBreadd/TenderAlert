# División de trabajo — 3 personas en paralelo (hackathon 12h)

> Objetivo: que A, B y C avancen en **ramas separadas** sin pisarse, y mergeen a
> `main` vía Pull Request. La clave es el desarrollo **contract-first**:
> los tipos compartidos (`lib/types`) + mocks (`lib/mocks`) son la frontera entre
> los tres. Se definen juntos al inicio y luego cada quien programa contra ellos.

## El reparto

| | Persona A — Frontend | Persona B — Backend/Datos | Persona C — IA/Prompts |
|---|---|---|---|
| **Rama** | `feat/frontend` | `feat/backend` | `feat/ai-prompts` |
| **Carpetas propias** | `app/page.tsx`, `app/onboarding/`, `app/dashboard/`, `components/` | `lib/data/`, `supabase/`, `app/api/empresa/`, `app/api/licitaciones/` | `lib/ai/`, `app/api/onboarding-chat/`, `app/api/match/`, `app/api/ficha/` |
| **Produce** | Pantallas y componentes UI | `Empresa`, `Licitacion` (datos reales) | `MatchResult`, `FichaRecomendacion`, chat |
| **Consume** | Rutas `/api/*` (vía fetch) | Latinfo, SEACE, Supabase | `Empresa` + `Licitacion` de B |
| **Skills** | `stitch/*`, `ui-ux-pro-max`, `frontend-design` | — | `claude-api` |

## Planes de desarrollo con checkboxes 📋
Cada persona tiene su plan por fases para trackear avance (tablero en
[`planes/README.md`](planes/README.md)):
- 👤 A — [`planes/persona-a-frontend.md`](planes/persona-a-frontend.md)
- 👤 B — [`planes/persona-b-backend.md`](planes/persona-b-backend.md)
- 👤 C — [`planes/persona-c-ia.md`](planes/persona-c-ia.md)

## Zona compartida (editar SOLO en consenso) 🔒
`lib/types/index.ts` y `lib/mocks/index.ts`. Si necesitas un campo nuevo, avísalo
en el grupo antes de tocarlo. Es la fuente de verdad de los tres.

## Por qué esto evita conflictos de merge
- Cada persona es dueña de **archivos distintos** (incluso dentro de `app/api/`,
  las rutas están separadas por dueño).
- Nadie espera a nadie: el frontend usa `lib/mocks`, el backend/IA devuelven esos
  mismos mocks como fallback hasta tener lo real. Mismo contrato → cero re-trabajo.

## Orden sugerido del día
1. **(juntos, ~20 min)** Acordar/ajustar `lib/types` y `lib/mocks`. `npm install`.
   Crear las 3 ramas desde `main`.
2. **(en paralelo)** Cada quien construye su capa contra el contrato.
   - A: pantallas con mocks → luego cambia a `fetch('/api/...')`.
   - B: Latinfo + SEACE + Supabase → reemplaza el fallback mock por datos reales.
   - C: prompts + scoring + RAG → reemplaza `generadoPor:'mock'` por `'claude'`.
3. **Integración (~hora 8-9):** A apunta sus fetch a las rutas reales de B y C.
4. **Freeze 17:30:** correr `skills/ponytail/ponytail-review`, luego PRs a `main`.

## Reglas de Git (de CLAUDE.md)
- `main` protegido. Solo **[el integrador]** mergea a `main`.
- Commits: `feat: / fix: / docs: / test: / refactor:` + descripción corta.
- Un commit = un cambio lógico. El agente sugiere el mensaje; un humano confirma.
- PR pequeño y enfocado. Pide review a otra persona antes de mergear.

## Checklist de "Definición de Hecho" por ruta
- [ ] Responde con el envelope `ApiResponse<T>`.
- [ ] Maneja error (400/404/500) sin tumbar el server.
- [ ] No expone API keys al cliente.
- [ ] Probada con al menos un caso de `lib/mocks`.
