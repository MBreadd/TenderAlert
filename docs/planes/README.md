# Planes de desarrollo — Tablero del equipo

Cada integrante tiene su plan con checkboxes (`[ ]`/`[x]`) por fase y alineado a los
hitos. Marca tu avance ahí; este tablero da la vista rápida de cómo va todo.

| Persona | Rama | Plan |
|---|---|---|
| 👤 A — Frontend | `feat/frontend` | [persona-a-frontend.md](persona-a-frontend.md) |
| 👤 B — Backend/Datos | `feat/backend` | [persona-b-backend.md](persona-b-backend.md) |
| 👤 C — IA/Prompts | `feat/ai-prompts` | [persona-c-ia.md](persona-c-ia.md) |

## Cronograma (hackathon 12h)
| Hora | Hito | Qué debe estar listo |
|---|---|---|
| Inicio | Fase 0 (juntos) | `npm install`, ramas creadas, contrato `lib/types` revisado |
| **11:30** | **Hito 1** | A: 3 pantallas con mocks · B: rutas de datos reales · C: match + chat |
| 11:30–18:00 | Integración | A conecta sus `fetch` a las rutas reales de B y C |
| **17:30** | **Freeze** | Correr `skills/ponytail/ponytail-review` y abrir los PRs |
| **18:00** | **Hito 2** | Flujo end-to-end real: RUC → dashboard → ficha |

## Sincronización (sin pisarse)
- 🔒 `lib/types` y `lib/mocks` solo se editan en consenso de los 3.
- Cada quien trabaja en su rama y mergea a `main` vía PR (solo el integrador mergea).
- Si te bloqueas +30 min, dilo en el grupo (regla de CLAUDE.md).

> Detalle del reparto y reglas de Git: [`../division-trabajo.md`](../division-trabajo.md).
